import { Request, Response } from "express";
import pool from "../config/database";

export class PublikasiController {
    static async getListPublikasi(req: Request, res: Response) {
        try {
            // /publikasi?dosen_id=...
            const dosen_id = req.query.dosen_id;

            if (!dosen_id || typeof dosen_id !== 'string') {
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'Parameter dosen_id diperlukan.' 
                });
            }
            const query = `SELECT dp.id, dp.judul, dp.quartile, dp.jenis_publikasi, dp.tanggal AS tanggalDibuat, dp.penerbit, dp.isbn, dp.tautan AS urlTautan, dp.keterangan, dp.nama_jurnal AS namaJurnal, dp.halaman, dp.edisi, dp.nomor, dp.doi AS urlDoi, dp.issn FROM detail_publikasi dp
JOIN publikasi p ON dp.id_publikasi = p.id
WHERE p.id_user = ?`;
            
            const [rows]: any = await pool.execute(query, [dosen_id]);

            if (rows.length === 0) {
                return res.status(200).json({ 
                    status: 'success', 
                    message: 'Dosen tidak memiliki data publikasi.',
                    data: [] 
                });
            }

            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil data publikasi dosen',
                data: rows
            });
        } catch (error: any) {
            console.error("Error getListPublikasi:", error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Gagal mengambil data dari database' 
            });
        }
    }
}