import { RowDataPacket } from 'mysql2';

export interface Token extends RowDataPacket{
  id: any;
  token: string;
  timestamp: any;
}

export interface Sdm {
  id_sdm?: string;
  nama_sdm?: string;
  nidn?: string;
  [key: string]: any;
}

/* VV - UNUSED - VV */

export interface Penelitian{
  id: string;
  judul: string | null;
  tahun_pelaksanaan: number | null;
  lama_kegiatan: number | null;
  id_users: string;
}

export interface BidangKeilmuanSDM{
  id: number;
  urutan: number;
  id_kelompok_bidang: string;
  kelompok_bidang: string;
  id_sdm: string;
}

export interface BidangKeilmuanPenelitian{
  id: number;
  urutan: number;
  id_kelompok_bidang: string;
  kelompok_bidang: string;
  id_penelitian: string;
}

export interface DetailPenelitian {
  id: string;                         
  id_kategori_kegiatan: number | null; 
  judul: string;                     
  id_afiliasi: string | null;         
  afiliasi: string | null;            
  id_kelompok_bidang: string | null;  
  kelompok_bidang: string | null;    
  id_litabmas_sebelumnya: string | null; 
  litabmas_sebelumnya: string | null;
  id_jenis_skim: string | null;       
  jenis_skim: string | null;         
  lokasi: string | null;              
  tahun_usulan: number | null;        
  tahun_kegiatan: number | null;      
  tahun_pelaksanaan: number | null;   
  lama_kegiatan: number | null;       
  tahun_pelaksanaan_ke: number | null; 
  // Driver mysql2 Node.js membaca DECIMAL sebagai string, bukan number!
  dana_dikti: string | null;          // decimal(15,2)
  dana_perguruan_tinggi: string | null; // decimal(15,2)
  dana_institusi_lain: string | null; // decimal(15,2)
  in_kind: string | null;             
  sk_penugasan: string | null;        
  tanggal_sk_penugasan: string | null; // date (disimpan sebagai string format 'YYYY-MM-DD' di TS)
  // Opsional (?) karena MySQL otomatis mengisinya saat INSERT/UPDATE
  created_at?: string | Date;         
  updated_at?: string | Date;         
  
  id_penelitian: string;              
}
export interface AnggotaPenelitian {
  id?: number;                 
  litabmas_id: string;         
  nama: string;                
  jenis: 'Dosen' | 'Mahasiswa' | 'Profesional/Mitra';
  id_sdm: string | null;       
  id_peserta_didik: string | null; 
  nomor_induk_peserta_didik: string | null;
  id_orang: string | null;     
  aktif: number;               
  peran: string;              
  // Opsional karena otomatis diisi oleh MySQL DEFAULT_GENERATED
  created_at?: string | Date;  // timestamp
  updated_at?: string | Date;  // timestamp
}

export interface MitraPenelitian{
  id: string;
  litabmas_id: string;
  nama: string;
  // Opsional karena MySQL otomatis mengisinya saat INSERT/UPDATE
  created_at: string | Date;
  updated_at: string | Date;
}

export interface DokumenPenelitian {
  id: string;                           
  litabmas_id: string;                  
  nama: string;                         
  jenis_dokumen: string | null;         
  nama_file: string | null;             
  jenis_file: string | null;           
  // Datetime di mysql2 biasanya dikembalikan sebagai object Date, tapi sering diparsing sebagai string.
  tanggal_upload: string | Date | null;
  tautan: string | null;                
  keterangan: string | null;            
  // Opsional karena otomatis diisi oleh MySQL DEFAULT_GENERATED
  created_at?: string | Date;           
  updated_at?: string | Date;           
}

export interface Publikasi{
  id: string;
  kategori_kegiatan: string;
  judul: string;
  quartile: number | null;
  jenis_publikasi: string;
  tanggal: string;
  asal_data: string;
  id_user: string;
}

export interface DetailPublikasi {
  id: string; 
  kategori_kegiatan: string;
  judul: string;
  quartile: number | null;
  jenis_publikasi: string;
  tanggal: string; 
  id_kategori_kegiatan: number;
  id_jenis_publikasi: number;
  kategori_capaian_luaran: string;
  id_kategori_capaian_luaran: number | null;
  judul_litabmas: string | null;
  id_litabmas: string | null; 
  nomor_paten: string | null;
  pemberi_paten: string | null;
  penerbit: string | null;
  isbn: string | null;
  jumlah_halaman: number | null;
  tautan: string | null;
  keterangan: string | null;
  judul_artikel: string | null;
  judul_asli: string | null;
  nama_jurnal: string | null;
  halaman: string | null; 
  edisi: string | null;
  volume: number | null;
  nomor: number | null;
  doi: string | null;
  issn: string | null;
  e_issn: string | null;
  seminar: number | null; 
  prosiding: number | null; 
  asal_data: string | null;
  id_publikasi: string; 
}

export interface PublikasiPenulis {
  id_penulis: number;          
  id_publikasi: string;        
  nama: string;               
  jenis: 'Dosen' | 'Mahasiswa' | 'Profesional/Mitra'; 
  id_sdm: string | null;       
  id_peserta_didik: string | null; 
  nomor_induk_peserta_didik: string | null; 
  id_orang: string | null;    
  urutan: number;              
  afiliasi: string;           
  corresponding_author: number | null; 
  peran: string;               
}

export interface PublikasiDokumen {
  id: string;              
  id_publikasi: string;    
  nama: string;            
  jenis_dokumen: string;   
  nama_file: string;       
  jenis_file: string;      
  tanggal_upload: string | null; 
  tautan: string | null;         
  keterangan: string | null;     
}