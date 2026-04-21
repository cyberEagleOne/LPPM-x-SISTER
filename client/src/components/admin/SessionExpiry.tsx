import { useState, useEffect, useCallback } from "react";
import { Clock, LogIn } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 min demo
const WARNING_BEFORE = 5 * 60 * 1000; // warn 5 min before

export function SessionExpiry() {
  const { isAuthenticated, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [expired, setExpired] = useState(false);
  const [remaining, setRemaining] = useState(0);

  const resetTimer = useCallback(() => {
    setShowWarning(false);
    setExpired(false);
    window.__sessionExpiry = Date.now() + SESSION_TIMEOUT;
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    resetTimer();

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    const handleActivity = () => {
      if (!expired && !showWarning) {
        window.__sessionExpiry = Date.now() + SESSION_TIMEOUT;
      }
    };
    events.forEach((e) => window.addEventListener(e, handleActivity));

    const interval = setInterval(() => {
      const expiry = window.__sessionExpiry || Date.now() + SESSION_TIMEOUT;
      const timeLeft = expiry - Date.now();
      setRemaining(Math.max(0, Math.floor(timeLeft / 1000)));

      if (timeLeft <= 0) {
        setExpired(true);
        setShowWarning(false);
        logout();
      } else if (timeLeft <= WARNING_BEFORE && !expired) {
        setShowWarning(true);
      }
    }, 1000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, handleActivity));
      clearInterval(interval);
    };
  }, [isAuthenticated, expired, showWarning, logout, resetTimer]);

  if (!isAuthenticated && !expired) return null;

  // Session expired overlay
  if (expired) {
    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 backdrop-blur-sm" style={{ fontFamily: "Inter, sans-serif" }}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-md mx-4 p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center mx-auto mb-5">
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-xl text-slate-900 mb-2" style={{ fontWeight: 700 }}>Sesi Berakhir</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Sesi login Anda telah habis karena tidak ada aktivitas. Data yang belum tersimpan mungkin hilang. Silakan login kembali.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm text-white bg-[#E30613] rounded-xl hover:bg-[#c00510] transition-all"
            style={{ fontWeight: 600 }}
          >
            <LogIn className="w-4 h-4" /> Login Kembali
          </Link>
        </div>
      </div>
    );
  }

  // Warning banner
  if (showWarning) {
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    return (
      <div className="fixed top-0 left-0 right-0 z-[250] bg-amber-500 text-white px-4 py-2 flex items-center justify-center gap-3 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>
        <Clock className="w-4 h-4" />
        <span style={{ fontWeight: 500 }}>
          Sesi Anda akan berakhir dalam {mins}:{secs.toString().padStart(2, "0")}
        </span>
        <button onClick={resetTimer} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-md text-xs transition-colors" style={{ fontWeight: 600 }}>
          Perpanjang
        </button>
      </div>
    );
  }

  return null;
}

// Extend window for session timer
declare global {
  interface Window {
    __sessionExpiry?: number;
  }
}
