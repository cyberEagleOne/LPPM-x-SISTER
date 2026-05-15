import { HttpClient } from './httpClient';
import { Config } from '../config/apiConfig';
import { prisma } from '../config/database'; // Import prisma
import dotenv from 'dotenv';

import type { 
  BidangKeilmuanPenelitian,
  BidangKeilmuanSDM,
  DetailPenelitian,
  DetailPublikasi,
  Penelitian,
  Publikasi,
  Sdm
} from '../../../shared/models';

dotenv.config();


export class apiReader {

  static async getAuthToken(): Promise<string> {
    try {
      // 1. SELECT id, token, timestamp FROM token ORDER BY id DESC LIMIT 1
      // Menggunakan Prisma findFirst
      const lastToken = await prisma.token.findFirst({
        orderBy: { id: 'desc' }
      });

      if (lastToken) {
        // Kalkulasi umur menit di sisi aplikasi
        const sekarang = new Date();
        const selisihMs = sekarang.getTime() - lastToken.timestamp.getTime();
        const umurMenit = Math.floor(selisihMs / 60000);

        if (umurMenit < 60 && umurMenit >= 0) {
          console.log(`Token masih valid (${umurMenit} menit).`);
          return lastToken.token as string;
        } else {
          // 2. DELETE FROM token WHERE id = ?
          // Menggunakan Prisma delete
          console.log(`Token kadaluarsa (${umurMenit} menit). Menghapus...`);
          await prisma.token.delete({
            where: { id: lastToken.id }
          });
        }
      }

      // Meminta token baru jika tidak ada atau kadaluarsa
      console.log("Meminta token baru dari API...");
      const response = await HttpClient.post(Config.URL_AUTHORIZE, {
        username: process.env.SISTER_USERNAME,
        password: process.env.SISTER_PASSWORD,
        id_pengguna: process.env.SISTER_ID_USER
      });

      const tokenBaru = response.token;

      // 3. INSERT INTO token (token) VALUES (?)
      // Menggunakan Prisma create
      await prisma.token.create({
        data: {
          token: tokenBaru
        }
      });

      return tokenBaru;
    } catch (error: any) {
      console.error("Gagal mengelola token:", error.message);
      throw error;
    }
  }

  static async fetchSDM(): Promise<Sdm[]> {
    const token = await this.getAuthToken();
    return await HttpClient.get(Config.URL_SDM, token);
  }

  static async fetchListPenelitian(id_sdm: string): Promise<Penelitian[]> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_PENELITIAN}?id_sdm=${id_sdm}`;
    return await HttpClient.get(url, token)
  }

  static async fetchDetailPenelitian(id_penelitian: string): Promise<DetailPenelitian> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_PENELITIAN}/${id_penelitian}`;
    return await HttpClient.get(url, token);
  }

  static async fetchBidangIlmuSDM(id_sdm: string): Promise<BidangKeilmuanSDM[]> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_BIDANG_ILMU}/${id_sdm}`;
    return await HttpClient.get(url, token);
  }

  static async fetchBidangIlmuPenelitian(id_pn?: string): Promise<BidangKeilmuanPenelitian[]> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_PENELITIAN}/${id_pn}/bidang_ilmu`;
    return await HttpClient.get(url, token);
  }

  static async fetchListPublikasi(id_sdm: string): Promise<Publikasi[]> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_PUBLIKASI}?id_sdm=${id_sdm}`
    return await HttpClient.get(url, token);
  }

  static async fetchDetailPublikasi(id_publikasi: string): Promise<DetailPublikasi> {
    const token = await this.getAuthToken();
    const url = `${Config.URL_PUBLIKASI}/${id_publikasi}`;
    return await HttpClient.get(url, token);
  }
}