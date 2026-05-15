import { Request, Response } from 'express';
import { prisma } from '../config/database';

export class SdmController {
    static async getSemuaSdm(req: Request, res: Response) {
        try {
            const rows = await prisma.users.findMany({
                select: {
                    id: true,
                    nama: true,
                    nidn: true,
                    email: true
                }
            });

            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil data dosen',
                data: rows
            });
        } catch (error: any) {
            console.error("Error getSemuaSdm:", error);
            return res.status(500).json({ status: 'error', message: 'Gagal mengambil data dari database' });
        }
    }
}