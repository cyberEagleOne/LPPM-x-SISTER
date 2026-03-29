export { SettingsPage } from "./SettingsWebsiteModern";

import { useState } from "react";
import { Save, Globe, Bell, Shield, Palette, CheckCircle } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";

function LegacySettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    siteName: "LPPM Pradita University",
    siteEmail: "lppm@pradita.ac.id",
    maxUpload: "10",
    sessionTimeout: "120",
    emailNotif: true,
    pushNotif: false,
    maintenanceMode: false,
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <PageWrapper title="Settings" subtitle="Konfigurasi sistem LPPM" breadcrumbs={[{ label: "Sistem" }, { label: "Settings" }]}>
      <div className="max-w-3xl space-y-6">
        {/* General */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center"><Globe className="w-5 h-5 text-blue-600" /></div>
            <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Umum</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "Nama Situs", key: "siteName" as const, type: "text" },
              { label: "Email Situs", key: "siteEmail" as const, type: "email" },
              { label: "Max Upload (MB)", key: "maxUpload" as const, type: "number" },
              { label: "Session Timeout (menit)", key: "sessionTimeout" as const, type: "number" },
            ].map((f) => (
              <div key={f.key}>
                <label className="block text-sm text-slate-600 mb-1.5" style={{ fontWeight: 500 }}>{f.label}</label>
                <input type={f.type} value={settings[f.key]} onChange={(e) => setSettings((p) => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E30613]/20 focus:border-[#E30613]/40 bg-slate-50/50" />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center"><Bell className="w-5 h-5 text-amber-600" /></div>
            <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Notifikasi</h3>
          </div>
          <div className="space-y-4">
            {[
              { label: "Email Notifikasi", key: "emailNotif" as const, desc: "Kirim notifikasi via email" },
              { label: "Push Notifikasi", key: "pushNotif" as const, desc: "Kirim push notification" },
            ].map((f) => (
              <div key={f.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-700" style={{ fontWeight: 500 }}>{f.label}</p>
                  <p className="text-xs text-slate-400">{f.desc}</p>
                </div>
                <button onClick={() => setSettings((p) => ({ ...p, [f.key]: !p[f.key] }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${settings[f.key] ? "bg-[#E30613]" : "bg-slate-300"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[f.key] ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center"><Shield className="w-5 h-5 text-red-600" /></div>
            <h3 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>Maintenance</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-700" style={{ fontWeight: 500 }}>Mode Maintenance</p>
              <p className="text-xs text-slate-400">Nonaktifkan akses publik sementara</p>
            </div>
            <button onClick={() => setSettings((p) => ({ ...p, maintenanceMode: !p.maintenanceMode }))}
              className={`w-11 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? "bg-[#E30613]" : "bg-slate-300"}`}>
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.maintenanceMode ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-all active:scale-95" style={{ fontWeight: 500 }}>
          <Save className="w-4 h-4" /> Simpan Perubahan
        </button>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border bg-green-50 border-green-200 text-green-700">
          <CheckCircle className="w-4 h-4" /><span className="text-sm" style={{ fontWeight: 500 }}>Settings berhasil disimpan</span>
        </div>
      )}
    </PageWrapper>
  );
}
