import { createContext, useContext, useState, type ReactNode } from "react";

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
  administrator: { id: "1", name: "Raka Pratama", email: "raka.pratama@pradita.ac.id", role: "administrator" },
  dosen: { id: "3", name: "Dr. Arif Ramadhan, M.Sc.", email: "arif.ramadhan@pradita.ac.id", role: "dosen", nidn: "0312098901", fakultas: "Fakultas Teknologi", prodi: "Teknik Informatika" },
  reviewer: { id: "4", name: "Prof. Dimas Prakoso", email: "dimas.prakoso@pradita.ac.id", role: "reviewer" },
  "halaman-umum": { id: "14", name: "Aulia Rahman", email: "aulia.rahman@pradita.ac.id", role: "halaman-umum" },
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => setUser(MOCK_USERS[role]);
  const logout = () => setUser(null);

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
