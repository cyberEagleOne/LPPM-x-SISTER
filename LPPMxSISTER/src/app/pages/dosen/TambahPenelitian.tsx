import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ArrowLeft, PlusCircle, Trash2, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const bidangOptions = [
  "Teknik Informatika", "Teknik Elektro", "Teknik Sipil", "Teknik Kimia",
  "Ekonomi", "Manajemen", "Akuntansi", "Hukum", "Farmasi", "Biologi",
  "Fisika", "Kimia", "Matematika", "Pendidikan", "Psikologi", "Sosiologi",
];

const skemaOptions = [
  "Penelitian Dasar", "Penelitian Terapan", "Penelitian Pengembangan",
  "Hibah Bersaing", "Hibah Fundamental", "Penelitian Mandiri",
];

export function TambahPenelitian() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [penulisTambahan, setPenulisTambahan] = useState([{ id: 1, nama: "", nidn: "", prodi: "" }]);
  const [form, setForm] = useState({
    judul: "",
    bidang: "",
    skema: "",
    tahun: "2026",
    abstrak: "",
    katakunci: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addPenulis = () => {
    setPenulisTambahan((prev) => [...prev, { id: Date.now(), nama: "", nidn: "", prodi: "" }]);
  };

  const removePenulis = (id: number) => {
    if (penulisTambahan.length === 1) return;
    setPenulisTambahan((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePenulis = (id: number, field: string, value: string) => {
    setPenulisTambahan((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Penelitian berhasil diajukan!", { description: form.judul || "Menunggu proses review oleh reviewer." });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-gray-900 mb-2">Penelitian Berhasil Diajukan!</h2>
          <p className="text-gray-500 mb-6" style={{ fontSize: 14, lineHeight: 1.7 }}>
            Penelitian Anda telah berhasil disubmit dan sedang menunggu proses review oleh reviewer yang ditunjuk.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setSubmitted(false)}
              className="px-5 py-2.5 rounded-xl border border-[#1e3a8a] text-[#1e3a8a]"
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              Ajukan Penelitian Lain
            </button>
            <Link
              to="/dosen"
              className="px-5 py-2.5 rounded-xl bg-[#1e3a8a] text-white"
              style={{ fontSize: 14, fontWeight: 600 }}
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          to="/dosen"
          className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-gray-900">Tambah Penelitian Baru</h1>
          <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>Isi formulir berikut untuk mengajukan penelitian baru</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informasi Penelitian */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-gray-900 mb-5 pb-4 border-b border-gray-100">
            Informasi Penelitian
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>
                Judul Penelitian <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.judul}
                onChange={(e) => handleChange("judul", e.target.value)}
                required
                placeholder="Masukkan judul penelitian secara lengkap"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/10 transition-all bg-gray-50"
                style={{ fontSize: 14 }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>
                  Bidang Ilmu <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.bidang}
                  onChange={(e) => handleChange("bidang", e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 outline-none focus:border-[#1e3a8a] bg-gray-50"
                  style={{ fontSize: 14 }}
                >
                  <option value="">Pilih bidang ilmu</option>
                  {bidangOptions.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>
                  Skema Penelitian <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.skema}
                  onChange={(e) => handleChange("skema", e.target.value)}
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 outline-none focus:border-[#1e3a8a] bg-gray-50"
                  style={{ fontSize: 14 }}
                >
                  <option value="">Pilih skema penelitian</option>
                  {skemaOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>
                Tahun Penelitian
              </label>
              <div className="flex gap-2">
                {["2024", "2025", "2026"].map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => handleChange("tahun", y)}
                    className={`px-5 py-2 rounded-lg border transition-colors ${
                      form.tahun === y
                        ? "bg-[#1e3a8a] text-white border-[#1e3a8a]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-[#1e3a8a] hover:text-[#1e3a8a]"
                    }`}
                    style={{ fontSize: 14, fontWeight: 500 }}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>
                Abstrak <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.abstrak}
                onChange={(e) => handleChange("abstrak", e.target.value)}
                required
                rows={5}
                placeholder="Tuliskan abstrak penelitian (minimal 150 kata)..."
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/10 transition-all bg-gray-50 resize-none"
                style={{ fontSize: 14 }}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>
                Kata Kunci
              </label>
              <input
                type="text"
                value={form.katakunci}
                onChange={(e) => handleChange("katakunci", e.target.value)}
                placeholder="Pisahkan dengan koma (contoh: AI, machine learning, pendidikan)"
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 outline-none focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/10 transition-all bg-gray-50"
                style={{ fontSize: 14 }}
              />
            </div>
          </div>
        </div>

        {/* Penulis Tambahan */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
            <h2 className="text-gray-900">Penulis Tambahan</h2>
            <button
              type="button"
              onClick={addPenulis}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#eff6ff] transition-colors"
              style={{ fontSize: 13, fontWeight: 600 }}
            >
              <PlusCircle size={15} /> Tambah Penulis
            </button>
          </div>

          <div className="space-y-4">
            {penulisTambahan.map((p, index) => (
              <div key={p.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-gray-600" style={{ fontSize: 13, fontWeight: 600 }}>Penulis {index + 1}</p>
                  {penulisTambahan.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePenulis(p.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={p.nama}
                    onChange={(e) => updatePenulis(p.id, "nama", e.target.value)}
                    placeholder="Nama lengkap"
                    className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none focus:border-[#1e3a8a]"
                    style={{ fontSize: 13 }}
                  />
                  <input
                    type="text"
                    value={p.nidn}
                    onChange={(e) => updatePenulis(p.id, "nidn", e.target.value)}
                    placeholder="NIDN"
                    className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none focus:border-[#1e3a8a]"
                    style={{ fontSize: 13 }}
                  />
                  <input
                    type="text"
                    value={p.prodi}
                    onChange={(e) => updatePenulis(p.id, "prodi", e.target.value)}
                    placeholder="Program studi"
                    className="border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 outline-none focus:border-[#1e3a8a]"
                    style={{ fontSize: 13 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Dokumen */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-gray-900 mb-5 pb-4 border-b border-gray-100">Upload Dokumen</h2>

          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#1e3a8a] transition-colors cursor-pointer bg-gray-50 hover:bg-[#f8faff]">
            <Upload size={28} className="text-gray-400 mx-auto mb-3" />
            <p className="text-gray-700" style={{ fontSize: 14, fontWeight: 500 }}>Seret & jatuhkan file di sini</p>
            <p className="text-gray-400 mt-1 mb-4" style={{ fontSize: 13 }}>atau</p>
            <button type="button" className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:border-[#1e3a8a] hover:text-[#1e3a8a]" style={{ fontSize: 13, fontWeight: 600 }}>
              Pilih File
            </button>
            <p className="text-gray-400 mt-3" style={{ fontSize: 12 }}>Format: PDF, DOCX · Maks. 20 MB</p>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
            <AlertCircle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-amber-700" style={{ fontSize: 13, lineHeight: 1.6 }}>
              Pastikan dokumen yang diunggah adalah proposal penelitian lengkap dalam format PDF atau DOCX. Dokumen yang tidak lengkap akan menyebabkan penundaan proses review.
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Link
            to="/dosen"
            className="px-6 py-3 rounded-xl border border-gray-200 text-gray-600 text-center hover:bg-gray-50 transition-colors"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            Batal
          </Link>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#1e3a8a] text-white hover:bg-[#1e40af] transition-colors shadow-sm"
            style={{ fontSize: 14, fontWeight: 600 }}
          >
            Submit Penelitian
          </button>
        </div>
      </form>
    </div>
  );
}