import { Request, Response } from "express";
import { prisma } from '../config/database';
import { v4 as uuidv4 } from "uuid";
import { syncToDB } from "../services/syncToDb";
import type { PeriodePublikasi, Publikasi } from '../../../shared/models'

export class PublikasiController {
    private static formatDate(value: Date | string | null | undefined) {
        if (!value) return null;
        if (value instanceof Date) return value.toISOString().split('T')[0];
        return String(value).split('T')[0];
    }

    private static async ensureDefaultPeriodePublikasi() {
        const count = await prisma.periode_publikasi.count();
        if (count > 0) return;

        const hasSubmissionDeadline = await PublikasiController.hasSubmissionDeadlineColumn();

        await prisma.periode_publikasi.create({
            data: {
                id: "2025/2026-Genap",
                tahun: "2025/2026",
                semester: "Genap",
                aktif: 1
            }
        });

        if (hasSubmissionDeadline) {
            await prisma.$executeRaw`
                INSERT INTO publikasi_deadline (
                    id_periode_publikasi,
                    submission_start,
                    submission_deadline,
                    revision_deadline,
                    coordinator_deadline,
                    ketua_lppm_deadline,
                    freeze_start,
                    freeze_end,
                    keterangan
                ) VALUES (
                    '2025/2026-Genap',
                    '2026-03-01',
                    '2026-05-31',
                    '2026-06-15',
                    '2026-06-30',
                    '2026-07-15',
                    '2026-07-16',
                    '2026-08-01',
                    'Periode pelaporan publikasi semester ganjil tahun ajaran 2026/2027. Keterlambatan tidak akan diproses.'
                )
            `;
        } else {
            await prisma.$executeRaw`
                INSERT INTO publikasi_deadline (
                    id_periode_publikasi,
                    submission_start,
                    revision_deadline,
                    coordinator_deadline,
                    ketua_lppm_deadline,
                    freeze_start,
                    freeze_end,
                    keterangan
                ) VALUES (
                    '2025/2026-Genap',
                    '2026-03-01',
                    '2026-06-15',
                    '2026-06-30',
                    '2026-07-15',
                    '2026-07-16',
                    '2026-08-01',
                    'Periode pelaporan publikasi semester ganjil tahun ajaran 2026/2027. Keterlambatan tidak akan diproses.'
                )
            `;
        }
    }

    private static async hasSubmissionDeadlineColumn() {
        const rows = await prisma.$queryRaw<{ total: bigint }[]>`
            SELECT COUNT(*) AS total
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'publikasi_deadline'
              AND COLUMN_NAME = 'submission_deadline'
        `;

        return Number(rows[0]?.total || 0) > 0;
    }

    static async getPeriodePublikasi(_req: Request, res: Response) {
        try {
            await PublikasiController.ensureDefaultPeriodePublikasi();
            const hasSubmissionDeadline = await PublikasiController.hasSubmissionDeadlineColumn();

            const periodes = hasSubmissionDeadline
                ? await prisma.$queryRaw<any[]>`
                    SELECT
                        pp.id,
                        pp.tahun,
                        pp.semester,
                        pp.aktif,
                        pd.submission_start,
                        pd.submission_deadline,
                        pd.revision_deadline,
                        pd.coordinator_deadline,
                        pd.ketua_lppm_deadline,
                        pd.freeze_start,
                        pd.freeze_end,
                        pd.keterangan
                    FROM periode_publikasi pp
                    LEFT JOIN publikasi_deadline pd ON pd.id_periode_publikasi = pp.id
                    ORDER BY pp.tahun DESC, pp.semester ASC
                `
                : await prisma.$queryRaw<any[]>`
                    SELECT
                        pp.id,
                        pp.tahun,
                        pp.semester,
                        pp.aktif,
                        pd.submission_start,
                        NULL AS submission_deadline,
                        pd.revision_deadline,
                        pd.coordinator_deadline,
                        pd.ketua_lppm_deadline,
                        pd.freeze_start,
                        pd.freeze_end,
                        pd.keterangan
                    FROM periode_publikasi pp
                    LEFT JOIN publikasi_deadline pd ON pd.id_periode_publikasi = pp.id
                    ORDER BY pp.tahun DESC, pp.semester ASC
                `;

            const data: PeriodePublikasi[] = periodes.map((periode) => ({
                id: periode.id,
                tahun: periode.tahun,
                semester: periode.semester,
                aktif: Boolean(periode.aktif),
                deadlines: periode.submission_start || periode.revision_deadline || periode.keterangan ? {
                    submissionStart: PublikasiController.formatDate(periode.submission_start),
                    submissionDeadline: PublikasiController.formatDate(periode.submission_deadline),
                    revisionDeadline: PublikasiController.formatDate(periode.revision_deadline),
                    coordinatorDeadline: PublikasiController.formatDate(periode.coordinator_deadline),
                    ketuaLppmDeadline: PublikasiController.formatDate(periode.ketua_lppm_deadline),
                    freezeStart: PublikasiController.formatDate(periode.freeze_start),
                    freezeEnd: PublikasiController.formatDate(periode.freeze_end),
                    keterangan: periode.keterangan
                } : undefined
            }));

            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil periode publikasi',
                data
            });
        } catch (error: any) {
            console.error("Error getPeriodePublikasi:", error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mengambil periode publikasi'
            });
        }
    }

    // --- Fungsi Lihat Data (GET) ---
    static async getListPublikasi(req: Request, res: Response) {
        try {
            const dosen_id = req.query.dosen_id;

            if (!dosen_id || typeof dosen_id !== 'string') {
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'Parameter dosen_id diperlukan.' 
                });
            }

            // Menggunakan Prisma findMany dengan include untuk relasi
            const publikasi = await prisma.publikasi.findMany({
                where: {
                    id_user: dosen_id
                },
                include: {
                    detail_publikasi: {
                        include: {
                            publikasi_penulis: true,
                            publikasi_dokumen: true,
                            publikasi_riwayat: {
                                orderBy: { tanggal: 'desc' },
                                take: 1
                            }
                        }
                    }
                }
            });
            // Flatten response so frontend can consume expected keys
            if (!publikasi || publikasi.length === 0) {
                return res.status(200).json({
                    status: 'success',
                    message: 'Dosen tidak memiliki data publikasi.',
                    data: []
                });
            }

            const formattedData = publikasi.map((p): Publikasi & Record<string, any> => {
                const detail = p.detail_publikasi;

                return {
                    ...p,
                    // prefer detail fields when available
                    judul: detail?.judul || p.judul || "",
                    quartile: detail?.quartile ?? p.quartile,
                    jenis_publikasi: detail?.jenis_publikasi || p.jenis_publikasi || "",
                    tanggal: detail?.tanggal || p.tanggal || "",
                    asal_data: p.asal_data || "",
                    penerbit: detail?.penerbit || null,
                    isbn: detail?.isbn || null,
                    status: detail?.status || null,
                    tim_penulis: detail?.publikasi_penulis || [],
                    dokumen: detail?.publikasi_dokumen || [],
                    nama_jurnal: detail?.nama_jurnal,
                    doi: detail?.doi || null,
                    issn: detail?.issn || null,
                    volume: detail?.volume || null,
                    nomor: detail?.nomor || null,
                    halaman: detail?.halaman || null,
                    seminar: detail?.seminar || null,
                    prosiding: detail?.prosiding || null,
                    komentar: detail?.publikasi_riwayat?.[0]?.catatan || null,
                    kategori_kegiatan: detail?.kategori_kegiatan || p.kategori_kegiatan || "",
                    kategori_capaian_luaran: detail?.kategori_capaian_luaran || null,
                    
                };
            });

            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil data publikasi dosen',
                data: formattedData
            });

        } catch (error: any) {
            console.error("Error getListPublikasi:", error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Gagal mengambil data dari database' 
            });
        }
    }

    // --- Fungsi Lihat Riwayat (GET) ---
    static async getRiwayatPublikasi(req: Request, res: Response) {
        try {
            const idPublikasi = req.params.id;

            if (!idPublikasi) {
                return res.status(400).json({
                    status: 'error',
                    message: 'ID Publikasi diperlukan.'
                });
            }

            const riwayat = await prisma.publikasi_riwayat.findMany({
                where: {
                    id_publikasi: idPublikasi as string
                },
                orderBy: {
                    tanggal: 'desc'
                }
            });

            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil riwayat publikasi',
                data: riwayat
            });

        } catch (error: any) {
            console.error("Error getRiwayatPublikasi:", error);
            return res.status(500).json({
                status: 'error',
                message: 'Gagal mengambil riwayat publikasi'
            });
        }
    }
    // --- Fungsi Tambah Data (POST) ---
    static async createPublikasi(req: Request, res: Response) {
        try {
            const data = req.body;

            // Logika pengecekan jenis publikasi
            const jenisPublikasiText = (data.jenis_publikasi || "").toLowerCase();
            const isProsiding = jenisPublikasiText.includes("prosiding") ? 1 : 0;
            const isSeminar = jenisPublikasiText.includes("seminar") ? 1 : 0;

            const sharedId = uuidv4();

            // Menggunakan Prisma Transaction
            await prisma.$transaction(async (tx: any) => {
                
                // 1. Simpan ke tabel publikasi (Header)
                await tx.publikasi.create({
                    data: {
                        id: sharedId,
                        kategori_kegiatan: data.kategori_kegiatan || "Test",
                        quartile: data.quartile,
                        judul: data.judul,
                        jenis_publikasi: data.jenis_publikasi,
                        tanggal: data.tanggal,
                        id_user: data.id_user
                    }
                });

                // 2. Simpan ke tabel detail_publikasi
                await tx.detail_publikasi.create({
                    data: {
                        id: sharedId,
                        kategori_kegiatan: data.kategori_kegiatan || "Test",
                        judul: data.judul,
                        quartile: data.quartile || null,
                        jenis_publikasi: data.jenis_publikasi,
                        tanggal: data.tanggal,
                        id_kategori_kegiatan: data.id_kategori_kegiatan || 1,
                        id_jenis_publikasi: data.id_jenis_publikasi || 1,
                        kategori_capaian_luaran: data.kategori_capaian_luaran || "Unknown",
                        id_kategori_capaian_luaran: data.id_kategori_capaian_luaran || null,
                        penerbit: data.penerbit || null,
                        isbn: data.isbn || null,
                        nama_jurnal: data.nama_jurnal || null,
                        doi: data.doi || data.urlDoi || null,
                        issn: data.issn || null,
                        volume: data.volume || null,
                        nomor: data.nomor || null,
                        halaman: data.halaman || null,
                        status: data.status || "approved",
                        seminar: isSeminar,
                        prosiding: isProsiding
                    }
                });
            });

            return res.status(201).json({ 
                status: 'success', 
                message: 'Data berhasil disimpan' 
            });

        } catch (error: any) {
            console.error("Prisma Transaction Error:", error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Gagal memproses data' 
            });
        }
    }
    // --- Fungsi Update Data (PUT) ---
    static async updatePublikasi(req: Request, res: Response) {
        try {
            const idPublikasi = req.params.id;
            const data = req.body;

            // Membungkus dalam transaksi agar kedua tabel terupdate secara atomik
            await prisma.$transaction(async (tx: any) => {
                
                // 1. Update tabel detail_publikasi
                await tx.detail_publikasi.update({
                    where: { id: idPublikasi },
                    data: {
                        judul: data.judul,
                        jenis_publikasi: data.jenis_publikasi,
                        tanggal: data.tanggal,
                        penerbit: data.penerbit || null,
                        isbn: data.isbn || null,
                        tautan: data.tautan || data.urlTautan || null,
                        keterangan: data.keterangan || null,
                        nama_jurnal: data.nama_jurnal || data.namaJurnal || null,
                        halaman: data.halaman || null,
                        edisi: data.edisi || null,
                        nomor: data.nomor ? Number(data.nomor) : null, // Memastikan tipe data number
                        doi: data.doi || data.urlDoi || null,
                        issn: data.issn || null,
                        quartile: data.quartile ? Number(data.quartile) : null,
                        status: data.status || undefined
                    }
                });

                // 2. Update tabel publikasi (jika ada data status yang dikirim)
                await tx.publikasi.update({
                    where: { id: idPublikasi },
                    data: {
                        judul: data.judul,
                        tanggal: data.tanggal,
                        kategori_kegiatan: data.kategori_kegiatan || undefined,
                        quartile: data.quartile ? Number(data.quartile) : null,
                        jenis_publikasi: data.jenis_publikasi || undefined
                    }
                });
            });

            return res.status(200).json({ 
                status: 'success', 
                message: 'Data berhasil diubah' 
            });

        } catch (error: any) {
            // Prisma akan melempar error P2025 jika Record ID tidak ditemukan
            if (error.code === 'P2025') {
                return res.status(404).json({ 
                    status: 'error', 
                    message: 'Data publikasi tidak ditemukan' 
                });
            }

            console.error("Error Update Publikasi:", error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Gagal mengubah data' 
            });
        }
    }
    // --- Fungsi Delete Data (DELETE) ---
    static async deletePublikasi(req: Request, res: Response) {
        try {
            // 1. Ambil ID dan paksa tipe datanya menjadi string
            const id = req.params.id as string;

            // Validasi tambahan (Opsional tapi sangat disarankan)
            if (!id || typeof id !== 'string') {
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'ID tidak valid' 
                });
            }

            // 2. Cek keberadaan data dan statusnya
            const dataPublikasi = await prisma.publikasi.findUnique({
                where: { id: id },
                include: {
                    detail_publikasi: {
                        select: { status: true }
                    }
                }
            });

            if (!dataPublikasi) {
                return res.status(404).json({ 
                    status: 'error', 
                    message: 'Data tidak ditemukan' 
                });
            }

            // 3. Validasi status Approved
            if (dataPublikasi.detail_publikasi?.status?.toLowerCase() === 'approved') {
                return res.status(403).json({ 
                    status: 'error', 
                    message: 'Data yang sudah Approved tidak dapat dihapus.' 
                });
            }

            // 4. Eksekusi penghapusan dalam Transaksi
            // Hapus ": any" pada tx agar TypeScript bisa mengawal autocompletenya
            await prisma.$transaction(async (tx) => {

                // Gunakan deleteMany untuk tabel relasi yang dihapus berdasarkan Foreign Key
                await tx.publikasi_dokumen.deleteMany({
                    where: { id_publikasi: id } // Asumsi nama foreign key-nya id_publikasi
                });

                await tx.publikasi_penulis.deleteMany({
                    where: { id_publikasi: id }
                });

                // Jika detail_publikasi ini 1-to-1 dan id_publikasi adalah @unique, bisa pakai .delete().
                // Tapi jika bukan @unique di schema.prisma, wajib pakai .deleteMany()
                await tx.detail_publikasi.deleteMany({
                    where: { id: id }
                });

                // Tabel utama menggunakan .delete() karena 'id' adalah Primary Key
                await tx.publikasi.delete({
                    where: { id: id }
                });
                
            });

            return res.json({ 
                status: 'success', 
                message: 'Publikasi berhasil dihapus' 
            });

        } catch (error: any) {
            console.error("Delete Error:", error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Gagal menghapus data' 
            });
        }
    }

    // --- Fungsi Menarik Data dari API SISTER ---
    static async getSisterPublikasi(req: Request, res: Response) {
    try {
        // Gunakan 'as string' agar tidak dianggap string[] oleh TypeScript
        const dosen_id = req.query.dosen_id as string;

        if (!dosen_id) {
            return res.status(400).json({ 
                status: 'error', 
                message: 'Dosen ID diperlukan' 
                });
        }

        // 1. Tarik data "Live" dari API SISTER melalui Service
        const rawSisterData = await syncToDB.syncPublikasiEachSDM(dosen_id);

        // 2. Ambil semua ID publikasi milik dosen tersebut yang sudah ada di DB lokal
        const localPublikasi = await prisma.publikasi.findMany({
            where: {
                id_user: dosen_id,
                // Pengecekan 'NOT: { id: null }' dihapus karena 'id' adalah Primary Key (Non-Nullable)
            },
            select: {
                id: true 
            }
        });

        // Sederhanakan hasil query menjadi array ID
        const existingSisterIds = localPublikasi.map((row: { id: string }) => row.id);

        // 3. Gabungkan data SISTER dengan flag status keberadaan di lokal
        const formattedData = rawSisterData.map((item: any): Publikasi & Record<string, any> => {
            return {
                ...item,
                existsLocally: existingSisterIds.includes(item.id) 
            };
        });

        return res.status(200).json({
            status: 'success',
            message: 'Berhasil menarik data SISTER',
            data: formattedData
        });

    } catch (error: any) {
        console.error("Error getSisterPublikasi:", error);
        return res.status(500).json({ 
            status: 'error', 
            message: 'Gagal komunikasi dengan server SISTER atau database' 
        });
    }
}
}
