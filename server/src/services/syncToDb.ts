import { apiReader } from '../utils/apiReader';
import { prisma } from '../config/database';
import { SyncReportImpl, type SyncReport } from './types/SyncReport';
import { SyncValidation } from '../utils/syncValidation';
import { EnumMapper } from '../utils/enumMapper';
import { SyncLogger } from '../utils/syncLogger';

/**
 * Service untuk sinkronisasi data dari SISTER ke database
 * Menggunakan transactions untuk atomicity dan structured logging untuk debugging
 */
export class syncToDB {
  /**
   * Sinkronisasi data SDM (Tenaga Pendidik/Dosen) dari SISTER
   * - Fetch SDM dari SISTER API
   * - Upsert ke users table
   * - Fetch & upsert bidang ilmu untuk setiap SDM
   * - Cleanup bidang ilmu lama
   * 
   * @returns SyncReport berisi success/failure metrics
   */
  static async syncSDM(): Promise<SyncReport> {
    const report = new SyncReportImpl('syncSDM');

    try {
      SyncLogger.info('syncSDM', 'Starting SDM synchronization from SISTER...');

      const dataSDM = await apiReader.fetchSDM();

      if (!dataSDM || dataSDM.length === 0) {
        SyncLogger.warn('syncSDM', 'No SDM data retrieved from SISTER');
        report.completed_at = new Date();
        return report;
      }

      report.total_processed = dataSDM.length;
      SyncLogger.info('syncSDM', `Retrieved ${dataSDM.length} SDM records`, { total: dataSDM.length });

      for (const sdm of dataSDM) {
        try {
          // 1. Validate SDM record
          const validation = SyncValidation.validateSDM(sdm);
          if (!validation.valid) {
            report.failed++;
            const errorMsg = validation.errors.join('; ');
            report.errors.push({
              record_id: sdm.id_sdm || 'unknown',
              record_name: sdm.nama_sdm || 'unknown',
              error_message: errorMsg,
              error_type: 'VALIDATION_ERROR'
            });
            SyncLogger.error('syncSDM', `Validation failed for SDM`, {
              sdm_id: sdm.id_sdm,
              errors: errorMsg
            });
            continue;
          }

          // 2. Wrap in transaction for atomicity
          await prisma.$transaction(async (tx) => {
            const password = 'password123'; // Placeholder, should use secure random generator in production'
            const userEmail = `${sdm.nidn}@lppm.local`;

            // UPSERT USER
            await tx.users.upsert({
              where: { id: sdm.id_sdm },
              update: {
                nama: sdm.nama_sdm || 'Nama tidak diketahui',
                nidn: sdm.nidn,
                email: userEmail
              },
              create: {
                id: sdm.id_sdm,
                nama: sdm.nama_sdm || 'Nama tidak diketahui',
                nidn: sdm.nidn,
                email: userEmail,
                password: password
              }
            });

            // Fetch bidang ilmu untuk SDM ini
            const listBidangIlmuSDM = await apiReader.fetchBidangIlmuSDM(sdm.id_sdm);

            // Cleanup old bidang ilmu records
            await tx.bidang_keilmuan_sdm.deleteMany({
              where: { id_sdm: sdm.id_sdm }
            });

            // Insert new bidang ilmu records
            if (listBidangIlmuSDM && listBidangIlmuSDM.length > 0) {
              for (const bidang of listBidangIlmuSDM) {
                // Validate bidang
                const bidangValidation = SyncValidation.validateBidangIlmuSDM(bidang);
                if (!bidangValidation.valid) {
                  SyncLogger.warn('syncSDM', 'Invalid bidang ilmu skipped', {
                    sdm_id: sdm.id_sdm,
                    errors: bidangValidation.errors
                  });
                  continue;
                }

                await tx.bidang_keilmuan_sdm.create({
                  data: {
                    id: BigInt(bidang.id),
                    urutan: bidang.urutan || 1,
                    id_kelompok_bidang: bidang.id_kelompok_bidang,
                    kelompok_bidang: bidang.kelompok_bidang,
                    id_sdm: sdm.id_sdm
                  }
                });
              }
            }
          });

          report.successful++;
          SyncLogger.info('syncSDM', `SDM synced successfully`, {
            sdm_id: sdm.id_sdm,
            nama: sdm.nama_sdm
          });
        } catch (error: any) {
          report.failed++;
          report.errors.push({
            record_id: sdm.id_sdm || 'unknown',
            record_name: sdm.nama_sdm || 'unknown',
            error_message: error.message,
            error_type: 'DATABASE_ERROR',
            stack_trace: error.stack
          });
          SyncLogger.error('syncSDM', 'Failed to sync SDM', {
            sdm_id: sdm.id_sdm,
            error: error.message
          });
        }
      }

      report.completed_at = new Date();
      SyncLogger.info('syncSDM', report.summary);
      return report;
    } catch (error: any) {
      report.completed_at = new Date();
      report.failed = report.total_processed - report.successful;
      SyncLogger.error('syncSDM', `Sync failed with error: ${error.message}`, {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Sinkronisasi data Penelitian dari SISTER untuk semua SDM
   * - Fetch penelitian untuk setiap SDM
   * - Wrap dalam transaction: detail + bidang ilmu + anggota + mitra + dokumen
   * 
   * @returns SyncReport berisi success/failure metrics
   */
  static async syncPenelitianAllSDM(): Promise<SyncReport> {
    const report = new SyncReportImpl('syncPenelitian');

    try {
      SyncLogger.info('syncPenelitian', 'Starting penelitian synchronization...');

      const dataSDM = await apiReader.fetchSDM();

      if (!dataSDM || dataSDM.length === 0) {
        SyncLogger.warn('syncPenelitian', 'No SDM data retrieved from SISTER');
        report.completed_at = new Date();
        return report;
      }

      SyncLogger.info('syncPenelitian', `Starting to sync penelitian for ${dataSDM.length} SDM`);

      let countSDMProcessed = 0;

      for (const sdm of dataSDM) {
        countSDMProcessed++;

        if (!sdm || !sdm.id_sdm) {
          SyncLogger.warn('syncPenelitian', `[${countSDMProcessed}/${dataSDM.length}] Empty SDM record skipped`);
          continue;
        }

        SyncLogger.info('syncPenelitian', `[${countSDMProcessed}/${dataSDM.length}] Processing penelitian for ${sdm.nama_sdm || sdm.id_sdm}`);

        try {
          const listPenelitian = await apiReader.fetchListPenelitian(sdm.id_sdm);

          if (!listPenelitian || listPenelitian.length === 0) {
            SyncLogger.info('syncPenelitian', `No penelitian found for SDM`, {
              sdm_id: sdm.id_sdm
            });
            continue;
          }

          for (const pen of listPenelitian) {
            report.total_processed++;
            const idPenelitian = pen.id;

            if (!idPenelitian) {
              report.failed++;
              SyncLogger.warn('syncPenelitian', 'Penelitian dengan ID kosong skipped', {
                sdm_id: sdm.id_sdm
              });
              continue;
            }

            try {
              // Wrap entire penelitian sync in transaction
              await prisma.$transaction(async (tx) => {
                // 1. UPSERT PENELITIAN
                await tx.penelitian.upsert({
                  where: { id: idPenelitian },
                  update: {
                    judul: pen.judul || 'Tanpa Judul',
                    tahun_pelaksanaan: pen.tahun_pelaksanaan || null,
                    lama_kegiatan: pen.lama_kegiatan || null
                  },
                  create: {
                    id: idPenelitian,
                    judul: pen.judul || 'Tanpa Judul',
                    tahun_pelaksanaan: pen.tahun_pelaksanaan || null,
                    lama_kegiatan: pen.lama_kegiatan || null,
                    id_users: sdm.id_sdm
                  }
                });

                // 2. UPSERT BIDANG KEILMUAN PENELITIAN
                const listBidangIlmuPenelitian = await apiReader.fetchBidangIlmuPenelitian(idPenelitian);

                // Cleanup old bidang records
                await tx.bidang_keilmuan_pn.deleteMany({
                  where: { id_penelitian: idPenelitian }
                });

                if (listBidangIlmuPenelitian && listBidangIlmuPenelitian.length > 0) {
                  for (const bidang of listBidangIlmuPenelitian) {
                    await tx.bidang_keilmuan_pn.create({
                      data: {
                        urutan: bidang.urutan ? Number(bidang.urutan) : 1,
                        id_kelompok_bidang: bidang.id_kelompok_bidang || 'UNKNOWN',
                        kelompok_bidang: bidang.kelompok_bidang || 'Unknown',
                        id_penelitian: idPenelitian
                      }
                    });
                  }
                }

                // 3. FETCH & UPSERT DETAIL PENELITIAN
                const detail = await apiReader.fetchDetailPenelitian(idPenelitian);

                if (detail) {
                  const detailValidation = SyncValidation.validateDetailPenelitian(detail);
                  if (!detailValidation.valid) {
                    throw new Error(`Detail validation failed: ${detailValidation.errors.join('; ')}`);
                  }

                  await tx.detail_penelitian.upsert({
                    where: { id: idPenelitian },
                    update: {
                      id_kategori_kegiatan: detail.id_kategori_kegiatan || null,
                      judul: detail.judul,
                      id_afiliasi: detail.id_afiliasi || null,
                      afiliasi: detail.afiliasi || null,
                      id_kelompok_bidang: detail.id_kelompok_bidang || null,
                      kelompok_bidang: detail.kelompok_bidang || null,
                      id_litabmas_sebelumnya: detail.id_litabmas_sebelumnya || null,
                      litabmas_sebelumnya: detail.litabmas_sebelumnya || null,
                      id_jenis_skim: detail.id_jenis_skim || null,
                      jenis_skim: detail.jenis_skim || null,
                      lokasi: detail.lokasi || null,
                      tahun_usulan: detail.tahun_usulan || null,
                      tahun_kegiatan: detail.tahun_kegiatan || null,
                      tahun_pelaksanaan: detail.tahun_pelaksanaan || null,
                      dana_dikti: detail.dana_dikti || null,
                      dana_perguruan_tinggi: detail.dana_perguruan_tinggi || null,
                      dana_institusi_lain: detail.dana_institusi_lain || null,
                      in_kind: detail.in_kind || null,
                      sk_penugasan: detail.sk_penugasan || null,
                      tanggal_sk_penugasan: detail.tanggal_sk_penugasan || null
                    },
                    create: {
                      id: idPenelitian,
                      id_kategori_kegiatan: detail.id_kategori_kegiatan || null,
                      judul: detail.judul,
                      id_afiliasi: detail.id_afiliasi || null,
                      afiliasi: detail.afiliasi || null,
                      id_kelompok_bidang: detail.id_kelompok_bidang || null,
                      kelompok_bidang: detail.kelompok_bidang || null,
                      id_litabmas_sebelumnya: detail.id_litabmas_sebelumnya || null,
                      litabmas_sebelumnya: detail.litabmas_sebelumnya || null,
                      id_jenis_skim: detail.id_jenis_skim || null,
                      jenis_skim: detail.jenis_skim || null,
                      lokasi: detail.lokasi || null,
                      tahun_usulan: detail.tahun_usulan || null,
                      tahun_kegiatan: detail.tahun_kegiatan || null,
                      tahun_pelaksanaan: detail.tahun_pelaksanaan || null,
                      dana_dikti: detail.dana_dikti || null,
                      dana_perguruan_tinggi: detail.dana_perguruan_tinggi || null,
                      dana_institusi_lain: detail.dana_institusi_lain || null,
                      in_kind: detail.in_kind || null,
                      sk_penugasan: detail.sk_penugasan || null,
                      tanggal_sk_penugasan: detail.tanggal_sk_penugasan || null,
                      status: detail.status || 'Approved' // Default ke 'Approved' jika status tidak tersedia
                    }
                  });

                  // 4. ANGGOTA (Delete & Insert ulang)
                  if (detail.anggota && Array.isArray(detail.anggota)) {
                    await tx.anggota.deleteMany({
                      where: { litabmas_id: idPenelitian }
                    });

                    for (const anggota of detail.anggota) {
                      const jenisAnggota = EnumMapper.mapAnggotaJenisSafe(anggota.jenis);

                      await tx.anggota.create({
                        data: {
                          id: anggota.id || undefined,
                          litabmas_id: idPenelitian,
                          nama: anggota.nama || 'Unknown',
                          jenis: jenisAnggota as any,
                          id_sdm: anggota.id_sdm || null,
                          id_peserta_didik: anggota.id_peserta_didik || null,
                          nomor_induk_peserta_didik: anggota.nomor_induk_peserta_didik || null,
                          id_orang: anggota.id_orang || null,
                          aktif: true,
                          peran: anggota.peran || 'Anggota'
                        }
                      });
                    }
                  }

                  // 5. MITRA (Upsert)
                  if (detail.mitra_litabmas && Array.isArray(detail.mitra_litabmas)) {
                    for (const mitra of detail.mitra_litabmas) {
                      const mitraValidation = SyncValidation.validateMitra(mitra);
                      if (!mitraValidation.valid) {
                        SyncLogger.warn('syncPenelitian', 'Invalid mitra record skipped', {
                          penelitian_id: idPenelitian,
                          errors: mitraValidation.errors
                        });
                        continue;
                      }

                      await tx.mitra.upsert({
                        where: { id: mitra.id },
                        update: {
                          nama: mitra.nama || 'Unknown'
                        },
                        create: {
                          id: mitra.id,
                          litabmas_id: idPenelitian,
                          nama: mitra.nama || 'Unknown'
                        }
                      });
                    }
                  }

                  // 6. DOKUMEN (Delete & Insert ulang)
                  if (detail.dokumen && Array.isArray(detail.dokumen)) {
                    await tx.dokumen.deleteMany({
                      where: { litabmas_id: idPenelitian }
                    });

                    for (const dok of detail.dokumen) {
                      const dokValidation = SyncValidation.validateDokumen(dok);
                      if (!dokValidation.valid) {
                        SyncLogger.warn('syncPenelitian', 'Invalid dokumen record skipped', {
                          penelitian_id: idPenelitian,
                          errors: dokValidation.errors
                        });
                        continue;
                      }

                      await tx.dokumen.create({
                        data: {
                          id: dok.id,
                          litabmas_id: idPenelitian,
                          nama: dok.nama || 'Unknown',
                          jenis_dokumen: dok.jenis_dokumen || null,
                          nama_file: dok.nama_file || null,
                          jenis_file: dok.jenis_file || null,
                          tautan: dok.tautan || null,
                          keterangan: dok.keterangan || null
                        }
                      });
                    }
                  }
                }
              });

              report.successful++;
              SyncLogger.info('syncPenelitian', 'Penelitian synced successfully', {
                penelitian_id: idPenelitian,
                judul: pen.judul
              });
            } catch (error: any) {
              report.failed++;
              report.errors.push({
                record_id: idPenelitian,
                record_name: pen.judul || 'Unknown',
                error_message: error.message,
                error_type: 'TRANSACTION_ERROR',
                stack_trace: error.stack
              });
              SyncLogger.error('syncPenelitian', 'Failed to sync penelitian', {
                penelitian_id: idPenelitian,
                error: error.message
              });
            }
          }
        } catch (error: any) {
          SyncLogger.error('syncPenelitian', 'Error processing SDM batch', {
            sdm_id: sdm.id_sdm,
            error: error.message
          });
        }
      }

      report.completed_at = new Date();
      SyncLogger.info('syncPenelitian', report.summary);
      return report;
    } catch (error: any) {
      report.completed_at = new Date();
      report.failed = report.total_processed - report.successful;
      SyncLogger.error('syncPenelitian', `Sync failed with error: ${error.message}`, {
        error: error.message
      });
      throw error;
    }
  }
    
  /**
   * Sinkronisasi data Publikasi dari SISTER untuk semua SDM
   * - Fetch publikasi untuk setiap SDM
   * - Wrap dalam transaction: detail + penulis + dokumen
   * 
   * @returns SyncReport berisi success/failure metrics
   */
  static async syncPublikasiAllSDM(): Promise<SyncReport> {
    const report = new SyncReportImpl('syncPublikasi');

    try {
      SyncLogger.info('syncPublikasi', 'Starting publikasi synchronization...');

      const dataSDM = await apiReader.fetchSDM();

      if (!dataSDM || dataSDM.length === 0) {
        SyncLogger.warn('syncPublikasi', 'No SDM data retrieved from SISTER');
        report.completed_at = new Date();
        return report;
      }

      SyncLogger.info('syncPublikasi', `Starting to sync publikasi for ${dataSDM.length} SDM`);

      let countSDMProcessed = 0;

      for (const sdm of dataSDM) {
        countSDMProcessed++;

        if (!sdm || !sdm.id_sdm) {
          SyncLogger.warn('syncPublikasi', `[${countSDMProcessed}/${dataSDM.length}] Empty SDM record skipped`);
          continue;
        }

        SyncLogger.info('syncPublikasi', `[${countSDMProcessed}/${dataSDM.length}] Processing publikasi for ${sdm.nama_sdm || sdm.id_sdm}`);

        try {
          const listPublikasi = await apiReader.fetchListPublikasi(sdm.id_sdm);

          if (!listPublikasi || listPublikasi.length === 0) {
            SyncLogger.info('syncPublikasi', `No publikasi found for SDM`, {
              sdm_id: sdm.id_sdm
            });
            continue;
          }

          for (const pub of listPublikasi) {
            report.total_processed++;
            const idPublikasi = pub.id;

            if (!idPublikasi) {
              report.failed++;
              SyncLogger.warn('syncPublikasi', 'Publikasi dengan ID kosong skipped', {
                sdm_id: sdm.id_sdm
              });
              continue;
            }

            try {
              // Wrap entire publikasi sync in transaction
              await prisma.$transaction(async (tx) => {
                // 1. UPSERT PUBLIKASI (Tabel Induk)
                await tx.publikasi.upsert({
                  where: { id: idPublikasi },
                  update: {
                    kategori_kegiatan: pub.kategori_kegiatan || 'Unknown',
                    judul: pub.judul || 'Tanpa Judul',
                    quartile: pub.quartile ? Number(pub.quartile) : null,
                    tanggal: pub.tanggal || 'Unknown'
                  },
                  create: {
                    id: idPublikasi,
                    kategori_kegiatan: pub.kategori_kegiatan || 'Unknown',
                    judul: pub.judul || 'Tanpa Judul',
                    quartile: pub.quartile ? Number(pub.quartile) : null,
                    jenis_publikasi: pub.jenis_publikasi || 'Unknown',
                    tanggal: pub.tanggal || 'Unknown',
                    asal_data: pub.asal_data || null,
                    id_user: sdm.id_sdm
                  }
                });

                // 2. FETCH & UPSERT DETAIL PUBLIKASI
                const detail = await apiReader.fetchDetailPublikasi(idPublikasi);

                if (detail) {
                  const detailValidation = SyncValidation.validateDetailPublikasi(detail);
                  if (!detailValidation.valid) {
                    throw new Error(`Detail validation failed: ${detailValidation.errors.join('; ')}`);
                  }

                  await tx.detail_publikasi.upsert({
                    where: { id: idPublikasi },
                    update: {
                      kategori_kegiatan: detail.kategori_kegiatan || pub.kategori_kegiatan || 'Unknown',
                      judul: detail.judul || pub.judul || 'Tanpa Judul',
                      quartile: detail.quartile ? Number(detail.quartile) : null,
                      jenis_publikasi: detail.jenis_publikasi || pub.jenis_publikasi || 'Unknown',
                      tanggal: detail.tanggal || pub.tanggal || 'Unknown',
                      id_kategori_kegiatan: detail.id_kategori_kegiatan || 0,
                      id_jenis_publikasi: detail.id_jenis_publikasi || 0,
                      kategori_capaian_luaran: detail.kategori_capaian_luaran || 'Unknown',
                      id_kategori_capaian_luaran: detail.id_kategori_capaian_luaran || null,
                      judul_litabmas: detail.judul_litabmas || null,
                      id_litabmas: detail.id_litabmas || null,
                      nomor_paten: detail.nomor_paten || null,
                      pemberi_paten: detail.pemberi_paten || null,
                      penerbit: detail.penerbit || null,
                      isbn: detail.isbn || null,
                      jumlah_halaman: detail.jumlah_halaman || null,
                      tautan: detail.tautan || null,
                      keterangan: detail.keterangan || null,
                      judul_artikel: detail.judul_artikel || null,
                      judul_asli: detail.judul_asli || null,
                      nama_jurnal: detail.nama_jurnal || null,
                      halaman: detail.halaman || null,
                      edisi: detail.edisi || null,
                      volume: detail.volume || null,
                      nomor: detail.nomor || null,
                      doi: detail.doi || null,
                      issn: detail.issn || null,
                      e_issn: detail.e_issn || null,
                      seminar: detail.seminar ? true : false,
                      prosiding: detail.prosiding ? true : false,
                      asal_data: detail.asal_data || pub.asal_data || null,
                      status: 'approved'
                    },
                    create: {
                      id: idPublikasi,
                      kategori_kegiatan: detail.kategori_kegiatan || pub.kategori_kegiatan || 'Unknown',
                      judul: detail.judul || pub.judul || 'Tanpa Judul',
                      quartile: detail.quartile ? Number(detail.quartile) : null,
                      jenis_publikasi: detail.jenis_publikasi || pub.jenis_publikasi || 'Unknown',
                      tanggal: detail.tanggal || pub.tanggal || 'Unknown',
                      id_kategori_kegiatan: detail.id_kategori_kegiatan || 0,
                      id_jenis_publikasi: detail.id_jenis_publikasi || 0,
                      kategori_capaian_luaran: detail.kategori_capaian_luaran || 'Unknown',
                      id_kategori_capaian_luaran: detail.id_kategori_capaian_luaran || null,
                      judul_litabmas: detail.judul_litabmas || null,
                      id_litabmas: detail.id_litabmas || null,
                      nomor_paten: detail.nomor_paten || null,
                      pemberi_paten: detail.pemberi_paten || null,
                      penerbit: detail.penerbit || null,
                      isbn: detail.isbn || null,
                      jumlah_halaman: detail.jumlah_halaman || null,
                      tautan: detail.tautan || null,
                      keterangan: detail.keterangan || null,
                      judul_artikel: detail.judul_artikel || null,
                      judul_asli: detail.judul_asli || null,
                      nama_jurnal: detail.nama_jurnal || null,
                      halaman: detail.halaman || null,
                      edisi: detail.edisi || null,
                      volume: detail.volume || null,
                      nomor: detail.nomor || null,
                      doi: detail.doi || null,
                      issn: detail.issn || null,
                      e_issn: detail.e_issn || null,
                      seminar: detail.seminar ? true : false,
                      prosiding: detail.prosiding ? true : false,
                      asal_data: detail.asal_data || pub.asal_data || null,
                      status: 'approved'
                    }
                  });

                  // 3. PENULIS (Delete & Insert)
                  if (detail.penulis && Array.isArray(detail.penulis)) {
                    await tx.publikasi_penulis.deleteMany({
                      where: { id_publikasi: idPublikasi }
                    });

                    for (const penulis of detail.penulis) {
                      const jenisPenulis = EnumMapper.mapPublikasiPenuliJenisSafe(penulis.jenis);

                      await tx.publikasi_penulis.create({
                        data: {
                          id_publikasi: idPublikasi,
                          nama: penulis.nama || 'Unknown',
                          jenis: jenisPenulis as any,
                          id_sdm: penulis.id_sdm || null,
                          id_peserta_didik: penulis.id_peserta_didik || null,
                          nomor_induk_peserta_didik: penulis.nomor_induk_peserta_didik || null,
                          id_orang: penulis.id_orang || null,
                          urutan: penulis.urutan || 0,
                          afiliasi: penulis.afiliasi || '',
                          corresponding_author: penulis.corresponding_author ? true : false,
                          peran: penulis.peran || 'Penulis'
                        }
                      });
                    }
                  }

                  // 4. DOKUMEN (Delete & Insert)
                  if (detail.dokumen && Array.isArray(detail.dokumen)) {
                    await tx.publikasi_dokumen.deleteMany({
                      where: { id_publikasi: idPublikasi }
                    });

                    for (const dok of detail.dokumen) {
                      await tx.publikasi_dokumen.create({
                        data: {
                          id: dok.id,
                          id_publikasi: idPublikasi,
                          nama: dok.nama || 'Unknown',
                          jenis_dokumen: dok.jenis_dokumen || 'Unknown',
                          nama_file: dok.nama_file || 'Unknown',
                          jenis_file: dok.jenis_file || 'Unknown',
                          tanggal_upload: dok.tanggal_upload || null,
                          tautan: dok.tautan || null,
                          keterangan: dok.keterangan || null
                        }
                      });
                    }
                  }
                }
              });

              report.successful++;
              SyncLogger.info('syncPublikasi', 'Publikasi synced successfully', {
                publikasi_id: idPublikasi,
                judul: pub.judul
              });
            } catch (error: any) {
              report.failed++;
              report.errors.push({
                record_id: idPublikasi,
                record_name: pub.judul || 'Unknown',
                error_message: error.message,
                error_type: 'TRANSACTION_ERROR',
                stack_trace: error.stack
              });
              SyncLogger.error('syncPublikasi', 'Failed to sync publikasi', {
                publikasi_id: idPublikasi,
                error: error.message
              });
            }
          }
        } catch (error: any) {
          SyncLogger.error('syncPublikasi', 'Error processing SDM batch', {
            sdm_id: sdm.id_sdm,
            error: error.message
          });
        }
      }

      report.completed_at = new Date();
      SyncLogger.info('syncPublikasi', report.summary);
      return report;
    } catch (error: any) {
      report.completed_at = new Date();
      report.failed = report.total_processed - report.successful;
      SyncLogger.error('syncPublikasi', `Sync failed with error: ${error.message}`, {
        error: error.message
      });
      throw error;
    }
  }

  /**
   * Fetch publikasi data untuk single SDM dari SISTER
   * (Utility method, tidak mengubah database)
   * 
   * @param id_sdm - ID SDM to fetch publikasi for
   * @returns Array of publikasi data
   */
  static async syncPublikasiEachSDM(id_sdm: string): Promise<any[]> {
    try {
      SyncLogger.info('syncPublikasiEachSDM', `Fetching publikasi for SDM`, { sdm_id: id_sdm });

      const listPublikasi = await apiReader.fetchListPublikasi(id_sdm);

      if (!listPublikasi || listPublikasi.length === 0) {
        SyncLogger.warn('syncPublikasiEachSDM', 'No publikasi found', { sdm_id: id_sdm });
        return [];
      }

      const hasilPublikasi: any[] = [];

      SyncLogger.info('syncPublikasiEachSDM', `Fetching details for ${listPublikasi.length} publikasi`);

      for (const lp of listPublikasi) {
        const idPublikasi = lp.id;
        if (!idPublikasi) continue;

        try {
          const detail_publikasi = await apiReader.fetchDetailPublikasi(idPublikasi);

          if (detail_publikasi) {
            hasilPublikasi.push({
              ...lp,
              ...detail_publikasi
            });
          }
        } catch (error: any) {
          SyncLogger.error('syncPublikasiEachSDM', 'Failed to fetch publikasi detail', {
            publikasi_id: idPublikasi,
            error: error.message
          });
        }
      }

      SyncLogger.info('syncPublikasiEachSDM', `Finished fetching publikasi data`, {
        sdm_id: id_sdm,
        total_publikasi: hasilPublikasi.length
      });

      return hasilPublikasi;
    } catch (error: any) {
      SyncLogger.error('syncPublikasiEachSDM', `Error fetching publikasi data: ${error.message}`, {
        sdm_id: id_sdm,
        error: error.message
      });
      throw error;
    }
  }
}

/**
 * CLI Execution
 * Run this file directly to execute sync
 * Usage: npx ts-node src/services/syncToDb.ts
 */
if (require.main === module) {
  syncToDB.syncPenelitianAllSDM();
  /*
  (async () => {
    try {
      SyncLogger.info('CLI', 'Starting full sync process...');

      console.log('\n=== SYNCING SDM ===');
      const sdmReport = await syncToDB.syncSDM();
      console.log(sdmReport.summary);
      console.log(`Errors: ${sdmReport.errors.length}`);

      console.log('\n=== SYNCING PENELITIAN ===');
      const penelitianReport = await syncToDB.syncPenelitianAllSDM();
      console.log(penelitianReport.summary);
      console.log(`Errors: ${penelitianReport.errors.length}`);

      console.log('\n=== SYNCING PUBLIKASI ===');
      const publikasiReport = await syncToDB.syncPublikasiAllSDM();
      console.log(publikasiReport.summary);
      console.log(`Errors: ${publikasiReport.errors.length}`);

      SyncLogger.info('CLI', 'Full sync process completed');
      process.exit(0);
    } catch (error: any) {
      SyncLogger.error('CLI', `Sync process failed: ${error.message}`);
      console.error(error);
      process.exit(1);
    }
  })();
  */
}