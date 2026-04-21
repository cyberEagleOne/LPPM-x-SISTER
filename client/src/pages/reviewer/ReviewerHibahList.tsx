import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ClipboardList, Eye, ChevronRight, CheckCircle, Clock, XCircle
} from "lucide-react";
import { PageWrapper } from "../../components/admin/PageWrapper";

interface HibahTugasItem {
  id: string;
  jenisHibah: "Penelitian" | "PKM";
  judul: string;
  pengusul: string;
  tanggalInvitation: string;
  approvalStatus: "pending" | "terima" | "tolak";
  sudahReview: boolean;
}

const MOCK_TUGAS: HibahTugasItem[] = [
  {
    id: "HIB-001",
    jenisHibah: "Penelitian",
    judul: "Penelitian IoT untuk Smart Campus Pradita",
    pengusul: "Dr. Arif Ramadhan, M.Sc.",
    tanggalInvitation: "2026-03-01",
    approvalStatus: "terima",
    sudahReview: true,
  },
  {
    id: "HIB-002",
    jenisHibah: "PKM",
    judul: "Pengabdian Masyarakat Desa Digital",
    pengusul: "Dr. Fajar Nugroho",
    tanggalInvitation: "2026-03-05",
    approvalStatus: "pending",
    sudahReview: false,
  },
  {
    id: "HIB-003",
    jenisHibah: "Penelitian",
    judul: "Machine Learning untuk Prediksi Cuaca Lokal",
    pengusul: "Dr. Lestari Handayani",
    tanggalInvitation: "2026-03-08",
    approvalStatus: "terima",
    sudahReview: false,
  },
  {
    id: "HIB-004",
    jenisHibah: "PKM",
    judul: "Pelatihan Digital Marketing UMKM Tangerang",
    pengusul: "Dr. Dewi Lestari",
    tanggalInvitation: "2026-03-10",
    approvalStatus: "tolak",
    sudahReview: false,
  },
];

const STATUS_BADGE: Record<string, JSX.Element> = {
  terima: (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
      <CheckCircle className="w-3 h-3" /> Terima
    </span>
  ),
  tolak: (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-700">
      <XCircle className="w-3 h-3" /> Tolak
    </span>
  ),
  pending: (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700">
      <Clock className="w-3 h-3" /> Pending
    </span>
  ),
};

export function ReviewerHibahList() {
  const navigate = useNavigate();
  const [data] = useState<HibahTugasItem[]>(MOCK_TUGAS);

  const handleView = (item: HibahTugasItem) => {
    if (item.jenisHibah === "Penelitian") {
      navigate(`/reviewer/hibah/penelitian/${item.id}`);
    } else {
      navigate(`/reviewer/hibah/pkm/${item.id}`);
    }
  };

  return (
    <PageWrapper
      title="Review Hibah"
      subtitle="Daftar proposal hibah yang ditugaskan kepada Anda"
      breadcrumbs={[{ label: "Reviewer" }, { label: "Review Hibah" }]}
    >
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-800">Hibah Ditugaskan</h3>
          <span className="ml-auto text-xs text-slate-500">{data.length} proposal</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {["No.", "Judul / Pengusul", "Jenis", "Tgl. Invitation", "Status", "Sudah Review?", "Aksi"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.map((item, i) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 text-sm text-slate-400">{i + 1}</td>
                  <td className="px-5 py-3.5 max-w-[300px]">
                    {item.approvalStatus === "terima" ? (
                      <button
                        onClick={() => handleView(item)}
                        className="text-sm font-medium text-blue-600 hover:underline text-left block truncate"
                      >
                        {item.judul}
                      </button>
                    ) : (
                      <p className="text-sm font-medium text-slate-700 truncate">{item.judul}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">{item.pengusul}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-full ${
                      item.jenisHibah === "Penelitian"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}>
                      {item.jenisHibah}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 whitespace-nowrap">{item.tanggalInvitation}</td>
                  <td className="px-5 py-3.5">{STATUS_BADGE[item.approvalStatus]}</td>
                  <td className="px-5 py-3.5">
                    {item.sudahReview ? (
                      <span className="text-xs font-semibold text-green-600">✅ Sudah</span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">— Belum</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleView(item)}
                      className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Lihat <ChevronRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageWrapper>
  );
}
