import { apiReader } from './apiReader';
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
                                INSERT INTO bidang_keilmuan_SDM (id, urutan, id_kelompok_bidang, kelompok_bidang, id_sdm)
                                VALUES (?, ?, ?, ?, ?)
                                ON DUPLICATE KEY UPDATE kelompok_bidang = VALUES(kelompok_bidang)
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
                            const idDetail = detail.id || detail.id_penelitian || idPenelitian;

                            const queryDetail = `
                                INSERT INTO detail_penelitian (id, id_kategori_kegiatan, judul, id_penelitian)
                                VALUES (?, ?, ?, ?)
                                ON DUPLICATE KEY UPDATE judul = VALUES(judul)
                            `;
                            await pool.execute(queryDetail, [
                                idDetail || null,
                                detail.id_kategori_kegiatan || null,
                                detail.judul || pen.judul,
                                idPenelitian 
                            ]);

                            if (detail.anggota && Array.isArray(detail.anggota)) {
                                for (const anggota of detail.anggota) {
                                    const queryAnggota = `
                                        INSERT INTO anggota (id, litabmas_id, nama, jenis)
                                        VALUES (?, ?, ?, ?)
                                        ON DUPLICATE KEY UPDATE nama = VALUES(nama)
                                    `;
                                    await pool.execute(queryAnggota, [
                                        anggota.id || null,
                                        idDetail, 
                                        anggota.nama || "Unknown",
                                        anggota.peran || anggota.jenis || null
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
                                        idDetail, 
                                        mitra.nama || "Unknown"
                                    ]);
                                }
                            }

                            if (detail.dokumen && Array.isArray(detail.dokumen)) {
                                for (const dok of detail.dokumen) {
                                    const queryDok = `
                                        INSERT INTO dokumen (id, litabmas_id, nama, jenis_dokumen, nama_file, jenis_file, tautan, keterangan)
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                                        ON DUPLICATE KEY UPDATE nama_file = VALUES(nama_file)
                                    `;
                                    await pool.execute(queryDok, [
                                        dok.id || null,
                                        idDetail,
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
}

if (require.main === module) {
    (async () => {
        try {
            console.log("Memulai sinkronisasi SDM...");

            await syncToDB.syncSDM();
            
            console.log("Memulai sinkronisasi penelitian...");
            await syncToDB.syncPenelitianEachSDM();

            console.log("Sinkronisasi selesai");
            process.exit(0); 

        } catch (error) {
            console.error("Gagal melakukan sinkronisasi:", error);
            process.exit(1); 
        }
    })();
}