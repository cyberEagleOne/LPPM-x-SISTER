import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UserRole =
  | "administrator"
  | "dosen"
  | "reviewer"
  | "halaman-umum";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  nidn?: string;
  fakultas?: string;
  prodi?: string;
}

const MOCK_USERS: Record<UserRole, User> = {
  administrator: { id: "1", name: "Admin Demo", email: "admin@example.com", role: "administrator" },
  dosen: { id: "3", name: "Dr. Dosen Utama, M.Sc.", email: "dosen@example.com", role: "dosen", nidn: "0312098901", fakultas: "Fakultas Teknologi", prodi: "Teknik Informatika" },
  reviewer: { id: "4", name: "Prof. Reviewer Utama, Ph.D.", email: "reviewer@example.com", role: "reviewer" },
  "halaman-umum": { id: "14", name: "User Demo", email: "user@example.com", role: "halaman-umum" },
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user_data");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("user_data", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user_data");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  administrator: "Administrator",
  dosen: "Dosen",
  reviewer: "Reviewer",
  "halaman-umum": "Halaman Umum",
};

export const ALL_ROLES: UserRole[] = [
  "administrator",
  "dosen",
  "reviewer",
  "halaman-umum",
];
