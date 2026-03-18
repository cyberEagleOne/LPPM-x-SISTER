import { Link, useParams } from "react-router";
import { Calendar, ChevronLeft, Copy, BookOpen, Tag } from "lucide-react";
import { toast } from "sonner";
import { getPublicationById } from "../data/publications";

export function PublikasiDetailPage() {
  const { id } = useParams();
  const pubId = Number(id);
  const pub = Number.isFinite(pubId) ? getPublicationById(pubId) : undefined;

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} disalin`, { description: value });
    } catch {
      toast.error("Gagal menyalin", { description: "Browser tidak mengizinkan akses clipboard." });
    }
  };

  if (!pub) {
    return (
      <div className="bg-[#f8fafc] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/publikasi"
            className="inline-flex items-center gap-2 text-[#1e3a8a] hover:text-[#1e40af]"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            <ChevronLeft size={16} /> Kembali ke Publikasi
          </Link>
          <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h1 className="text-gray-900">Publikasi tidak ditemukan</h1>
            <p className="text-gray-500 mt-2" style={{ fontSize: 14 }}>
              ID publikasi tidak valid atau publikasi sudah tidak tersedia.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* Header */}
      <div className="bg-[#1e3a8a]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            to="/publikasi"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            <ChevronLeft size={16} /> Kembali
          </Link>

          <div className="mt-5">
            <p className="text-blue-300" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Publikasi
            </p>
            <h1 className="text-white mt-2" style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900, lineHeight: 1.25 }}>
              {pub.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-blue-200" style={{ fontSize: 13 }}>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen size={14} /> {pub.journal}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} /> {pub.year}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Tag size={14} /> {pub.prodi}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                {pub.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <p className="text-gray-400" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Penulis
          </p>
          <p className="text-gray-900 mt-2" style={{ fontSize: 16, fontWeight: 700 }}>
            {pub.author}
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-gray-400" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                DOI
              </p>
              <p className="text-gray-900 mt-2 break-all" style={{ fontSize: 15, fontWeight: 700 }}>
                {pub.doi}
              </p>
            </div>
            <button
              onClick={() => copy(pub.doi, "DOI")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors flex-shrink-0"
              style={{ fontSize: 13, fontWeight: 700 }}
            >
              <Copy size={14} /> Salin
            </button>
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <p className="text-gray-400" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Abstrak
          </p>
          <p className="text-gray-800 mt-3" style={{ fontSize: 16, lineHeight: 1.9 }}>
            {pub.abstract}
          </p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <p className="text-gray-400" style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Kata Kunci
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {pub.keywords.map((k) => (
              <span
                key={k}
                className="px-3 py-1 rounded-full bg-[#eff6ff] text-[#1e3a8a] border border-blue-200"
                style={{ fontSize: 12, fontWeight: 700 }}
              >
                {k}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

