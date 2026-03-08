import axios from 'axios';
import { Config } from '../config/apiConfig';
import dotenv from 'dotenv';

dotenv.config();

interface SisterAuthResponse {
  token: string;
}

export interface SisterSdmResponse {
  id_sdm?: string;
  nama_sdm?: string;
  nidn?: string;
  [key: string]: any;
}

export class SisterService {
  
  static async getAuthToken(): Promise<string> {
    try {
      console.log("Sedang meminta token otorisasi...");
      const response = await axios.post<SisterAuthResponse>(Config.URL_AUTHORIZE, {
        username: process.env.SISTER_USERNAME,
        password: process.env.SISTER_PASSWORD,
        id_pengguna: process.env.SISTER_ID_USER
      });
      
      console.log("Token berhasil didapatkan!");
      return response.data.token; 
    } catch (error: any) {
      console.error("Gagal login ke SISTER API:", error.response?.data || error.message);
      throw new Error("Gagal mendapatkan token autentikasi SISTER");
    }
  }

  static async testLihatResponseSDM(): Promise<void> {
    try {
      const token = await this.getAuthToken();

      console.log(`Mengambil data dari: ${Config.URL_SDM}`);
      const response = await axios.get<SisterSdmResponse[]>(Config.URL_SDM, {
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
}

if (require.main === module) {
  SisterService.testLihatResponseSDM();
}