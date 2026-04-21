import { UserRole } from "../context/AuthContext";

/**
 * DATA LAYER: HTTP Request ke Backend
 * File ini didedikasikan untuk melakukan koneksi ke REST API/Graphql.
 * Komponen UI dan Hooks tidak boleh melalukan fetch langsung ke URL.
 */
export const loginApi = async (email: string, password?: string): Promise<{ role: UserRole, token: string }> => {
  // Simulasi HTTP request delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mockup default role kembali sebagai dosen jika login logic belum terhubung API asli
      resolve({ role: "dosen", token: "fake-jwt-token-123" });
    }, 800);
  });
};

export const loginUnifiedApi = async (email: string, password?: string): Promise<any> => {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  const dataJson = await response.json();

  if (!response.ok) {
    throw new Error(dataJson.message || "Terjadi kesalahan saat login");
  }

  return dataJson.data;
};

export const registerApi = async (data: Record<string, any>): Promise<any> => {
  // Simulasi API POST /api/register
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Register success", data });
    }, 1500);
  });
};
