import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../config/database";

const toNumberOrNull = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const toDecimalOrNull = (value: unknown) => {
  if (value === "" || value === null || value === undefined) return null;
  return String(value);
};

const formatPenelitian = (item: any) => {
  const detail = item.detail_penelitian;

  return {
    id: item.id,
    judul: detail?.judul || item.judul,
    tahun_pelaksanaan: detail?.tahun_pelaksanaan ?? item.tahun_pelaksanaan,
    lama_kegiatan: detail?.lama_kegiatan ?? item.lama_kegiatan,
    id_users: item.id_users,
    tanggalDibuat: detail?.created_at || null,
    status: "approved",
    detail_penelitian: detail
      ? {
          ...detail,
          dana_dikti: detail.dana_dikti?.toString?.() ?? detail.dana_dikti,
          dana_perguruan_tinggi: detail.dana_perguruan_tinggi?.toString?.() ?? detail.dana_perguruan_tinggi,
          dana_institusi_lain: detail.dana_institusi_lain?.toString?.() ?? detail.dana_institusi_lain,
          anggota: (detail.anggota || []).map((anggota: any) => ({
            ...anggota,
            id: Number(anggota.id),
            aktif: anggota.aktif ? 1 : 0,
          })),
          mitra_litabmas: detail.mitra || [],
          dokumen: detail.dokumen || [],
        }
      : null,
  };
};

export class PenelitianController {
  static async getListPenelitian(req: Request, res: Response) {
    try {
      const dosen_id = req.query.dosen_id;

      if (!dosen_id || typeof dosen_id !== "string") {
        return res.status(400).json({
          status: "error",
          message: "Parameter dosen_id diperlukan.",
        });
      }

      const penelitian = await prisma.penelitian.findMany({
        where: { id_users: dosen_id },
        include: {
          detail_penelitian: {
            include: {
              anggota: true,
              mitra: true,
              dokumen: true,
            },
          },
        },
        orderBy: [{ tahun_pelaksanaan: "desc" }, { judul: "asc" }],
      });

      return res.status(200).json({
        status: "success",
        message: "Berhasil mengambil data penelitian dosen",
        data: penelitian.map(formatPenelitian),
      });
    } catch (error) {
      console.error("Error getListPenelitian:", error);
      return res.status(500).json({
        status: "error",
        message: "Gagal mengambil data penelitian dari database",
      });
    }
  }

  static async createPenelitian(req: Request, res: Response) {
    try {
      const data = req.body;
      const id = uuidv4();

      if (!data.id_users || !data.judul) {
        return res.status(400).json({
          status: "error",
          message: "id_users dan judul wajib diisi.",
        });
      }

      await prisma.$transaction(async (tx) => {
        await tx.penelitian.create({
          data: {
            id,
            judul: data.judul,
            tahun_pelaksanaan: toNumberOrNull(data.tahun_pelaksanaan),
            lama_kegiatan: toNumberOrNull(data.lama_kegiatan),
            id_users: data.id_users,
          },
        });

        await tx.detail_penelitian.create({
          data: {
            id,
            id_kategori_kegiatan: toNumberOrNull(data.id_kategori_kegiatan),
            judul: data.judul,
            id_afiliasi: data.id_afiliasi || null,
            afiliasi: data.afiliasi || null,
            id_kelompok_bidang: data.id_kelompok_bidang || null,
            kelompok_bidang: data.kelompok_bidang || null,
            id_litabmas_sebelumnya: data.id_litabmas_sebelumnya || null,
            litabmas_sebelumnya: data.litabmas_sebelumnya || null,
            id_jenis_skim: data.id_jenis_skim || null,
            jenis_skim: data.jenis_skim || null,
            lokasi: data.lokasi || null,
            tahun_usulan: toNumberOrNull(data.tahun_usulan),
            tahun_kegiatan: toNumberOrNull(data.tahun_kegiatan),
            tahun_pelaksanaan: toNumberOrNull(data.tahun_pelaksanaan),
            lama_kegiatan: toNumberOrNull(data.lama_kegiatan),
            tahun_pelaksanaan_ke: toNumberOrNull(data.tahun_pelaksanaan_ke),
            dana_dikti: toDecimalOrNull(data.dana_dikti),
            dana_perguruan_tinggi: toDecimalOrNull(data.dana_perguruan_tinggi),
            dana_institusi_lain: toDecimalOrNull(data.dana_institusi_lain),
            in_kind: data.in_kind || null,
            sk_penugasan: data.sk_penugasan || null,
            tanggal_sk_penugasan: data.tanggal_sk_penugasan || null,
            status: data.status || "draft",
          },
        });
      });

      return res.status(201).json({
        status: "success",
        message: "Data penelitian berhasil disimpan",
      });
    } catch (error) {
      console.error("Error createPenelitian:", error);
      return res.status(500).json({
        status: "error",
        message: "Gagal menyimpan data penelitian",
      });
    }
  }

  static async updatePenelitian(req: Request, res: Response) {
    try {
      const id = String(req.params.id);
      const data = req.body;

      await prisma.$transaction(async (tx) => {
        await tx.penelitian.update({
          where: { id },
          data: {
            judul: data.judul,
            tahun_pelaksanaan: toNumberOrNull(data.tahun_pelaksanaan),
            lama_kegiatan: toNumberOrNull(data.lama_kegiatan),
          },
        });

        await tx.detail_penelitian.upsert({
          where: { id },
          create: {
            id,
            judul: data.judul,
            id_kategori_kegiatan: toNumberOrNull(data.id_kategori_kegiatan),
            id_afiliasi: data.id_afiliasi || null,
            afiliasi: data.afiliasi || null,
            id_kelompok_bidang: data.id_kelompok_bidang || null,
            kelompok_bidang: data.kelompok_bidang || null,
            id_litabmas_sebelumnya: data.id_litabmas_sebelumnya || null,
            litabmas_sebelumnya: data.litabmas_sebelumnya || null,
            id_jenis_skim: data.id_jenis_skim || null,
            jenis_skim: data.jenis_skim || null,
            lokasi: data.lokasi || null,
            tahun_usulan: toNumberOrNull(data.tahun_usulan),
            tahun_kegiatan: toNumberOrNull(data.tahun_kegiatan),
            tahun_pelaksanaan: toNumberOrNull(data.tahun_pelaksanaan),
            lama_kegiatan: toNumberOrNull(data.lama_kegiatan),
            tahun_pelaksanaan_ke: toNumberOrNull(data.tahun_pelaksanaan_ke),
            dana_dikti: toDecimalOrNull(data.dana_dikti),
            dana_perguruan_tinggi: toDecimalOrNull(data.dana_perguruan_tinggi),
            dana_institusi_lain: toDecimalOrNull(data.dana_institusi_lain),
            in_kind: data.in_kind || null,
            sk_penugasan: data.sk_penugasan || null,
            tanggal_sk_penugasan: data.tanggal_sk_penugasan || null,
            status: data.status || "draft",
          },
          update: {
            judul: data.judul,
            id_kategori_kegiatan: toNumberOrNull(data.id_kategori_kegiatan),
            id_afiliasi: data.id_afiliasi || null,
            afiliasi: data.afiliasi || null,
            id_kelompok_bidang: data.id_kelompok_bidang || null,
            kelompok_bidang: data.kelompok_bidang || null,
            id_litabmas_sebelumnya: data.id_litabmas_sebelumnya || null,
            litabmas_sebelumnya: data.litabmas_sebelumnya || null,
            id_jenis_skim: data.id_jenis_skim || null,
            jenis_skim: data.jenis_skim || null,
            lokasi: data.lokasi || null,
            tahun_usulan: toNumberOrNull(data.tahun_usulan),
            tahun_kegiatan: toNumberOrNull(data.tahun_kegiatan),
            tahun_pelaksanaan: toNumberOrNull(data.tahun_pelaksanaan),
            lama_kegiatan: toNumberOrNull(data.lama_kegiatan),
            tahun_pelaksanaan_ke: toNumberOrNull(data.tahun_pelaksanaan_ke),
            dana_dikti: toDecimalOrNull(data.dana_dikti),
            dana_perguruan_tinggi: toDecimalOrNull(data.dana_perguruan_tinggi),
            dana_institusi_lain: toDecimalOrNull(data.dana_institusi_lain),
            in_kind: data.in_kind || null,
            sk_penugasan: data.sk_penugasan || null,
            tanggal_sk_penugasan: data.tanggal_sk_penugasan || null,
          },
        });
      });

      return res.status(200).json({
        status: "success",
        message: "Data penelitian berhasil diubah",
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({
          status: "error",
          message: "Data penelitian tidak ditemukan",
        });
      }

      console.error("Error updatePenelitian:", error);
      return res.status(500).json({
        status: "error",
        message: "Gagal mengubah data penelitian",
      });
    }
  }

  static async deletePenelitian(req: Request, res: Response) {
    try {
      const id = String(req.params.id);

      await prisma.penelitian.delete({
        where: { id },
      });

      return res.status(200).json({
        status: "success",
        message: "Data penelitian berhasil dihapus",
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        return res.status(404).json({
          status: "error",
          message: "Data penelitian tidak ditemukan",
        });
      }

      console.error("Error deletePenelitian:", error);
      return res.status(500).json({
        status: "error",
        message: "Gagal menghapus data penelitian",
      });
    }
  }
}
