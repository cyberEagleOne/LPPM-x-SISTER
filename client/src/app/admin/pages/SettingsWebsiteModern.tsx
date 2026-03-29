import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { CheckCircle, Globe, Image as ImageIcon, Plus, Save, Trash2 } from "lucide-react";
import { PageWrapper } from "../components/PageWrapper";
import {
  getWebsiteSettings,
  saveWebsiteSettings,
  type WebsiteSettingsData,
} from "../data/superAdminWebsiteStore";

async function fileToDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function SettingsPage() {
  const [settings, setSettings] = useState<WebsiteSettingsData>(() => getWebsiteSettings());
  const [saved, setSaved] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!saved) return undefined;
    const timer = window.setTimeout(() => setSaved(false), 2500);
    return () => window.clearTimeout(timer);
  }, [saved]);

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const image = await fileToDataUrl(file);
    setSettings((previous) => ({ ...previous, image }));
  };

  const updateUrlItem = (index: number, value: string) => {
    setSettings((previous) => ({
      ...previous,
      urls: previous.urls.map((item, itemIndex) => (itemIndex === index ? value : item)),
    }));
  };

  const addUrlField = () => {
    setSettings((previous) => ({ ...previous, urls: [...previous.urls, ""] }));
  };

  const removeUrlField = (index: number) => {
    setSettings((previous) => ({
      ...previous,
      urls: previous.urls.length === 1 ? previous.urls : previous.urls.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSave = () => {
    saveWebsiteSettings(settings);
    setSaved(true);
  };

  return (
    <PageWrapper
      title="Web Settings"
      subtitle="Long form website settings sesuai blueprint administrasi super admin."
      breadcrumbs={[{ label: "Website" }, { label: "Web Settings" }]}
      actions={
        <button
          type="button"
          onClick={handleSave}
          className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white transition-colors hover:bg-[#c00510]"
          style={{ fontWeight: 600 }}
        >
          <Save className="h-4 w-4" />
          Simpan
        </button>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base text-slate-900" style={{ fontWeight: 600 }}>Identitas Website</h3>
                <p className="mt-1 text-sm text-slate-500">Field image, about, address, email, phone, dan url[] ada di sini.</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
              <div className="flex justify-center">
                <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-xl bg-white">
                  {settings.image ? (
                    <img src={settings.image} alt="Website preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400">
                      <ImageIcon className="mx-auto h-10 w-10" />
                      <p className="mt-2 text-sm">Belum ada image website</p>
                    </div>
                  )}
                </div>
              </div>

              <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white transition-colors hover:bg-black"
                >
                  <ImageIcon className="h-4 w-4" />
                  Pilih Image
                </button>
                <button
                  type="button"
                  onClick={() => setSettings((previous) => ({ ...previous, image: null }))}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Image
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Nama Situs</label>
                <input value={settings.siteName} onChange={(event) => setSettings((previous) => ({ ...previous, siteName: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Email</label>
                <input value={settings.email} onChange={(event) => setSettings((previous) => ({ ...previous, email: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Phone</label>
                <input value={settings.phone} onChange={(event) => setSettings((previous) => ({ ...previous, phone: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Address</label>
                <input value={settings.address} onChange={(event) => setSettings((previous) => ({ ...previous, address: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>About</label>
              <textarea value={settings.about} onChange={(event) => setSettings((previous) => ({ ...previous, about: event.target.value }))} rows={5} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" />
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm text-slate-900" style={{ fontWeight: 600 }}>Daftar URL</h4>
                  <p className="mt-1 text-xs text-slate-500">Mengikuti field `url[]` dari dokumen settings lama.</p>
                </div>
                <button
                  type="button"
                  onClick={addUrlField}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-3 py-2 text-sm text-white transition-colors hover:bg-[#c00510]"
                >
                  <Plus className="h-4 w-4" />
                  Tambah URL
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {settings.urls.map((item, index) => (
                  <div key={`${index}-${item}`} className="flex gap-2">
                    <input
                      value={item}
                      onChange={(event) => updateUrlItem(index, event.target.value)}
                      placeholder="https://..."
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#E30613]"
                    />
                    <button
                      type="button"
                      onClick={() => removeUrlField(index)}
                      className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-3 text-sm text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove URL
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-base text-slate-900" style={{ fontWeight: 600 }}>Template Dokumen</h3>
          <p className="mt-1 text-sm text-slate-500">Field template penelitian, PKM, mandiri, dan KI mengikuti pattern long settings form.</p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Template Penelitian</label>
              <textarea value={settings.templatePenelitian} onChange={(event) => setSettings((previous) => ({ ...previous, templatePenelitian: event.target.value }))} rows={5} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Template PKM</label>
              <textarea value={settings.templatePkm} onChange={(event) => setSettings((previous) => ({ ...previous, templatePkm: event.target.value }))} rows={5} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Template Mandiri</label>
              <textarea value={settings.templateMandiri} onChange={(event) => setSettings((previous) => ({ ...previous, templateMandiri: event.target.value }))} rows={5} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Template KI</label>
              <textarea value={settings.templateKi} onChange={(event) => setSettings((previous) => ({ ...previous, templateKi: event.target.value }))} rows={5} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" />
            </div>
          </div>
        </div>
      </div>

      {saved ? (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-green-700 shadow-lg">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm" style={{ fontWeight: 500 }}>Web settings berhasil disimpan</span>
        </div>
      ) : null}
    </PageWrapper>
  );
}
