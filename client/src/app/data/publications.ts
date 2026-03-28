export type Publication = {
  id: number;
  title: string;
  author: string;
  prodi: string;
  year: number;
  journal: string;
  doi: string;
  status: string;
  abstract: string;
  keywords: string[];
};

export const publications: Publication[] = [
  {
    id: 1,
    title: "Pengembangan Model Pembelajaran Berbasis AI untuk Pendidikan Tinggi",
    author: "Dr. Siti Rahma, M.Si.",
    prodi: "Teknik Informatika",
    year: 2025,
    journal: "Journal of Educational Technology",
    doi: "10.1234/jet.2025.001",
    status: "Terverifikasi",
    abstract:
      "Penelitian ini mengembangkan model pembelajaran adaptif berbasis AI untuk meningkatkan personalisasi materi kuliah. Sistem memanfaatkan profil belajar mahasiswa dan analitik ketercapaian untuk merekomendasikan konten dan evaluasi yang relevan.",
    keywords: ["AI", "Pendidikan Tinggi", "Adaptive Learning", "Learning Analytics"],
  },
  {
    id: 2,
    title: "Analisis Dampak Kebijakan Fiskal Terhadap Pertumbuhan Ekonomi Regional",
    author: "Prof. Budi Santoso, Ph.D.",
    prodi: "Ekonomi Pembangunan",
    year: 2025,
    journal: "Indonesian Economic Review",
    doi: "10.1234/ier.2025.014",
    status: "Terverifikasi",
    abstract:
      "Studi ini mengevaluasi dampak belanja pemerintah dan insentif pajak terhadap pertumbuhan ekonomi daerah menggunakan pendekatan panel data. Temuan menunjukkan efek yang bervariasi antar wilayah dan sektor.",
    keywords: ["Kebijakan Fiskal", "Pertumbuhan", "Panel Data", "Regional"],
  },
  {
    id: 3,
    title: "Formulasi Nanopartikel Kurkumin Sebagai Agen Anti-Kanker",
    author: "Dr. Ayu Lestari, M.Pharm.",
    prodi: "Farmasi",
    year: 2025,
    journal: "Asian Journal of Pharmaceutical Science",
    doi: "10.1234/ajps.2025.007",
    status: "Terverifikasi",
    abstract:
      "Penelitian ini merancang nanopartikel kurkumin untuk meningkatkan bioavailabilitas dan efektivitas terapi. Hasil in-vitro menunjukkan peningkatan uptake seluler dan potensi sitotoksik terhadap lini sel kanker tertentu.",
    keywords: ["Kurkumin", "Nanopartikel", "Farmasi", "Anti-kanker"],
  },
  {
    id: 4,
    title: "Identifikasi Senyawa Bioaktif dari Tanaman Herbal Kalimantan",
    author: "Dr. Wahyu Nugroho, M.Sc.",
    prodi: "Biologi",
    year: 2025,
    journal: "Biodiversity Research Journal",
    doi: "10.1234/brj.2025.019",
    status: "Terverifikasi",
    abstract:
      "Studi eksploratif ini mengidentifikasi kandidat senyawa bioaktif dari tanaman herbal endemik Kalimantan melalui ekstraksi bertahap dan uji aktivitas antioksidan. Beberapa fraksi menunjukkan aktivitas signifikan.",
    keywords: ["Herbal", "Bioaktif", "Antioksidan", "Biodiversity"],
  },
  {
    id: 5,
    title: "Sistem Deteksi Dini Gempa Berbasis Machine Learning",
    author: "Ir. Reza Pradipta, M.T.",
    prodi: "Teknik Sipil",
    year: 2024,
    journal: "Natural Hazards and Earth System Sciences",
    doi: "10.5194/nhess.2024.312",
    status: "Terverifikasi",
    abstract:
      "Makalah ini mengusulkan model ML untuk mendeteksi pola awal aktivitas seismik dari sensor. Model diuji pada dataset historis dan menunjukkan peningkatan performa dibanding baseline statistik.",
    keywords: ["Machine Learning", "Gempa", "Seismik", "Early Warning"],
  },
  {
    id: 6,
    title: "Pengaruh Media Sosial Terhadap Perilaku Konsumen Generasi Z",
    author: "Dr. Laila Kusuma, M.M.",
    prodi: "Manajemen",
    year: 2024,
    journal: "Journal of Consumer Behavior",
    doi: "10.1234/jcb.2024.088",
    status: "Terverifikasi",
    abstract:
      "Penelitian ini menganalisis hubungan intensitas penggunaan media sosial, kepercayaan influencer, dan keputusan pembelian Gen Z. Hasil menunjukkan peran mediasi kepercayaan dan norma sosial.",
    keywords: ["Media Sosial", "Gen Z", "Perilaku Konsumen", "Influencer"],
  },
  {
    id: 7,
    title: "Pengembangan Reaktor Biogas Skala Rumah Tangga Dari Limbah Organik",
    author: "Dr. Teguh Arief, M.Eng.",
    prodi: "Teknik Kimia",
    year: 2024,
    journal: "Renewable Energy Journal",
    doi: "10.1234/rej.2024.052",
    status: "Terverifikasi",
    abstract:
      "Studi rekayasa ini merancang reaktor biogas rumah tangga berbiaya rendah dengan efisiensi konversi yang lebih baik. Pengujian lapangan menunjukkan kestabilan produksi gas pada variasi beban.",
    keywords: ["Biogas", "Limbah Organik", "Reaktor", "Energi Terbarukan"],
  },
  {
    id: 8,
    title: "Strategi Pembelajaran Matematika Kontekstual di Daerah Terpencil",
    author: "Dr. Nur Hidayat, M.Pd.",
    prodi: "Pendidikan Matematika",
    year: 2024,
    journal: "Mathematics Education Research Journal",
    doi: "10.1234/merj.2024.031",
    status: "Terverifikasi",
    abstract:
      "Penelitian tindakan kelas ini mengevaluasi strategi pembelajaran matematika kontekstual dengan konteks lokal daerah terpencil. Hasil menunjukkan peningkatan pemahaman konsep dan motivasi belajar.",
    keywords: ["Pembelajaran Kontekstual", "Matematika", "Daerah Terpencil", "PTK"],
  },
];

export function getPublicationById(id: number) {
  return publications.find((p) => p.id === id);
}

