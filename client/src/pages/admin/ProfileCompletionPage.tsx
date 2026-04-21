import { useState } from "react";
import { CheckCircle, AlertCircle, ExternalLink, Save, Award } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { ConfirmModal } from "../../components/admin/ConfirmModal";

interface AcademicField {
  key: string;
  label: string;
  value: string;
  required: boolean;
  placeholder: string;
  helpText?: string;
  type?: "text" | "url" | "number";
}

export function ProfileCompletionPage() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; variant: "success"; onConfirm: () => void }>({
    isOpen: false, title: "", message: "", variant: "success", onConfirm: () => {}
  });

  const [fields, setFields] = useState<AcademicField[]>([
    { key: "sinta_id", label: "SINTA ID", value: "6712345", required: true, placeholder: "Contoh: 6712345", helpText: "Dapatkan dari sinta.kemdikbud.go.id" },
    { key: "google_scholar", label: "Google Scholar URL", value: "https://scholar.google.com/citations?user=abc123", required: true, placeholder: "https://scholar.google.com/citations?user=...", type: "url", helpText: "URL profil Google Scholar Anda" },
    { key: "h_index", label: "H-Index", value: "5", required: true, placeholder: "Contoh: 5", type: "number", helpText: "Berdasarkan Google Scholar atau Scopus" },
    { key: "scopus_id", label: "Scopus Author ID", value: "", required: false, placeholder: "Contoh: 57200123456", helpText: "Opsional - dari scopus.com" },
    { key: "orcid", label: "ORCID", value: "", required: false, placeholder: "Contoh: 0000-0002-1234-5678", helpText: "Opsional - dari orcid.org" },
  ]);

  const updateField = (key: string, value: string) => {
    setFields(prev => prev.map(f => f.key === key ? { ...f, value } : f));
  };

  const filledRequired = fields.filter(f => f.required && f.value.trim()).length;
  const totalRequired = fields.filter(f => f.required).length;
  const filledAll = fields.filter(f => f.value.trim()).length;
  const totalAll = fields.length;
  const completionPct = Math.round((filledAll / totalAll) * 100);
  const requiredComplete = filledRequired === totalRequired;

  const handleSave = () => {
    setConfirmModal({
      isOpen: true,
      title: "Simpan Profil Akademik?",
      message: requiredComplete
        ? "Data profil akademik Anda akan disimpan dan diverifikasi oleh LPPM."
        : "Beberapa field wajib belum diisi. Anda tetap bisa menyimpan sebagai draft.",
      variant: "success",
      onConfirm: () => { setSaved(true); setTimeout(() => setSaved(false), 3000); },
    });
  };

  return (
    <PageWrapper
      title="Profil Akademik"
      subtitle="Lengkapi data akademik Anda untuk mengajukan hibah penelitian"
      breadcrumbs={[{ label: "Profile" }, { label: "Profil Akademik" }]}
    >
      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#E30613]" />
            <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Kelengkapan Profil</h3>
          </div>
          <span className={`text-lg ${completionPct === 100 ? "text-green-600" : "text-slate-700"}`} style={{ fontWeight: 700 }}>
            {completionPct}%
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${completionPct === 100 ? "bg-green-500" : completionPct >= 60 ? "bg-[#E30613]" : "bg-amber-500"}`}
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-slate-400">{filledAll}/{totalAll} field terisi</p>
          <p className="text-xs text-slate-400">{filledRequired}/{totalRequired} field wajib terisi</p>
        </div>
        {!requiredComplete && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">Isi semua field wajib (*) untuk dapat mengajukan hibah internal. Tombol submit akan dinonaktifkan jika data belum lengkap.</p>
          </div>
        )}
        {requiredComplete && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-green-50 border border-green-100 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
            <p className="text-xs text-green-700">Semua field wajib telah terisi. Anda dapat mengajukan hibah internal.</p>
          </div>
        )}
      </div>

      {/* User Info Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <h4 className="text-sm text-slate-800 mb-4" style={{ fontWeight: 600 }}>Informasi Dasar</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: "Nama Lengkap", value: user?.name || "-" },
            { label: "Email", value: user?.email || "-" },
            { label: "NIDN", value: user?.nidn || "-" },
            { label: "Fakultas", value: user?.fakultas || "-" },
            { label: "Program Studi", value: user?.prodi || "-" },
            { label: "Role", value: user?.role || "-" },
          ].map(info => (
            <div key={info.label}>
              <p className="text-xs text-slate-400 mb-1" style={{ fontWeight: 500 }}>{info.label}</p>
              <p className="text-sm text-slate-800" style={{ fontWeight: 500 }}>{info.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Academic Fields Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h4 className="text-sm text-slate-800 mb-5" style={{ fontWeight: 600 }}>Data Akademik & Indeksasi</h4>
        <div className="space-y-5">
          {fields.map(field => {
            const isFilled = field.value.trim().length > 0;
            return (
              <div key={field.key}>
                <div className="flex items-center gap-2 mb-1.5">
                  <label className="text-sm text-slate-700" style={{ fontWeight: 500 }}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  {isFilled ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  ) : field.required ? (
                    <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                  ) : (
                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">opsional</span>
                  )}
                </div>
                <input
                  type={field.type || "text"}
                  value={field.value}
                  onChange={e => updateField(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all bg-slate-50/50 placeholder:text-slate-400 ${
                    isFilled
                      ? "border-green-200 focus:ring-green-200 focus:border-green-300"
                      : field.required
                        ? "border-red-200 focus:ring-red-200 focus:border-red-300"
                        : "border-slate-200 focus:ring-[#E30613]/20 focus:border-[#E30613]/40"
                  }`}
                />
                {field.helpText && (
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    {field.type === "url" && <ExternalLink className="w-3 h-3" />}
                    {field.helpText}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100">
          <button
            onClick={handleSave}
            disabled={!requiredComplete}
            className="flex items-center gap-2 px-6 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
            style={{ fontWeight: 500 }}
          >
            <Save className="w-4 h-4" /> Simpan Profil
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-green-600" style={{ fontWeight: 500 }}>
              <CheckCircle className="w-4 h-4" /> Berhasil disimpan!
            </span>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal(p => ({ ...p, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
      />
    </PageWrapper>
  );
}
