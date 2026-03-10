import axios from 'axios';
import { Config } from '../config/apiConfig';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const TOKEN_CACHE_FILE = path.join(__dirname, '../../.sister_token_cache');

const TOKEN_LIFETIME_MS = (parseInt(process.env.SISTER_TOKEN_LIFETIME_MINUTES || '55')) * 60 * 1000;

interface AuthResponse {
  token: string;
}

interface TokenCache {
  token: string;
  created_at: number; 
}

export interface SdmResponse {
  id_sdm?: string;
  nama_sdm?: string;
  nidn?: string;
  [key: string]: any;
}

export class apiReader {

  private static readCachedToken(): string | null {
    try {
      if (!fs.existsSync(TOKEN_CACHE_FILE)) return null;

      const raw = fs.readFileSync(TOKEN_CACHE_FILE, 'utf-8');
      const cache: TokenCache = JSON.parse(raw);

      const elapsed = Date.now() - cache.created_at;
      const lifetimeMinutes = TOKEN_LIFETIME_MS / 60000;

      if (elapsed < TOKEN_LIFETIME_MS) {
        const sisaMenit = Math.round((TOKEN_LIFETIME_MS - elapsed) / 60000);
        console.log(Token cache masih valid (sisa ${sisaMenit} menit dari ${lifetimeMinutes} menit));
        return cache.token;
      }

      console.log(Token cache sudah expired (lewat ${lifetimeMinutes} menit), perlu generate ulang...);
      return null;
    } catch {
      return null;
    }
  }
  private static saveCachedToken(token: string): void {
    const cache: TokenCache = {
      token,
      created_at: Date.now()
    };
    fs.writeFileSync(TOKEN_CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');
    console.log(Token disimpan ke cache: ${TOKEN_CACHE_FILE});
  }
  static async getAuthToken(): Promise<string> {
    const envToken = process.env.SISTER_TOKEN;
    if (envToken && envToken.trim() !== '') {
      console.log('Menggunakan SISTER_TOKEN dari .env');
      return envToken.trim();
    }
    const cachedToken = this.readCachedToken();
    if (cachedToken) {
      return cachedToken;
    }
    try {
      console.log("Meminta token baru dari SISTER API...");
      const response = await axios.post<AuthResponse>(Config.URL_AUTHORIZE, {
        username: process.env.SISTER_USERNAME,
        password: process.env.SISTER_PASSWORD,
        id_pengguna: process.env.SISTER_ID_USER
      });
      
      const newToken = response.data.token;
      console.log("Token baru berhasil didapatkan!");

      // Simpan ke cache supaya tidak request ulang
      this.saveCachedToken(newToken);

      return newToken; 
    } catch (error: any) {
      console.error("Gagal login ke SISTER API:", error.response?.data || error.message);
      throw new Error("Gagal mendapatkan token autentikasi SISTER");
    }
  }

  static async testLihatResponseSDM(): Promise<void> {
    try {
      const token = await this.getAuthToken();

      console.log(\nMengambil data dari: ${Config.URL_SDM});
      const response = await axios.get<SdmResponse[]>(Config.URL_SDM, {
        headers: {
          'Authorization': Bearer ${token}
        }
      });

      const dataSdm = response.data;

      console.log("\n========== HASIL RESPONSE SISTER API ==========");
      
      if (Array.isArray(dataSdm) && dataSdm.length > 0) {
          console.log(Total Data Ditemukan: ${dataSdm.length} baris);
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
        'Authorization': Bearer ${token}
      }
    });
    return response.data;
  }
}

if (require.main === module) {
  apiReader.testLihatResponseSDM();
}