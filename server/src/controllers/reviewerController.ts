import { Request, Response } from "express";
import pool from "../config/database";

export class ReviewerController {
    // --- Get List of Publications for Review ---
    static async getListPublikasiReview(req: Request, res: Response) {
        try {
            // We want to fetch all publications. In a real scenario, this might be filtered by reviewer role or period.
            const query = `
                SELECT 
                    dp.id, 
                    dp.judul, 
                    dp.tanggal, 
                    dp.status, 
                    dp.komentar,
                    dp.jenis_publikasi,
                    dp.nomor_paten,
                    (
                        SELECT pp.nama 
                        FROM publikasi_penulis pp 
                        WHERE pp.id_publikasi = p.id AND pp.urutan = 1 
                        LIMIT 1
                    ) AS dosen
                FROM publikasi p
                JOIN detail_publikasi dp ON p.id = dp.id
                ORDER BY dp.tanggal DESC
            `;
            
            const [rows]: any = await pool.execute(query);

            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil data review publikasi',
                data: rows
            });
        } catch (error: any) {
            console.error("Error getListPublikasiReview:", error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Gagal mengambil data dari database' 
            });
        }
    }

    // --- Update Review Status and Komentar ---
    static async updatePublikasiReview(req: Request, res: Response) {
        try {
            const idPublikasi = req.params.id; 
            const { status, komentar } = req.body;

            if (!status) {
                return res.status(400).json({ status: 'error', message: 'Status wajib diisi' });
            }

            const query = `
                UPDATE detail_publikasi 
                SET status = ?, komentar = ?
                WHERE id = ?
            `;
            
            const [result]: any = await pool.execute(query, [status, komentar || null, idPublikasi]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
            }

            return res.status(200).json({ status: 'success', message: 'Review berhasil disimpan' });
        } catch (error) {
            console.error("Error updatePublikasiReview:", error);
            return res.status(500).json({ status: 'error', message: 'Gagal menyimpan review' });
        }
    }
}
