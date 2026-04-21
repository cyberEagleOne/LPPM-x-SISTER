import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth, UserRole } from "../context/AuthContext";
import { getDefaultAdminLanding } from "../config/roleTemplates";
import { loginApi } from "../api/authApi";

/**
 * LOGIC LAYER: Custom Hook useLogin
 * Memisahkan semua logika form, state loading/error, dan logic pemanggilan service
 * supaya file UI murni hanya JSX.
 */
export const useLogin = () => {
  const [showManual, setShowManual] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  // Karena struktur folder berubah, perhatikan scope useAuth
  const { login } = useAuth(); 

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Fungsi dipanggil untuk bypass (Demo Only)
  const handleDemoLogin = (role: UserRole) => {
    login(role);
    navigate(getDefaultAdminLanding(role));
  };

  // Fungsi dipanggil saat tombol form login sesungguhnya di-klik
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Memanggil Data Layer
      const data = await loginApi(email, password);
      
      // 2. Mengeksekusi perubahan State
      login(data.role);
      
      // 3. Navigasi
      navigate(getDefaultAdminLanding(data.role));
    } catch (err: any) {
      setError(err.message || "Gagap login. Periksa email / password");
    } finally {
      setLoading(false);
    }
  };

  return {
    // States
    showManual, setShowManual,
    showPassword, setShowPassword,
    email, setEmail,
    password, setPassword,
    loading, error, isValidEmail,

    // Actions
    handleDemoLogin,
    handleManualSubmit
  };
};
