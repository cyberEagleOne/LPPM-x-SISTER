import { apiReader } from '../utils/apiReader';
import { simpanRawJSON } from '../utils/helper'

export class fileSaver{
    static async fetchAndSaveSDM(): Promise<void> {
        try {
            console.log("Meminta apiReader untuk menarik data SDM dari SISTER...");
            
            const dataSDM = await apiReader.fetchSDM();

            if (!dataSDM || dataSDM.length === 0) {
                console.log("Tidak ada data SDM yang ditarik dari SISTER.");
                return;
            }

            // 1. Simpan Data Induk SDM
            simpanRawJSON('', 'raw_sdm_all.json', dataSDM);
            console.log(`Berhasil mendapatkan ${dataSDM.length} data SDM. File 'raw_sdm_all.json' telah disimpan di folder output.`);

            let countProcessed = 0;
            console.log("Mulai menarik data Bidang Ilmu untuk masing-masing SDM...");

            // 2. Looping untuk mengambil Bidang Ilmu
            for (const sdm of dataSDM) {
                // Skip jika id_sdm tidak valid
                if (!sdm || !sdm.id_sdm) continue; 
                
                const listBidangIlmuSDM = await apiReader.fetchBidangIlmuSDM(sdm.id_sdm);

                // Jika ada datanya, simpan ke file dengan nama spesifik ID Dosen tersebut
                if (listBidangIlmuSDM && listBidangIlmuSDM.length > 0) {
                    simpanRawJSON('', `raw_bidang_ilmu_sdm_${sdm.id_sdm}.json`, listBidangIlmuSDM);
                }

                countProcessed++;
                
                // Tampilkan log progress setiap kelipatan 10
                if (countProcessed % 10 === 0) {
                    console.log(`Progress: ${countProcessed} dosen telah diproses...`);
                }
            }

            console.log(`Proses penarikan selesai. Silakan cek folder 'output' untuk melihat data mentah JSON-nya.`);
        } catch (error: any) {
            console.error("Terjadi kesalahan saat menarik raw data:", error.message);
        }
    }

    static async savePenelitianRawJSON(): Promise<void> {
        try {
            console.log("=== Memulai Penyelamatan Data Mentah Penelitian ===");
            
            // 1. Tarik Data SDM
            console.log("Menarik data SDM dari SISTER...");
            const dataSDM = await apiReader.fetchSDM();

            if (!dataSDM || dataSDM.length === 0) {
                console.log("Tidak ada data SDM.");
                return;
            }

            simpanRawJSON('', '00_semua_sdm.json', dataSDM);
            console.log(`Berhasil mendapatkan ${dataSDM.length} SDM.`);

            let countDosen = 0;

            for (const sdm of dataSDM) {
                countDosen++;
                if (!sdm || !sdm.id_sdm) continue;

                console.log(`\n[${countDosen}/${dataSDM.length}] Menarik data milik: ${sdm.nama_sdm || sdm.id_sdm}`);

                // 2. Tarik List Penelitian per SDM
                const listPenelitian = await apiReader.fetchListPenelitian(sdm.id_sdm);

                if (!listPenelitian || listPenelitian.length === 0) {
                    console.log(`   -> Tidak ada riwayat penelitian.`);
                    continue;
                }

                // Simpan list penelitian ringkas milik dosen tersebut
                simpanRawJSON('sdm_research_lists', `list_penelitian_${sdm.id_sdm}.json`, listPenelitian);

                for (const pen of listPenelitian) {
                    const idPenelitian = pen.id;
                    if (!idPenelitian) continue;

                    console.log(`      -> Mendetailkan: ${pen.judul?.substring(0, 50)}...`);

                    // 3. Tarik Bidang Ilmu Penelitian
                    const listBidangIlmu = await apiReader.fetchBidangIlmuPenelitian(idPenelitian);
                    if (listBidangIlmu) {
                        simpanRawJSON('research_fields', `fields_${idPenelitian}.json`, listBidangIlmu);
                    }

                    // 4. Tarik Detail Lengkap (Termasuk Anggota, Mitra, Dokumen di dalamnya)
                    const detail = await apiReader.fetchDetailPenelitian(idPenelitian);
                    if (detail) {
                        // Data ini biasanya sudah mencakup array anggota, mitra_litabmas, dan dokumen
                        simpanRawJSON('research_details', `detail_${idPenelitian}.json`, detail);
                    }
                }
            }

            console.log("\n=== Seluruh Data Mentah Penelitian Berhasil Disimpan di Folder Output! ===");

        } catch (error: any) {
            console.error("Terjadi kesalahan saat menyimpan data penelitian:", error.message);
        }
    }

    static async savePublikasiRawJSON(): Promise<void> {
        try {
            console.log("=== Memulai Penyelamatan Data Mentah Publikasi ===");
            
            // 1. Tarik Data SDM
            console.log("Menarik data SDM dari SISTER...");
            const dataSDM = await apiReader.fetchSDM();

            if (!dataSDM || dataSDM.length === 0) {
                console.log("Tidak ada data SDM yang ditarik.");
                return;
            }

            // Simpan SDM sebagai referensi (opsional jika sudah ada dari fungsi sebelumnya)
            simpanRawJSON('', '00_semua_sdm.json', dataSDM);
            console.log(`Berhasil mendapatkan ${dataSDM.length} SDM. Mulai menarik riwayat publikasi...`);

            let countDosen = 0;

            for (const sdm of dataSDM) {
                countDosen++;
                if (!sdm || !sdm.id_sdm) continue;

                console.log(`\n[${countDosen}/${dataSDM.length}] Memproses publikasi milik: ${sdm.nama_sdm || sdm.id_sdm}`);

                // 2. Tarik List Publikasi per SDM
                const listPublikasi = await apiReader.fetchListPublikasi(sdm.id_sdm);

                if (!listPublikasi || listPublikasi.length === 0) {
                    console.log(`   -> Tidak ada riwayat publikasi.`);
                    continue;
                }

                // Simpan list publikasi milik dosen tersebut ke dalam sub-folder
                simpanRawJSON('sdm_publication_lists', `list_publikasi_${sdm.id_sdm}.json`, listPublikasi);

                for (const pub of listPublikasi) {
                    const idPublikasi = pub.id;
                    if (!idPublikasi) continue;

                    console.log(`      -> Mendetailkan: ${pub.judul?.substring(0, 50)}...`);

                    // 3. Tarik Detail Lengkap Publikasi (Biasanya mencakup penulis dan dokumen)
                    const detail = await apiReader.fetchDetailPublikasi(idPublikasi);
                    
                    if (detail) {
                        // Simpan detail lengkapnya ke dalam sub-folder tersendiri
                        simpanRawJSON('publication_details', `detail_publikasi_${idPublikasi}.json`, detail);
                    }
                }
            }

            console.log("\n=== Seluruh Data Mentah Publikasi Berhasil Disimpan di Folder Output! ===");

        } catch (error: any) {
            console.error("Terjadi kesalahan saat menyimpan data publikasi:", error.message);
        }
    }
}

if (require.main === module) {
    (async () => {
        try {
            console.log("Memulai sinkronisasi SDM...");

            await fileSaver.fetchAndSaveSDM();
            
            console.log("Memulai sinkronisasi penelitian...");
            await fileSaver.savePenelitianRawJSON();

            console.log("Memulai sinkronisasi publikasi...");
            await fileSaver.savePublikasiRawJSON();

            console.log("Sinkronisasi selesai!");
            process.exit(0); 

        } catch (error) {
            console.error("Gagal melakukan sinkronisasi:", error);
            process.exit(1); 
        }
    })();
}