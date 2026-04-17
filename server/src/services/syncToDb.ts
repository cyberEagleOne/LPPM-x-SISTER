import { apiReader } from '../utils/apiReader';
//import { SdmResponse, AnggotaPenelitian, BidangKeilmuanSDM, BidangKeilmuanPenelitian, DetailPenelitian, DokumenPenelitian, MitraPenelitian, Penelitian } from '../config/models'
import pool from '../config/database';

export class syncToDB {
    static async syncSDM(): Promise<void> {
        try {
            console.log("Meminta apiReadeer untuk menarik data dari SISTER...");
            
            const dataSDM = await apiReader.fetchSDM();

            if(!dataSDM || dataSDM.length === 0){
                console.log("Tidak ada data SDM yang ditarik");
                return;
            }

            console.log(`Berhasil mendapatkan ${dataSDM.length} data. Mulai menyimpan ke database...`);

            let countInserted = 0;

            for(const sdm of dataSDM){
                console.log(`Mencoba mengambil data dosen ke ${countInserted + 1}`);
                if(!sdm) {
                    console.log(`Data SDM urutan ke-${countInserted + 1} terdeteksi kosong/undefined. Di-skip.`);
                    continue;
                }
                if(!sdm.nidn || sdm.nidn.trim() === '') continue;
                
                const dummyEmail = `${sdm.nidn}@sister.sync`;
                const defaultPassword = 'password123';

                const query = `
                INSERT INTO users (id, nama, nidn, email, password) 
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE nama = VALUES(nama)
                `;
                await pool.execute(query, [
                    sdm.id_sdm || "ID tidak diketahui",
                    sdm.nama_sdm || "Nama tidak diketahui",
                    sdm.nidn,
                    dummyEmail,
                    defaultPassword
                ]);

                const listBidangIlmuSDM = await apiReader.fetchBidangIlmuSDM(sdm.id_sdm);

                if(listBidangIlmuSDM && listBidangIlmuSDM.length > 0){
                    for (const bidang of listBidangIlmuSDM) {
                            const queryBidang = `
                                INSERT INTO bidang_keilmuan_sdm (id, urutan, id_kelompok_bidang, kelompok_bidang, id_sdm)
                                VALUES (?, ?, ?, ?, ?)
                            `;
                            await pool.execute(queryBidang, [
                                bidang.id || null, 
                                bidang.urutan || null,
                                bidang.id_kelompok_bidang || null,
                                bidang.kelompok_bidang || "Unknown",
                                sdm.id_sdm 
                            ]);
                    }
                }

                
                
                countInserted++;
            }

            console.log("Data SDM berhasil disimpan");
        } catch (error: any) {
            console.error("Terjadi kesalahan saat sinkronisasi ke DB", error.message);
            
        }
    }

    static async syncPenelitianEachSDM(): Promise<void> {
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
                 if(!sdm) {
                    console.log(`Data SDM urutan ke-${countDosen} terdeteksi kosong/undefined. Di-skip.`);
                    continue;
                }
                if (!sdm.id_sdm) continue; 
                
                console.log(`\n[${countDosen}/${dataSDM.length}] Memproses data milik: ${sdm.nama_sdm || sdm.id_sdm}`);

                const listPenelitian = await apiReader.fetchListPenelitian(sdm.id_sdm); 

                if (!listPenelitian || listPenelitian.length === 0) {
                    console.log(`   -> Tidak ada data penelitian.`);
                    continue;
                }

                for (const pen of listPenelitian) {
                    const idPenelitian = pen.id || pen.id_penelitian; 

                    const listBidangIlmuPenelitian = await apiReader.fetchBidangIlmuPenelitian(idPenelitian);

                    const queryPenelitian = `
                        INSERT INTO penelitian (id, judul, tahun_pelaksanaan, lama_kegiatan, id_users)
                        VALUES (?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE 
                        judul = VALUES(judul), tahun_pelaksanaan = VALUES(tahun_pelaksanaan)
                    `;
                    await pool.execute(queryPenelitian, [
                        idPenelitian || null, 
                        pen.judul || "Tanpa Judul", 
                        pen.tahun_pelaksanaan || null, 
                        pen.lama_kegiatan || null, 
                        sdm.id_sdm 
                    ]);

                    if (listBidangIlmuPenelitian && listBidangIlmuPenelitian.length > 0) {
                        for (const bidang of listBidangIlmuPenelitian) {
                            const queryBidang = `
                                INSERT INTO bidang_keilmuan_pn (id, urutan, id_kelompok_bidang, kelompok_bidang, id_penelitian)
                                VALUES (?, ?, ?, ?, ?)
                                ON DUPLICATE KEY UPDATE kelompok_bidang = VALUES(kelompok_bidang)
                            `;
                            await pool.execute(queryBidang, [
                                bidang.id || null, 
                                bidang.urutan || null,
                                bidang.id_kelompok_bidang || null,
                                bidang.kelompok_bidang || "Unknown",
                                idPenelitian 
                            ]);
                        }
                    }

                    if (idPenelitian) {
                        const detail = await apiReader.fetchDetailPenelitian(idPenelitian);
                        
                        if (detail) {

                            const queryDetail = `
                                INSERT INTO detail_penelitian (id, id_kategori_kegiatan, judul, 
                                id_afiliasi, afiliasi, id_kelompok_bidang, kelompok_bidang, 
                                id_litabmas_sebelumnya, litabmas_sebelumnya, id_jenis_skim, jenis_skim,
                                lokasi, tahun_usulan, tahun_kegiatan, tahun_pelaksanaan, dana_dikti,
                                dana_perguruan_tinggi, dana_institusi_lain, in_kind, sk_penugasan, tanggal_sk_penugasan)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                                ON DUPLICATE KEY UPDATE judul = VALUES(judul)
                            `;
                            await pool.execute(queryDetail, [
                                idPenelitian,
                                detail.id_kategori_kegiatan || null,
                                detail.judul || pen.judul,
                                detail.id_afiliasi || null,
                                detail.afiliasi || null,
                                detail.id_kelompok_bidang || null,
                                detail.kelompok_bidang || null,
                                detail.id_litabmas_sebelumnya || null,
                                detail.litabmas_sebelumnya || null,
                                detail.id_jenis_skim || null,
                                detail.jenis_skim || null,
                                detail.lokasi || null,
                                detail.tahun_usulan || null,
                                detail.tahun_kegiatan || null,
                                detail.tahun_pelaksanaan || null,
                                detail.dana_dikti || null,
                                detail.dana_perguruan_tinggi || null,
                                detail.dana_institusi_lain || null,
                                detail.in_kind || null,
                                detail.sk_penugasan || null,
                                detail.tanggal_sk_penugasan || null
                            ]);

                            if (detail.anggota && Array.isArray(detail.anggota)) {
                                await pool.execute('DELETE FROM anggota WHERE litabmas_id = ?', [idPenelitian]);

                                for (const anggota of detail.anggota) {
                                    const queryAnggota = `
                                        INSERT INTO anggota (
                                            id, litabmas_id, nama, jenis, id_sdm, id_peserta_didik, 
                                            nomor_induk_peserta_didik, id_orang, aktif, peran
                                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                                    `;
                                    await pool.execute(queryAnggota, [
                                        anggota.id || null,                        
                                        idPenelitian,                              
                                        anggota.nama || "Unknown",                 
                                        anggota.jenis || "Dosen",                  
                                        anggota.id_sdm || null,                    
                                        anggota.id_peserta_didik || null,          
                                        anggota.nomor_induk_peserta_didik || null, 
                                        anggota.id_orang || null,                  
                                        1,                                         
                                        anggota.peran || "Anggota"                 
                                    ]);
                                }
                            }

                            if (detail.mitra_litabmas && Array.isArray(detail.mitra_litabmas)) {
                                for (const mitra of detail.mitra_litabmas) {
                                    const queryMitra = `
                                        INSERT INTO mitra (id, litabmas_id, nama)
                                        VALUES (?, ?, ?)
                                        ON DUPLICATE KEY UPDATE nama = VALUES(nama)
                                    `;
                                    await pool.execute(queryMitra, [
                                        mitra.id || null, 
                                        idPenelitian, 
                                        mitra.nama || "Unknown"
                                    ]);
                                }
                            }

                            if (detail.dokumen && Array.isArray(detail.dokumen)) {
                                await pool.execute('DELETE FROM dokumen WHERE litabmas_id = ?', [idPenelitian]);
                                for (const dok of detail.dokumen) {
                                    const queryDok = `
                                        INSERT INTO dokumen (id, litabmas_id, nama, jenis_dokumen, nama_file, jenis_file, tautan, keterangan)
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                                        ON DUPLICATE KEY UPDATE nama_file = VALUES(nama_file)
                                    `;
                                    await pool.execute(queryDok, [
                                        dok.id || null,
                                        idPenelitian,
                                        dok.nama || "Unknown",
                                        dok.jenis_dokumen || null,
                                        dok.nama_file || null,
                                        dok.jenis_file || null,
                                        dok.tautan || null,
                                        dok.keterangan || null
                                    ]);
                                }
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

    static async syncPublikasiEachSDM(): Promise<void> {
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
                    const idPublikasi = pub.id || pub.id_publikasi;
                    if (!idPublikasi) continue;
                    if (!pub) continue;

                    const queryPublikasi = `
                        INSERT INTO publikasi (
                            id, kategori_kegiatan, judul, quartile, jenis_publikasi, tanggal, asal_data, id_user
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        ON DUPLICATE KEY UPDATE
                            kategori_kegiatan = VALUES(kategori_kegiatan),
                            judul = VALUES(judul), 
                            quartile = VALUES(quartile),
                            tanggal = VALUES(tanggal)
                    `;
                    await pool.execute(queryPublikasi, [
                        idPublikasi,
                        pub.kategori_kegiatan || "Unknown",
                        pub.judul || "Tanpa Judul",
                        pub.quartile || null,
                        pub.jenis_publikasi || "Unknown",
                        pub.tanggal || "Unknown",
                        pub.asal_data || null,
                        sdm.id_sdm
                    ]);

                    const detail = await apiReader.fetchDetailPublikasi(idPublikasi);

                    if (detail) {
                        const queryDetail = `
                            INSERT INTO detail_publikasi (
                                id, kategori_kegiatan, judul, quartile, jenis_publikasi, tanggal, 
                                id_kategori_kegiatan, id_jenis_publikasi, kategori_capaian_luaran, 
                                id_kategori_capaian_luaran, judul_litabmas, id_litabmas, nomor_paten, 
                                pemberi_paten, penerbit, isbn, jumlah_halaman, tautan, keterangan, 
                                judul_artikel, judul_asli, nama_jurnal, halaman, edisi, volume, nomor, 
                                doi, issn, e_issn, seminar, prosiding, asal_data, status
                            ) VALUES (
                                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
                            ) ON DUPLICATE KEY UPDATE 
                                judul = VALUES(judul)
                        `;
                        await pool.execute(queryDetail, [
                            idPublikasi,
                            detail.kategori_kegiatan || pub.kategori_kegiatan || "Unknown",
                            detail.judul || pub.judul || "Tanpa Judul",
                            detail.quartile || pub.quartile || null,
                            detail.jenis_publikasi || pub.jenis_publikasi || "Unknown",
                            detail.tanggal || pub.tanggal || "Unknown",
                            detail.id_kategori_kegiatan || 0,
                            detail.id_jenis_publikasi || 0,
                            detail.kategori_capaian_luaran || "Unknown",
                            detail.id_kategori_capaian_luaran || null,
                            detail.judul_litabmas || null,
                            detail.id_litabmas || null,
                            detail.nomor_paten || null,
                            detail.pemberi_paten || null,
                            detail.penerbit || null,
                            detail.isbn || null,
                            detail.jumlah_halaman || null,
                            detail.tautan || null,
                            detail.keterangan || null,
                            detail.judul_artikel || null,
                            detail.judul_asli || null,
                            detail.nama_jurnal || null,
                            detail.halaman || null,
                            detail.edisi || null,
                            detail.volume || null,
                            detail.nomor || null,
                            detail.doi || null,
                            detail.issn || null,
                            detail.e_issn || null,
                            detail.seminar ? 1 : 0, 
                            detail.prosiding ? 1 : 0, 
                            detail.asal_data || pub.asal_data || null,
                            "approved"
                        ]);

                        if (detail.penulis && Array.isArray(detail.penulis)) {
                            await pool.execute('DELETE FROM publikasi_penulis WHERE id_publikasi = ?', [idPublikasi]);
                            for (const penulis of detail.penulis) {
                                const queryPenulis = `
                                    INSERT INTO publikasi_penulis (
                                        id_publikasi, nama, jenis, id_sdm, id_peserta_didik, 
                                        nomor_induk_peserta_didik, id_orang, urutan, afiliasi, 
                                        corresponding_author, peran
                                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                                    ON DUPLICATE KEY UPDATE
                                        jenis = VALUES(jenis),
                                        urutan = VALUES(urutan),
                                        afiliasi = VALUES(afiliasi),
                                        peran = VALUES(peran),
                                        corresponding_author = VALUES(corresponding_author),
                                        id_sdm = VALUES(id_sdm)
                                `;
                                await pool.execute(queryPenulis, [
                                    idPublikasi,
                                    penulis.nama || "Unknown",
                                    penulis.jenis || "Dosen", 
                                    penulis.id_sdm || null,
                                    penulis.id_peserta_didik || null,
                                    penulis.nomor_induk_peserta_didik || null,
                                    penulis.id_orang || null,
                                    penulis.urutan || 0,
                                    penulis.afiliasi || "",
                                    penulis.corresponding_author ? 1 : 0,
                                    penulis.peran || "Penulis"
                                ]);
                            }
                        }

                        if (detail.dokumen && Array.isArray(detail.dokumen)) {
                            await pool.execute('DELETE FROM publikasi_dokumen WHERE id_publikasi = ?', [idPublikasi]);
                            for (const dok of detail.dokumen) {
                                const queryDokumen = `
                                    INSERT INTO publikasi_dokumen (
                                        id, id_publikasi, nama, jenis_dokumen, nama_file, 
                                        jenis_file, tanggal_upload, tautan, keterangan
                                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                                     ON DUPLICATE KEY UPDATE 
                                        nama = VALUES(nama),
                                        jenis_dokumen = VALUES(jenis_dokumen),
                                        nama_file = VALUES(nama_file),
                                        jenis_file = VALUES(jenis_file),
                                        tautan = VALUES(tautan),
                                        keterangan = VALUES(keterangan)
                                `;
                                await pool.execute(queryDokumen, [
                                    dok.id || null, 
                                    idPublikasi,
                                    dok.nama || "Unknown",
                                    dok.jenis_dokumen || "Unknown",
                                    dok.nama_file || "Unknown",
                                    dok.jenis_file || "Unknown",
                                    dok.tanggal_upload || null,
                                    dok.tautan || null,
                                    dok.keterangan || null
                                ]);
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
}

if (require.main === module) {
    (async () => {
        try {
            console.log("Memulai sinkronisasi SDM...");

            await syncToDB.syncSDM();
            
            console.log("Memulai sinkronisasi penelitian...");
            await syncToDB.syncPenelitianEachSDM();

            console.log("Memulai sinkronisasi publikasi...");
            await syncToDB.syncPublikasiEachSDM();

            console.log("Sinkronisasi selesai!");
            process.exit(0); 

        } catch (error) {
            console.error("Gagal melakukan sinkronisasi:", error);
            process.exit(1); 
        }
    })();
}