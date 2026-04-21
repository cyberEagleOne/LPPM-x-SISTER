import { Link, useSearchParams } from "react-router";
import { ChevronRight, Download, FileText, FileSpreadsheet, File } from "lucide-react";

interface DownloadFile {
  name: string;
  description: string;
  size: string;
  type: string;
  icon: React.ReactNode;
}

const fileCategories: Record<string, { title: string; description: string; files: DownloadFile[] }> = {
  "form-proposal": {
    title: "Form Proposal",
    description: "Template dan formulir untuk pengajuan proposal penelitian dan pengabdian masyarakat.",
    files: [
      { name: "Form Proposal Penelitian Internal 2025", description: "Formulir pengajuan proposal hibah internal", size: "245 KB", type: "DOCX", icon: <FileText className="w-5 h-5 text-blue-600" /> },
      { name: "Form Proposal Pengabdian Masyarakat", description: "Formulir pengajuan proposal PkM", size: "198 KB", type: "DOCX", icon: <FileText className="w-5 h-5 text-blue-600" /> },
      { name: "Form Biodata Peneliti", description: "Formulir biodata ketua dan anggota peneliti", size: "156 KB", type: "DOCX", icon: <FileText className="w-5 h-5 text-blue-600" /> },
      { name: "Form Surat Pernyataan Ketua Peneliti", description: "Surat pernyataan ketersediaan waktu dan komitmen", size: "89 KB", type: "PDF", icon: <File className="w-5 h-5 text-red-600" /> },
    ],
  },
  "template-laporan": {
    title: "Template Laporan",
    description: "Template laporan kemajuan dan laporan akhir penelitian.",
    files: [
      { name: "Template Laporan Kemajuan Penelitian", description: "Format laporan progress penelitian", size: "312 KB", type: "DOCX", icon: <FileText className="w-5 h-5 text-blue-600" /> },
      { name: "Template Laporan Akhir Penelitian", description: "Format laporan akhir penelitian", size: "456 KB", type: "DOCX", icon: <FileText className="w-5 h-5 text-blue-600" /> },
      { name: "Template Laporan Keuangan", description: "Format laporan penggunaan anggaran penelitian", size: "178 KB", type: "XLSX", icon: <FileSpreadsheet className="w-5 h-5 text-green-600" /> },
      { name: "Template Logbook Penelitian", description: "Format pencatatan harian kegiatan penelitian", size: "234 KB", type: "XLSX", icon: <FileSpreadsheet className="w-5 h-5 text-green-600" /> },
    ],
  },
  "panduan-drtm": {
    title: "Panduan DRTM",
    description: "Dokumen panduan terkait DRTPM Kemendikbudristek.",
    files: [
      { name: "Panduan Penelitian dan PkM Edisi XIV", description: "Panduan resmi DRTPM untuk penelitian dan pengabdian", size: "8.5 MB", type: "PDF", icon: <File className="w-5 h-5 text-red-600" /> },
      { name: "Panduan Pengusulan Proposal DRTPM 2025", description: "Petunjuk teknis pengusulan melalui SIMLITABMAS", size: "2.3 MB", type: "PDF", icon: <File className="w-5 h-5 text-red-600" /> },
      { name: "Panduan Monev DRTPM", description: "Pedoman monitoring dan evaluasi hibah DRTPM", size: "1.8 MB", type: "PDF", icon: <File className="w-5 h-5 text-red-600" /> },
      { name: "FAQ Hibah DRTPM", description: "Pertanyaan yang sering diajukan seputar hibah DRTPM", size: "567 KB", type: "PDF", icon: <File className="w-5 h-5 text-red-600" /> },
    ],
  },
  "sop-penelitian": {
    title: "SOP Penelitian",
    description: "Standard Operating Procedure untuk kegiatan penelitian di Universitas Pradita.",
    files: [
      { name: "SOP Pengajuan Proposal Penelitian", description: "Prosedur standar pengajuan proposal penelitian internal", size: "345 KB", type: "PDF", icon: <File className="w-5 h-5 text-red-600" /> },
      { name: "SOP Pelaksanaan Penelitian", description: "Prosedur standar pelaksanaan kegiatan penelitian", size: "289 KB", type: "PDF", icon: <File className="w-5 h-5 text-red-600" /> },
      { name: "SOP Pelaporan Hasil Penelitian", description: "Prosedur standar pelaporan dan diseminasi hasil", size: "278 KB", type: "PDF", icon: <File className="w-5 h-5 text-red-600" /> },
      { name: "SOP Etika Penelitian", description: "Prosedur standar etika dan integritas penelitian", size: "198 KB", type: "PDF", icon: <File className="w-5 h-5 text-red-600" /> },
      { name: "SOP Pendaftaran HKI", description: "Prosedur standar pendaftaran hak kekayaan intelektual", size: "234 KB", type: "PDF", icon: <File className="w-5 h-5 text-red-600" /> },
    ],
  },
};

const tabs = [
  { key: "form-proposal", label: "Form Proposal" },
  { key: "template-laporan", label: "Template Laporan" },
  { key: "panduan-drtm", label: "Panduan DRTM" },
  { key: "sop-penelitian", label: "SOP Penelitian" },
];

export function UnduhBerkasPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "form-proposal";
  const category = fileCategories[activeTab] || fileCategories["form-proposal"];

  const handleDownload = (fileName: string) => {
    alert(`Mengunduh: ${fileName}\n\n(Demo mode - file tidak tersedia)`);
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Hero */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link to="/" className="hover:text-[#E30613]">Beranda</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#E30613]">Unduh Berkas</span>
          </div>
          <h1 className="text-2xl md:text-3xl text-gray-800">Unduh Berkas</h1>
          <p className="text-sm text-gray-500 mt-2">Download dokumen, template, dan panduan terkait penelitian dan pengabdian masyarakat.</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSearchParams({ tab: tab.key })}
                className={`px-4 py-2 text-sm rounded-lg transition-all ${
                  activeTab === tab.key
                    ? "bg-[#E30613] text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category header */}
          <div className="mb-6">
            <h2 className="text-lg text-gray-800">{category.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
          </div>

          {/* Files list */}
          <div className="space-y-3">
            {category.files.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                  {file.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm text-gray-800 truncate">{file.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{file.description}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">{file.type}</span>
                    <span className="text-xs text-gray-400">{file.size}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(file.name)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm border border-[#E30613] text-[#E30613] rounded-lg hover:bg-[#E30613] hover:text-white transition-all shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Unduh</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
