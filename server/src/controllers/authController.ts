import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // 1. Cari user berdasarkan email menggunakan Prisma
            // findFirst digunakan karena email biasanya unik
            const user = await prisma.users.findFirst({
                where: { email: email },
                select: {
                    id: true,
                    nama: true,
                    nidn: true,
                    email: true,
                    password: true
                }
            });

            // 2. Jika user tidak ditemukan
            if (!user) {
                return res.status(401).json({ 
                    status: 'error', 
                    message: 'Email atau password salah' 
                });
            }

            // 3. Cek password
            if (user.password !== password) {
                return res.status(401).json({ 
                    status: 'error', 
                    message: 'Email atau password salah' 
                });
            }
            
            // 4. Response sukses
            return res.status(200).json({
                status: 'success',
                message: 'Login berhasil',
                data: {
                    id: user.id,
                    nama: user.nama,
                    email: user.email,
                    nidn: user.nidn
                }
            });

        } catch (error: any) {
            console.error("Error saat login:", error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Terjadi kesalahan pada server' 
            });
        }
    }
}