export { RolesPermissionsPage } from "./RolesPermissionsModern";

import { useState } from "react";
import { Shield, Key, Grid3X3, CheckCircle, XCircle, Plus, Edit } from "lucide-react";
import { PageWrapper } from "../../components/admin/PageWrapper";
import { ALL_ROLES, ROLE_LABELS, type UserRole } from "../../context/AuthContext";
import { resolveRoleTemplate, type RoleTemplate } from "../../config/roleTemplates";

type TabType = "roles" | "permissions" | "matrix";

const PERMISSIONS = [
  { id: "hibah.view", module: "Hibah Internal", action: "View" },
  { id: "hibah.create", module: "Hibah Internal", action: "Create" },
  { id: "hibah.edit", module: "Hibah Internal", action: "Edit" },
  { id: "hibah.delete", module: "Hibah Internal", action: "Delete" },
  { id: "hibah.approve", module: "Hibah Internal", action: "Approve" },
  { id: "hibah.review", module: "Hibah Internal", action: "Review" },
  { id: "surat.view", module: "Surat Tugas", action: "View" },
  { id: "surat.create", module: "Surat Tugas", action: "Create" },
  { id: "surat.approve", module: "Surat Tugas", action: "Approve" },
  { id: "konf.view", module: "Konferensi", action: "View" },
  { id: "konf.create", module: "Konferensi", action: "Create" },
  { id: "pub.view", module: "Publikasi", action: "View" },
  { id: "pub.create", module: "Publikasi", action: "Create" },
  { id: "pub.approve", module: "Publikasi", action: "Approve" },
  { id: "users.manage", module: "User Management", action: "Manage" },
  { id: "settings.manage", module: "Settings", action: "Manage" },
  { id: "audit.view", module: "Audit Log", action: "View" },
  { id: "export.all", module: "Export Data", action: "Export" },
];

const TEMPLATE_ROLE_PERMISSIONS: Record<RoleTemplate, string[]> = {
  administrator: PERMISSIONS.map((p) => p.id),
  lppm: ["hibah.view", "hibah.create", "hibah.edit", "surat.view", "surat.create", "konf.view", "konf.create", "pub.view", "pub.create", "export.all"],
  dosen: ["hibah.view", "hibah.create", "hibah.edit", "surat.view", "surat.create", "konf.view", "konf.create", "pub.view", "pub.create"],
  reviewer: ["hibah.view", "hibah.review"],
  "reviewer-hibah": ["hibah.view", "hibah.review"],
  finance: ["hibah.view", "surat.view", "export.all"],
  "kordinator-publikasi": ["pub.view", "pub.create", "pub.approve"],
  "kordinator-riset": ["hibah.view", "hibah.create", "konf.view", "konf.create"],
  "ketua-lppm": ["hibah.view", "hibah.approve", "surat.view", "surat.approve", "konf.view", "pub.view", "pub.approve", "export.all"],
  "halaman-umum": [],
  hrd: ["surat.view"],
  terdaftar: [],
};

function getRolePermissions(role: UserRole): string[] {
  return TEMPLATE_ROLE_PERMISSIONS[resolveRoleTemplate(role)] || [];
}

function LegacyRolesPermissionsPage({ tab }: { tab: TabType }) {
  const [activeTab, setActiveTab] = useState<TabType>(tab);
  const displayRoles: UserRole[] = [
    "administrator",
    "halaman-admin",
    "lppm",
    "dosen",
    "halaman-dosen",
    "reviewer",
    "reviewer-hibah",
    "finance",
    "kordinator-publikasi",
    "kordinator-riset",
    "ketua-lppm",
    "halaman-umum",
    "hrd",
    "terdaftar",
  ];

  return (
    <PageWrapper
      title={activeTab === "roles" ? "Roles" : activeTab === "permissions" ? "Permissions" : "Role-Permission Matrix"}
      subtitle="Kelola role, permission, dan akses pengguna"
      breadcrumbs={[{ label: "Master Data" }, { label: activeTab === "roles" ? "Roles" : activeTab === "permissions" ? "Permissions" : "Matrix" }]}
      actions={
        activeTab !== "matrix" ? (
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-[#E30613] rounded-lg hover:bg-[#c00510] transition-all" style={{ fontWeight: 500 }}>
            <Plus className="w-4 h-4" /> Tambah {activeTab === "roles" ? "Role" : "Permission"}
          </button>
        ) : undefined
      }
    >
      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        {[
          { key: "roles" as const, icon: Shield, label: "Roles" },
          { key: "permissions" as const, icon: Key, label: "Permissions" },
          { key: "matrix" as const, icon: Grid3X3, label: "Matrix" },
        ].map((t) => (
          <button key={t.key} onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-all ${activeTab === t.key ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            style={{ fontWeight: activeTab === t.key ? 600 : 400 }}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {activeTab === "roles" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_ROLES.map((role) => (
            <div key={role} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-slate-600" />
                </div>
                <button className="p-1.5 text-slate-400 hover:text-amber-600 rounded-md transition-colors"><Edit className="w-4 h-4" /></button>
              </div>
              <h4 className="text-sm text-slate-800" style={{ fontWeight: 600 }}>{ROLE_LABELS[role]}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{getRolePermissions(role).length} permissions</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "permissions" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>Permission ID</th>
                  <th className="px-5 py-3 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>Module</th>
                  <th className="px-5 py-3 text-left text-xs text-slate-500" style={{ fontWeight: 600 }}>Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {PERMISSIONS.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 text-sm text-slate-700" style={{ fontWeight: 500 }}>{p.id}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{p.module}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{p.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "matrix" && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-3 text-left text-slate-500 sticky left-0 bg-white z-10 min-w-[140px]" style={{ fontWeight: 600 }}>Permission</th>
                  {displayRoles.map((r) => (
                    <th key={r} className="px-2 py-3 text-center text-slate-500 min-w-[80px]" style={{ fontWeight: 600 }}>
                      <span className="block truncate">{ROLE_LABELS[r].split(" ")[0]}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {PERMISSIONS.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2.5 text-slate-700 sticky left-0 bg-white whitespace-nowrap" style={{ fontWeight: 500 }}>{p.id}</td>
                    {displayRoles.map((r) => (
                    <td key={r} className="px-2 py-2.5 text-center">
                        {getRolePermissions(r).includes(p.id) ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="w-4 h-4 text-slate-200 mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
