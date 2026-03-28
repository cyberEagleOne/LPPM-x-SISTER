import { useMemo } from "react";
import { Shield, Mail, User, Settings, ClipboardList } from "lucide-react";
import { motion } from "motion/react";

export function AdminProfile() {
  const info = useMemo(
    () => ({
      name: "Admin LPPM",
      subtitle: "Super Administrator",
      email: "admin@lppm.pradita.ac.id",
      scope: [
        "Manajemen pengguna (assign role)",
        "Manajemen artikel (buat/edit/hapus)",
        "Monitoring sistem (demo)",
      ],
    }),
    []
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-gray-900">Profil Admin</h1>
        <p className="text-gray-500 mt-0.5" style={{ fontSize: 14 }}>
          Informasi akun dan cakupan akses
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="h-28" style={{ background: "linear-gradient(135deg, #7c2d12 0%, #b45309 100%)" }} />
        <div className="px-8 pb-8 -mt-10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div
                className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-white"
                style={{ backgroundColor: "#7c2d12", fontSize: 24, fontWeight: 900 }}
              >
                AL
              </div>
              <div>
                <h2 className="text-gray-900">{info.name}</h2>
                <p className="text-gray-500 mt-1" style={{ fontSize: 14 }}>
                  {info.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-100 text-red-700 border border-red-200" style={{ fontSize: 12, fontWeight: 800 }}>
                <Shield size={14} /> Admin
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200" style={{ fontSize: 12, fontWeight: 800 }}>
                <Settings size={14} /> Akses Penuh (Demo)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-gray-400" style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Kontak
              </p>
              <p className="text-gray-900 mt-2 flex items-center gap-2" style={{ fontSize: 14, fontWeight: 800 }}>
                <Mail size={14} className="text-gray-400" /> {info.email}
              </p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 lg:col-span-2">
              <p className="text-gray-400" style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Cakupan Akses
              </p>
              <ul className="mt-2 space-y-2">
                {info.scope.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-gray-700" style={{ fontSize: 14 }}>
                    <ClipboardList size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <p className="text-gray-400" style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Catatan
          </p>
          <p className="text-gray-700 mt-2" style={{ fontSize: 14, lineHeight: 1.8 }}>
            Halaman ini adalah placeholder profil admin. Jika Anda ingin, kita bisa tambah pengaturan akun, audit log,
            dan manajemen hak akses yang lebih realistis.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.06 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <p className="text-gray-400" style={{ fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Identitas
          </p>
          <p className="text-gray-900 mt-2 flex items-center gap-2" style={{ fontSize: 14, fontWeight: 800 }}>
            <User size={15} className="text-gray-400" /> {info.name}
          </p>
          <p className="text-gray-500 mt-1" style={{ fontSize: 13 }}>
            {info.subtitle}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

