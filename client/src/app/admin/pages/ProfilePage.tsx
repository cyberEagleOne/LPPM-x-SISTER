import { useState } from "react";
import { Camera, Save, CheckCircle, Eye, EyeOff, Lock, Shield } from "lucide-react";
import { useAuth, ROLE_LABELS } from "../context/AuthContext";
import { PageWrapper } from "../components/PageWrapper";
import { ConfirmModal } from "../components/ConfirmModal";

export function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "password">("info");
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", variant: "success" as "success" | "warning" | "danger", onConfirm: () => {} });
  const [pwData, setPwData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    nidn: user?.nidn || "0312098901",
    phone: "081234567890",
    fakultas: user?.fakultas || "Fakultas Teknologi",
    prodi: user?.prodi || "Teknik Informatika",
    npwp: "12.345.678.9-012.000",
    rekening: "1234567890 (BCA)",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmModal({
      open: true, title: "Simpan Perubahan?", message: "Data profil Anda akan diperbarui.", variant: "success",
      onConfirm: () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 3000); },
    });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwData.newPassword !== pwData.confirmPassword) return;
    if (pwData.newPassword.length < 8) return;
    setConfirmModal({
      open: true, title: "Ganti Password?", message: "Anda akan diminta login ulang setelah mengganti password.", variant: "warning",
      onConfirm: () => { setSaved(true); setPwData({ oldPassword: "", newPassword: "", confirmPassword: "" }); setTimeout(() => setSaved(false), 3000); },
    });
  };

  const pwMatch = pwData.newPassword === pwData.confirmPassword && pwData.newPassword.length > 0;
  const pwStrong = pwData.newPassword.length >= 8;

  if (!user) return null;

  return (
    <PageWrapper title="Profile Saya" breadcrumbs={[{ label: "Profile Saya" }]}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E30613] to-[#ff4757] flex items-center justify-center text-white text-3xl" style={{ fontWeight: 700 }}>
                {user.name.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-[#E30613] transition-colors shadow-sm">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-slate-900" style={{ fontWeight: 600 }}>{user.name}</h3>
            <p className="text-sm text-slate-500">{user.email}</p>
            <span className="mt-2 px-3 py-1 text-xs bg-[#E30613]/10 text-[#E30613] rounded-full" style={{ fontWeight: 500 }}>{ROLE_LABELS[user.role]}</span>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
            {[
              { label: "NIDN", value: formData.nidn },
              { label: "Fakultas", value: formData.fakultas },
              { label: "Program Studi", value: formData.prodi },
              { label: "Telepon", value: formData.phone },
              { label: "NPWP", value: formData.npwp },
              { label: "Rekening", value: formData.rekening },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-[11px] text-slate-400" style={{ fontWeight: 500 }}>{f.label}</p>
                <p className="text-sm text-slate-700">{f.value || "-"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab Switcher */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
            {[
              { key: "info" as const, icon: Shield, label: "Informasi Pribadi" },
              { key: "password" as const, icon: Lock, label: "Ganti Password" },
            ].map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${activeTab === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                style={{ fontWeight: activeTab === t.key ? 600 : 400 }}>
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>

          {activeTab === "info" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-slate-800" style={{ fontWeight: 600 }}>Informasi Pribadi</h3>
                {!editing && (
                  <button onClick={() => setEditing(true)} className="px-4 py-2 text-sm text-[#E30613] bg-red-50 rounded-lg hover:bg-red-100 transition-colors" style={{ fontWeight: 500 }}>
                    Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Nama Lengkap", key: "name" as const, type: "text", required: true },
                    { label: "Email", key: "email" as const, type: "email", required: true },
                    { label: "NIDN", key: "nidn" as const, type: "text", required: false },
                    { label: "Telepon", key: "phone" as const, type: "text", required: true },
                    { label: "Fakultas", key: "fakultas" as const, type: "text", required: false },
                    { label: "Program Studi", key: "prodi" as const, type: "text", required: false },
                    { label: "NPWP", key: "npwp" as const, type: "text", required: false },
                    { label: "Rekening", key: "rekening" as const, type: "text", required: false },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-sm text-slate-600 mb-1.5" style={{ fontWeight: 500 }}>
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                      </label>
                      <input type={field.type} value={formData[field.key]} onChange={(e) => setFormData((p) => ({ ...p, [field.key]: e.target.value }))} disabled={!editing} required={field.required}
                        className={`w-full px-4 py-2.5 text-sm border rounded-lg transition-all ${editing ? "border-slate-200 bg-white focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 focus:outline-none" : "border-transparent bg-slate-50 text-slate-600 cursor-not-allowed"}`} />
                      {editing && field.required && !formData[field.key] && (
                        <p className="text-[11px] text-red-500 mt-1">Field ini wajib diisi</p>
                      )}
                    </div>
                  ))}
                </div>

                {editing && (
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <button type="submit" className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-all active:scale-95" style={{ fontWeight: 500 }}>
                      <Save className="w-4 h-4" /> Simpan
                    </button>
                    <button type="button" onClick={() => setEditing(false)} className="px-5 py-2.5 text-sm text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors" style={{ fontWeight: 500 }}>
                      Batal
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === "password" && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h3 className="text-slate-800 mb-6" style={{ fontWeight: 600 }}>Ganti Password</h3>
              <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5" style={{ fontWeight: 500 }}>Password Lama <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={showOldPw ? "text" : "password"} value={pwData.oldPassword} onChange={(e) => setPwData((p) => ({ ...p, oldPassword: e.target.value }))} required placeholder="Masukkan password lama"
                      className="w-full px-4 py-2.5 pr-10 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 focus:outline-none bg-slate-50/50 placeholder:text-slate-400" />
                    <button type="button" onClick={() => setShowOldPw(!showOldPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showOldPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5" style={{ fontWeight: 500 }}>Password Baru <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type={showNewPw ? "text" : "password"} value={pwData.newPassword} onChange={(e) => setPwData((p) => ({ ...p, newPassword: e.target.value }))} required placeholder="Minimal 8 karakter"
                      className="w-full px-4 py-2.5 pr-10 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 focus:outline-none bg-slate-50/50 placeholder:text-slate-400" />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {pwData.newPassword && !pwStrong && (
                    <p className="text-[11px] text-red-500 mt-1">Password minimal 8 karakter</p>
                  )}
                  {pwData.newPassword && pwStrong && (
                    <p className="text-[11px] text-green-600 mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Password cukup kuat</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-slate-600 mb-1.5" style={{ fontWeight: 500 }}>Konfirmasi Password <span className="text-red-500">*</span></label>
                  <input type="password" value={pwData.confirmPassword} onChange={(e) => setPwData((p) => ({ ...p, confirmPassword: e.target.value }))} required placeholder="Ulangi password baru"
                    className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 focus:outline-none bg-slate-50/50 placeholder:text-slate-400" />
                  {pwData.confirmPassword && !pwMatch && (
                    <p className="text-[11px] text-red-500 mt-1">Password tidak cocok</p>
                  )}
                  {pwMatch && (
                    <p className="text-[11px] text-green-600 mt-1 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Password cocok</p>
                  )}
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <button type="submit" disabled={!pwMatch || !pwStrong || !pwData.oldPassword}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ fontWeight: 500 }}>
                    <Lock className="w-4 h-4" /> Ganti Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border bg-green-50 border-green-200 text-green-700">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm" style={{ fontWeight: 500 }}>{activeTab === "info" ? "Profile berhasil diperbarui" : "Password berhasil diganti"}</span>
        </div>
      )}
      <ConfirmModal isOpen={confirmModal.open} {...confirmModal} onClose={() => setConfirmModal((p) => ({ ...p, open: false }))} />
    </PageWrapper>
  );
}
