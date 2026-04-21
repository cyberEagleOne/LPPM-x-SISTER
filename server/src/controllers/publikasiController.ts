import { Request, Response } from "express";
import pool from "../config/database";
import { v4 as uuidv4 } from "uuid";

export class PublikasiController {
    // --- Fungsi Lihat Data (GET) ---
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
            const query = `SELECT dp.id, dp.judul, dp.quartile, dp.jenis_publikasi, dp.tanggal, dp.penerbit, dp.isbn, dp.jumlah_halaman, dp.tautan, dp.keterangan, dp.nama_jurnal, dp.halaman, dp.edisi, dp.volume, dp.nomor, dp.doi, dp.issn, dp.status,
                (
                    SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id_penulis', pp.id_penulis,
                            'nama', pp.nama,
                            'jenis', pp.jenis,
                            'afiliasi', pp.afiliasi,
                            'urutan', pp.urutan,
                            'id_sdm', pp.id_sdm
                        )
                    )
                    FROM publikasi_penulis pp
                    WHERE pp.id_publikasi = p.id
                ) AS tim_penulis
            FROM publikasi p
            LEFT JOIN detail_publikasi dp ON p.id = dp.id
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
    // --- Fungsi Tambah Data (POST) ---
    static async createPublikasi(req: Request, res: Response) {
        const connection = await pool.getConnection(); 
        try {
            await connection.beginTransaction(); 

            const data = req.body;

            const sharedId = uuidv4(); 

            const queryHeader = `
                INSERT INTO publikasi (id, kategori_kegiatan, quartile, judul, jenis_publikasi, tanggal, id_user) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            await connection.execute(queryHeader, [
                sharedId, 
                data.kategori_kegiatan || "Test", 
                data.quartile,
                data.judul, 
                data.jenis_publikasi, 
                data.tanggal, 
                data.id_user
            ]);


            const queryDetail = `
                INSERT INTO detail_publikasi (
                    id, kategori_kegiatan, judul, jenis_publikasi, tanggal, id_kategori_kegiatan, id_jenis_publikasi, kategori_capaian_luaran,
                    penerbit, isbn, nama_jurnal, doi, issn, volume, nomor, halaman, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            await connection.execute(queryDetail, [
                sharedId,
                data.kategori_kegiatan || "Test",
                data.judul,
                data.jenis_publikasi,
                data.tanggal,
                data.id_kategori_kegiatan || 1,
                data.id_jenis_publikasi || 1,
                data.kategori_capaian_luaran || "Test",
                data.penerbit || null,
                data.isbn || null,
                data.nama_jurnal || null,
                data.urlDoi || null,
                data.issn || null,
                data.volume || null,
                data.nomor || null,
                data.halaman || null,
                data.status
            ]);

            

            await connection.commit(); 
            return res.status(201).json({ status: 'success', message: 'Data berhasil disimpan' });

        } catch (error: any) {
            await connection.rollback(); 
            console.error("Transaction Error:", error);
            return res.status(500).json({ status: 'error', message: 'Gagal memproses data' });
        } finally {
            connection.release(); 
        }
    }

    // --- Fungsi Update Data (PUT) ---
    static async updatePublikasi(req: Request, res: Response) {
        try {
            // /publikasi/:id
            const idPublikasi = req.params.id; 
            const data = req.body;
            const query = `
                UPDATE detail_publikasi SET 
                judul = ?, jenis_publikasi = ?, tanggal = ?, penerbit = ?, isbn = ?, tautan = ?, 
                keterangan = ?, nama_jurnal = ?, halaman = ?, edisi = ?, nomor = ?, doi = ?, issn = ?, quartile = ?
                WHERE id = ?
            `;
            const params = [
                data.judul, data.jenis_publikasi, data.tanggal, data.penerbit || null, data.isbn || null, data.urlTautan || null, 
                data.keterangan || null, data.namaJurnal || null, data.halaman || null, data.edisi || null, data.nomor || null, 
                data.urlDoi || null, data.issn || null, data.quartile || null, 
                idPublikasi 
            ];
            
            await pool.execute(query, params);

            if (data.status) {
                await pool.execute(
                    `UPDATE publikasi SET status = ? WHERE id = ?`, 
                    [data.status, idPublikasi] 
                );
            }

            

            return res.status(200).json({ status: 'success', message: 'Data berhasil diubah' });
        } catch (error) {
            console.error("Error Update Publikasi:", error);
            return res.status(500).json({ status: 'error', message: 'Gagal mengubah data' });
        }
    }
    // --- Fungsi Delete Data (DELETE) ---
    static async deletePublikasi(req: Request, res: Response) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const { id } = req.params;

            const [rows]: any = await connection.execute(
                'SELECT dp.status FROM publikasi p JOIN detail_publikasi dp ON p.id = dp.id WHERE p.id = ?', 
                [id]
            );

            if (rows.length === 0) {
                await connection.rollback();
                return res.status(404).json({ status: 'error', message: 'Data tidak ditemukan' });
            }

            if (rows[0].status?.toLowerCase() === 'approved') {
                await connection.rollback();
                return res.status(403).json({ 
                    status: 'error', 
                    message: 'Data yang sudah Approved tidak dapat dihapus.' 
                });
            }
            await connection.execute('DELETE FROM detail_publikasi WHERE id = ?', [id]);

            const [result]: any = await connection.execute('DELETE FROM publikasi WHERE id = ?', [id]);

            if (result.affectedRows === 0) {
                throw new Error("Gagal menghapus data utama");
            }

            await connection.commit();
            return res.json({ status: 'success', message: 'Publikasi berhasil dihapus' });

        } catch (error: any) {
            await connection.rollback();
            console.error("Delete Error:", error);
            return res.status(500).json({ status: 'error', message: 'Gagal menghapus data' });
        } finally {
            connection.release();
        }
    }
}