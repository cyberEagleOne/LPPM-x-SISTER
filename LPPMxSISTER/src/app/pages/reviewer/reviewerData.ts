// Shared mock data for reviewer pages

export interface SubmissionField {
  label: string;
  submitted: string;
  sister: string;
  match: "match" | "mismatch" | "partial";
}

export interface ResearchItem {
  id: number;
  submittedAt: string;
  schema: string;
  dosenName: string;
  dosenNidn: string;
  prodi: string;
  title: string;
  fields: SubmissionField[];
  sisterFound: boolean;
  overallValidity: "valid" | "invalid" | "partial";
}

export const submissions: ResearchItem[] = [
  {
    id: 1,
    submittedAt: "3 Mar 2026",
    schema: "Penelitian Terapan",
    dosenName: "Dr. Siti Rahma, M.Si.",
    dosenNidn: "0012345678",
    prodi: "Teknik Informatika",
    title: "Implementasi IoT dalam Monitoring Kualitas Udara Perkotaan",
    sisterFound: true,
    overallValidity: "partial",
    fields: [
      { label: "Judul Penelitian", submitted: "Implementasi IoT dalam Monitoring Kualitas Udara Perkotaan", sister: "Implementasi IoT dalam Monitoring Kualitas Udara Perkotaan", match: "match" },
      { label: "Ketua Peneliti", submitted: "Dr. Siti Rahma, M.Si.", sister: "Dr. Siti Rahma, M.Si.", match: "match" },
      { label: "NIDN Ketua", submitted: "0012345678", sister: "0012345678", match: "match" },
      { label: "Program Studi", submitted: "Teknik Informatika", sister: "Teknik Informatika", match: "match" },
      { label: "Tahun Penelitian", submitted: "2025", sister: "2026", match: "mismatch" },
      { label: "Anggota Peneliti", submitted: "M. Rizky Pratama, Dewi Kurniawati", sister: "M. Rizky Pratama", match: "partial" },
    ],
  },
  {
    id: 2,
    submittedAt: "28 Feb 2026",
    schema: "Penelitian Dasar",
    dosenName: "Dr. Siti Rahma, M.Si.",
    dosenNidn: "0012345678",
    prodi: "Teknik Informatika",
    title: "Sistem Rekomendasi Beasiswa Mahasiswa Menggunakan Machine Learning",
    sisterFound: true,
    overallValidity: "valid",
    fields: [
      { label: "Judul Penelitian", submitted: "Sistem Rekomendasi Beasiswa Mahasiswa Menggunakan Machine Learning", sister: "Sistem Rekomendasi Beasiswa Mahasiswa Menggunakan Machine Learning", match: "match" },
      { label: "Ketua Peneliti", submitted: "Dr. Siti Rahma, M.Si.", sister: "Dr. Siti Rahma, M.Si.", match: "match" },
      { label: "NIDN Ketua", submitted: "0012345678", sister: "0012345678", match: "match" },
      { label: "Program Studi", submitted: "Teknik Informatika", sister: "Teknik Informatika", match: "match" },
      { label: "Tahun Penelitian", submitted: "2026", sister: "2026", match: "match" },
      { label: "Anggota Peneliti", submitted: "Arif Budiman", sister: "Arif Budiman", match: "match" },
    ],
  },
  {
    id: 3,
    submittedAt: "25 Feb 2026",
    schema: "Penelitian Terapan",
    dosenName: "Dr. Hendra Kurniawan, M.Kom.",
    dosenNidn: "0099887766",
    prodi: "Sistem Informasi",
    title: "Analisis Sentimen Media Sosial untuk Deteksi Krisis Kesehatan",
    sisterFound: false,
    overallValidity: "invalid",
    fields: [
      { label: "Judul Penelitian", submitted: "Analisis Sentimen Media Sosial untuk Deteksi Krisis Kesehatan", sister: "— Tidak ditemukan —", match: "mismatch" },
      { label: "Ketua Peneliti", submitted: "Dr. Hendra Kurniawan, M.Kom.", sister: "— Tidak ditemukan —", match: "mismatch" },
      { label: "NIDN Ketua", submitted: "0099887766", sister: "— Tidak ditemukan —", match: "mismatch" },
      { label: "Program Studi", submitted: "Sistem Informasi", sister: "— Tidak ditemukan —", match: "mismatch" },
      { label: "Tahun Penelitian", submitted: "2026", sister: "— Tidak ditemukan —", match: "mismatch" },
      { label: "Anggota Peneliti", submitted: "Rina Fitriani, Dr. Agus Prasetyo", sister: "— Tidak ditemukan —", match: "mismatch" },
    ],
  },
  {
    id: 4,
    submittedAt: "12 Mar 2026",
    schema: "Penelitian Pengembangan",
    dosenName: "Dr. Ayu Lestari, M.Pharm.",
    dosenNidn: "0044556677",
    prodi: "Farmasi",
    title: "Optimasi Formulasi Gel Herbal untuk Perawatan Luka",
    sisterFound: true,
    overallValidity: "valid",
    fields: [
      { label: "Judul Penelitian", submitted: "Optimasi Formulasi Gel Herbal untuk Perawatan Luka", sister: "Optimasi Formulasi Gel Herbal untuk Perawatan Luka", match: "match" },
      { label: "Ketua Peneliti", submitted: "Dr. Ayu Lestari, M.Pharm.", sister: "Dr. Ayu Lestari, M.Pharm.", match: "match" },
      { label: "NIDN Ketua", submitted: "0044556677", sister: "0044556677", match: "match" },
      { label: "Program Studi", submitted: "Farmasi", sister: "Farmasi", match: "match" },
      { label: "Tahun Penelitian", submitted: "2026", sister: "2026", match: "match" },
      { label: "Anggota Peneliti", submitted: "N. Putri, R. Maulana", sister: "N. Putri, R. Maulana", match: "match" },
    ],
  },
  {
    id: 5,
    submittedAt: "10 Mar 2026",
    schema: "Penelitian Dasar",
    dosenName: "Dr. Wahyu Nugroho, M.Sc.",
    dosenNidn: "0077889900",
    prodi: "Biologi",
    title: "Studi Keanekaragaman Mikroba Tanah pada Lahan Gambut",
    sisterFound: true,
    overallValidity: "partial",
    fields: [
      { label: "Judul Penelitian", submitted: "Studi Keanekaragaman Mikroba Tanah pada Lahan Gambut", sister: "Studi Keanekaragaman Mikroba Tanah pada Lahan Gambut", match: "match" },
      { label: "Ketua Peneliti", submitted: "Dr. Wahyu Nugroho, M.Sc.", sister: "Dr. Wahyu Nugroho, M.Sc.", match: "match" },
      { label: "NIDN Ketua", submitted: "0077889900", sister: "0077889900", match: "match" },
      { label: "Program Studi", submitted: "Biologi", sister: "Biologi", match: "match" },
      { label: "Tahun Penelitian", submitted: "2025", sister: "2026", match: "mismatch" },
      { label: "Anggota Peneliti", submitted: "S. Handayani, A. Prasetyo", sister: "S. Handayani", match: "partial" },
    ],
  },
];

// Historical decided items for the sub-pages
export interface DecidedItem {
  id: number;
  title: string;
  dosenName: string;
  prodi: string;
  schema: string;
  submittedAt: string;
  decidedAt: string;
  status: "pending" | "approved" | "rejected";
  matchScore: number;
  reviewerNote: string;
}

export const allResearchHistory: DecidedItem[] = [
  { id: 101, title: "Pengembangan Model Pembelajaran Berbasis AI untuk Pendidikan Tinggi", dosenName: "Dr. Siti Rahma, M.Si.", prodi: "Teknik Informatika", schema: "Penelitian Terapan", submittedAt: "15 Jan 2025", decidedAt: "20 Jan 2025", status: "approved", matchScore: 100, reviewerNote: "Data sudah sesuai dengan SISTER. Disetujui." },
  { id: 102, title: "Analisis Keamanan Aplikasi Mobile Perbankan di Indonesia", dosenName: "Dr. Siti Rahma, M.Si.", prodi: "Teknik Informatika", schema: "Penelitian Terapan", submittedAt: "10 Nov 2024", decidedAt: "15 Nov 2024", status: "approved", matchScore: 100, reviewerNote: "Semua data terverifikasi. Approve." },
  { id: 103, title: "Pengembangan Sistem Deteksi Plagiarisme Berbasis NLP Bahasa Indonesia", dosenName: "Dr. Siti Rahma, M.Si.", prodi: "Teknik Informatika", schema: "Penelitian Pengembangan", submittedAt: "5 Jul 2024", decidedAt: "10 Jul 2024", status: "approved", matchScore: 100, reviewerNote: "Data valid. Disetujui." },
  { id: 104, title: "Formulasi Nanopartikel Kurkumin Sebagai Agen Anti-Kanker", dosenName: "Dr. Ayu Lestari, M.Pharm.", prodi: "Farmasi", schema: "Penelitian Dasar", submittedAt: "20 Dec 2024", decidedAt: "28 Dec 2024", status: "approved", matchScore: 83, reviewerNote: "Data sebagian besar sesuai. Approved." },
  { id: 105, title: "Optimasi Algoritma Kompresi Data untuk Perangkat IoT Berdaya Rendah", dosenName: "Dr. Siti Rahma, M.Si.", prodi: "Teknik Informatika", schema: "Penelitian Dasar", submittedAt: "2 Sep 2024", decidedAt: "8 Sep 2024", status: "rejected", matchScore: 50, reviewerNote: "Tahun penelitian tidak sesuai dengan data SISTER. Mohon perbaiki dan ajukan ulang." },
  { id: 106, title: "Studi Kelayakan Energi Surya di Kawasan Pedesaan Kalimantan", dosenName: "Dr. Teguh Arief, M.Eng.", prodi: "Teknik Kimia", schema: "Penelitian Terapan", submittedAt: "15 Aug 2024", decidedAt: "22 Aug 2024", status: "rejected", matchScore: 33, reviewerNote: "Data peneliti tidak ditemukan di SISTER. NIDN tidak terdaftar." },
  // Pending items (these are the same as submissions above, for the pending table)
  { id: 1, title: "Implementasi IoT dalam Monitoring Kualitas Udara Perkotaan", dosenName: "Dr. Siti Rahma, M.Si.", prodi: "Teknik Informatika", schema: "Penelitian Terapan", submittedAt: "3 Mar 2026", decidedAt: "-", status: "pending", matchScore: 67, reviewerNote: "" },
  { id: 2, title: "Sistem Rekomendasi Beasiswa Mahasiswa Menggunakan Machine Learning", dosenName: "Dr. Siti Rahma, M.Si.", prodi: "Teknik Informatika", schema: "Penelitian Dasar", submittedAt: "28 Feb 2026", decidedAt: "-", status: "pending", matchScore: 100, reviewerNote: "" },
  { id: 3, title: "Analisis Sentimen Media Sosial untuk Deteksi Krisis Kesehatan", dosenName: "Dr. Hendra Kurniawan, M.Kom.", prodi: "Sistem Informasi", schema: "Penelitian Terapan", submittedAt: "25 Feb 2026", decidedAt: "-", status: "pending", matchScore: 0, reviewerNote: "" },
];
