import { apiReader } from '../utils/apiReader';
import { prisma } from '../config/database';

export class syncToDB {
    static async syncSDM(): Promise<void> {
        try {
            console.log("Meminta apiReader untuk menarik data dari SISTER...");
            
            const dataSDM = await apiReader.fetchSDM();

            if (!dataSDM || dataSDM.length === 0) {
                console.log("Tidak ada data SDM yang ditarik");
                return;
            }

            console.log(`Berhasil mendapatkan ${dataSDM.length} data. Mulai menyimpan ke database...`);

            let countInserted = 0;

            for (const sdm of dataSDM) {
                if (!sdm || !sdm.nidn || sdm.nidn.trim() === '') continue;
                
                const dummyEmail = `${sdm.nidn}@sister.sync`;
                const defaultPassword = 'password123';

                // UPSERT USER (Mapping sdm -> users)
                // Prisma akan mengecek 'id'. Jika sudah ada, jalankan 'update', jika belum ada jalankan 'create'
                await prisma.users.upsert({
                    where: { id: sdm.id_sdm },
                    update: {
                        nama: sdm.nama_sdm || "Nama tidak diketahui",
                        nidn: sdm.nidn,
                        // Update field lain jika diperlukan
                    },
                    create: {
                        id: sdm.id_sdm,
                        nama: sdm.nama_sdm || "Nama tidak diketahui",
                        nidn: sdm.nidn,
                        email: dummyEmail,
                        password: defaultPassword,
                    }
                });

                // Tarik data Bidang Ilmu untuk SDM spesifik ini
                const listBidangIlmuSDM = await apiReader.fetchBidangIlmuSDM(sdm.id_sdm);

                if (listBidangIlmuSDM && listBidangIlmuSDM.length > 0) {
                    for (const bidang of listBidangIlmuSDM) {
                        if (bidang.id === undefined || bidang.id === null) {
                            console.log(`[Skip] SDM ditemukan tanpa ID, melewati data ini...`);
                            continue; 
                        }
                        // UPSERT Bidang Keilmuan
                        // Catatan: Karena 'id' di database adalah bigint, gunakan BigInt() di Prisma
                        await prisma.bidang_keilmuan_sdm.upsert({
                            where: { id: BigInt(bidang.id) },
                            update: {
                                urutan: bidang.urutan,
                                id_kelompok_bidang: bidang.id_kelompok_bidang,
                                kelompok_bidang: bidang.kelompok_bidang,
                            },
                            create: {
                                id: BigInt(bidang.id),
                                urutan: bidang.urutan,
                                id_kelompok_bidang: bidang.id_kelompok_bidang,
                                kelompok_bidang: bidang.kelompok_bidang,
                                id_sdm: sdm.id_sdm
                            }
                        });
                    }
                }

                countInserted++;
                if (countInserted % 10 === 0) {
                    console.log(`Proses sinkronisasi: ${countInserted} dosen telah diproses...`);
                }
            }

            console.log(`Sinkronisasi selesai. Total ${countInserted} data SDM berhasil diproses.`);
        } catch (error: any) {
            console.error("Terjadi kesalahan saat sinkronisasi ke DB:", error.message);
        }
    }

    static async syncPenelitianAllSDM(): Promise<void> {
        try {
            console.log("Menarik data SDM dari SISTER...");
            const dataSDM = await apiReader.fetchSDM();

            if (!dataSDM || dataSDM.length === 0) {
                console.log("Tidak ada data SDM yang ditarik.");
                return;
            }

            console.log(`Berhasil mendapatkan ${dataSDM.length} SDM. Mulai menarik riwayat penelitian...`);

            let countDosen = 0;

            for (const sdm of dataSDM) {
                countDosen++;
                if (!sdm || !sdm.id_sdm) {
                    console.log(`Data SDM urutan ke-${countDosen} terdeteksi kosong/undefined. Di-skip.`);
                    continue;
                }

                console.log(`\n[${countDosen}/${dataSDM.length}] Memproses data milik: ${sdm.nama_sdm || sdm.id_sdm}`);

                const listPenelitian = await apiReader.fetchListPenelitian(sdm.id_sdm);

                if (!listPenelitian || listPenelitian.length === 0) {
                    console.log(`   -> Tidak ada data penelitian.`);
                    continue;
                }

                for (const pen of listPenelitian) {
                    const idPenelitian = pen.id;
                    if (!idPenelitian || idPenelitian === undefined || idPenelitian === null) continue;

                    // 1. UPSERT PENELITIAN
                    await prisma.penelitian.upsert({
                        where: { id: idPenelitian },
                        update: {
                            judul: pen.judul || "Tanpa Judul",
                            tahun_pelaksanaan: pen.tahun_pelaksanaan || null,
                            lama_kegiatan: pen.lama_kegiatan || null,
                        },
                        create: {
                            id: idPenelitian,
                            judul: pen.judul || "Tanpa Judul",
                            tahun_pelaksanaan: pen.tahun_pelaksanaan || null,
                            lama_kegiatan: pen.lama_kegiatan || null,
                            id_users: sdm.id_sdm
                        }
                    });
                    

                    // 2. UPSERT BIDANG KEILMUAN PENELITIAN
                    const listBidangIlmuPenelitian = await apiReader.fetchBidangIlmuPenelitian(idPenelitian);
                    if (listBidangIlmuPenelitian && listBidangIlmuPenelitian.length > 0) {
                        // Hapus data lama berdasarkan id_penelitian sebelum insert yang baru
                        await prisma.bidang_keilmuan_pn.deleteMany({
                            where: { id_penelitian: idPenelitian }
                        });
                        for (const bidang of listBidangIlmuPenelitian) {
                            await prisma.bidang_keilmuan_pn.create({
                                data: {
                                    urutan: bidang.urutan ? Number(bidang.urutan) : 1,
                                    id_kelompok_bidang: bidang.id_kelompok_bidang,
                                    kelompok_bidang: bidang.kelompok_bidang || "Unknown",
                                    id_penelitian: idPenelitian
                                }
                            });
                        }
                    }

                    // 3. DETAIL PENELITIAN & RELASI (Anggota, Mitra, Dokumen)
                    const detail = await apiReader.fetchDetailPenelitian(idPenelitian);
                    
                    if (detail) {
                        // UPSERT DETAIL PENELITIAN
                        await prisma.detail_penelitian.upsert({
                            where: { id: idPenelitian },
                            update: {
                                id_kategori_kegiatan: detail.id_kategori_kegiatan || null,
                                judul: detail.judul,
                                id_afiliasi: detail.id_afiliasi || null,
                                afiliasi: detail.afiliasi || null,
                                id_kelompok_bidang: detail.id_kelompok_bidang || null,
                                kelompok_bidang: detail.kelompok_bidang || null,
                                id_litabmas_sebelumnya: detail.id_litabmas_sebelumnya || null,
                                litabmas_sebelumnya: detail.litabmas_sebelumnya || null,
                                id_jenis_skim: detail.id_jenis_skim || null,
                                jenis_skim: detail.jenis_skim || null,
                                lokasi: detail.lokasi || null,
                                tahun_usulan: detail.tahun_usulan || null,
                                tahun_kegiatan: detail.tahun_kegiatan || null,
                                tahun_pelaksanaan: detail.tahun_pelaksanaan || null,
                                dana_dikti: detail.dana_dikti || null,
                                dana_perguruan_tinggi: detail.dana_perguruan_tinggi || null,
                                dana_institusi_lain: detail.dana_institusi_lain || null,
                                in_kind: detail.in_kind || null,
                                sk_penugasan: detail.sk_penugasan || null,
                                tanggal_sk_penugasan: detail.tanggal_sk_penugasan || null
                            },
                            create: {
                                id: idPenelitian,
                                id_kategori_kegiatan: detail.id_kategori_kegiatan || null,
                                judul: detail.judul,
                                id_afiliasi: detail.id_afiliasi || null,
                                afiliasi: detail.afiliasi || null,
                                id_kelompok_bidang: detail.id_kelompok_bidang || null,
                                kelompok_bidang: detail.kelompok_bidang || null,
                                id_litabmas_sebelumnya: detail.id_litabmas_sebelumnya || null,
                                litabmas_sebelumnya: detail.litabmas_sebelumnya || null,
                                id_jenis_skim: detail.id_jenis_skim || null,
                                jenis_skim: detail.jenis_skim || null,
                                lokasi: detail.lokasi || null,
                                tahun_usulan: detail.tahun_usulan || null,
                                tahun_kegiatan: detail.tahun_kegiatan || null,
                                tahun_pelaksanaan: detail.tahun_pelaksanaan || null,
                                dana_dikti: detail.dana_dikti || null,
                                dana_perguruan_tinggi: detail.dana_perguruan_tinggi || null,
                                dana_institusi_lain: detail.dana_institusi_lain || null,
                                in_kind: detail.in_kind || null,
                                sk_penugasan: detail.sk_penugasan || null,
                                tanggal_sk_penugasan: detail.tanggal_sk_penugasan || null
                            }
                        });

                        // 4. ANGGOTA (Delete & Insert ulang agar sinkron dengan data SISTER terbaru)
                        if (detail.anggota && Array.isArray(detail.anggota)) {
                            await prisma.anggota.deleteMany({
                                where: { litabmas_id: idPenelitian }
                            });

                            for (const anggota of detail.anggota) {
                                
                                // ----------------------------------------------------
                                // LAKUKAN MAPPING (PENERJEMAHAN) ENUM DI SINI
                                // ----------------------------------------------------
                                let jenisAnggota: any = anggota.jenis || "Dosen";
                                
                                // Jika data dari SISTER mengandung garis miring, ubah ke underscore
                                if (jenisAnggota === "Profesional/Mitra") {
                                    jenisAnggota = "Profesional_Mitra";
                                }
                                // ----------------------------------------------------

                                await prisma.anggota.create({
                                    data: {
                                        id: anggota.id || undefined, 
                                        litabmas_id: idPenelitian,
                                        nama: anggota.nama || "Unknown",
                                        
                                        // Gunakan variabel yang sudah di-mapping
                                        jenis: jenisAnggota, 
                                        
                                        id_sdm: anggota.id_sdm || null,
                                        id_peserta_didik: anggota.id_peserta_didik || null,
                                        nomor_induk_peserta_didik: anggota.nomor_induk_peserta_didik || null,
                                        id_orang: anggota.id_orang || null,
                                        aktif: true,
                                        peran: anggota.peran || "Anggota"
                                    }
                                });
                            }
                        }

                        // 5. MITRA (Upsert berdasarkan ID Mitra)
                        if (detail.mitra_litabmas && Array.isArray(detail.mitra_litabmas)) {
                            for (const mitra of detail.mitra_litabmas) {
                                await prisma.mitra.upsert({
                                    where: { id: mitra.id },
                                    update: {
                                        litabmas_id: idPenelitian,
                                        nama: mitra.nama || "Unknown"
                                    },
                                    create: {
                                        id: mitra.id,
                                        litabmas_id: idPenelitian,
                                        nama: mitra.nama || "Unknown"
                                    }
                                });
                            }
                        }

                        // 6. DOKUMEN (Delete & Insert ulang)
                        if (detail.dokumen && Array.isArray(detail.dokumen)) {
                            await prisma.dokumen.deleteMany({
                                where: { litabmas_id: idPenelitian }
                            });

                            for (const dok of detail.dokumen) {
                                await prisma.dokumen.create({
                                    data: {
                                        id: dok.id, 
                                        litabmas_id: idPenelitian,
                                        nama: dok.nama || "Unknown",
                                        jenis_dokumen: dok.jenis_dokumen || null,
                                        nama_file: dok.nama_file || null,
                                        jenis_file: dok.jenis_file || null,
                                        tautan: dok.tautan || null,
                                        keterangan: dok.keterangan || null
                                    }
                                });
                            }
                        }
                    }
                }
            }
            console.log("\nSinkronisasi seluruh hierarki Penelitian sukses!");

        } catch (error: any) {
            console.error("Terjadi kesalahan saat sinkronisasi penelitian ke DB:", error.message);
        }
    }
    
    static async syncPublikasiAllSDM(): Promise<void> {
        try {
            console.log("Menarik data SDM dari SISTER untuk sinkronisasi Publikasi...");
            const dataSDM = await apiReader.fetchSDM();

            if (!dataSDM || dataSDM.length === 0) {
                console.log("Tidak ada data SDM yang ditarik.");
                return;
            }

            console.log(`Berhasil mendapatkan ${dataSDM.length} SDM. Mulai menarik riwayat publikasi...`);

            let countDosen = 0;

            for (const sdm of dataSDM) {
                countDosen++;
                if (!sdm || !sdm.id_sdm) continue;

                console.log(`\n[${countDosen}/${dataSDM.length}] Memproses publikasi milik: ${sdm.nama_sdm || sdm.id_sdm}`);

                const listPublikasi = await apiReader.fetchListPublikasi(sdm.id_sdm);

                if (!listPublikasi || listPublikasi.length === 0) {
                    console.log(`   -> Tidak ada data publikasi.`);
                    continue;
                }

                for (const pub of listPublikasi) {
                    const idPublikasi = pub.id;
                    if (!idPublikasi) continue;

                    // 1. UPSERT PUBLIKASI (Tabel Induk)
                    await prisma.publikasi.upsert({
                        where: { id: idPublikasi },
                        update: {
                            kategori_kegiatan: pub.kategori_kegiatan || "Unknown",
                            judul: pub.judul || "Tanpa Judul",
                            quartile: pub.quartile ? Number(pub.quartile) : null,
                            tanggal: pub.tanggal || "Unknown",
                        },
                        create: {
                            id: idPublikasi,
                            kategori_kegiatan: pub.kategori_kegiatan || "Unknown",
                            judul: pub.judul || "Tanpa Judul",
                            quartile: pub.quartile ? Number(pub.quartile) : null,
                            jenis_publikasi: pub.jenis_publikasi || "Unknown",
                            tanggal: pub.tanggal || "Unknown",
                            asal_data: pub.asal_data || null,
                            id_user: sdm.id_sdm
                        }
                    });

                    // 2. FETCH DETAIL DARI API
                    const detail = await apiReader.fetchDetailPublikasi(idPublikasi);

                    if (detail) {
                        // 3. UPSERT DETAIL PUBLIKASI
                        await prisma.detail_publikasi.upsert({
                            where: { id: idPublikasi },
                            update: {
                                kategori_kegiatan: detail.kategori_kegiatan || pub.kategori_kegiatan || "Unknown",
                                judul: detail.judul || pub.judul || "Tanpa Judul",
                                quartile: detail.quartile ? Number(detail.quartile) : null,
                                jenis_publikasi: detail.jenis_publikasi || pub.jenis_publikasi || "Unknown",
                                tanggal: detail.tanggal || pub.tanggal || "Unknown",
                                id_kategori_kegiatan: detail.id_kategori_kegiatan || 0,
                                id_jenis_publikasi: detail.id_jenis_publikasi || 0,
                                kategori_capaian_luaran: detail.kategori_capaian_luaran || "Unknown",
                                id_kategori_capaian_luaran: detail.id_kategori_capaian_luaran || null,
                                judul_litabmas: detail.judul_litabmas || null,
                                id_litabmas: detail.id_litabmas || null,
                                nomor_paten: detail.nomor_paten || null,
                                pemberi_paten: detail.pemberi_paten || null,
                                penerbit: detail.penerbit || null,
                                isbn: detail.isbn || null,
                                jumlah_halaman: detail.jumlah_halaman || null,
                                tautan: detail.tautan || null,
                                keterangan: detail.keterangan || null,
                                judul_artikel: detail.judul_artikel || null,
                                judul_asli: detail.judul_asli || null,
                                nama_jurnal: detail.nama_jurnal || null,
                                halaman: detail.halaman || null,
                                edisi: detail.edisi || null,
                                volume: detail.volume || null,
                                nomor: detail.nomor || null,
                                doi: detail.doi || null,
                                issn: detail.issn || null,
                                e_issn: detail.e_issn || null,
                                seminar: detail.seminar ? true : false,
                                prosiding: detail.prosiding ? true : false,
                                asal_data: detail.asal_data || pub.asal_data || null,
                                status: "approved",
                                komentar: "-" 
                             },
                            create: {
                                id: idPublikasi,
                                kategori_kegiatan: detail.kategori_kegiatan || pub.kategori_kegiatan || "Unknown",
                                judul: detail.judul || pub.judul || "Tanpa Judul",
                                quartile: detail.quartile ? Number(detail.quartile) : null,
                                jenis_publikasi: detail.jenis_publikasi || pub.jenis_publikasi || "Unknown",
                                tanggal: detail.tanggal || pub.tanggal || "Unknown",
                                id_kategori_kegiatan: detail.id_kategori_kegiatan || 0,
                                id_jenis_publikasi: detail.id_jenis_publikasi || 0,
                                kategori_capaian_luaran: detail.kategori_capaian_luaran || "Unknown",
                                id_kategori_capaian_luaran: detail.id_kategori_capaian_luaran || null,
                                judul_litabmas: detail.judul_litabmas || null,
                                id_litabmas: detail.id_litabmas || null,
                                nomor_paten: detail.nomor_paten || null,
                                pemberi_paten: detail.pemberi_paten || null,
                                penerbit: detail.penerbit || null,
                                isbn: detail.isbn || null,
                                jumlah_halaman: detail.jumlah_halaman || null,
                                tautan: detail.tautan || null,
                                keterangan: detail.keterangan || null,
                                judul_artikel: detail.judul_artikel || null,
                                judul_asli: detail.judul_asli || null,
                                nama_jurnal: detail.nama_jurnal || null,
                                halaman: detail.halaman || null,
                                edisi: detail.edisi || null,
                                volume: detail.volume || null,
                                nomor: detail.nomor || null,
                                doi: detail.doi || null,
                                issn: detail.issn || null,
                                e_issn: detail.e_issn || null,
                                seminar: detail.seminar ? true : false,
                                prosiding: detail.prosiding ? true : false,
                                asal_data: detail.asal_data || pub.asal_data || null,
                                status: "approved",
                                komentar: "-" // Menyesuaikan kolom NOT NULL jika ada di DB
                            }
                        });

                        // 4. PENULIS (Delete & Insert)
                        if (detail.penulis && Array.isArray(detail.penulis)) {
                            await prisma.publikasi_penulis.deleteMany({
                                where: { id_publikasi: idPublikasi }
                            });

                            for (const penulis of detail.penulis) {
                                await prisma.publikasi_penulis.create({
                                    data: {
                                        id_publikasi: idPublikasi,
                                        nama: penulis.nama || "Unknown",
                                        jenis: (penulis.jenis as any) || "Dosen", 
                                        id_sdm: penulis.id_sdm || null,
                                        id_peserta_didik: penulis.id_peserta_didik || null,
                                        nomor_induk_peserta_didik: penulis.nomor_induk_peserta_didik || null,
                                        id_orang: penulis.id_orang || null,
                                        urutan: penulis.urutan || 0,
                                        afiliasi: penulis.afiliasi || "",
                                        corresponding_author: penulis.corresponding_author ? true : false,
                                        peran: penulis.peran || "Penulis"
                                    }
                                });
                            }
                        }

                        // 5. DOKUMEN (Delete & Insert)
                        if (detail.dokumen && Array.isArray(detail.dokumen)) {
                            await prisma.publikasi_dokumen.deleteMany({
                                where: { id_publikasi: idPublikasi }
                            });

                            for (const dok of detail.dokumen) {
                                await prisma.publikasi_dokumen.create({
                                    data: {
                                        id: dok.id, // Biarkan auto-increment jika ID kosong
                                        id_publikasi: idPublikasi,
                                        nama: dok.nama || "Unknown",
                                        jenis_dokumen: dok.jenis_dokumen || "Unknown",
                                        nama_file: dok.nama_file || "Unknown",
                                        jenis_file: dok.jenis_file || "Unknown",
                                        tanggal_upload: dok.tanggal_upload || null,
                                        tautan: dok.tautan || null,
                                        keterangan: dok.keterangan || null
                                    }
                                });
                            }
                        }
                    }
                }
            }
            console.log("\nSinkronisasi seluruh hierarki Publikasi sukses!");

        } catch (error: any) {
            console.error("Terjadi kesalahan saat sinkronisasi publikasi ke DB:", error.message);
        }
    }

    static async syncPublikasiEachSDM(id_sdm: string): Promise<any[]> {
        try {
            console.log(`Menarik data list publikasi SISTER untuk dosen ID: ${id_sdm}`);

            const listPublikasi = await apiReader.fetchListPublikasi(id_sdm);
            
            if (!listPublikasi || listPublikasi.length === 0) {
                console.log("Tidak ada publikasi ditemukan di SISTER.");
                return [];
            }

            const hasilPublikasi: any[] = [];

            console.log(`Mengambil detail untuk ${listPublikasi.length} publikasi...`);
            for (const lp of listPublikasi) {
                const idPublikasi = lp.id;
                if (!idPublikasi) continue;

                const detail_publikasi = await apiReader.fetchDetailPublikasi(idPublikasi);
                
                if (detail_publikasi) {
                    hasilPublikasi.push({
                        ...lp,
                        ...detail_publikasi
                    });
                }
            }

            console.log("Selesai mengambil data SISTER.");
            return hasilPublikasi;

        } catch (error: any) {
            console.error("Terjadi kesalahan saat menarik data SISTER:", error.message);
            throw error;
        }
    }
}

if (require.main === module) {
    syncToDB.syncPublikasiAllSDM();
    /*(async () => {
        try {
            console.log("Memulai sinkronisasi SDM...");

            await syncToDB.syncSDM();
            
            console.log("Memulai sinkronisasi penelitian...");
            await syncToDB.syncPenelitianAllSDM();

            console.log("Memulai sinkronisasi publikasi...");
            await syncToDB.syncPublikasiAllSDM();

            console.log("Sinkronisasi selesai!");
            process.exit(0); 

        } catch (error) {
            console.error("Gagal melakukan sinkronisasi:", error);
            process.exit(1); 
        }
    })();
    */
}