import { Request, Response } from "express";
// Pastikan path import ini disesuaikan dengan lokasi custom Prisma-mu
import { prisma } from "../config/database"; 

export class ReviewerController {
    // --- Get List of Publications for Review ---
    static async getListPublikasiReview(req: Request, res: Response) {
        try {
            const rawData = await prisma.publikasi.findMany({
                where: {
                    detail_publikasi: { isNot: null } 
                },
                select: {
                    id: true, 
                    detail_publikasi: {
                        select: {
                            judul: true,
                            tanggal: true,
                            status: true,
                            komentar: true,
                            jenis_publikasi: true,
                            nomor_paten: true,
                            
                            // PINDAHKAN KE SINI: Ambil penulis dari dalam detail_publikasi
                            publikasi_penulis: {
                                where: { urutan: 1 }, 
                                take: 1, 
                                select: { nama: true }
                            }
                        }
                    }
                },
                orderBy: {
                    detail_publikasi: { tanggal: 'desc' }
                }
            });

            // Mapping datanya juga harus disesuaikan jalurnya
            const formattedData = rawData.map((item: any) => ({
                id: item.id,
                judul: item.detail_publikasi?.judul,
                tanggal: item.detail_publikasi?.tanggal,
                status: item.detail_publikasi?.status,
                komentar: item.detail_publikasi?.komentar,
                jenis_publikasi: item.detail_publikasi?.jenis_publikasi,
                nomor_paten: item.detail_publikasi?.nomor_paten,
                
                // Sekarang jalurnya adalah: item -> detail_publikasi -> publikasi_penulis
                dosen: item.detail_publikasi?.publikasi_penulis?.[0]?.nama || null
            }));

            return res.status(200).json({
                status: 'success',
                message: 'Berhasil mengambil data review publikasi',
                data: formattedData
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
            // Beri type assertion as string agar Prisma tidak bingung dengan tipe dari params
            const idPublikasi = req.params.id as string; 
            const { status, komentar } = req.body;

            if (!status) {
                return res.status(400).json({ 
                    status: 'error', 
                    message: 'Status wajib diisi' 
                });
            }

            // Eksekusi Update menggunakan Prisma
            await prisma.detail_publikasi.update({
                where: { id: idPublikasi },
                data: {
                    status: status,
                    komentar: komentar || null
                }
            });

            return res.status(200).json({ 
                status: 'success', 
                message: 'Review berhasil disimpan' 
            });

        } catch (error: any) {
            // Prisma memiliki kode error spesifik 'P2025' jika record yang mau di-update tidak ditemukan (affectedRows === 0)
            if (error.code === 'P2025') {
                return res.status(404).json({ 
                    status: 'error', 
                    message: 'Data tidak ditemukan' 
                });
            }

            console.error("Error updatePublikasiReview:", error);
            return res.status(500).json({ 
                status: 'error', 
                message: 'Gagal menyimpan review' 
            });
        }
    }
}