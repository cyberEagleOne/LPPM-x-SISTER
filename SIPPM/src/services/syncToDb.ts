import { apiReader, SdmResponse } from './apiReader';
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
}

if (require.main === module) {
  syncToDB.syncSDM();
}