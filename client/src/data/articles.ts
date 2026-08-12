export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
}

export const articles: Article[] = [
  {
    id: "optimalisasi-rumah-bibit",
    title: 'Optimalisasi Rumah Bibit di "Rumah Peng Anggur an", Budi Daya Anggur Lahan Terbatas Kota Tangerang',
    description: "Program pengabdian masyarakat untuk budidaya anggur lahan terbatas di Kota Tangerang.",
    content: `<p>Program pengabdian masyarakat ini merupakan inisiatif kolaboratif antara Universitas Demo dengan masyarakat dalam upaya mengoptimalkan budidaya anggur di lahan terbatas perkotaan.</p>
    <p>Kegiatan ini melibatkan dosen dan mahasiswa dari berbagai program studi yang bekerja sama dengan kelompok tani untuk mengembangkan teknik budidaya yang efisien dan berkelanjutan.</p>
    <h3>Latar Belakang</h3>
    <p>Urbanisasi yang semakin pesat telah mengurangi lahan pertanian. Namun, semangat masyarakat untuk berkebun tetap tinggi. Program ini hadir untuk menjembatani keterbatasan lahan dengan teknik budidaya modern seperti vertikultur dan hidroponik sederhana.</p>
    <h3>Tujuan Program</h3>
    <ul>
      <li>Meningkatkan kapasitas petani urban dalam budidaya anggur</li>
      <li>Mengoptimalkan penggunaan lahan terbatas</li>
      <li>Membangun model percontohan rumah bibit anggur</li>
      <li>Transfer teknologi budidaya modern ke masyarakat</li>
    </ul>
    <h3>Hasil dan Dampak</h3>
    <p>Program ini berhasil menghasilkan 200+ bibit anggur berkualitas yang siap didistribusikan ke masyarakat sekitar. Selain itu, telah terbentuk kelompok tani baru yang mandiri dan mampu mengelola rumah bibit secara berkelanjutan.</p>
    <p>Kegiatan ini juga menghasilkan modul panduan budidaya anggur lahan terbatas yang dapat direplikasi di daerah urban lainnya. Para peserta mendapat pelatihan intensif tentang pemilihan bibit, teknik pembibitan, pengendalian hama, dan manajemen pasca panen.</p>`,
    image: "https://images.unsplash.com/photo-1770982698865-10713fa6f73b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFwZSUyMGZhcm1pbmclMjB1cmJhbiUyMGdhcmRlbiUyMGdyZWVuaG91c2V8ZW58MXx8fHwxNzcxNTUzODUwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "15 November 2024",
    author: "Tim LPPM Demo",
    category: "Pengabdian Masyarakat",
  },
  {
    id: "monev-internal-2024",
    title: "Monev Internal Universitas Demo 2024",
    description: "Bapak dan Ibu dosen Universitas Demo yang tertarik, silakan hadir untuk menyaksikan Monev Internal ini. Untuk...",
    content: `<p>Monitoring dan Evaluasi (Monev) Internal Universitas Demo tahun 2024 telah dilaksanakan sebagai bentuk pengawasan dan penjaminan mutu terhadap seluruh kegiatan penelitian yang didanai melalui hibah internal universitas.</p>
    <h3>Latar Belakang</h3>
    <p>Monev internal merupakan kegiatan rutin tahunan yang diselenggarakan oleh LPPM Universitas Demo untuk memastikan bahwa setiap penelitian yang didanai berjalan sesuai dengan rencana, target, dan timeline yang telah ditetapkan.</p>
    <h3>Pelaksanaan</h3>
    <p>Kegiatan Monev dilaksanakan selama 3 hari pada tanggal 20-22 Oktober 2024. Total 45 proposal penelitian dari berbagai fakultas dipresentasikan di hadapan reviewer internal dan eksternal.</p>
    <h3>Aspek Penilaian</h3>
    <ul>
      <li>Capaian luaran penelitian (publikasi, HKI, produk)</li>
      <li>Kesesuaian penggunaan anggaran</li>
      <li>Progres pelaksanaan terhadap timeline</li>
      <li>Dampak dan keberlanjutan penelitian</li>
    </ul>
    <h3>Hasil Monev</h3>
    <p>Dari 45 penelitian yang dievaluasi, 38 penelitian mendapat predikat "Baik" dan 7 penelitian mendapat catatan perbaikan. Seluruh peneliti diminta untuk menyelesaikan laporan akhir paling lambat Desember 2024.</p>`,
    image: "https://images.unsplash.com/photo-1585298799938-a15d7abb8523?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZXZhbHVhdGlvbiUyMG1lZXRpbmclMjBhY2FkZW1pYyUyMHJldmlld3xlbnwxfHx8fDE3NzE1NTM4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    date: "22 Oktober 2024",
    author: "Admin LPPM",
    category: "Kegiatan Internal",
  },
  {
    id: "lolos-hibah-drtpm-2024",
    title: "Universitas Demo Lolos Hibah DRTPM 2024!",
    description: "Langkah maju ini bukan hanya tentang memenangkan hibah, tapi juga tentang membuka jalan baru untuk inovasi...",
    content: `<p>Universitas Demo kembali menorehkan prestasi membanggakan dengan berhasil meloloskan beberapa proposal penelitian dan pengabdian masyarakat pada skema hibah DRTPM (Direktorat Riset, Teknologi, dan Pengabdian kepada Masyarakat) Kemendikbudristek tahun 2024.</p>
    <h3>Pencapaian</h3>
    <p>Tahun ini, Universitas Demo berhasil meloloskan 8 proposal penelitian dan 3 proposal pengabdian masyarakat pada berbagai skema pendanaan DRTPM, dengan total pendanaan mencapai lebih dari Rp 1,5 miliar.</p>
    <h3>Skema yang Berhasil Didanai</h3>
    <ul>
      <li>Penelitian Dasar - 3 proposal</li>
      <li>Penelitian Terapan - 2 proposal</li>
      <li>Penelitian Pengembangan - 2 proposal</li>
      <li>Penelitian Dosen Pemula - 1 proposal</li>
      <li>Program Kemitraan Masyarakat - 2 proposal</li>
      <li>Program Pengembangan Desa Mitra - 1 proposal</li>
    </ul>
    <h3>Kata Rektor</h3>
    <p>"Keberhasilan ini merupakan bukti nyata komitmen Universitas Demo dalam pengembangan riset dan inovasi. Kami bangga dengan para dosen yang telah bekerja keras menyusun proposal berkualitas tinggi," ujar Rektor Universitas Demo.</p>
    <h3>Dukungan LPPM</h3>
    <p>LPPM Universitas Demo telah memberikan dukungan penuh melalui serangkaian workshop penulisan proposal, clinic proposal, dan pendampingan intensif kepada seluruh dosen yang mengajukan proposal ke DRTPM.</p>`,
    image: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMGdyYW50JTIwc3VjY2VzcyUyMGNlbGVicmF0aW9uJTIwdHJvcGh5fGVufDF8fHx8MTc3MTU1Mzg1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "5 September 2024",
    author: "Humas LPPM",
    category: "Prestasi",
  },
];

export const relatedArticles: Article[] = [
  {
    id: "workshop-penulisan-proposal",
    title: "Workshop Penulisan Proposal Penelitian 2024",
    description: "Pelatihan intensif bagi dosen untuk meningkatkan kualitas proposal penelitian hibah nasional.",
    content: "",
    image: "https://images.unsplash.com/photo-1760121788536-9797394e210e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhY2FkZW1pYyUyMHdyaXRpbmclMjB3b3Jrc2hvcCUyMGxlY3R1cmUlMjBoYWxsfGVufDF8fHx8MTc3MTU1Mzg1MXww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "10 Agustus 2024",
    author: "Admin LPPM",
    category: "Workshop",
  },
  {
    id: "pengabdian-desa-mitra",
    title: "Program Pengabdian Desa Mitra Universitas Demo",
    description: "Kolaborasi dengan desa mitra untuk pengembangan teknologi tepat guna bagi masyarakat pedesaan.",
    content: "",
    image: "https://ipol.id/wp-content/uploads/2025/06/70e1f797-38b3-4bcd-b4fc-ebff831a9a1e-860x572.jpg",
    date: "1 Juli 2024",
    author: "Tim LPPM Demo",
    category: "Pengabdian Masyarakat",
  },
  {
    id: "seminar-nasional-riset",
    title: "Seminar Nasional Riset dan Inovasi 2024",
    description: "Forum ilmiah nasional untuk diseminasi hasil penelitian dosen dan mahasiswa.",
    content: "",
    image: "https://images.unsplash.com/photo-1567539416605-324ae3470ced?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwaW5ub3ZhdGlvbiUyMHRlY2hub2xvZ3klMjBleHBvfGVufDF8fHx8MTc3MTU1Mzg1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    date: "15 Juni 2024",
    author: "Humas LPPM",
    category: "Seminar",
  },
];
