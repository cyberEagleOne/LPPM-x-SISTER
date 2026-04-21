import { useEffect, useMemo, useState } from "react";
import { Edit, Grid3X3, Key, Plus, Save, Shield, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { ConfirmModal } from "../../components/admin/ConfirmModal";
import { PageWrapper } from "../../components/admin/PageWrapper";
import {
  getManagedPermissions,
  getManagedRoles,
  getManagedUsers,
  saveManagedPermissions,
  saveManagedRoles,
  saveManagedUsers,
  saveRolePermissionMatrix,
  syncRolePermissionMatrix,
  type ManagedPermissionDefinition,
  type ManagedRoleDefinition,
  type ManagedRoleKey,
  type ManagedRoleTemplate,
  type RolePermissionMatrix,
  getRolePermissionMatrix,
} from "../../data/admin/superAdminAdministrationStore";

type TabType = "roles" | "permissions" | "matrix";

interface ConfirmState {
  isOpen: boolean;
  title: string;
  message: string;
  variant: "danger" | "warning" | "success" | "info";
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
}

interface RoleFormState {
  key: string;
  label: string;
  description: string;
  template: ManagedRoleTemplate;
}

interface PermissionFormState {
  id: string;
  module: string;
  action: string;
  description: string;
}

const TAB_META: Record<TabType, { label: string; icon: typeof Shield; path: string }> = {
  roles: { label: "Roles", icon: Shield, path: "/admin/roles" },
  permissions: { label: "Permissions", icon: Key, path: "/admin/permissions" },
  matrix: { label: "Role-Permission Matrix", icon: Grid3X3, path: "/admin/role-matrix" },
};

const EMPTY_ROLE_FORM: RoleFormState = {
  key: "",
  label: "",
  description: "",
  template: "administrator",
};

const EMPTY_PERMISSION_FORM: PermissionFormState = {
  id: "",
  module: "",
  action: "",
  description: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makePermissionId(moduleName: string, actionName: string) {
  return `${slugify(moduleName).replace(/-/g, ".")}.${slugify(actionName).replace(/-/g, ".")}`;
}

function RoleModal({
  isOpen,
  form,
  mode,
  onChange,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  form: RoleFormState;
  mode: "create" | "edit";
  onChange: (next: RoleFormState) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg text-slate-900" style={{ fontWeight: 600 }}>
            {mode === "create" ? "Tambah Role" : "Edit Role"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Mengikuti pattern role management dari blueprint administrasi super admin.
          </p>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>
              Nama Role
            </label>
            <input
              type="text"
              value={form.label}
              onChange={(event) =>
                onChange({
                  ...form,
                  label: event.target.value,
                  key: mode === "create" ? slugify(event.target.value) : form.key,
                })
              }
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors focus:border-[#E30613]"
              placeholder="Contoh: Operator Konten"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>
                Key / Slug
              </label>
              <input
                type="text"
                value={form.key}
                onChange={(event) => onChange({ ...form, key: slugify(event.target.value) })}
                disabled={mode === "edit"}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors focus:border-[#E30613] disabled:bg-slate-100 disabled:text-slate-400"
                placeholder="operator-konten"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>
                Template
              </label>
              <select
                value={form.template}
                onChange={(event) => onChange({ ...form, template: event.target.value as ManagedRoleTemplate })}
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors focus:border-[#E30613]"
              >
                <option value="administrator">Administrator</option>
                <option value="dosen">Dosen</option>
                <option value="reviewer">Reviewer</option>
                <option value="halaman-umum">Halaman Umum</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>
              Deskripsi
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => onChange({ ...form, description: event.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#E30613]"
              placeholder="Ringkas fungsi role ini di sistem."
            />
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
            {mode === "create" ? "Simpan Role" : "Update Role"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PermissionModal({
  isOpen,
  form,
  mode,
  onChange,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  form: PermissionFormState;
  mode: "create" | "edit";
  onChange: (next: PermissionFormState) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="text-lg text-slate-900" style={{ fontWeight: 600 }}>
            {mode === "create" ? "Tambah Permission" : "Edit Permission"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Module, action, dan deskripsi akan dipakai di matrix role-permission.
          </p>
        </div>

        <div className="space-y-4 px-5 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>
                Module
              </label>
              <input
                type="text"
                value={form.module}
                onChange={(event) =>
                  onChange({
                    ...form,
                    module: event.target.value,
                    id: mode === "create" ? makePermissionId(event.target.value, form.action) : form.id,
                  })
                }
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors focus:border-[#E30613]"
                placeholder="Users"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>
                Action
              </label>
              <input
                type="text"
                value={form.action}
                onChange={(event) =>
                  onChange({
                    ...form,
                    action: event.target.value,
                    id: mode === "create" ? makePermissionId(form.module, event.target.value) : form.id,
                  })
                }
                className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-colors focus:border-[#E30613]"
                placeholder="Manage"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>
              Permission ID
            </label>
            <input
              type="text"
              value={form.id}
              disabled
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-500"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>
              Deskripsi
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => onChange({ ...form, description: event.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-colors focus:border-[#E30613]"
              placeholder="Ringkas fungsi permission ini."
            />
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
            {mode === "create" ? "Simpan Permission" : "Update Permission"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RolesPermissionsPage({ tab }: { tab: TabType }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>(tab);
  const [roles, setRoles] = useState<ManagedRoleDefinition[]>(() => getManagedRoles());
  const [permissions, setPermissions] = useState<ManagedPermissionDefinition[]>(() => getManagedPermissions());
  const [matrix, setMatrix] = useState<RolePermissionMatrix>(() => getRolePermissionMatrix());
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleModalMode, setRoleModalMode] = useState<"create" | "edit">("create");
  const [roleForm, setRoleForm] = useState<RoleFormState>(EMPTY_ROLE_FORM);
  const [permissionModalOpen, setPermissionModalOpen] = useState(false);
  const [permissionModalMode, setPermissionModalMode] = useState<"create" | "edit">("create");
  const [permissionForm, setPermissionForm] = useState<PermissionFormState>(EMPTY_PERMISSION_FORM);
  const [confirmModal, setConfirmModal] = useState<ConfirmState>({
    isOpen: false,
    title: "",
    message: "",
    variant: "danger",
    onConfirm: () => undefined,
  });

  useEffect(() => {
    setActiveTab(tab);
  }, [tab]);

  useEffect(() => {
    if (!flashMessage) return undefined;
    const timer = window.setTimeout(() => setFlashMessage(null), 2400);
    return () => window.clearTimeout(timer);
  }, [flashMessage]);

  const permissionUsage = useMemo(() => {
    return permissions.reduce((accumulator, permission) => {
      accumulator[permission.id] = roles.filter((role) => matrix[role.key]?.includes(permission.id)).length;
      return accumulator;
    }, {} as Record<string, number>);
  }, [matrix, permissions, roles]);

  const goToTab = (nextTab: TabType) => {
    setActiveTab(nextTab);
    navigate(TAB_META[nextTab].path);
  };

  const persistRoles = (nextRoles: ManagedRoleDefinition[], nextMatrix: RolePermissionMatrix, message?: string) => {
    setRoles(nextRoles);
    setMatrix(nextMatrix);
    saveManagedRoles(nextRoles);
    saveRolePermissionMatrix(nextMatrix);
    if (message) setFlashMessage(message);
  };

  const persistPermissions = (
    nextPermissions: ManagedPermissionDefinition[],
    nextMatrix: RolePermissionMatrix,
    message?: string,
  ) => {
    setPermissions(nextPermissions);
    setMatrix(nextMatrix);
    saveManagedPermissions(nextPermissions);
    saveRolePermissionMatrix(nextMatrix);
    if (message) setFlashMessage(message);
  };

  const openInfoModal = (title: string, message: string) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      variant: "info",
      confirmLabel: "Oke",
      cancelLabel: "Tutup",
      onConfirm: () => undefined,
    });
  };

  const openCreateRole = () => {
    setRoleModalMode("create");
    setRoleForm(EMPTY_ROLE_FORM);
    setRoleModalOpen(true);
  };

  const openEditRole = (role: ManagedRoleDefinition) => {
    setRoleModalMode("edit");
    setRoleForm({
      key: role.key,
      label: role.label,
      description: role.description,
      template: role.template,
    });
    setRoleModalOpen(true);
  };

  const saveRole = () => {
    if (!roleForm.label.trim() || !roleForm.key.trim()) {
      openInfoModal("Role belum lengkap", "Nama role dan key wajib diisi.");
      return;
    }

    if (roleModalMode === "create" && roles.some((role) => role.key === roleForm.key)) {
      openInfoModal("Key sudah dipakai", "Gunakan key role yang berbeda agar matrix tetap stabil.");
      return;
    }

    if (roleModalMode === "edit") {
      const nextRoles = roles.map((role) =>
        role.key === roleForm.key
          ? { ...role, label: roleForm.label.trim(), description: roleForm.description.trim(), template: roleForm.template }
          : role
      );
      persistRoles(nextRoles, syncRolePermissionMatrix(matrix, nextRoles, permissions), "Role berhasil diperbarui.");
    } else {
      const nextRoles = [
        ...roles,
        {
          key: roleForm.key,
          label: roleForm.label.trim(),
          slug: roleForm.key,
          description: roleForm.description.trim() || "Role tambahan hasil migrasi React.",
          template: roleForm.template,
          system: false,
        },
      ];
      persistRoles(nextRoles, syncRolePermissionMatrix(matrix, nextRoles, permissions), "Role baru berhasil ditambahkan.");
    }

    setRoleModalOpen(false);
  };

  const requestDeleteRole = (role: ManagedRoleDefinition) => {
    if (role.system) {
      openInfoModal("Role sistem tidak dihapus", "Role bawaan blueprint dibiarkan tetap ada agar shell admin tidak rusak.");
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: "Hapus role ini?",
      message: `${role.label} akan dihapus dari daftar role dan dilepas dari user yang memakainya.`,
      variant: "danger",
      confirmLabel: "Hapus Role",
      cancelLabel: "Batal",
      onConfirm: () => {
        const nextRoles = roles.filter((item) => item.key !== role.key);
        const nextMatrix = syncRolePermissionMatrix(matrix, nextRoles, permissions);
        const nextUsers = getManagedUsers().map((user) => ({
          ...user,
          roleKeys: user.roleKeys.filter((roleKey) => roleKey !== role.key),
        }));
        saveManagedUsers(nextUsers);
        persistRoles(nextRoles, nextMatrix, "Role berhasil dihapus.");
      },
    });
  };

  const openCreatePermission = () => {
    setPermissionModalMode("create");
    setPermissionForm(EMPTY_PERMISSION_FORM);
    setPermissionModalOpen(true);
  };

  const openEditPermission = (permission: ManagedPermissionDefinition) => {
    setPermissionModalMode("edit");
    setPermissionForm(permission);
    setPermissionModalOpen(true);
  };

  const savePermission = () => {
    if (!permissionForm.module.trim() || !permissionForm.action.trim() || !permissionForm.id.trim()) {
      openInfoModal("Permission belum lengkap", "Module dan action wajib diisi.");
      return;
    }

    if (permissionModalMode === "create" && permissions.some((permission) => permission.id === permissionForm.id)) {
      openInfoModal("Permission ID bentrok", "Gunakan kombinasi module/action yang berbeda.");
      return;
    }

    if (permissionModalMode === "edit") {
      const nextPermissions = permissions.map((permission) =>
        permission.id === permissionForm.id
          ? {
              ...permission,
              module: permissionForm.module.trim(),
              action: permissionForm.action.trim(),
              description: permissionForm.description.trim(),
            }
          : permission
      );
      persistPermissions(nextPermissions, syncRolePermissionMatrix(matrix, roles, nextPermissions), "Permission berhasil diperbarui.");
    } else {
      const nextPermissions = [
        ...permissions,
        {
          id: permissionForm.id,
          module: permissionForm.module.trim(),
          action: permissionForm.action.trim(),
          description: permissionForm.description.trim() || "Permission tambahan hasil migrasi React.",
        },
      ];
      persistPermissions(nextPermissions, syncRolePermissionMatrix(matrix, roles, nextPermissions), "Permission baru berhasil ditambahkan.");
    }

    setPermissionModalOpen(false);
  };

  const requestDeletePermission = (permission: ManagedPermissionDefinition) => {
    setConfirmModal({
      isOpen: true,
      title: "Hapus permission ini?",
      message: `${permission.id} akan dihapus dari daftar permission dan seluruh matrix role.`,
      variant: "danger",
      confirmLabel: "Hapus Permission",
      cancelLabel: "Batal",
      onConfirm: () => {
        const nextPermissions = permissions.filter((item) => item.id !== permission.id);
        persistPermissions(
          nextPermissions,
          syncRolePermissionMatrix(matrix, roles, nextPermissions),
          "Permission berhasil dihapus.",
        );
      },
    });
  };

  const toggleMatrixCell = (roleKey: ManagedRoleKey, permissionId: string) => {
    setMatrix((previous) => {
      const currentPermissions = previous[roleKey] ?? [];
      const nextPermissions = currentPermissions.includes(permissionId)
        ? currentPermissions.filter((item) => item !== permissionId)
        : [...currentPermissions, permissionId];
      return { ...previous, [roleKey]: nextPermissions };
    });
  };

  const handleSaveMatrix = () => {
    const nextMatrix = syncRolePermissionMatrix(matrix, roles, permissions);
    setMatrix(nextMatrix);
    saveRolePermissionMatrix(nextMatrix);
    setFlashMessage("Matrix role-permission berhasil disimpan.");
  };

  return (
    <PageWrapper
      title={TAB_META[activeTab].label}
      subtitle="Kelola role, permission, dan matrix akses berdasarkan blueprint administrasi super admin."
      breadcrumbs={[{ label: "Master Data" }, { label: TAB_META[activeTab].label }]}
      actions={
        activeTab === "roles" ? (
          <button
            type="button"
            onClick={openCreateRole}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white transition-colors hover:bg-[#c00510]"
            style={{ fontWeight: 600 }}
          >
            <Plus className="h-4 w-4" />
            Tambah Role
          </button>
        ) : activeTab === "permissions" ? (
          <button
            type="button"
            onClick={openCreatePermission}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white transition-colors hover:bg-[#c00510]"
            style={{ fontWeight: 600 }}
          >
            <Plus className="h-4 w-4" />
            Tambah Permission
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSaveMatrix}
            className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white transition-colors hover:bg-[#c00510]"
            style={{ fontWeight: 600 }}
          >
            <Save className="h-4 w-4" />
            Update Role Permissions
          </button>
        )
      }
    >
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {(Object.keys(TAB_META) as TabType[]).map((tabKey) => {
          const Icon = TAB_META[tabKey].icon;
          const isActive = activeTab === tabKey;
          return (
            <button
              key={tabKey}
              type="button"
              onClick={() => goToTab(tabKey)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors ${isActive ? "bg-[#E30613] text-white" : "text-slate-600 hover:bg-slate-100"}`}
              style={{ fontWeight: isActive ? 600 : 500 }}
            >
              <Icon className="h-4 w-4" />
              {TAB_META[tabKey].label}
            </button>
          );
        })}
      </div>

      {flashMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {flashMessage}
        </div>
      ) : null}

      {activeTab === "roles" ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {roles.map((role) => (
            <div key={role.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                    {role.template}
                  </div>
                  <h3 className="mt-3 text-base text-slate-900" style={{ fontWeight: 600 }}>
                    {role.label}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">{role.key}</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditRole(role)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => requestDeleteRole(role)}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-600">{role.description}</p>

              <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3 text-sm">
                <div>
                  <p className="text-slate-400">Permissions</p>
                  <p className="mt-1 text-slate-900" style={{ fontWeight: 600 }}>
                    {(matrix[role.key] ?? []).length}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Mode</p>
                  <p className="mt-1 text-slate-900" style={{ fontWeight: 600 }}>
                    {role.system ? "System" : "Custom"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {activeTab === "permissions" ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-5 py-3 text-left" style={{ fontWeight: 600 }}>Permission ID</th>
                  <th className="px-5 py-3 text-left" style={{ fontWeight: 600 }}>Module</th>
                  <th className="px-5 py-3 text-left" style={{ fontWeight: 600 }}>Action</th>
                  <th className="px-5 py-3 text-left" style={{ fontWeight: 600 }}>Dipakai Role</th>
                  <th className="px-5 py-3 text-left" style={{ fontWeight: 600 }}>Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-slate-50/80">
                    <td className="px-5 py-3">
                      <p className="text-slate-900" style={{ fontWeight: 600 }}>{permission.id}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{permission.description}</p>
                    </td>
                    <td className="px-5 py-3">{permission.module}</td>
                    <td className="px-5 py-3">{permission.action}</td>
                    <td className="px-5 py-3">{permissionUsage[permission.id] ?? 0} role</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditPermission(permission)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDeletePermission(permission)}
                          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {activeTab === "matrix" ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4 text-sm text-slate-500">
            Centang kotak untuk memberi permission ke role. Simpan perubahan lewat tombol `Update Role Permissions`.
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="sticky left-0 z-10 min-w-[220px] bg-slate-50 px-4 py-3 text-left" style={{ fontWeight: 600 }}>
                    Permission
                  </th>
                  {roles.map((role) => (
                    <th key={role.key} className="min-w-[140px] px-3 py-3 text-center" style={{ fontWeight: 600 }}>
                      {role.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissions.map((permission) => (
                  <tr key={permission.id} className="hover:bg-slate-50/70">
                    <td className="sticky left-0 bg-white px-4 py-3">
                      <p className="text-slate-900" style={{ fontWeight: 600 }}>{permission.id}</p>
                      <p className="mt-0.5 text-xs text-slate-400">{permission.module} / {permission.action}</p>
                    </td>
                    {roles.map((role) => (
                      <td key={`${role.key}-${permission.id}`} className="px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={(matrix[role.key] ?? []).includes(permission.id)}
                          onChange={() => toggleMatrixCell(role.key, permission.id)}
                          className="h-4 w-4 rounded border-slate-300 text-[#E30613] focus:ring-[#E30613]"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <RoleModal
        isOpen={roleModalOpen}
        form={roleForm}
        mode={roleModalMode}
        onChange={setRoleForm}
        onClose={() => setRoleModalOpen(false)}
        onSubmit={saveRole}
      />

      <PermissionModal
        isOpen={permissionModalOpen}
        form={permissionForm}
        mode={permissionModalMode}
        onChange={setPermissionForm}
        onClose={() => setPermissionModalOpen(false)}
        onSubmit={savePermission}
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
