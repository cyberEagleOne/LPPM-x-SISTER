import { RowDataPacket } from 'mysql2';

export interface SdmResponse {
  id_sdm?: string;
  nama_sdm?: string;
  nidn?: string;
  [key: string]: any;
}

export interface Token extends RowDataPacket{
  id: any;
  token: string;
  timestamp: any;
}

export interface Penelitian{
  id?: string;
  judul: string;
  tahun_pelaksanaan?: number;
  lama_kegiatan?: number;
  id_users?: string;
}

export interface BidangKeilmuan{
  id?: number;
  urutan?: number;
  id_kelompok_bidang: string;
  kelompok_bidang: string;
  id_dt_penelitian?: string;
}

export interface DetailPenelitian{
  id?: string;
  id_kategori_kegiatan?: number;
  judul: string;
  [key: string]: any;
}

export interface AnggotaPenelitian{
  id?: number;
  litabmas_id?: string;
  nama: string;
  jenis?: string;
  [key: string]: any;
}

export interface MitraPenelitian{
  id?: string;
  litabmas_id?: string;
  nama: string;
  [key: string]: any;
}

export interface DokumenPenelitian{
  id?: string;
  litabmas_id?: string;
  nama: string;
  jenis_dokumen: string;
  nama_file: string;
  jenis_file: string;
  tanggal_upload?: Date;
  tautan: string;
  keterangan: string;
  [key: string]: any;
}