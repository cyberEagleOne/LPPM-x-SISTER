export interface TokenCache {
  token: string;
  created_at: number; 
}

export interface SdmResponse {
  id_sdm?: string;
  nama_sdm?: string;
  nidn?: string;
  [key: string]: any;
}

export interface MitraLitabmas {
  id: string;
  nama: string;
}

export interface AnggotaLitabmas {
  nama: string;
  jenis: 'Dosen' | 'Mahasiswa' | 'Profesional/Mitra';
  id_sdm: string | null;
  id_pd: string | null; 
  nipd: string | null;   
  id_orang: string | null;
  stat_aktif: boolean;   
  peran: string;
}

export interface DokumenLitabmas {
  id: string;
  nama: string;
  jenis_dokumen: string;
  nama_file: string;
  jenis_file: string;
  tanggal_upload: string;
  tautan: string;
  keterangan: string;
}

export interface PenelitianResponse {
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