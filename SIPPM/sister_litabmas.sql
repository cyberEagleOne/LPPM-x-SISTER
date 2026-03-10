-- ============================================================
-- SISTER Litabmas Database Schema
-- Sesuai dengan endpoint SISTER API: penelitian / pengabdian
-- URL: https://sister-api.kemdiktisaintek.go.id/
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- ============================================================
-- Database: `penelitian`
-- ============================================================
CREATE DATABASE IF NOT EXISTS `penelitian`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `penelitian`;

-- ============================================================
-- Tabel 1: litabmas (Tabel Utama Penelitian/Pengabdian)
-- ============================================================

CREATE TABLE `litabmas` (
  `id` CHAR(36) NOT NULL COMMENT 'UUID penelitian/pengabdian dari SISTER',
  `id_kategori_kegiatan` INT DEFAULT NULL COMMENT 'ID kategori kegiatan',
  `judul` VARCHAR(500) NOT NULL COMMENT 'Judul kegiatan',
  `id_afiliasi` CHAR(36) DEFAULT NULL COMMENT 'UUID perguruan tinggi / lembaga afiliasi',
  `afiliasi` VARCHAR(255) DEFAULT NULL COMMENT 'Nama perguruan tinggi / lembaga afiliasi',
  `id_kelompok_bidang` CHAR(36) DEFAULT NULL COMMENT 'UUID kelompok bidang litabmas',
  `kelompok_bidang` VARCHAR(255) DEFAULT NULL COMMENT 'Nama kelompok bidang litabmas',
  `id_litabmas_sebelumnya` CHAR(36) DEFAULT NULL COMMENT 'UUID litabmas sebelumnya (lanjutan)',
  `litabmas_sebelumnya` VARCHAR(500) DEFAULT NULL COMMENT 'Judul litabmas sebelumnya (lanjutan)',
  `id_jenis_skim` CHAR(36) DEFAULT NULL COMMENT 'UUID skim kegiatan',
  `jenis_skim` VARCHAR(255) DEFAULT NULL COMMENT 'Nama skim kegiatan',
  `lokasi` VARCHAR(500) DEFAULT NULL COMMENT 'Lokasi kegiatan',
  `tahun_usulan` INT DEFAULT NULL COMMENT 'Tahun usulan',
  `tahun_kegiatan` INT DEFAULT NULL COMMENT 'Tahun kegiatan',
  `tahun_pelaksanaan` INT DEFAULT NULL COMMENT 'Tahun pelaksanaan',
  `lama_kegiatan` INT DEFAULT NULL COMMENT 'Lama pelaksanaan (tahun)',
  `tahun_pelaksanaan_ke` INT DEFAULT NULL COMMENT 'Tahun pelaksanaan ke',
  `dana_dikti` DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Dana dari DIKTI (Rp)',
  `dana_perguruan_tinggi` DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Dana dari PT (Rp)',
  `dana_institusi_lain` DECIMAL(15,2) DEFAULT 0.00 COMMENT 'Dana dari institusi lain (Rp)',
  `in_kind` TEXT DEFAULT NULL COMMENT 'In kind',
  `sk_penugasan` VARCHAR(255) DEFAULT NULL COMMENT 'Nomor SK penugasan',
  `tanggal_sk_penugasan` DATE DEFAULT NULL COMMENT 'Tanggal SK',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabel 2: mitra (Mitra Litabmas)
-- ============================================================

CREATE TABLE `mitra` (
  `id` CHAR(36) NOT NULL COMMENT 'UUID mitra dari SISTER',
  `litabmas_id` CHAR(36) NOT NULL COMMENT 'FK ke litabmas.id',
  `nama` VARCHAR(255) NOT NULL COMMENT 'Nama mitra',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_mitra_litabmas` (`litabmas_id`),
  CONSTRAINT `fk_mitra_litabmas`
    FOREIGN KEY (`litabmas_id`)
    REFERENCES `litabmas` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabel 3: anggota (Anggota Litabmas)
-- ============================================================

CREATE TABLE `anggota` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `litabmas_id` CHAR(36) NOT NULL COMMENT 'FK ke litabmas.id',
  `nama` VARCHAR(255) NOT NULL COMMENT 'Nama anggota',
  `jenis` ENUM('Dosen', 'Mahasiswa', 'Profesional/Mitra') NOT NULL COMMENT 'Jenis anggota',
  `id_sdm` CHAR(36) DEFAULT NULL COMMENT 'ID Dosen (jika jenis=Dosen)',
  `id_peserta_didik` CHAR(36) DEFAULT NULL COMMENT 'ID mahasiswa (jika jenis=Mahasiswa)',
  `nomor_induk_peserta_didik` VARCHAR(50) DEFAULT NULL COMMENT 'NIM (jika jenis=Mahasiswa)',
  `id_orang` CHAR(36) DEFAULT NULL COMMENT 'ID kolaborator luar (jika jenis lain)',
  `aktif` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1=aktif, 0=tidak aktif',
  `peran` VARCHAR(50) NOT NULL COMMENT 'Ketua atau Anggota',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_anggota_litabmas` (`litabmas_id`),
  KEY `idx_anggota_sdm` (`id_sdm`),
  KEY `idx_anggota_peserta` (`id_peserta_didik`),
  KEY `idx_anggota_orang` (`id_orang`),
  CONSTRAINT `fk_anggota_litabmas`
    FOREIGN KEY (`litabmas_id`)
    REFERENCES `litabmas` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabel 4: dokumen (Dokumen Litabmas)
-- ============================================================

CREATE TABLE `dokumen` (
  `id` CHAR(36) NOT NULL COMMENT 'UUID dokumen dari SISTER',
  `litabmas_id` CHAR(36) NOT NULL COMMENT 'FK ke litabmas.id',
  `nama` VARCHAR(255) NOT NULL COMMENT 'Nama dokumen',
  `jenis_dokumen` VARCHAR(100) DEFAULT NULL COMMENT 'Jenis dokumen',
  `nama_file` VARCHAR(255) DEFAULT NULL COMMENT 'Nama file dokumen',
  `jenis_file` VARCHAR(100) DEFAULT NULL COMMENT 'Mime type dokumen',
  `tanggal_upload` DATETIME DEFAULT NULL COMMENT 'Waktu upload',
  `tautan` TEXT DEFAULT NULL COMMENT 'Tautan dokumen',
  `keterangan` TEXT DEFAULT NULL COMMENT 'Keterangan dokumen',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_dokumen_litabmas` (`litabmas_id`),
  CONSTRAINT `fk_dokumen_litabmas`
    FOREIGN KEY (`litabmas_id`)
    REFERENCES `litabmas` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Selesai!
-- ============================================================

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
