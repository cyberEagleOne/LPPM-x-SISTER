import { Request, Response } from 'express';
import pool from '../config/database'; //

export class AuthController {
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const query = `SELECT id, nama, nidn, email, password FROM users WHERE email = ?`;
            const [rows]: any = await pool.execute(query, [email]);

            if (rows.length === 0) {
                return res.status(404).json({ status: 'error', message: 'Email tidak ditemukan' });
            }

            const user = rows[0];

            if (user.password !== password) {
                return res.status(401).json({ status: 'error', message: 'Password salah' });
            }
            
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

        } catch (error) {
            console.error("Error saat login:", error);
            return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
        }
    }
}