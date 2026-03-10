import axios from 'axios';
import { Config } from '../config/apiConfig';
import { SdmResponse, token } from '../config/models';
import dotenv from 'dotenv';
import pool from '../config/database';

dotenv.config();


export class apiReader {

  static async getAuthToken(): Promise<string> {
    try {
      // 1. Ambil token terakhir dari database
      // Asumsi nama tabel: 'token' dan kolom waktu: 'timestamp'
      const queryCek = "SELECT id, token, timestamp FROM token ORDER BY id DESC LIMIT 1";
      const [rows] = await pool.execute<token[]>(queryCek);

      if (rows.length > 0) {
        const dataToken = rows[0];
        
        // 2. Hitung selisih waktu
        const waktuBuat = new Date(dataToken.timestamp);
        const waktuSekarang = new Date();
        
        const selisihMilidetik = waktuSekarang.getTime() - waktuBuat.getTime();
        const selisihMenit = Math.floor(selisihMilidetik / (1000 * 60)); // Ubah milidetik ke menit

        // 3. Evaluasi (Apakah umurnya di bawah 60 menit?)
        if (selisihMenit < 60) {
          console.log(`✅ Token dari DB masih valid. (Umur: ${selisihMenit} menit)`);
          return dataToken.token; // Langsung kembalikan tokennya, tidak perlu hit SISTER
        } else {
          console.log(`⚠️ Token kadaluarsa (Umur: ${selisihMenit} menit). Menghapus dari DB...`);
          // Hapus token yang sudah usang
          await pool.execute("DELETE FROM token WHERE id = ?", [dataToken.id]);
        }
      }

      // 4. Jika tidak ada token (kosong) ATAU token sudah dihapus di atas, Minta yang Baru!
      console.log("⏳ Meminta token BARU dari SISTER API...");
      const response = await axios.post(Config.URL_AUTHORIZE, {
        username: process.env.SISTER_USERNAME,
        password: process.env.SISTER_PASSWORD,
        id_pengguna: process.env.SISTER_ID_USER
      });

      const tokenBaru = response.data.token;

      // 5. Simpan token baru ke database
      const queryInsert = "INSERT INTO token (token) VALUES (?)";
      // Kita asumsikan kolom 'timestamp' di tabelmu sudah diatur 'CURRENT_TIMESTAMP' secara otomatis oleh MySQL
      await pool.execute(queryInsert, [tokenBaru]);
      
      console.log("✅ Token baru berhasil disimpan ke database.");
      return tokenBaru;

    } catch (error: any) {
      console.error("❌ Terjadi kesalahan saat mengurus token:", error.message);
      throw error;
    }
  }

  static async testLihatResponseSDM(): Promise<void> {
    try {
      const token = await this.getAuthToken();

      console.log(`\nMengambil data dari: ${Config.URL_SDM}`);
      const response = await axios.get<SdmResponse[]>(Config.URL_SDM, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const dataSdm = response.data;

      console.log("\n========== HASIL RESPONSE SISTER API ==========");
      
      if (Array.isArray(dataSdm) && dataSdm.length > 0) {
          console.log(`Total Data Ditemukan: ${dataSdm.length} baris`);
          console.log("\nContoh Struktur Data (Item Pertama):");
          console.dir(dataSdm[0], { depth: null, colors: true });
      } else {
          console.log("Struktur Response Utuh:");
          console.dir(dataSdm, { depth: null, colors: true });
      }
      
      console.log("===============================================\n");

    } catch (error: any) {
      console.error("Terjadi kesalahan saat menarik data:", error.response?.data || error.message);
    }
  }

  static async fetchSDM(): Promise<SdmResponse[]> {
    const token = await this.getAuthToken();
    const response = await axios.get<SdmResponse[]>(Config.URL_SDM, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }
}

if (require.main === module) {
  apiReader.testLihatResponseSDM();
}