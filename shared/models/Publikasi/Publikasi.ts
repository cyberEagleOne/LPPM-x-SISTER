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