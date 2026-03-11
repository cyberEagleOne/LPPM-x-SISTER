import { apiReader } from './apiReader';
import { SdmResponse, AnggotaPenelitian, BidangKeilmuan, DetailPenelitian, DokumenPenelitian, MitraPenelitian, Penelitian } from '../config/models';
import pool from '../config/database';

export class syncToDB {
    static async syncSDM(): Promise<void> {
        try {
            console.log("Meminta apiReadeer untuk menarik data dari SISTER...");
            
            const dataSDM: SdmResponse[] = await apiReader.fetchSDM();

            if(!dataSDM || dataSDM.length === 0){
                console.log("Tidak ada data SDM yang ditarik");
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
                
                countInserted++;
            }

            console.log("Data SDM berhasil disimpan");
        } catch (error: any) {
            console.error("Terjadi kesalahan saat sinkronisasi ke DB", error.message);
            
        }
    }

    static async syncPenelitianBySDM(): Promise<void> {
        try {
            console.log("Menarik data SDM dari SISTER...");
            const dataSDM: SdmResponse[] = await apiReader.fetchSDM();

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

                const listBidangIlmu = await apiReader.fetchBidangIlmu(sdm.id_sdm);

                const listPenelitian = await apiReader.fetchListPenelitian(sdm.id_sdm); 

                if (!listPenelitian || listPenelitian.length === 0) {
                    console.log(`   -> Tidak ada data penelitian.`);
                    continue;
                }

                for (const pen of listPenelitian) {
                    const idPenelitian = pen.id || pen.id_penelitian; 
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

                    if (listBidangIlmu && listBidangIlmu.length > 0) {
                        for (const bidang of listBidangIlmu) {
                            const queryBidang = `
                                INSERT INTO bidang_keilmuan (id, urutan, id_kelompok_bidang, kelompok_bidang, id_dt_penelitian)
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

                            if (detail.mitra_litabmas && Array.isArray(detail.mitra)) {
                                for (const mitra of detail.mitra) {
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
  syncToDB.syncPenelitianBySDM();
}