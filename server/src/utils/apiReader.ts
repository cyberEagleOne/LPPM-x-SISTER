import { HttpClient } from './httpClient';
import { Config } from '../config/apiConfig';
import { Token } from '../config/models';
//import { SdmResponse, AnggotaPenelitian, BidangKeilmuanSDM, BidangKeilmuanPenelitian, DetailPenelitian, DokumenPenelitian, MitraPenelitian, Penelitian } from '../config/models'
import dotenv from 'dotenv';
import pool from '../config/database';

dotenv.config();


export class apiReader {

  static async getAuthToken(): Promise<string> {
    try {
      const queryCek = `
        SELECT id, token, TIMESTAMPDIFF(MINUTE, timestamp, NOW()) AS umur_menit 
        FROM token 
        ORDER BY id DESC LIMIT 1
      `;
      const [rows]: any = await pool.execute(queryCek);

      if (rows.length > 0) {
        const dataToken = rows[0];

        if (dataToken.umur_menit < 60 && dataToken.umur_menit >= 0) {
          console.log(`Token dari DB masih valid. (Umur: ${dataToken.umur_menit} menit)`);
          return dataToken.token;
        } else {
          console.log(`Token kadaluarsa (Umur: ${dataToken.umur_menit} menit). Menghapus dari DB...`);
          await pool.execute("DELETE FROM token WHERE id = ?", [dataToken.id]);
        }
      }

      console.log("Meminta token BARU dari SISTER API...");
      const response = await HttpClient.post(Config.URL_AUTHORIZE, {
        username: process.env.SISTER_USERNAME,
        password: process.env.SISTER_PASSWORD,
        id_pengguna: process.env.SISTER_ID_USER
      });

      const tokenBaru = response.token;

      const queryInsert = "INSERT INTO token (token) VALUES (?)";
      await pool.execute(queryInsert, [tokenBaru]);
      
      console.log("Token baru berhasil disimpan ke database.");
      return tokenBaru;

    } catch (error: any) {
      console.error("Terjadi kesalahan saat mengurus token:", error.message);
      throw error;
    }
  }

  static async fetchSDM(): Promise<any[]> {
    const token = await this.getAuthToken();
    return await HttpClient.get(Config.URL_SDM, token);
  }

  static async fetchListPenelitian(id_sdm: string): Promise<any[]> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_PENELITIAN}?id_sdm=${id_sdm}`;
    return await HttpClient.get(url, token)
  }

  static async fetchDetailPenelitian(id_penelitian: string): Promise<any> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_PENELITIAN}/${id_penelitian}`;
    return await HttpClient.get(url, token);
  }

  static async fetchBidangIlmuSDM(id_sdm: string): Promise<any[]> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_BIDANG_ILMU}/${id_sdm}`;
    return await HttpClient.get(url, token);
  }

  static async fetchBidangIlmuPenelitian(id_pn?: string): Promise<any[]> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_PENELITIAN}/${id_pn}/bidang_ilmu`;
    return await HttpClient.get(url, token);
  }

  static async fetchListPublikasi(id_sdm: string): Promise<any[]> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_PUBLIKASI}?id_sdm=${id_sdm}`
    return await HttpClient.get(url, token);
  }

  static async fetchDetailPublikasi(id_publikasi: string): Promise<any> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_PUBLIKASI}/${id_publikasi}`;
    return await HttpClient.get(url, token);
  }
}