const MOCK_TEXT_REPLACEMENTS: Array<[string, string]> = [
  ["Super Admin", "Raka Pratama"],
  ["Pengguna Umum", "Aulia Rahman"],
  ["Dr. Budi Santoso, M.Sc.", "Dr. Arif Ramadhan, M.Sc."],
  ["Dr. Budi Santoso, M.Eng.", "Dr. Arif Ramadhan, M.Eng."],
  ["Dr. Budi Santoso", "Dr. Arif Ramadhan"],
  ["Prof. Andi Wijaya, Ph.D.", "Prof. Dimas Prakoso, Ph.D."],
  ["Prof. Andi Wijaya", "Prof. Dimas Prakoso"],
  ["Prof. Ahmad Wijaya, Ph.D.", "Prof. Dimas Prakoso, Ph.D."],
  ["Prof. Ahmad Wijaya", "Prof. Dimas Prakoso"],
  ["Dr. Ahmad Wijaya, M.T.", "Dr. Galih Pranata, M.T."],
  ["Dr. Ahmad Wijaya", "Dr. Galih Pranata"],
  ["Dr. Siti Aminah, M.Kom.", "Dr. Lestari Handayani, M.Kom."],
  ["Dr. Siti Aminah", "Dr. Lestari Handayani"],
  ["Dr. Hendra Kusuma, M.Si.", "Dr. Fajar Nugroho, M.Si."],
  ["Dr. Hendra Kusuma", "Dr. Fajar Nugroho"],
  ["Dr. Rina Pradita", "Dr. Maya Permata"],
  ["Dr. Satria Wijaya", "Dr. Reza Mahendra"],
  ["Dr. Nabila Prameswari", "Dr. Nisa Azzahra"],
  ["Maya Putri", "Siska Putri"],
  ["Rahma Dewi", "Novi Anggraini"],
  ["Ir. Siti Rahayu, M.Sc.", "Ir. Wulan Safitri, M.Sc."],
  ["Prof. Rudi Hartono", "Prof. Yogi Darmawan"],
  ["Bapak Suharto", "Bapak Ridwan Setiawan"],
  ["Pak Gatot", "Pak Bambang Nugraha"],
  ["Edison", "Rizky Maulana"],
  ["Nadia Diandra, S.T., M.T.", "Nadira Putri Lestari, S.T., M.T."],
  ["Bella Koes Paulina Cantik, S.T., M.Eng.", "Belinda Prameswari, S.T., M.Eng."],
  ["Bella Koes Paulina Cantik, S.T.,M.Eng.", "Belinda Prameswari, S.T.,M.Eng."],
  ["Dr. Van Basten, S.T., M.T., M.B.A.", "Dr. Farhan Mahendra, S.T., M.T., M.B.A."],
  ["Pengki Suanto, S.T., M.T.", "Rizal Saputra, S.T., M.T."],
  ["Ida Ayu Sawitri Dian Mawarni, S.T., M.T.", "Intan Ayu Maharani, S.T., M.T."],
  ["Deasy Olivia, S.T., M.T.", "Della Olivia, S.T., M.T."],
  ["Rendy Akbar", "Rendi Akbar Pratama"],
  ["Ade Firmansyah, S.T., M.T.", "Aditya Firmansyah, S.T., M.T."],
  ["Ade Firmansyah, S.T.,M.T.", "Aditya Firmansyah, S.T.,M.T."],
  ["Prof. Dr. Rektor", "Prof. Dr. Surya Kencana"],
  ["Dr. Wakil Rektor 1", "Dr. Hadi Saputra"],
  ["Dr. Wakil Rektor 2", "Dr. Mira Laksmi"],
  ["Dr. Wakil Rektor 3", "Dr. Taufik Hidayat"],
  ["Dr. Dekan FT", "Dr. Gilang Perdana"],
  ["Prof. Dekan FB", "Prof. Ratna Kusumawati"],
  ["Dr. Dekan FD", "Dr. Citra Maheswari"],
  ["Dr. Dekan FH", "Dr. Bayu Saptono"],
  ["admin@pradita.ac.id", "raka.pratama@pradita.ac.id"],
  ["public@pradita.ac.id", "aulia.rahman@pradita.ac.id"],
  ["budi.santoso@pradita.ac.id", "arif.ramadhan@pradita.ac.id"],
  ["andi.wijaya@pradita.ac.id", "dimas.prakoso@pradita.ac.id"],
  ["edisons.siregar@pradita.ac.id", "raka.pratama@pradita.ac.id"],
  ["edison@contoh.com", "rizky.maulana@contoh.com"],
  ["nadia.diandra@pradita.ac.id", "nadira.lestari@pradita.ac.id"],
  ["bella.paulina@pradita.ac.id", "belinda.prameswari@pradita.ac.id"],
  ["van.basten@pradita.ac.id", "farhan.mahendra@pradita.ac.id"],
  ["pengki.suanto@pradita.ac.id", "rizal.saputra@pradita.ac.id"],
  ["deasy.olivia@pradita.ac.id", "della.olivia@pradita.ac.id"],
  ["ade.firmansyah@pradita.ac.id", "aditya.firmansyah@pradita.ac.id"],
  ["maya@example.com", "siska.putri@example.com"],
  ["suharto@techsol.id", "ridwan@techsol.id"],
  ["gatot@batuceper.go.id", "bambang@batuceper.go.id"],
];

export function normalizeMockText(text: string) {
  return MOCK_TEXT_REPLACEMENTS.reduce((currentText, [from, to]) => currentText.replaceAll(from, to), text);
}

export function normalizeMockValue<T>(value: T): T {
  if (typeof value === "string") {
    return normalizeMockText(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeMockValue(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, currentValue]) => [key, normalizeMockValue(currentValue)])
    ) as T;
  }

  return value;
}
