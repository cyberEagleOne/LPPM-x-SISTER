import { Request, Response } from "express";
import { prisma } from '../config/database';
import { v4 as uuidv4 } from "uuid";
import { syncToDB } from "../services/syncToDb";
import { Publikasi } from '../../../shared/models'

export class PublikasiController {
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
                    // LEFT JOIN ke detail_publikasi
                    detail_publikasi: true, 
                    // Ambil data penulis terkait (Otomatis jadi Array)
                    publikasi_penulis: true,
                    // Ambil data dokumen terkait (Otomatis jadi Array)
                    publikasi_dokumen: true 
                }
            });

            if (publikasi.length === 0) {
                return res.status(200).json({ 
                    status: 'success', 
                    message: 'Dosen tidak memiliki data publikasi.',
                    data: [] 
                });
            }

            /*
            const formattedData = publikasi.map((p) => ({
                id: p.id,
                judul: p.detail_publikasi?.judul || p.judul,
                quartile: p.detail_publikasi?.quartile || p.quartile,
                jenis_publikasi: p.detail_publikasi?.jenis_publikasi || p.jenis_publikasi,
                tanggal: p.detail_publikasi?.tanggal || p.tanggal,
                penerbit: p.detail_publikasi?.penerbit,
                isbn: p.detail_publikasi?.isbn,
                status: p.detail_publikasi?.status,
                tim_penulis: p.publikasi_penulis,
                dokumen: p.publikasi_dokumen
            }));
            */

            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil data publikasi dosen',
                data: publikasi
            });

        } catch (error: any) {
            console.error("Error getListPublikasi:", error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Gagal mengambil data dari database' 
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
                        doi: data.urlDoi || null, // Mapping urlDoi ke kolom doi
                        issn: data.issn || null,
                        volume: data.volume || null,
                        nomor: data.nomor || null,
                        halaman: data.halaman || null,
                        status: data.status || "approved",
                        seminar: isSeminar,
                        prosiding: isProsiding,
                        komentar: "-"
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
                        tautan: data.urlTautan || null, // Mapping urlTautan ke kolom tautan
                        keterangan: data.keterangan || null,
                        nama_jurnal: data.namaJurnal || null,
                        halaman: data.halaman || null,
                        edisi: data.edisi || null,
                        nomor: data.nomor ? Number(data.nomor) : null, // Memastikan tipe data number
                        doi: data.urlDoi || null,
                        issn: data.issn || null,
                        quartile: data.quartile ? Number(data.quartile) : null
                    }
                });

                // 2. Update tabel publikasi (jika ada data status yang dikirim)
                await tx.publikasi.update({
                    where: { id: idPublikasi },
                    data: {
                        judul: data.judul,
                        tanggal: data.tanggal,
                        // Update status jika dikirim dari frontend
                        ...(data.status && { status: data.status }) 
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
            const { id } = req.params;

            // 1. Cek keberadaan data dan statusnya
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

            // 2. Validasi status Approved
            if (dataPublikasi.detail_publikasi?.status?.toLowerCase() === 'approved') {
                return res.status(403).json({ 
                    status: 'error', 
                    message: 'Data yang sudah Approved tidak dapat dihapus.' 
                });
            }

            // 3. Eksekusi penghapusan dalam Transaksi
            await prisma.$transaction(async (tx: any) => {

                await tx.publikasi_dokumen.delete({
                    where: { id: id }
                });

                await tx.publikasi_penulis.delete({
                    where: { id_publikasi: id }
                });

                await tx.detail_publikasi.delete({
                    where: { id_publikasi: id }
                });

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
            const dosen_id = req.query.dosen_id;

            if (!dosen_id || typeof dosen_id !== 'string') {
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
                    NOT: { id: null } // Memastikan ID tidak null
                },
                select: {
                    id: true // Kita hanya butuh ID untuk pengecekan
                }
            });

            // Sederhanakan hasil query menjadi array ID saja: ['id1', 'id2', ...]
            const existingSisterIds = localPublikasi.map((row: {id: string}) => row.id);

            // 3. Gabungkan data SISTER dengan flag status keberadaan di lokal
            const formattedData = rawSisterData.map((item) => {
                return {
                    ...item,
                    // Tambahkan flag boolean agar frontend bisa tahu mana data yang sudah di-sync
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