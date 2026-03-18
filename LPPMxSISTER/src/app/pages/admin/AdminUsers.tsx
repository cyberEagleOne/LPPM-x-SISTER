import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, Plus, Edit2, Trash2, ChevronDown, Users, Shield, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "../../components/ConfirmDialog";

const initialUsers = [
  { id: 1, name: "Dr. Siti Rahma, M.Si.", email: "siti.rahma@pradita.ac.id", nidn: "0012345678", prodi: "Teknik Informatika", role: "Dosen", status: "Aktif", joined: "15 Aug 2015" },
  { id: 2, name: "Prof. Ahmad Fauzi", email: "ahmad.fauzi@pradita.ac.id", nidn: "0098765432", prodi: "-", role: "Reviewer", status: "Aktif", joined: "1 Jan 2020" },
  { id: 3, name: "Prof. Budi Santoso, Ph.D.", email: "budi.santoso@pradita.ac.id", nidn: "0023456789", prodi: "Ekonomi Pembangunan", role: "Dosen", status: "Aktif", joined: "3 Mar 2012" },
  { id: 4, name: "Dr. Ayu Lestari, M.Pharm.", email: "ayu.lestari@pradita.ac.id", nidn: "0034567890", prodi: "Farmasi", role: "Dosen", status: "Aktif", joined: "20 Sep 2018" },
  { id: 5, name: "Ir. Reza Pradipta, M.T.", email: "reza.pradipta@pradita.ac.id", nidn: "0045678901", prodi: "Teknik Sipil", role: "Dosen", status: "Nonaktif", joined: "10 Feb 2016" },
  { id: 6, name: "Dr. Wahyu Nugroho, M.Sc.", email: "wahyu.nugroho@pradita.ac.id", nidn: "0056789012", prodi: "Biologi", role: "Dosen", status: "Aktif", joined: "5 Jul 2017" },
  { id: 7, name: "Admin LPPM", email: "admin@lppm.pradita.ac.id", nidn: "-", prodi: "-", role: "Admin", status: "Aktif", joined: "1 Jan 2022" },
];

const roleColors: Record<string, string> = {
  Dosen: "bg-blue-100 text-blue-700",
  Reviewer: "bg-green-100 text-green-700",
  Admin: "bg-red-100 text-red-700",
};

export function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<typeof initialUsers[0] | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  const filtered = users.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "Semua" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleDelete = (id: number) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (deleteTarget !== null) {
      const user = users.find((u) => u.id === deleteTarget);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget));
      toast.success("Pengguna dihapus", { description: user?.name ?? "" });
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link to="/admin" className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-gray-900">Manajemen Pengguna</h1>
          <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>Kelola akun dosen, reviewer, dan administrator</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Dosen", count: users.filter((u) => u.role === "Dosen").length, icon: Users, color: "#1e3a8a", bg: "#eff6ff" },
          { label: "Reviewer", count: users.filter((u) => u.role === "Reviewer").length, icon: UserCheck, color: "#059669", bg: "#ecfdf5" },
          { label: "Admin", count: users.filter((u) => u.role === "Admin").length, icon: Shield, color: "#7c2d12", bg: "#fef2f2" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.bg }}>
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-gray-900" style={{ fontSize: 22, fontWeight: 800 }}>{s.count}</p>
              <p className="text-gray-500" style={{ fontSize: 13 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between">
          <div className="flex gap-3 flex-1">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 max-w-xs">
              <Search size={15} className="text-gray-400" />
              <input
                type="text"
                placeholder="Cari pengguna..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-gray-700 flex-1"
                style={{ fontSize: 13 }}
              />
            </div>
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-lg text-gray-700 bg-gray-50 outline-none cursor-pointer"
                style={{ fontSize: 13 }}
              >
                {["Semua", "Dosen", "Reviewer", "Admin"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <button
            onClick={() => { setEditUser(null); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7c2d12] text-white hover:bg-[#92400e] transition-colors"
            style={{ fontSize: 13, fontWeight: 600 }}
          >
            <Plus size={16} /> Tambah Pengguna
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Pengguna</th>
                <th className="text-left px-4 py-3 text-gray-500 hidden md:table-cell" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>NIDN / Prodi</th>
                <th className="text-center px-4 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Role</th>
                <th className="text-center px-4 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</th>
                <th className="text-center px-4 py-3 text-gray-500" style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-[#f8faff] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          backgroundColor:
                            user.role === "Admin" ? "#7c2d12" : user.role === "Reviewer" ? "#065f46" : "#1e3a8a",
                        }}
                      >
                        {user.name.split(" ")[1]?.[0] || user.name[0]}
                      </div>
                      <div>
                        <p className="text-gray-900" style={{ fontSize: 14, fontWeight: 600 }}>{user.name}</p>
                        <p className="text-gray-400" style={{ fontSize: 12 }}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <p className="text-gray-600" style={{ fontSize: 13 }}>{user.nidn}</p>
                    <p className="text-gray-400" style={{ fontSize: 12 }}>{user.prodi}</p>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full ${roleColors[user.role]}`} style={{ fontSize: 11, fontWeight: 600 }}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full ${
                        user.status === "Aktif" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                      style={{ fontSize: 11, fontWeight: 600 }}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === "Aktif" ? "bg-green-500" : "bg-gray-400"}`}></span>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => { setEditUser(user); setShowModal(true); }}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-14">
            <Users size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400" style={{ fontSize: 14 }}>Pengguna tidak ditemukan</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-gray-900 mb-5">{editUser ? "Edit Pengguna" : "Tambah Pengguna Baru"}</h2>
            <div className="space-y-4">
              {[
                { label: "Nama Lengkap", placeholder: "Dr. Nama Lengkap, Gelar" },
                { label: "Email", placeholder: "email@pradita.ac.id" },
                { label: "NIDN", placeholder: "0012345678" },
                { label: "Program Studi", placeholder: "Teknik Informatika" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>{f.label}</label>
                  <input
                    type="text"
                    defaultValue={editUser ? (editUser as any)[f.label.toLowerCase().replace(" ", "")] : ""}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 outline-none focus:border-[#7c2d12]"
                    style={{ fontSize: 14 }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-gray-700 mb-1.5" style={{ fontSize: 13, fontWeight: 600 }}>Role</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50 text-gray-700 outline-none focus:border-[#7c2d12]"
                  style={{ fontSize: 14 }}
                  defaultValue={editUser?.role || "Dosen"}
                >
                  {["Dosen", "Reviewer", "Admin"].map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                Batal
              </button>
              <button
                onClick={() => {
                  toast.success(editUser ? "Perubahan disimpan" : "Pengguna berhasil ditambahkan");
                  setShowModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#7c2d12] text-white"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                {editUser ? "Simpan Perubahan" : "Tambah Pengguna"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={deleteTarget !== null}
        title="Hapus Pengguna"
        message={`Apakah Anda yakin ingin menghapus pengguna ${users.find((u) => u.id === deleteTarget)?.name ?? ""}? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Hapus"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}