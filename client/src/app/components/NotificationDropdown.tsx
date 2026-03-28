import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, Clock, XCircle, FileText, Users } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
}

const initialNotifications: Notification[] = [
  { id: 1, title: "Penelitian Baru Diajukan", message: "Dr. Siti Rahma mengajukan penelitian baru untuk di-review.", time: "5 menit lalu", read: false, type: "info" },
  { id: 2, title: "Penelitian Disetujui", message: "Penelitian 'Sistem Rekomendasi Beasiswa' telah disetujui.", time: "1 jam lalu", read: false, type: "success" },
  { id: 3, title: "Artikel Dipublikasikan", message: "Artikel 'Inovasi Riset Era Society 5.0' berhasil diterbitkan.", time: "3 jam lalu", read: true, type: "info" },
  { id: 4, title: "Penelitian Ditolak", message: "Penelitian 'Analisis Sentimen' ditolak karena data tidak valid.", time: "5 jam lalu", read: true, type: "error" },
  { id: 5, title: "Pengguna Baru Terdaftar", message: "Dr. Hendra Kurniawan ditambahkan sebagai Dosen.", time: "1 hari lalu", read: true, type: "info" },
];

const typeIcons = {
  info: <FileText size={14} className="text-blue-500" />,
  success: <CheckCheck size={14} className="text-green-500" />,
  warning: <Clock size={14} className="text-amber-500" />,
  error: <XCircle size={14} className="text-red-500" />,
};

const typeBg = {
  info: "bg-blue-50",
  success: "bg-green-50",
  warning: "bg-amber-50",
  error: "bg-red-50",
};

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="relative" ref={ref}>
      <button
        className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <Bell size={18} />
        <AnimatePresence>
          {unread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
              style={{ fontSize: 10, fontWeight: 700 }}
            >
              {unread}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
          >
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-gray-900" style={{ fontSize: 15, fontWeight: 700 }}>
                  Notifikasi
                </p>
                {unread > 0 && (
                  <p className="text-gray-400" style={{ fontSize: 12 }}>
                    {unread} belum dibaca
                  </p>
                )}
              </div>
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  style={{ fontSize: 12, fontWeight: 600 }}
                >
                  Tandai semua dibaca
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n, idx) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`px-5 py-3.5 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 ${
                    !n.read ? "bg-blue-50/40" : ""
                  }`}
                  onClick={() => markRead(n.id)}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${typeBg[n.type]}`}
                  >
                    {typeIcons[n.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`truncate ${!n.read ? "text-gray-900" : "text-gray-600"}`}
                        style={{ fontSize: 13, fontWeight: !n.read ? 600 : 500 }}
                      >
                        {n.title}
                      </p>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-gray-400 truncate" style={{ fontSize: 12 }}>
                      {n.message}
                    </p>
                    <p className="text-gray-400 mt-1" style={{ fontSize: 11 }}>
                      {n.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-gray-100 text-center">
              <button
                className="text-blue-600 hover:text-blue-800 transition-colors"
                style={{ fontSize: 13, fontWeight: 600 }}
                onClick={() => setOpen(false)}
              >
                Tutup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
