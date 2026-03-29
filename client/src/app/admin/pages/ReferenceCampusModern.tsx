import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useSearchParams } from "react-router";
import { ConfirmModal } from "../components/ConfirmModal";
import { PageWrapper } from "../components/PageWrapper";
import {
  createReferenceId,
  getFaculties,
  getOfficials,
  getReferenceGroups,
  getReferenceValues,
  getStudyPrograms,
  saveFaculties,
  saveOfficials,
  saveReferenceGroups,
  saveReferenceValues,
  saveStudyPrograms,
  type FacultyItem,
  type OfficialItem,
  type ReferenceGroupItem,
  type ReferenceValueItem,
  type StudyProgramItem,
} from "../data/superAdminReferenceStore";

type ConfirmState = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
};

function useFlashMessage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!message) return undefined;
    const timer = window.setTimeout(() => setMessage(""), 2400);
    return () => window.clearTimeout(timer);
  }, [message]);

  return { message, setMessage };
}

function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="flex h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 text-sm text-slate-500">
      <Search className="h-4 w-4" />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-64 bg-transparent outline-none" />
    </label>
  );
}

function ToastMessage({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[100] rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm text-green-700 shadow-lg">
      {message}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return <div className="px-4 py-10 text-center text-sm text-slate-400">{label}</div>;
}

function FormModal({
  isOpen,
  onClose,
  title,
  description,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  children: ReactNode;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="border-b border-slate-200 px-6 py-5">
          <h3 className="text-xl text-slate-900" style={{ fontWeight: 700 }}>{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        <div className="max-h-[calc(90vh-96px)] overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}

function normalizeParam(value: string | null) {
  return value && value.trim() ? value : "all";
}

export function FakultasPage() {
  const [items, setItems] = useState<FacultyItem[]>(() => getFaculties());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", code: "", dean: "", description: "" });
  const [confirm, setConfirm] = useState<ConfirmState>({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  const { message, setMessage } = useFlashMessage();

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();
    return items.filter((item) => [item.name, item.code, item.dean, item.description].some((value) => value.toLowerCase().includes(keyword)));
  }, [items, search]);

  const persist = (next: FacultyItem[]) => {
    setItems(next);
    saveFaculties(next);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", code: "", dean: "", description: "" });
  };

  const openCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEdit = (item: FacultyItem) => {
    setEditingId(item.id);
    setForm({ name: item.name, code: item.code, dean: item.dean, description: item.description });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const saveItem = () => {
    if (!form.name.trim() || !form.code.trim()) {
      setMessage("Nama fakultas dan kode wajib diisi.");
      return;
    }
    const payload: FacultyItem = {
      id: editingId ?? createReferenceId("FK", items.map((item) => item.id)),
      name: form.name.trim(),
      code: form.code.trim(),
      dean: form.dean.trim(),
      description: form.description.trim(),
    };
    const next = editingId ? items.map((item) => (item.id === editingId ? payload : item)) : [payload, ...items];
    persist(next);
    closeForm();
    setMessage("Data fakultas berhasil disimpan.");
  };

  const deleteItems = (ids: string[]) => {
    if (ids.length === 0) return;
    setConfirm({
      isOpen: true,
      title: "Hapus fakultas",
      message: ids.length === 1 ? "Fakultas terpilih akan dihapus." : `${ids.length} fakultas akan dihapus.`,
      onConfirm: () => {
        const next = items.filter((item) => !ids.includes(item.id));
        persist(next);
        setSelectedIds([]);
        if (editingId && ids.includes(editingId)) closeForm();
        setMessage("Data fakultas berhasil dihapus.");
      },
    });
  };

  return (
    <PageWrapper
      title="Fakultas"
      subtitle="Bulk CRUD master data fakultas untuk super admin."
      breadcrumbs={[{ label: "Administrasi" }, { label: "Fakultas" }]}
      actions={
        <>
          <button type="button" onClick={() => deleteItems(selectedIds)} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><Trash2 className="h-4 w-4" /> Delete</button>
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]"><Plus className="h-4 w-4" /> Tambah</button>
        </>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base text-slate-900" style={{ fontWeight: 600 }}>Daftar Fakultas</h3>
            <p className="mt-1 text-sm text-slate-500">Aksi tambah, edit, delete, bulk delete, dan search sudah aktif.</p>
          </div>
          <SearchField value={search} onChange={setSearch} placeholder="Cari fakultas..." />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-3 py-3"><input type="checkbox" checked={filtered.length > 0 && selectedIds.length === filtered.length} onChange={(event) => setSelectedIds(event.target.checked ? filtered.map((item) => item.id) : [])} /></th>
                <th className="px-3 py-3">Nama</th>
                <th className="px-3 py-3">Kode</th>
                <th className="px-3 py-3">Dekan</th>
                <th className="px-3 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={5}><EmptyState label="Belum ada data fakultas." /></td></tr> : filtered.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-3"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={(event) => setSelectedIds((previous) => event.target.checked ? [...new Set([...previous, item.id])] : previous.filter((value) => value !== item.id))} /></td>
                  <td className="px-3 py-3"><p className="text-slate-900" style={{ fontWeight: 600 }}>{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.description || "-"}</p></td>
                  <td className="px-3 py-3">{item.code}</td>
                  <td className="px-3 py-3">{item.dean || "-"}</td>
                  <td className="px-3 py-3"><div className="flex justify-end gap-2"><button type="button" onClick={() => openEdit(item)} className="rounded-lg bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"><Edit className="h-4 w-4" /></button><button type="button" onClick={() => deleteItems([item.id])} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal isOpen={isFormOpen} onClose={closeForm} title={editingId ? "Edit Fakultas" : "Tambah Fakultas"} description="Form sederhana sesuai pattern CRUD master data.">
        <div className="grid gap-4">
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Nama Fakultas</label><input value={form.name} onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Kode</label><input value={form.code} onChange={(event) => setForm((previous) => ({ ...previous, code: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Dekan</label><input value={form.dean} onChange={(event) => setForm((previous) => ({ ...previous, dean: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Deskripsi</label><textarea rows={4} value={form.description} onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" /></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">Reset</button>
          <button type="button" onClick={saveItem} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]">{editingId ? "Update" : "Submit"}</button>
        </div>
      </FormModal>

      <ConfirmModal isOpen={confirm.isOpen} onClose={() => setConfirm((previous) => ({ ...previous, isOpen: false }))} onConfirm={confirm.onConfirm} title={confirm.title} message={confirm.message} confirmLabel="Hapus" variant="danger" />
      <ToastMessage message={message} />
    </PageWrapper>
  );
}

export function ProdiPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const faculties = useMemo(() => getFaculties(), []);
  const facultyMap = useMemo(() => Object.fromEntries(faculties.map((item) => [item.id, item.name])) as Record<string, string>, [faculties]);
  const activeFacultyId = normalizeParam(searchParams.get("faculty"));
  const [items, setItems] = useState<StudyProgramItem[]>(() => getStudyPrograms());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    facultyId: activeFacultyId === "all" ? faculties[0]?.id ?? "" : activeFacultyId,
    name: "",
    code: "",
    degree: "S1",
    accreditation: "",
  });
  const [confirm, setConfirm] = useState<ConfirmState>({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  const { message, setMessage } = useFlashMessage();

  useEffect(() => {
    if (!editingId && activeFacultyId !== "all") {
      setForm((previous) => ({ ...previous, facultyId: activeFacultyId }));
    }
  }, [activeFacultyId, editingId]);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();
    return items.filter((item) => {
      const matchesContext = activeFacultyId === "all" || item.facultyId === activeFacultyId;
      const matchesSearch = [item.name, item.code, item.degree, item.accreditation, facultyMap[item.facultyId] ?? ""]
        .some((value) => value.toLowerCase().includes(keyword));
      return matchesContext && matchesSearch;
    });
  }, [activeFacultyId, facultyMap, items, search]);

  const persist = (next: StudyProgramItem[]) => {
    setItems(next);
    saveStudyPrograms(next);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      facultyId: activeFacultyId === "all" ? faculties[0]?.id ?? "" : activeFacultyId,
      name: "",
      code: "",
      degree: "S1",
      accreditation: "",
    });
  };

  const openCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEdit = (item: StudyProgramItem) => {
    setEditingId(item.id);
    setForm({ facultyId: item.facultyId, name: item.name, code: item.code, degree: item.degree, accreditation: item.accreditation });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const saveItem = () => {
    if (!form.facultyId || !form.name.trim() || !form.code.trim()) {
      setMessage("Fakultas, nama prodi, dan kode wajib diisi.");
      return;
    }
    const payload: StudyProgramItem = {
      id: editingId ?? createReferenceId("PD", items.map((item) => item.id)),
      facultyId: form.facultyId,
      name: form.name.trim(),
      code: form.code.trim(),
      degree: form.degree.trim(),
      accreditation: form.accreditation.trim(),
    };
    const next = editingId ? items.map((item) => (item.id === editingId ? payload : item)) : [payload, ...items];
    persist(next);
    closeForm();
    setMessage("Data program studi berhasil disimpan.");
  };

  const deleteItems = (ids: string[]) => {
    if (ids.length === 0) return;
    setConfirm({
      isOpen: true,
      title: "Hapus program studi",
      message: ids.length === 1 ? "Program studi terpilih akan dihapus." : `${ids.length} program studi akan dihapus.`,
      onConfirm: () => {
        const next = items.filter((item) => !ids.includes(item.id));
        persist(next);
        setSelectedIds([]);
        if (editingId && ids.includes(editingId)) closeForm();
        setMessage("Data program studi berhasil dihapus.");
      },
    });
  };

  const changeContext = (facultyId: string) => {
    setSearchParams(facultyId === "all" ? {} : { faculty: facultyId });
    setSelectedIds([]);
  };

  return (
    <PageWrapper
      title="Program Study"
      subtitle="Filtered CRUD program studi dengan konteks fakultas aktif."
      breadcrumbs={[{ label: "Administrasi" }, { label: "Program Study" }]}
      actions={
        <>
          <button type="button" onClick={() => deleteItems(selectedIds)} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><Trash2 className="h-4 w-4" /> Delete</button>
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]"><Plus className="h-4 w-4" /> Tambah</button>
        </>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base text-slate-900" style={{ fontWeight: 600 }}>Daftar Program Studi</h3>
            <p className="mt-1 text-sm text-slate-500">`gourl` React dipakai untuk berpindah konteks fakultas aktif.</p>
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <select value={activeFacultyId} onChange={(event) => changeContext(event.target.value)} className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]">
              <option value="all">Semua Fakultas</option>
              {faculties.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <SearchField value={search} onChange={setSearch} placeholder="Cari prodi..." />
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-3 py-3"><input type="checkbox" checked={filtered.length > 0 && selectedIds.length === filtered.length} onChange={(event) => setSelectedIds(event.target.checked ? filtered.map((item) => item.id) : [])} /></th>
                <th className="px-3 py-3">Program Studi</th>
                <th className="px-3 py-3">Kode</th>
                <th className="px-3 py-3">Jenjang</th>
                <th className="px-3 py-3">Akreditasi</th>
                <th className="px-3 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={6}><EmptyState label="Belum ada data program studi pada konteks ini." /></td></tr> : filtered.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-3"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={(event) => setSelectedIds((previous) => event.target.checked ? [...new Set([...previous, item.id])] : previous.filter((value) => value !== item.id))} /></td>
                  <td className="px-3 py-3"><p className="text-slate-900" style={{ fontWeight: 600 }}>{item.name}</p><p className="mt-1 text-xs text-slate-500">{facultyMap[item.facultyId] ?? "-"}</p></td>
                  <td className="px-3 py-3">{item.code}</td>
                  <td className="px-3 py-3">{item.degree}</td>
                  <td className="px-3 py-3">{item.accreditation || "-"}</td>
                  <td className="px-3 py-3"><div className="flex justify-end gap-2"><button type="button" onClick={() => openEdit(item)} className="rounded-lg bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"><Edit className="h-4 w-4" /></button><button type="button" onClick={() => deleteItems([item.id])} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal isOpen={isFormOpen} onClose={closeForm} title={editingId ? "Edit Program Studi" : "Tambah Program Studi"} description="Form create dan edit dalam konteks fakultas aktif.">
        <div className="grid gap-4">
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Fakultas</label><select value={form.facultyId} onChange={(event) => setForm((previous) => ({ ...previous, facultyId: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]">{faculties.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Nama Program Studi</label><input value={form.name} onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Kode</label><input value={form.code} onChange={(event) => setForm((previous) => ({ ...previous, code: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div className="grid gap-4 md:grid-cols-2">
            <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Jenjang</label><input value={form.degree} onChange={(event) => setForm((previous) => ({ ...previous, degree: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
            <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Akreditasi</label><input value={form.accreditation} onChange={(event) => setForm((previous) => ({ ...previous, accreditation: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">Reset</button>
          <button type="button" onClick={saveItem} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]">{editingId ? "Update" : "Submit"}</button>
        </div>
      </FormModal>

      <ConfirmModal isOpen={confirm.isOpen} onClose={() => setConfirm((previous) => ({ ...previous, isOpen: false }))} onConfirm={confirm.onConfirm} title={confirm.title} message={confirm.message} confirmLabel="Hapus" variant="danger" />
      <ToastMessage message={message} />
    </PageWrapper>
  );
}

export function PejabatPage() {
  const [items, setItems] = useState<OfficialItem[]>(() => getOfficials());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", position: "", unit: "", email: "" });
  const [confirm, setConfirm] = useState<ConfirmState>({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  const { message, setMessage } = useFlashMessage();

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();
    return items.filter((item) => [item.name, item.position, item.unit, item.email].some((value) => value.toLowerCase().includes(keyword)));
  }, [items, search]);

  const persist = (next: OfficialItem[]) => {
    setItems(next);
    saveOfficials(next);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", position: "", unit: "", email: "" });
  };

  const openCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEdit = (item: OfficialItem) => {
    setEditingId(item.id);
    setForm({ name: item.name, position: item.position, unit: item.unit, email: item.email });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const saveItem = () => {
    if (!form.name.trim() || !form.position.trim()) {
      setMessage("Nama dan jabatan pejabat wajib diisi.");
      return;
    }
    const payload: OfficialItem = {
      id: editingId ?? createReferenceId("PJB", items.map((item) => item.id)),
      name: form.name.trim(),
      position: form.position.trim(),
      unit: form.unit.trim(),
      email: form.email.trim(),
    };
    const next = editingId ? items.map((item) => (item.id === editingId ? payload : item)) : [payload, ...items];
    persist(next);
    closeForm();
    setMessage("Data pejabat berhasil disimpan.");
  };

  const deleteItems = (ids: string[]) => {
    if (ids.length === 0) return;
    setConfirm({
      isOpen: true,
      title: "Hapus pejabat",
      message: ids.length === 1 ? "Pejabat terpilih akan dihapus." : `${ids.length} pejabat akan dihapus.`,
      onConfirm: () => {
        const next = items.filter((item) => !ids.includes(item.id));
        persist(next);
        setSelectedIds([]);
        if (editingId && ids.includes(editingId)) closeForm();
        setMessage("Data pejabat berhasil dihapus.");
      },
    });
  };

  return (
    <PageWrapper
      title="Pejabat Pradita"
      subtitle="Master data pejabat universitas dan LPPM."
      breadcrumbs={[{ label: "Administrasi" }, { label: "Pejabat Pradita" }]}
      actions={
        <>
          <button type="button" onClick={() => deleteItems(selectedIds)} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><Trash2 className="h-4 w-4" /> Delete</button>
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]"><Plus className="h-4 w-4" /> Tambah</button>
        </>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base text-slate-900" style={{ fontWeight: 600 }}>Daftar Pejabat</h3>
            <p className="mt-1 text-sm text-slate-500">Digunakan untuk kebutuhan penandatangan dan referensi struktur kampus.</p>
          </div>
          <SearchField value={search} onChange={setSearch} placeholder="Cari pejabat..." />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-3 py-3"><input type="checkbox" checked={filtered.length > 0 && selectedIds.length === filtered.length} onChange={(event) => setSelectedIds(event.target.checked ? filtered.map((item) => item.id) : [])} /></th>
                <th className="px-3 py-3">Nama</th>
                <th className="px-3 py-3">Jabatan</th>
                <th className="px-3 py-3">Unit</th>
                <th className="px-3 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={5}><EmptyState label="Belum ada data pejabat." /></td></tr> : filtered.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-3"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={(event) => setSelectedIds((previous) => event.target.checked ? [...new Set([...previous, item.id])] : previous.filter((value) => value !== item.id))} /></td>
                  <td className="px-3 py-3"><p className="text-slate-900" style={{ fontWeight: 600 }}>{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.email || "-"}</p></td>
                  <td className="px-3 py-3">{item.position}</td>
                  <td className="px-3 py-3">{item.unit || "-"}</td>
                  <td className="px-3 py-3"><div className="flex justify-end gap-2"><button type="button" onClick={() => openEdit(item)} className="rounded-lg bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"><Edit className="h-4 w-4" /></button><button type="button" onClick={() => deleteItems([item.id])} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal isOpen={isFormOpen} onClose={closeForm} title={editingId ? "Edit Pejabat" : "Tambah Pejabat"} description="Form create dan edit pejabat kampus.">
        <div className="grid gap-4">
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Nama</label><input value={form.name} onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Jabatan</label><input value={form.position} onChange={(event) => setForm((previous) => ({ ...previous, position: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Unit</label><input value={form.unit} onChange={(event) => setForm((previous) => ({ ...previous, unit: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Email</label><input value={form.email} onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">Reset</button>
          <button type="button" onClick={saveItem} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]">{editingId ? "Update" : "Submit"}</button>
        </div>
      </FormModal>

      <ConfirmModal isOpen={confirm.isOpen} onClose={() => setConfirm((previous) => ({ ...previous, isOpen: false }))} onConfirm={confirm.onConfirm} title={confirm.title} message={confirm.message} confirmLabel="Hapus" variant="danger" />
      <ToastMessage message={message} />
    </PageWrapper>
  );
}

export function GroupReferencePage() {
  const [items, setItems] = useState<ReferenceGroupItem[]>(() => getReferenceGroups());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", code: "", description: "" });
  const [confirm, setConfirm] = useState<ConfirmState>({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  const { message, setMessage } = useFlashMessage();

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();
    return items.filter((item) => [item.name, item.code, item.description].some((value) => value.toLowerCase().includes(keyword)));
  }, [items, search]);

  const persist = (next: ReferenceGroupItem[]) => {
    setItems(next);
    saveReferenceGroups(next);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: "", code: "", description: "" });
  };

  const openCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEdit = (item: ReferenceGroupItem) => {
    setEditingId(item.id);
    setForm({ name: item.name, code: item.code, description: item.description });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const saveItem = () => {
    if (!form.name.trim() || !form.code.trim()) {
      setMessage("Nama group dan kode wajib diisi.");
      return;
    }
    const payload: ReferenceGroupItem = {
      id: editingId ?? createReferenceId("GR", items.map((item) => item.id)),
      name: form.name.trim(),
      code: form.code.trim(),
      description: form.description.trim(),
    };
    const next = editingId ? items.map((item) => (item.id === editingId ? payload : item)) : [payload, ...items];
    persist(next);
    closeForm();
    setMessage("Group reference berhasil disimpan.");
  };

  const deleteItems = (ids: string[]) => {
    if (ids.length === 0) return;
    setConfirm({
      isOpen: true,
      title: "Hapus group reference",
      message: ids.length === 1 ? "Group reference terpilih akan dihapus." : `${ids.length} group reference akan dihapus.`,
      onConfirm: () => {
        const nextGroups = items.filter((item) => !ids.includes(item.id));
        persist(nextGroups);
        const nextValues = getReferenceValues().filter((item) => !ids.includes(item.groupId));
        saveReferenceValues(nextValues);
        setSelectedIds([]);
        if (editingId && ids.includes(editingId)) closeForm();
        setMessage("Group reference berhasil dihapus.");
      },
    });
  };

  return (
    <PageWrapper
      title="Group Reference"
      subtitle="Master group untuk nilai reference dan data referensi lain."
      breadcrumbs={[{ label: "Administrasi" }, { label: "Group Reference" }]}
      actions={
        <>
          <button type="button" onClick={() => deleteItems(selectedIds)} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><Trash2 className="h-4 w-4" /> Delete</button>
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]"><Plus className="h-4 w-4" /> Tambah</button>
        </>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-base text-slate-900" style={{ fontWeight: 600 }}>Daftar Group Reference</h3>
            <p className="mt-1 text-sm text-slate-500">Menjadi parent untuk Nilai Reference.</p>
          </div>
          <SearchField value={search} onChange={setSearch} placeholder="Cari group reference..." />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-3 py-3"><input type="checkbox" checked={filtered.length > 0 && selectedIds.length === filtered.length} onChange={(event) => setSelectedIds(event.target.checked ? filtered.map((item) => item.id) : [])} /></th>
                <th className="px-3 py-3">Nama Group</th>
                <th className="px-3 py-3">Kode</th>
                <th className="px-3 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={4}><EmptyState label="Belum ada group reference." /></td></tr> : filtered.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-3"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={(event) => setSelectedIds((previous) => event.target.checked ? [...new Set([...previous, item.id])] : previous.filter((value) => value !== item.id))} /></td>
                  <td className="px-3 py-3"><p className="text-slate-900" style={{ fontWeight: 600 }}>{item.name}</p><p className="mt-1 text-xs text-slate-500">{item.description || "-"}</p></td>
                  <td className="px-3 py-3">{item.code}</td>
                  <td className="px-3 py-3"><div className="flex justify-end gap-2"><button type="button" onClick={() => openEdit(item)} className="rounded-lg bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"><Edit className="h-4 w-4" /></button><button type="button" onClick={() => deleteItems([item.id])} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal isOpen={isFormOpen} onClose={closeForm} title={editingId ? "Edit Group Reference" : "Tambah Group Reference"} description="Form create dan edit parent group referensi.">
        <div className="grid gap-4">
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Nama Group</label><input value={form.name} onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Kode</label><input value={form.code} onChange={(event) => setForm((previous) => ({ ...previous, code: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Deskripsi</label><textarea rows={4} value={form.description} onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" /></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">Reset</button>
          <button type="button" onClick={saveItem} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]">{editingId ? "Update" : "Submit"}</button>
        </div>
      </FormModal>

      <ConfirmModal isOpen={confirm.isOpen} onClose={() => setConfirm((previous) => ({ ...previous, isOpen: false }))} onConfirm={confirm.onConfirm} title={confirm.title} message={confirm.message} confirmLabel="Hapus" variant="danger" />
      <ToastMessage message={message} />
    </PageWrapper>
  );
}

export function NilaiReferencePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const groups = useMemo(() => getReferenceGroups(), []);
  const groupMap = useMemo(() => Object.fromEntries(groups.map((item) => [item.id, item.name])) as Record<string, string>, [groups]);
  const activeGroupId = normalizeParam(searchParams.get("group"));
  const [items, setItems] = useState<ReferenceValueItem[]>(() => getReferenceValues());
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    groupId: activeGroupId === "all" ? groups[0]?.id ?? "" : activeGroupId,
    label: "",
    valueCode: "",
    description: "",
    sortOrder: "1",
  });
  const [confirm, setConfirm] = useState<ConfirmState>({ isOpen: false, title: "", message: "", onConfirm: () => {} });
  const { message, setMessage } = useFlashMessage();

  useEffect(() => {
    if (!editingId && activeGroupId !== "all") {
      setForm((previous) => ({ ...previous, groupId: activeGroupId }));
    }
  }, [activeGroupId, editingId]);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();
    return items
      .filter((item) => activeGroupId === "all" || item.groupId === activeGroupId)
      .filter((item) => [item.label, item.valueCode, item.description, groupMap[item.groupId] ?? ""].some((value) => value.toLowerCase().includes(keyword)))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [activeGroupId, groupMap, items, search]);

  const persist = (next: ReferenceValueItem[]) => {
    setItems(next);
    saveReferenceValues(next);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      groupId: activeGroupId === "all" ? groups[0]?.id ?? "" : activeGroupId,
      label: "",
      valueCode: "",
      description: "",
      sortOrder: "1",
    });
  };

  const openCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEdit = (item: ReferenceValueItem) => {
    setEditingId(item.id);
    setForm({
      groupId: item.groupId,
      label: item.label,
      valueCode: item.valueCode,
      description: item.description,
      sortOrder: String(item.sortOrder),
    });
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const saveItem = () => {
    if (!form.groupId || !form.label.trim() || !form.valueCode.trim()) {
      setMessage("Group, label, dan kode nilai wajib diisi.");
      return;
    }
    const payload: ReferenceValueItem = {
      id: editingId ?? createReferenceId("RV", items.map((item) => item.id)),
      groupId: form.groupId,
      label: form.label.trim(),
      valueCode: form.valueCode.trim(),
      description: form.description.trim(),
      sortOrder: Number(form.sortOrder) || 1,
    };
    const next = editingId ? items.map((item) => (item.id === editingId ? payload : item)) : [payload, ...items];
    persist(next);
    closeForm();
    setMessage("Nilai reference berhasil disimpan.");
  };

  const deleteItems = (ids: string[]) => {
    if (ids.length === 0) return;
    setConfirm({
      isOpen: true,
      title: "Hapus nilai reference",
      message: ids.length === 1 ? "Nilai reference terpilih akan dihapus." : `${ids.length} nilai reference akan dihapus.`,
      onConfirm: () => {
        const next = items.filter((item) => !ids.includes(item.id));
        persist(next);
        setSelectedIds([]);
        if (editingId && ids.includes(editingId)) closeForm();
        setMessage("Nilai reference berhasil dihapus.");
      },
    });
  };

  const changeContext = (groupId: string) => {
    setSearchParams(groupId === "all" ? {} : { group: groupId });
    setSelectedIds([]);
  };

  return (
    <PageWrapper
      title="Nilai Reference"
      subtitle="Filtered CRUD nilai reference berdasarkan group aktif."
      breadcrumbs={[{ label: "Administrasi" }, { label: "Nilai Reference" }]}
      actions={
        <>
          <button type="button" onClick={() => deleteItems(selectedIds)} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"><Trash2 className="h-4 w-4" /> Delete</button>
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]"><Plus className="h-4 w-4" /> Tambah</button>
        </>
      }
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-base text-slate-900" style={{ fontWeight: 600 }}>Daftar Nilai Reference</h3>
            <p className="mt-1 text-sm text-slate-500">Mengikuti pola filtered CRUD table dengan perpindahan context group.</p>
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <select value={activeGroupId} onChange={(event) => changeContext(event.target.value)} className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]">
              <option value="all">Semua Group</option>
              {groups.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
            <SearchField value={search} onChange={setSearch} placeholder="Cari nilai reference..." />
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-3 py-3"><input type="checkbox" checked={filtered.length > 0 && selectedIds.length === filtered.length} onChange={(event) => setSelectedIds(event.target.checked ? filtered.map((item) => item.id) : [])} /></th>
                <th className="px-3 py-3">Label</th>
                <th className="px-3 py-3">Kode Nilai</th>
                <th className="px-3 py-3">Urutan</th>
                <th className="px-3 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? <tr><td colSpan={5}><EmptyState label="Belum ada nilai reference pada konteks ini." /></td></tr> : filtered.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="px-3 py-3"><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={(event) => setSelectedIds((previous) => event.target.checked ? [...new Set([...previous, item.id])] : previous.filter((value) => value !== item.id))} /></td>
                  <td className="px-3 py-3"><p className="text-slate-900" style={{ fontWeight: 600 }}>{item.label}</p><p className="mt-1 text-xs text-slate-500">{groupMap[item.groupId] ?? "-"}</p></td>
                  <td className="px-3 py-3">{item.valueCode}</td>
                  <td className="px-3 py-3">{item.sortOrder}</td>
                  <td className="px-3 py-3"><div className="flex justify-end gap-2"><button type="button" onClick={() => openEdit(item)} className="rounded-lg bg-amber-50 p-2 text-amber-700 hover:bg-amber-100"><Edit className="h-4 w-4" /></button><button type="button" onClick={() => deleteItems([item.id])} className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FormModal isOpen={isFormOpen} onClose={closeForm} title={editingId ? "Edit Nilai Reference" : "Tambah Nilai Reference"} description="Nilai dibuat dalam parent group yang aktif.">
        <div className="grid gap-4">
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Group</label><select value={form.groupId} onChange={(event) => setForm((previous) => ({ ...previous, groupId: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]">{groups.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Label</label><input value={form.label} onChange={(event) => setForm((previous) => ({ ...previous, label: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Kode Nilai</label><input value={form.valueCode} onChange={(event) => setForm((previous) => ({ ...previous, valueCode: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Urutan</label><input type="number" min="1" value={form.sortOrder} onChange={(event) => setForm((previous) => ({ ...previous, sortOrder: event.target.value }))} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" /></div>
          <div><label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Deskripsi</label><textarea rows={4} value={form.description} onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" /></div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50">Reset</button>
          <button type="button" onClick={saveItem} className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]">{editingId ? "Update" : "Submit"}</button>
        </div>
      </FormModal>

      <ConfirmModal isOpen={confirm.isOpen} onClose={() => setConfirm((previous) => ({ ...previous, isOpen: false }))} onConfirm={confirm.onConfirm} title={confirm.title} message={confirm.message} confirmLabel="Hapus" variant="danger" />
      <ToastMessage message={message} />
    </PageWrapper>
  );
}
