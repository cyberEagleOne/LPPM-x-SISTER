import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, KeyRound, Save, Shield, User } from "lucide-react";
import { Link, useParams } from "react-router";
import { ConfirmModal } from "../components/ConfirmModal";
import { PageWrapper } from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";
import {
  buildDefaultProfileFromUser,
  getManagedRoles,
  getManagedUsers,
  saveManagedUsers,
  type ManagedRoleDefinition,
  type ManagedRoleKey,
  type ManagedUser,
  type ManagedUserProfile,
} from "../data/superAdminAdministrationStore";

type DetailTab = "account" | "profile";

interface PasswordFormState {
  newPassword: string;
  confirmPassword: string;
}

function profileToText(values: string[] | undefined) {
  return values?.join(", ") ?? "";
}

function textToProfileList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function UserDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>(() => getManagedUsers());
  const [roles] = useState<ManagedRoleDefinition[]>(() => getManagedRoles());
  const [activeTab, setActiveTab] = useState<DetailTab>("account");
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({ newPassword: "", confirmPassword: "" });
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const currentUser = useMemo(() => {
    return users.find((item) => item.id === id) ?? users[0] ?? null;
  }, [id, users]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nidn, setNidn] = useState("");
  const [status, setStatus] = useState<ManagedUser["status"]>("active");
  const [roleKeys, setRoleKeys] = useState<ManagedRoleKey[]>([]);
  const [profile, setProfile] = useState<ManagedUserProfile>(buildDefaultProfileFromUser(getManagedUsers()[0] ?? {
    id: "",
    name: "",
    email: "",
    roleKeys: [],
    fakultas: "",
    status: "active",
  }));

  useEffect(() => {
    if (!currentUser) return;
    setName(currentUser.name);
    setEmail(currentUser.email);
    setNidn(currentUser.nidn ?? "");
    setStatus(currentUser.status);
    setRoleKeys(currentUser.roleKeys);
    setProfile(currentUser.profile ?? buildDefaultProfileFromUser(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (!flashMessage) return undefined;
    const timer = window.setTimeout(() => setFlashMessage(null), 2400);
    return () => window.clearTimeout(timer);
  }, [flashMessage]);

  if (!currentUser) {
    return (
      <PageWrapper title="Detail User" breadcrumbs={[{ label: "Master Data" }, { label: "Users", path: "/admin/users" }, { label: "Detail User" }]}>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          User tidak ditemukan.
        </div>
      </PageWrapper>
    );
  }

  const displayRoleLabels = roleKeys.map((roleKey) => roles.find((role) => role.key === roleKey)?.label ?? roleKey);

  const persistCurrentUser = (nextUser: ManagedUser, message: string) => {
    const nextUsers = users.map((item) => (item.id === nextUser.id ? nextUser : item));
    setUsers(nextUsers);
    saveManagedUsers(nextUsers);
    setFlashMessage(message);
  };

  const handleRoleToggle = (roleKey: ManagedRoleKey) => {
    setRoleKeys((previous) =>
      previous.includes(roleKey) ? previous.filter((item) => item !== roleKey) : [...previous, roleKey]
    );
  };

  const handleSaveAccount = () => {
    persistCurrentUser(
      {
        ...currentUser,
        name: name.trim() || currentUser.name,
        email: email.trim() || currentUser.email,
        nidn: nidn.trim(),
        status,
        roleKeys: roleKeys.length ? roleKeys : currentUser.roleKeys,
        profile: {
          ...profile,
          namaDepan: (profile.namaDepan ?? name).trim() || name.trim(),
          namaBelakang: (profile.namaBelakang ?? "").trim(),
        },
      },
      "Akun dan role user berhasil diperbarui.",
    );
  };

  const handleSaveProfile = () => {
    persistCurrentUser(
      {
        ...currentUser,
        name: `${profile.namaDepan ?? ""} ${profile.namaBelakang ?? ""}`.trim() || name.trim() || currentUser.name,
        profile,
      },
      "Profil user berhasil diperbarui.",
    );
  };

  const handlePasswordSubmit = () => {
    if (passwordForm.newPassword.length < 8 || passwordForm.newPassword !== passwordForm.confirmPassword) {
      setConfirmModalOpen(true);
      return;
    }
    setShowPasswordModal(false);
    setPasswordForm({ newPassword: "", confirmPassword: "" });
    setFlashMessage("Password mock berhasil diubah.");
  };

  return (
    <PageWrapper
      title="Detail User"
      subtitle="Editor role dan profil user yang terhubung ke mock store React baru."
      breadcrumbs={[{ label: "Master Data" }, { label: "Users", path: "/admin/users" }, { label: currentUser.name }]}
    >
      {flashMessage ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {flashMessage}
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-slate-700 text-3xl text-white">
            {(profile.fotoUrl || "").trim() ? (
              <img src={profile.fotoUrl ?? ""} alt={currentUser.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              <span>{(name || currentUser.name).trim().charAt(0).toUpperCase()}</span>
            )}
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-lg text-slate-900" style={{ fontWeight: 600 }}>
              {name || currentUser.name}
            </h2>
            <p className="mt-1 text-sm text-slate-500">{email || currentUser.email}</p>
          </div>

          <div className="mt-5 space-y-2">
            {displayRoleLabels.map((label) => (
              <div key={label} className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[#E30613]">
                {label}
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <p>ID: {currentUser.id}</p>
            <p className="mt-1">Status: {status === "active" ? "Active" : "Inactive"}</p>
            <p className="mt-1">NIDN: {nidn || "-"}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 px-5 py-4">
            <button
              type="button"
              onClick={() => setActiveTab("account")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors ${activeTab === "account" ? "bg-[#E30613] text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <Shield className="h-4 w-4" />
              Account
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors ${activeTab === "profile" ? "bg-[#E30613] text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <User className="h-4 w-4" />
              Profile
            </button>
          </div>

          {activeTab === "account" ? (
            <div className="space-y-5 px-5 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Nama Lengkap</label>
                  <input value={name} onChange={(event) => setName(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Email</label>
                  <input value={email} onChange={(event) => setEmail(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>NIDN / ID</label>
                  <input value={nidn} onChange={(event) => setNidn(event.target.value)} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Status</label>
                  <select value={status} onChange={(event) => setStatus(event.target.value as ManagedUser["status"])} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm text-slate-700" style={{ fontWeight: 600 }}>Role User</p>
                <div className="grid gap-2 md:grid-cols-2">
                  {roles.map((role) => (
                    <label key={role.key} className="flex items-start gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
                      <input
                        type="checkbox"
                        checked={roleKeys.includes(role.key)}
                        onChange={() => handleRoleToggle(role.key)}
                        className="mt-1 rounded border-slate-300 text-[#E30613] focus:ring-[#E30613]"
                      />
                      <span>
                        <span className="block text-sm text-slate-800" style={{ fontWeight: 600 }}>{role.label}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">{role.description}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-black"
                >
                  <KeyRound className="h-4 w-4" />
                  Ganti Password
                </button>
                <button
                  type="button"
                  onClick={handleSaveAccount}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]"
                >
                  <Save className="h-4 w-4" />
                  Update
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 px-5 py-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Nama Depan</label>
                  <input value={profile.namaDepan ?? ""} onChange={(event) => setProfile({ ...profile, namaDepan: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Nama Belakang</label>
                  <input value={profile.namaBelakang ?? ""} onChange={(event) => setProfile({ ...profile, namaBelakang: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>No. Telp</label>
                  <input value={profile.noTelp ?? ""} onChange={(event) => setProfile({ ...profile, noTelp: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Tanggal Lahir</label>
                  <input type="datetime-local" value={profile.tanggalLahir ?? ""} onChange={(event) => setProfile({ ...profile, tanggalLahir: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Sinta URL</label>
                  <input value={profile.sintaUrl ?? ""} onChange={(event) => setProfile({ ...profile, sintaUrl: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Google Scholar URL</label>
                  <input value={profile.gscholarUrl ?? ""} onChange={(event) => setProfile({ ...profile, gscholarUrl: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>About Me</label>
                <textarea rows={4} value={profile.aboutMe ?? ""} onChange={(event) => setProfile({ ...profile, aboutMe: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Bidang Penelitian</label>
                  <textarea rows={3} value={profileToText(profile.bidangPenelitian)} onChange={(event) => setProfile({ ...profile, bidangPenelitian: textToProfileList(event.target.value) })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" placeholder="Pisahkan dengan koma" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Bidang PKM</label>
                  <textarea rows={3} value={profileToText(profile.bidangPkm)} onChange={(event) => setProfile({ ...profile, bidangPkm: textToProfileList(event.target.value) })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#E30613]" placeholder="Pisahkan dengan koma" />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveProfile}
                className="inline-flex items-center gap-2 rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]"
              >
                <CheckCircle2 className="h-4 w-4" />
                Update Profile
              </button>
            </div>
          )}

          {user?.role === "administrator" ? (
            <div className="border-t border-slate-200 bg-slate-50 px-5 py-4">
              <Link to="/admin/users" className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {showPasswordModal ? (
        <div className="fixed inset-0 z-[220] flex items-center justify-center px-4" onClick={() => setShowPasswordModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-md rounded-xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-lg text-slate-900" style={{ fontWeight: 600 }}>Ganti Password</h3>
              <p className="mt-1 text-sm text-slate-500">{currentUser.name} / {currentUser.email}</p>
            </div>
            <div className="space-y-4 px-5 py-5">
              <div>
                <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Password Baru</label>
                <input type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" placeholder="Minimal 8 karakter" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-slate-700" style={{ fontWeight: 600 }}>Konfirmasi Password</label>
                <input type="password" value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })} className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-[#E30613]" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
              <button type="button" onClick={() => setShowPasswordModal(false)} className="rounded-lg bg-white px-4 py-2 text-sm text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100">Batal</button>
              <button type="button" onClick={handlePasswordSubmit} className="rounded-lg bg-[#E30613] px-4 py-2 text-sm text-white hover:bg-[#c00510]">Simpan</button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmModal
        isOpen={confirmModalOpen}
        title="Password belum valid"
        message="Password minimal 8 karakter dan konfirmasi password harus sama."
        variant="warning"
        confirmLabel="Oke"
        cancelLabel="Tutup"
        onConfirm={() => undefined}
        onClose={() => setConfirmModalOpen(false)}
      />
    </PageWrapper>
  );
}
