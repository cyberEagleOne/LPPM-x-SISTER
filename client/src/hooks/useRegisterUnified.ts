import { useState } from "react";
import { useNavigate } from "react-router";
import { registerApi } from "../api/authApi";

export const useRegisterUnified = () => {
  const [nidn, setNidn] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const passwordStrength =
    password.length === 0
      ? null
      : password.length < 6
        ? "weak"
        : password.length < 10
          ? "medium"
          : "strong";

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!nidn.trim()) nextErrors.nidn = "NIDN wajib diisi.";
    if (!email.trim()) nextErrors.email = "Email wajib diisi.";
    else if (!isValidEmail) nextErrors.email = "Format email tidak valid.";
    if (password.length < 8) nextErrors.password = "Password minimal 8 karakter.";
    if (password !== confirmation) nextErrors.confirmation = "Konfirmasi password tidak cocok.";
    return nextErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    
    try {
      await registerApi({ nidn, email, password, password_confirmation: confirmation });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch(err) {
      console.error(err);
    }
  };

  return {
    nidn, setNidn,
    email, setEmail,
    password, setPassword,
    confirmation, setConfirmation,
    showPassword, setShowPassword,
    showConfirm, setShowConfirm,
    errors, success,
    isValidEmail, passwordStrength,
    handleSubmit
  };
};
