import axios from 'axios';
import { Config } from '../config/apiConfig';
import { SdmResponse } from '../config/models';
import pool from '../config/database';
import dotenv from 'dotenv';

dotenv.config();

interface AuthResponse {
  token: string;
}

export class apiReader {
  
   static async getAuthToken(): Promise<string>{
    try {
      const queryCek = "SELECT id, token, timestamp FROM token ORDER BY id DESC LIMIT 1";
      const [rows]: any = await pool.execute(queryCek);

      if (rows.length > 0) {
        const dataToken = rows[0];
        
        const waktuBuat = new Date(dataToken.timestamp);
        const waktuSekarang = new Date();
        
        const selisihMilidetik = waktuSekarang.getTime() - waktuBuat.getTime();
        const selisihMenit = Math.floor(selisihMilidetik / (1000 * 60));

        if (selisihMenit < 60) {
          console.log(`Token dari DB masih valid. (Umur: ${selisihMenit} menit)`);
          return dataToken.token;
        } else {
          console.log(`Token kadaluarsa (Umur: ${selisihMenit} menit). Menghapus dari DB...`);
          await pool.execute("DELETE FROM token WHERE id = ?", [dataToken.id]);
        }
      }

      console.log("Meminta token BARU dari SISTER API...");
      const response = await axios.post(Config.URL_AUTHORIZE, {
        id_pengguna: process.env.SISTER_ID_PENGGUNA,
        username: process.env.SISTER_USERNAME,
        password: process.env.SISTER_PASSWORD
      });

      const tokenBaru = response.data.token;

      const queryInsert = "INSERT INTO token (token) VALUES (?)";
      await pool.execute(queryInsert, [tokenBaru]);
      
      console.log("Token baru berhasil disimpan ke database.");
      return tokenBaru;

    } catch (error: any) {
      console.error("Terjadi kesalahan saat mengurus token:", error.message);
      throw error;
    }
  }

  static async testLihatResponseSDM(): Promise<void> {
    try {
      const token = await this.getAuthToken();

      console.log(`Mengambil data dari: ${Config.URL_SDM}`);
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
          console.dir(dataSdm[88], { depth: null, colors: true });
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