import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { ArrowDownUp, Edit, IdCard, Search, Trash2, UserPlus } from "lucide-react";
import { Link } from "react-router";
import { ConfirmModal } from "../components/ConfirmModal";
import { PageWrapper } from "../components/PageWrapper";
import { SkeletonTable } from "../components/SkeletonLoader";
import { useAuth } from "../context/AuthContext";
import {
  createManagedUserId,
  getManagedRoles,
  getManagedUsers,
  saveManagedUsers,
  type ManagedRoleDefinition,
  type ManagedRoleKey,
  type ManagedUser,
  type ManagedUserStatus,
} from "../data/superAdminAdministrationStore";

type SortField = "name" | "email" | "roles" | "fakultas";
type SortDirection = "asc" | "desc";

interface UserFormState {
  id?: string;
  name: string;
  email: string;
  nidn: string;
  fakultas: string;
  prodi: string;
  status: ManagedUserStatus;
  roleKeys: ManagedRoleKey[];
}

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  variant: "danger" | "warning" | "success" | "info";
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

const EMPTY_FORM: UserFormState = {
  name: "",
  email: "",
  nidn: "",
  fakultas: "",
  prodi: "",
  status: "active",
  roleKeys: ["dosen"],
};

function getRoleLabel(roleDefinitions: ManagedRoleDefinition[], roleKey: ManagedRoleKey) {
  return roleDefinitions.find((role) => role.key === roleKey)?.label ?? roleKey;
}

function getRoleSummary(roleDefinitions: ManagedRoleDefinition[], roleKeys: ManagedRoleKey[]) {
  return roleKeys.map((roleKey) => getRoleLabel(roleDefinitions, roleKey)).join(", ");
}

function toFormState(user: ManagedUser): UserFormState {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    nidn: user.nidn ?? "",
    fakultas: user.fakultas,
    prodi: user.prodi ?? "",
    status: user.status,
    roleKeys: user.roleKeys,
  };
}

function UserEditorModal({
  isOpen,
  mode,
  form,
  roleDefinitions,
  onChange,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  mode: "create" | "edit";
  form: UserFormState;
  roleDefinitions: ManagedRoleDefinition[];
  onChange: (next: UserFormState) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  if (!isOpen) return null;

  const handleRoleToggle = (roleKey: ManagedRoleKey) => {
    const nextRoleKeys = form.roleKeys.includes(roleKey)
      ? form.roleKeys.filter((item) => item !== roleKey)
      : [...form.roleKeys, roleKey];

    onChange({
      ...form,
      roleKeys: nextRoleKeys.length ? nextRoleKeys : form.roleKeys,
    });
  };

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-lg text-slate-900" style={{ fontWeight: 600 }}>
              {mode === "create" ? "Tambah User" : "Edit User"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Meniru pattern users legacy: tambah, edit, dan assign multi-role.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            Tutup
          </button>
        </div>

        <div className="grid gap-6 px-5 py-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>
                Nama Lengkap
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(event) => onChange({ ...form, name: event.target.value })}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors focus:border-[#E30613]"
                placeholder="Nama user"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => onChange({ ...form, email: event.target.value })}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors focus:border-[#E30613]"
                placeholder="nama@pradita.ac.id"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>
                  NIDN / ID
                </label>
                <input
                  type="text"
                  value={form.nidn}
                  onChange={(event) => onChange({ ...form, nidn: event.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors focus:border-[#E30613]"
                  placeholder="Opsional"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(event) => onChange({ ...form, status: event.target.value as ManagedUserStatus })}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors focus:border-[#E30613]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>
                  Fakultas
                </label>
                <input
                  type="text"
                  value={form.fakultas}
                  onChange={(event) => onChange({ ...form, fakultas: event.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors focus:border-[#E30613]"
                  placeholder="Fakultas"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>
                  Program Studi
                </label>
                <input
                  type="text"
                  value={form.prodi}
                  onChange={(event) => onChange({ ...form, prodi: event.target.value })}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors focus:border-[#E30613]"
                  placeholder="Program studi"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm text-slate-900" style={{ fontWeight: 600 }}>
                Pilih Role
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Mengikuti field legacy `roleid[]`, jadi satu user bisa punya lebih dari satu role.
              </p>

              <div className="mt-4 max-h-72 space-y-2 overflow-y-auto pr-1">
                {roleDefinitions.map((role) => (
                  <label
                    key={role.key}
                    className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5"
                  >
                    <input
                      type="checkbox"
                      checked={form.roleKeys.includes(role.key)}
                      onChange={() => handleRoleToggle(role.key)}
                      className="mt-1 rounded border-slate-300 text-[#E30613] focus:ring-[#E30613]"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm text-slate-800" style={{ fontWeight: 600 }}>
                        {role.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500">{role.description}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-white px-4 py-2 text-sm text-slate-600 ring-1 ring-slate-200 transition-colors hover:bg-slate-100"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white transition-colors hover:bg-[#c00510]"
            style={{ fontWeight: 600 }}
          >
            {mode === "create" ? "Simpan User" : "Update User"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function UserManagement() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<ManagedUser[]>(() => getManagedUsers());
  const [roleDefinitions] = useState<ManagedRoleDefinition[]>(() => getManagedRoles());
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"create" | "edit">("create");
  const [formState, setFormState] = useState<UserFormState>(EMPTY_FORM);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<ConfirmState>({
    isOpen: false,
    title: "",
    message: "",
    variant: "danger",
    onConfirm: () => undefined,
  });

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 300);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    setSelectedIds((previous) => previous.filter((id) => users.some((item) => item.id === id)));
  }, [users]);

  useEffect(() => {
    if (!flashMessage) return undefined;
    const timer = window.setTimeout(() => setFlashMessage(null), 2400);
    return () => window.clearTimeout(timer);
  }, [flashMessage]);

  const isReadOnly = user?.role !== "administrator";

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return users.filter((item) => {
      const joinedRoles = getRoleSummary(roleDefinitions, item.roleKeys).toLowerCase();
      return [
        item.id,
        item.name,
        item.email,
        item.fakultas,
        item.prodi ?? "",
        item.nidn ?? "",
        joinedRoles,
      ].some((value) => value.toLowerCase().includes(query));
    });
  }, [roleDefinitions, searchQuery, users]);

  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];
    sorted.sort((left, right) => {
      const leftValue =
        sortField === "roles"
          ? getRoleSummary(roleDefinitions, left.roleKeys)
          : sortField === "fakultas"
            ? `${left.fakultas} ${left.prodi ?? ""}`
            : left[sortField];
      const rightValue =
        sortField === "roles"
          ? getRoleSummary(roleDefinitions, right.roleKeys)
          : sortField === "fakultas"
            ? `${right.fakultas} ${right.prodi ?? ""}`
            : right[sortField];
      return sortDirection === "asc"
        ? String(leftValue).localeCompare(String(rightValue))
        : String(rightValue).localeCompare(String(leftValue));
    });
    return sorted;
  }, [filteredUsers, roleDefinitions, sortDirection, sortField]);

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / perPage));
  const paginatedUsers = sortedUsers.slice((currentPage - 1) * perPage, currentPage * perPage);

  const persistUsers = (nextUsers: ManagedUser[], message?: string) => {
    setUsers(nextUsers);
    saveManagedUsers(nextUsers);
    if (message) setFlashMessage(message);
  };

  const handleSort = (field: SortField) => {
    setCurrentPage(1);
    if (sortField === field) {
      setSortDirection((previous) => (previous === "asc" ? "desc" : "asc"));
      return;
    }
    setSortField(field);
    setSortDirection("asc");
  };

  const handleSelectAll = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedIds(paginatedUsers.map((item) => item.id));
      return;
    }
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]
    );
  };

  const openCreateModal = () => {
    setEditorMode("create");
    setFormState(EMPTY_FORM);
    setEditorOpen(true);
  };

  const openEditModal = (targetUser: ManagedUser) => {
    setEditorMode("edit");
    setFormState(toFormState(targetUser));
    setEditorOpen(true);
  };

  const openMessageModal = (title: string, message: string) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      variant: "warning",
      confirmLabel: "Oke",
      cancelLabel: "Tutup",
      onConfirm: () => undefined,
    });
  };

  const handleSaveUser = () => {
    if (!formState.name.trim() || !formState.email.trim()) {
      openMessageModal("Data belum lengkap", "Nama dan email wajib diisi sebelum user disimpan.");
      return;
    }

    if (!formState.roleKeys.length) {
      openMessageModal("Role belum dipilih", "Minimal satu role harus dipilih agar user bisa dipakai di modul administrasi.");
      return;
    }

    const normalizedEmail = formState.email.trim().toLowerCase();
    const duplicateEmail = users.find(
      (item) => item.email.toLowerCase() === normalizedEmail && item.id !== formState.id
    );

    if (duplicateEmail) {
      openMessageModal("Email sudah dipakai", "Gunakan email lain agar data user tidak saling bertabrakan.");
      return;
    }

    if (editorMode === "edit" && formState.id) {
      const nextUsers = users.map((item) =>
        item.id === formState.id
          ? {
              ...item,
              name: formState.name.trim(),
              email: normalizedEmail,
              nidn: formState.nidn.trim(),
              fakultas: formState.fakultas.trim() || "-",
              prodi: formState.prodi.trim() || "-",
              status: formState.status,
              roleKeys: formState.roleKeys,
            }
          : item
      );
      persistUsers(nextUsers, "Data user berhasil diperbarui.");
    } else {
      const nextUser: ManagedUser = {
        id: createManagedUserId(users),
        name: formState.name.trim(),
        email: normalizedEmail,
        nidn: formState.nidn.trim(),
        fakultas: formState.fakultas.trim() || "-",
        prodi: formState.prodi.trim() || "-",
        status: formState.status,
        roleKeys: formState.roleKeys,
      };
      persistUsers([nextUser, ...users], "User baru berhasil ditambahkan.");
    }

    setEditorOpen(false);
  };

  const requestDeleteUsers = (ids: string[]) => {
    const affectedUsers = users.filter((item) => ids.includes(item.id));
    setConfirmModal({
      isOpen: true,
      title: ids.length > 1 ? "Hapus user terpilih?" : "Hapus user ini?",
      message:
        ids.length > 1
          ? `${affectedUsers.length} user akan dihapus dari mock React admin.`
          : `${affectedUsers[0]?.name ?? "User"} akan dihapus dari mock React admin.`,
      variant: "danger",
      confirmLabel: ids.length > 1 ? "Hapus Semua" : "Hapus User",
      cancelLabel: "Batal",
      onConfirm: () => {
        const nextUsers = users.filter((item) => !ids.includes(item.id));
        persistUsers(nextUsers, ids.length > 1 ? "User terpilih berhasil dihapus." : "User berhasil dihapus.");
        setSelectedIds((previous) => previous.filter((id) => !ids.includes(id)));
      },
    });
  };

  const renderSortButton = (field: SortField, label: string) => (
    <button
      type="button"
      onClick={() => handleSort(field)}
      className="flex w-full items-center justify-between gap-2 text-left"
    >
      <span>{label}</span>
      <ArrowDownUp className="h-3.5 w-3.5 text-slate-300" strokeWidth={2.5} />
    </button>
  );

  return (
    <PageWrapper
      title="User Management"
      subtitle="Bulk CRUD user dengan pola list, selectall, tambah, edit, dan hapus."
      breadcrumbs={[{ label: "Master Data" }, { label: "Users" }]}
      actions={
        !isReadOnly ? (
          <>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white transition-colors hover:bg-[#c00510]"
              style={{ fontWeight: 600 }}
            >
              <UserPlus className="h-4 w-4" />
              Tambah User
            </button>
            <button
              type="button"
              onClick={() => requestDeleteUsers(selectedIds)}
              disabled={!selectedIds.length}
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
              style={{ fontWeight: 600 }}
            >
              <Trash2 className="h-4 w-4" />
              Hapus ({selectedIds.length})
            </button>
          </>
        ) : undefined
      }
    >
      {loading ? (
        <SkeletonTable rows={8} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <div className="grid gap-4 lg:grid-cols-[auto_1fr_auto] lg:items-center">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span>Show</span>
                <select
                  value={perPage}
                  onChange={(event) => {
                    setPerPage(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm outline-none transition-colors focus:border-[#E30613]"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span>entries</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Cari nama, email, role, fakultas, atau prodi..."
                    className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none transition-colors focus:border-[#E30613]"
                  />
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                  {selectedIds.length} dipilih
                </div>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                {sortedUsers.length} user tersedia
              </div>
            </div>

            {flashMessage ? (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {flashMessage}
              </div>
            ) : null}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="w-12 px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={paginatedUsers.length > 0 && paginatedUsers.every((item) => selectedIds.includes(item.id))}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-[#E30613] focus:ring-[#E30613]"
                    />
                  </th>
                  <th className="px-4 py-3 text-left" style={{ fontWeight: 600 }}>{renderSortButton("name", "Nama")}</th>
                  <th className="px-4 py-3 text-left" style={{ fontWeight: 600 }}>{renderSortButton("email", "Email")}</th>
                  <th className="px-4 py-3 text-left" style={{ fontWeight: 600 }}>{renderSortButton("roles", "Role")}</th>
                  <th className="px-4 py-3 text-left" style={{ fontWeight: 600 }}>{renderSortButton("fakultas", "Fakultas / Prodi")}</th>
                  <th className="px-4 py-3 text-left" style={{ fontWeight: 600 }}>Status</th>
                  <th className="px-4 py-3 text-left" style={{ fontWeight: 600 }}>Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedUsers.length ? (
                  paginatedUsers.map((managedUser) => (
                    <tr key={managedUser.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(managedUser.id)}
                          onChange={() => toggleSelect(managedUser.id)}
                          className="rounded border-slate-300 text-[#E30613] focus:ring-[#E30613]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-slate-900" style={{ fontWeight: 600 }}>{managedUser.name}</p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {managedUser.id}
                            {managedUser.nidn ? ` • ${managedUser.nidn}` : ""}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">{managedUser.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {managedUser.roleKeys.map((roleKey) => (
                            <span
                              key={roleKey}
                              className="rounded-full bg-red-50 px-2.5 py-1 text-xs text-[#E30613]"
                              style={{ fontWeight: 600 }}
                            >
                              {getRoleLabel(roleDefinitions, roleKey)}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p>{managedUser.fakultas || "-"}</p>
                        <p className="mt-0.5 text-xs text-slate-400">{managedUser.prodi || "-"}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ${managedUser.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                          style={{ fontWeight: 600 }}
                        >
                          {managedUser.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-[#0d6efd]">
                          <Link
                            to={`/admin/users/${managedUser.id}`}
                            className="rounded-md p-2 transition-colors hover:bg-blue-50 hover:text-[#0b5ed7]"
                            title="Role detail"
                          >
                            <IdCard className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/admin/users/${managedUser.id}`}
                            className="rounded-md p-2 transition-colors hover:bg-blue-50 hover:text-[#0b5ed7]"
                            title="Profile detail"
                          >
                            <Search className="h-4 w-4" />
                          </Link>
                          {!isReadOnly ? (
                            <>
                              <button
                                type="button"
                                onClick={() => openEditModal(managedUser)}
                                className="rounded-md p-2 transition-colors hover:bg-amber-50 hover:text-amber-600"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => requestDeleteUsers([managedUser.id])}
                                className="rounded-md p-2 transition-colors hover:bg-red-50 hover:text-red-600"
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">
                      Tidak ada user yang cocok dengan pencarian saat ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Showing {sortedUsers.length === 0 ? 0 : (currentPage - 1) * perPage + 1} to{" "}
              {Math.min(currentPage * perPage, sortedUsers.length)} of {sortedUsers.length} entries
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-200 px-3 py-2 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`h-9 min-w-9 rounded-lg border px-3 text-sm transition-colors ${currentPage === page ? "border-[#E30613] bg-[#E30613] text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-200 px-3 py-2 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      <UserEditorModal
        isOpen={editorOpen}
        mode={editorMode}
        form={formState}
        roleDefinitions={roleDefinitions}
        onChange={setFormState}
        onClose={() => setEditorOpen(false)}
        onSubmit={handleSaveUser}
      />

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        confirmLabel={confirmModal.confirmLabel}
        cancelLabel={confirmModal.cancelLabel}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal((previous) => ({ ...previous, isOpen: false }))}
      />
    </PageWrapper>
  );
}
