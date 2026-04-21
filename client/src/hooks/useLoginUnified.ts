import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth, UserRole, User } from "../context/AuthContext";
import { getDefaultAdminLanding } from "../config/roleTemplates";
import { loginUnifiedApi } from "../api/authApi";

export const useLoginUnified = () => {
  const [showManual, setShowManual] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleDemoLogin = (role: UserRole) => {
    const dummyUser: User = {
      id: `demo-${role}-999`,
      name: `Akun Demo ${role}`,
      email: `demo.${role}@pradita.ac.id`,
      role: role,
    };

    login(dummyUser);
    navigate(getDefaultAdminLanding(role));
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const data = await loginUnifiedApi(email, password);
      
      const userDataAsli: User = {
        id: data.id.toString(),
        name: data.nama,
        email: data.email,
        nidn: data.nidn,
        role: "dosen" as UserRole
      };

      login(userDataAsli);
      navigate(getDefaultAdminLanding("dosen"));
      
    } catch (error: any) {
      console.error("Gagal terhubung ke server:", error);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    showManual, setShowManual,
    showPassword, setShowPassword,
    email, setEmail,
    password, setPassword,
    errorMessage, isLoading,
    isValidEmail,
    handleDemoLogin,
    handleManualSubmit
  };
};
