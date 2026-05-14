// server/src/config/database.ts
import { PrismaClient } from '@prisma/client';

// Inisialisasi satu instance PrismaClient agar bisa dipakai di seluruh aplikasi
export const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Berhasil terhubung ke Database melalui Prisma!");
  } catch (error) {
    console.error("Gagal terhubung ke Database:", error);
    process.exit(1);
  }
};