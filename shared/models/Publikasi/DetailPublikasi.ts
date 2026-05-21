export type PublikasiStatus =
  | "draft"
  | "submitted"
  | "pending-review"
  | "revisi"
  | "submit-revisi"
  | "approved"
  | "rejected"
  | "verified"
  | "read-finance"
  | "lunas"
  | "hutang"
  | "active"
  | "inactive"
  | "expired";

export type JenisPublikasi = "artikel" | "buku" | "haki" | "prototipe";

export interface RiwayatAktivitas {
  id: string;
  tanggal: string;
  status: string;
  aktor: string;
  peran: string;
  catatan?: string | null;
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

export interface PublikasiPenulis {
  id: string;
  id_penulis: number | string;          
  id_publikasi: string;        
  nama: string;               
  jenis: 'Dosen' | 'Mahasiswa' | 'Profesional/Mitra'; 
  id_sdm: string | null;       
  id_peserta_didik: string | null; 
  nomor_induk_peserta_didik: string | null; 
  id_orang: string | null;    
  urutan: number;              
  afiliasi: string;           
  corresponding_author: number | boolean | string | null; 
  peran: string;               
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

  penulis?: PublikasiPenulis[];
  dokumen?: PublikasiDokumen[];
}

export interface PublikasiItem {
  id: string;
  periodeId: string;
  jenis_publikasi?: string;
  id_jenis_publikasi?: number | "";
  jenis: JenisPublikasi;
  judul: string;
  quartile?: number | "";
  kategori_kegiatan?: string;
  id_kategori_kegiatan?: number | "";
  kategori_capaian_luaran?: string;
  id_kategori_capaian_luaran?: number | null | "";
  nama_jurnal?: string;
  doi?: string;
  tautan?: string;
  jenisJurnal?: string;
  issn?: string;
  halaman?: string;
  edisi?: string;
  volume?: number;
  nomor?: number;
  keterangan?: string;
  penerbit?: string;
  isbn?: string;
  jumlah_halaman: number | null;
  nomorSertifikat?: string;
  jenisHaki?: string;
  namaProto?: string;
  jenisProto?: string;
  urlDokumen?: string;
  tanggal: string;
  status: PublikasiStatus;
  tanggalDibuat: string;
  urutanPenulis: number | "";
  penulisDosen: PublikasiPenulis[];
  penulisMahasiswa: PublikasiPenulis[];
  riwayat?: RiwayatAktivitas[];
  dokumen: PublikasiDokumen[];
}