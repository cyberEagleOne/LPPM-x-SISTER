export interface MitraPenelitian{
  id: string;
  litabmas_id: string;
  nama: string;
  // Opsional karena MySQL otomatis mengisinya saat INSERT/UPDATE
  created_at: string | Date;
  updated_at: string | Date;
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
  
  anggota?: AnggotaPenelitian[];
  mitra_litabmas?: MitraPenelitian[];
  dokumen?: DokumenPenelitian[];
  status?: string; // Menambahkan properti status untuk menyimpan status penelitian
}