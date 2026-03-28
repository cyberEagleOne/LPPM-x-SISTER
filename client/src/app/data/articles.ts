export type Article = {
  id: number;
  title: string;
  preview: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
};

export const articles: Article[] = [
  {
    id: 1,
    title: "Inovasi Riset Universitas Menuju Era Society 5.0",
    preview:
      "Universitas Pradita terus mendorong ekosistem penelitian yang adaptif terhadap perkembangan teknologi global dan kebutuhan industri masa depan. Program akselerasi riset kini tengah digalakkan.",
    content:
      "Universitas Pradita terus mendorong ekosistem penelitian yang adaptif terhadap perkembangan teknologi global dan kebutuhan industri masa depan. Program akselerasi riset kini tengah digalakkan melalui berbagai kolaborasi strategis dengan mitra industri dan lembaga penelitian internasional.\n\nDalam rangka menyongsong era Society 5.0, LPPM telah merancang roadmap penelitian yang mencakup bidang-bidang prioritas seperti kecerdasan buatan, Internet of Things, big data analytics, dan cyber-physical systems. Pendekatan multidisiplin menjadi kunci utama dalam strategi ini.\n\nRektor Universitas Pradita, Prof. Dr. Ir. Haryanto, M.Eng., menyatakan bahwa investasi dalam riset dan inovasi merupakan fondasi utama untuk membangun universitas berkelas dunia yang relevan dengan tantangan global kontemporer.",
    author: "Tim Redaksi LPPM",
    date: "5 Maret 2026",
    category: "Inovasi",
    readTime: "5 menit",
  },
  {
    id: 2,
    title: "Workshop Penulisan Artikel Ilmiah Internasional",
    preview:
      "LPPM menyelenggarakan workshop intensif untuk meningkatkan kemampuan dosen dalam menulis artikel ilmiah bertaraf internasional. Kegiatan ini diikuti lebih dari 80 peserta dari berbagai prodi.",
    content:
      "LPPM menyelenggarakan workshop intensif untuk meningkatkan kemampuan dosen dalam menulis artikel ilmiah bertaraf internasional. Kegiatan ini diikuti lebih dari 80 peserta dari berbagai program studi.\n\nWorkshop berlangsung selama tiga hari dengan menghadirkan narasumber dari berbagai jurnal bereputasi internasional. Materi yang dibahas meliputi teknik penulisan abstrak yang efektif, metodologi penelitian yang kuat, dan strategi submission ke jurnal Q1 dan Q2.\n\nPeserta juga mendapat kesempatan untuk berkonsultasi langsung mengenai draft artikel mereka dengan para reviewer berpengalaman dari Scopus-indexed journals.",
    author: "Humas LPPM",
    date: "1 Maret 2026",
    category: "Kegiatan",
    readTime: "4 menit",
  },
  {
    id: 3,
    title: "Peningkatan Kualitas Penelitian Melalui Kolaborasi Lintas Disiplin",
    preview:
      "Kolaborasi antar prodi membuka peluang penelitian yang lebih komprehensif dan berdampak luas bagi masyarakat dan industri nasional maupun internasional.",
    content:
      "Kolaborasi antar program studi membuka peluang penelitian yang lebih komprehensif dan berdampak luas bagi masyarakat dan industri nasional maupun internasional.\n\nPendekatan interdisipliner telah terbukti menghasilkan temuan-temuan inovatif yang tidak mungkin dicapai melalui penelitian yang bersifat monodisiplin. LPPM Universitas Pradita mendorong pembentukan research clusters yang mempertemukan keahlian dari berbagai bidang ilmu.\n\nBeberapa contoh kolaborasi sukses meliputi proyek smart agriculture yang melibatkan Teknik Informatika dan Pertanian, serta program health informatics yang memadukan Ilmu Komputer dan Kedokteran.",
    author: "Dr. Hendra Wijaya",
    date: "26 Feb 2026",
    category: "Opini",
    readTime: "6 menit",
  },
  {
    id: 4,
    title: "Pengumuman Hibah Penelitian Internal 2026",
    preview:
      "LPPM membuka pendaftaran hibah penelitian internal untuk semester genap 2026 dengan total anggaran Rp 5 miliar. Dosen tetap dengan jabatan minimal Asisten Ahli dapat mendaftar.",
    content:
      "LPPM membuka pendaftaran hibah penelitian internal untuk semester genap 2026 dengan total anggaran Rp 5 miliar. Dosen tetap dengan jabatan minimal Asisten Ahli dapat mendaftar melalui sistem online.\n\nSkema hibah yang tersedia meliputi Penelitian Dasar (maks Rp 50 juta), Penelitian Terapan (maks Rp 100 juta), dan Penelitian Pengembangan (maks Rp 150 juta). Prioritas diberikan kepada penelitian yang memiliki potensi hilirisasi dan dampak sosial.\n\nBatas akhir pengajuan proposal adalah 30 April 2026. Seluruh proses pengajuan dan review dilakukan melalui sistem LPPM × SISTER.",
    author: "Admin LPPM",
    date: "20 Feb 2026",
    category: "Pengumuman",
    readTime: "3 menit",
  },
  {
    id: 5,
    title: "Dosen Universitas Pradita Raih Penghargaan Riset Nasional",
    preview:
      "Dr. Siti Rahma berhasil meraih penghargaan peneliti terbaik nasional dari Kemendikbud Ristek atas kontribusinya dalam pengembangan sistem AI untuk pendidikan inklusif.",
    content:
      "Dr. Siti Rahma berhasil meraih penghargaan peneliti terbaik nasional dari Kemendikbud Ristek atas kontribusinya dalam pengembangan sistem AI untuk pendidikan inklusif.\n\nPenghargaan ini diberikan pada acara Anugerah Peneliti Indonesia 2026 yang diselenggarakan di Jakarta. Dr. Siti Rahma terpilih dari 500 nominasi peneliti se-Indonesia berdasarkan kualitas dan dampak penelitiannya.\n\nSistem AI yang dikembangkan telah diimplementasikan di 15 sekolah luar biasa dan berhasil meningkatkan efektivitas pembelajaran siswa berkebutuhan khusus hingga 40%.",
    author: "Humas LPPM",
    date: "15 Feb 2026",
    category: "Prestasi",
    readTime: "4 menit",
  },
  {
    id: 6,
    title: "Panduan Baru Pengajuan Etika Penelitian 2026",
    preview:
      "Komisi Etika Penelitian Universitas Pradita merilis panduan baru terkait tata cara pengajuan ethical clearance untuk penelitian yang melibatkan subjek manusia dan hewan.",
    content:
      "Komisi Etika Penelitian Universitas Pradita merilis panduan baru terkait tata cara pengajuan ethical clearance untuk penelitian yang melibatkan subjek manusia dan hewan.\n\nPanduan ini mencakup prosedur baru yang lebih streamlined untuk pengajuan ethical clearance, termasuk formulir online yang terintegrasi dengan sistem LPPM × SISTER. Waktu review dipangkas dari 30 hari menjadi 14 hari kerja.\n\nSeluruh peneliti yang melibatkan subjek manusia atau hewan wajib mendapatkan persetujuan etika sebelum memulai pengumpulan data. Pelanggaran akan dikenai sanksi sesuai ketentuan yang berlaku.",
    author: "Komisi Etika",
    date: "10 Feb 2026",
    category: "Panduan",
    readTime: "3 menit",
  },
];

export function getArticleById(id: number) {
  return articles.find((a) => a.id === id);
}
