import axios from 'axios';
import { Config } from '../config/apiConfig';
import { Token } from '../config/models';
//import { SdmResponse, AnggotaPenelitian, BidangKeilmuanSDM, BidangKeilmuanPenelitian, DetailPenelitian, DokumenPenelitian, MitraPenelitian, Penelitian } from '../config/models'
import dotenv from 'dotenv';
import pool from '../config/database';

dotenv.config();


export class apiReader {

  static async getAuthToken(): Promise<string> {
    try {
      const queryCek = "SELECT id, token, timestamp FROM token ORDER BY id DESC LIMIT 1";
      const [rows] = await pool.execute<Token[]>(queryCek);

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
        username: process.env.SISTER_USERNAME,
        password: process.env.SISTER_PASSWORD,
        id_pengguna: process.env.SISTER_ID_USER
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

      console.log(`\nMengambil data dari: ${Config.URL_SDM}`);
      const response = await axios.get<any[]>(Config.URL_SDM, {
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

  static async fetchSDM(): Promise<any[]> {
    const token = await this.getAuthToken();
    const response = await axios.get<any[]>(Config.URL_SDM, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  }

  static async fetchListPenelitian(id_sdm: string): Promise<any[]> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_PENELITIAN}?id_sdm=${id_sdm}`;
    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data; 
  }

  static async fetchDetailPenelitian(id_penelitian: string): Promise<any> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_PENELITIAN}/${id_penelitian}`;
    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  }

  static async fetchBidangIlmuSDM(id_sdm: string): Promise<any[]> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_BIDANG_ILMU}/${id_sdm}`;
    const response = await axios.get(url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  }

  static async fetchBidangIlmuPenelitian(id_pn?: string): Promise<any[]> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_PENELITIAN}/${id_pn}/bidang_ilmu`;
    const response = await axios.get(url, {
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