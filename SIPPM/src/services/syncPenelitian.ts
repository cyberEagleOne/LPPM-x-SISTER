import axios from 'axios';
import { Config } from '../config/apiConfig';
import { apiReader } from './apiReader';
import pool from '../config/database';

interface MitraLitabmas {
  id: string;
  nama: string;
}

interface AnggotaLitabmas {
  nama: string;
  jenis: 'Dosen' | 'Mahasiswa' | 'Profesional/Mitra';
  id_sdm: string | null;
  id_pd: string | null; 
  nipd: string | null;   
  id_orang: string | null;
  stat_aktif: boolean;   
  peran: string;
}

interface DokumenLitabmas {
  id: string;
  nama: string;
  jenis_dokumen: string;
  nama_file: string;
  jenis_file: string;
  tanggal_upload: string;
  tautan: string;
  keterangan: string;
}

interface PenelitianResponse {
  id: string;
  id_kategori_kegiatan: number;
  judul: string;
  id_afiliasi: string;
  afiliasi: string;
  id_kelompok_bidang: string;
  kelompok_bidang: string;
  id_litabmas_sebelumnya: string | null;
  litabmas_sebelumnya: string | null;
  id_jenis_skim: string;
  jenis_skim: string;
  lokasi: string;
  tahun_usulan: number;
  tahun_kegiatan: number;
  tahun_pelaksanaan: number;
  lama_kegiatan: number;
  tahun_pelaksanaan_ke: number;
  dana_dikti: number;
  dana_perguruan_tinggi: number;
  dana_institusi_lain: number;
  in_kind: string | null;
  sk_penugasan: string | null;
  tanggal_sk_penugasan: string | null;
  mitra_litabmas: MitraLitabmas[];
  anggota: AnggotaLitabmas[];
  dokumen: DokumenLitabmas[];
  [key: string]: any;
}

export class syncPenelitian {
  static async fetchPenelitianDetail(token: string, id: string): Promise<PenelitianResponse | null> {
    try {
      const url = `${Config.URL_PENELITIAN}/${id}`;
      const response = await axios.get<PenelitianResponse>(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      console.error(`Gagal ambil detail penelitian ${id}:`, error.response?.status || error.message);
      return null;
    }
  }
  static async fetchPenelitianByDosen(token: string, idSdm: string): Promise<PenelitianResponse[]> {
    try {
      const response = await axios.get<PenelitianResponse[]>(Config.URL_PENELITIAN, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { id_sdm: idSdm }
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      console.error(`Gagal ambil daftar penelitian untuk SDM ${idSdm}:`, error.response?.status || error.message);
      return [];
    }
  }

  private static async insertLitabmas(data: PenelitianResponse): Promise<void> {
    const query = `
      INSERT INTO litabmas (
        id, id_kategori_kegiatan, judul, id_afiliasi, afiliasi,
        id_kelompok_bidang, kelompok_bidang, id_litabmas_sebelumnya, litabmas_sebelumnya,
        id_jenis_skim, jenis_skim, lokasi, tahun_usulan, tahun_kegiatan,
        tahun_pelaksanaan, lama_kegiatan, tahun_pelaksanaan_ke,
        dana_dikti, dana_perguruan_tinggi, dana_institusi_lain,
        in_kind, sk_penugasan, tanggal_sk_penugasan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        id_kategori_kegiatan = VALUES(id_kategori_kegiatan),
        judul = VALUES(judul),
        id_afiliasi = VALUES(id_afiliasi),
        afiliasi = VALUES(afiliasi),
        id_kelompok_bidang = VALUES(id_kelompok_bidang),
        kelompok_bidang = VALUES(kelompok_bidang),
        id_litabmas_sebelumnya = VALUES(id_litabmas_sebelumnya),
        litabmas_sebelumnya = VALUES(litabmas_sebelumnya),
        id_jenis_skim = VALUES(id_jenis_skim),
        jenis_skim = VALUES(jenis_skim),
        lokasi = VALUES(lokasi),
        tahun_usulan = VALUES(tahun_usulan),
        tahun_kegiatan = VALUES(tahun_kegiatan),
        tahun_pelaksanaan = VALUES(tahun_pelaksanaan),
        lama_kegiatan = VALUES(lama_kegiatan),
        tahun_pelaksanaan_ke = VALUES(tahun_pelaksanaan_ke),
        dana_dikti = VALUES(dana_dikti),
        dana_perguruan_tinggi = VALUES(dana_perguruan_tinggi),
        dana_institusi_lain = VALUES(dana_institusi_lain),
        in_kind = VALUES(in_kind),
        sk_penugasan = VALUES(sk_penugasan),
        tanggal_sk_penugasan = VALUES(tanggal_sk_penugasan),
        updated_at = CURRENT_TIMESTAMP
    `;

    await pool.execute(query, [
      data.id,
      data.id_kategori_kegiatan || null,
      data.judul || '',
      data.id_afiliasi || null,
      data.afiliasi || null,
      data.id_kelompok_bidang || null,
      data.kelompok_bidang || null,
      data.id_litabmas_sebelumnya || null,
      data.litabmas_sebelumnya || null,
      data.id_jenis_skim || null,
      data.jenis_skim || null,
      data.lokasi || null,
      data.tahun_usulan || null,
      data.tahun_kegiatan || null,
      data.tahun_pelaksanaan || null,
      data.lama_kegiatan || null,
      data.tahun_pelaksanaan_ke || null,
      data.dana_dikti || 0,
      data.dana_perguruan_tinggi || 0,
      data.dana_institusi_lain || 0,
      data.in_kind || null,
      data.sk_penugasan || null,
      data.tanggal_sk_penugasan || null
    ]);
  }
  private static async insertMitra(litabmasId: string, mitraList: MitraLitabmas[]): Promise<void> {
    if (!mitraList || mitraList.length === 0) return;
    await pool.execute('DELETE FROM mitra WHERE litabmas_id = ?', [litabmasId]);

    const query = `
      INSERT INTO mitra (id, litabmas_id, nama) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        litabmas_id = VALUES(litabmas_id),
        nama = VALUES(nama),
        updated_at = CURRENT_TIMESTAMP
    `;
    for (const m of mitraList) {
      await pool.execute(query, [m.id, litabmasId, m.nama || '']);
    }
  }
  private static async insertAnggota(litabmasId: string, anggotaList: AnggotaLitabmas[]): Promise<void> {
    if (!anggotaList || anggotaList.length === 0) return;
    await pool.execute('DELETE FROM anggota WHERE litabmas_id = ?', [litabmasId]);

    const query = `
      INSERT INTO anggota (litabmas_id, nama, jenis, id_sdm, id_peserta_didik, nomor_induk_peserta_didik, id_orang, aktif, peran)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    for (const a of anggotaList) {
      await pool.execute(query, [
        litabmasId,
        a.nama || '',
        a.jenis || 'Dosen',
        a.id_sdm || null,
        a.id_pd || null,
        a.nipd || null,
        a.id_orang || null,
        a.stat_aktif ? 1 : 0,
        a.peran || 'Anggota'
      ]);
    }
  }
  private static async insertDokumen(litabmasId: string, dokumenList: DokumenLitabmas[]): Promise<void> {
    if (!dokumenList || dokumenList.length === 0) return;

    await pool.execute('DELETE FROM dokumen WHERE litabmas_id = ?', [litabmasId]);

    const query = `
      INSERT INTO dokumen (id, litabmas_id, nama, jenis_dokumen, nama_file, jenis_file, tanggal_upload, tautan, keterangan)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        litabmas_id = VALUES(litabmas_id),
        nama = VALUES(nama),
        jenis_dokumen = VALUES(jenis_dokumen),
        nama_file = VALUES(nama_file),
        jenis_file = VALUES(jenis_file),
        tanggal_upload = VALUES(tanggal_upload),
        tautan = VALUES(tautan),
        keterangan = VALUES(keterangan),
        updated_at = CURRENT_TIMESTAMP
    `;
    for (const d of dokumenList) {
      await pool.execute(query, [
        d.id,
        litabmasId,
        d.nama || '',
        d.jenis_dokumen || null,
        d.nama_file || null,
        d.jenis_file || null,
        d.tanggal_upload || null,
        d.tautan || null,
        d.keterangan || null
      ]);
    }
  }
  static async sync(): Promise<void> {
    try {
      console.log('=== SYNC PENELITIAN DARI SISTER ===\n');
      const token = await apiReader.getAuthToken();
      console.log('Mengambil daftar SDM...');
      const daftarSdm = await apiReader.fetchSDM();

      if (!daftarSdm || daftarSdm.length === 0) {
        console.log('Tidak ada data SDM ditemukan.');
        return;
      }
      console.log(`Ditemukan ${daftarSdm.length} dosen.\n`);

      let totalPenelitian = 0;
      let totalMitra = 0;
      let totalAnggota = 0;
      let totalDokumen = 0;

      for (let i = 0; i < daftarSdm.length; i++) {
        const sdm = daftarSdm[i];
        const idSdm = sdm.id_sdm;
        if (!idSdm) continue;

        console.log(`[${i + 1}/${daftarSdm.length}] Mengambil penelitian dosen: ${sdm.nama_sdm || idSdm}`);

        const penelitianList = await this.fetchPenelitianByDosen(token, idSdm);

        if (penelitianList.length === 0) {
          console.log(`  -> Tidak ada penelitian.\n`);
          continue;
        }

        console.log(`  -> Ditemukan ${penelitianList.length} penelitian.`);

        for (const summary of penelitianList) {
          if (!summary.id) continue;

          const p = await this.fetchPenelitianDetail(token, summary.id);
          if (!p) continue;

          await this.insertLitabmas(p);
          totalPenelitian++;

          if (p.mitra_litabmas && p.mitra_litabmas.length > 0) {
            await this.insertMitra(p.id, p.mitra_litabmas);
            totalMitra += p.mitra_litabmas.length;
          }

          if (p.anggota && p.anggota.length > 0) {
            await this.insertAnggota(p.id, p.anggota);
            totalAnggota += p.anggota.length;
          }

          if (p.dokumen && p.dokumen.length > 0) {
            await this.insertDokumen(p.id, p.dokumen);
            totalDokumen += p.dokumen.length;
          }

          console.log(`     - "${p.judul}" (mitra: ${p.mitra_litabmas?.length || 0}, anggota: ${p.anggota?.length || 0}, dokumen: ${p.dokumen?.length || 0})`);
        }
        console.log('');
      }

      console.log('=== SYNC SELESAI ===');
      console.log(`Total penelitian : ${totalPenelitian}`);
      console.log(`Total mitra      : ${totalMitra}`);
      console.log(`Total anggota    : ${totalAnggota}`);
      console.log(`Total dokumen    : ${totalDokumen}`);

    } catch (error: any) {
      console.error('Gagal sync penelitian:', error.message);
    } finally {
      await pool.end();
    }
  }
}

if (require.main === module) {
  syncPenelitian.sync();
}
