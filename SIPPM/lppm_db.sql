-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 10, 2026 at 03:52 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lppm_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `anggota`
--

CREATE TABLE `anggota` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `litabmas_id` char(36) NOT NULL COMMENT 'FK ke litabmas.id',
  `nama` varchar(255) NOT NULL COMMENT 'Nama anggota',
  `jenis` enum('Dosen','Mahasiswa','Profesional/Mitra') NOT NULL COMMENT 'Jenis anggota',
  `id_sdm` char(36) DEFAULT NULL COMMENT 'ID Dosen (jika jenis=Dosen)',
  `id_peserta_didik` char(36) DEFAULT NULL COMMENT 'ID mahasiswa (jika jenis=Mahasiswa)',
  `nomor_induk_peserta_didik` varchar(50) DEFAULT NULL COMMENT 'NIM (jika jenis=Mahasiswa)',
  `id_orang` char(36) DEFAULT NULL COMMENT 'ID kolaborator luar (jika jenis lain)',
  `aktif` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1=aktif, 0=tidak aktif',
  `peran` varchar(50) NOT NULL COMMENT 'Ketua atau Anggota',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dokumen`
--

CREATE TABLE `dokumen` (
  `id` char(36) NOT NULL COMMENT 'UUID dokumen dari SISTER',
  `litabmas_id` char(36) NOT NULL COMMENT 'FK ke litabmas.id',
  `nama` varchar(255) NOT NULL COMMENT 'Nama dokumen',
  `jenis_dokumen` varchar(100) DEFAULT NULL COMMENT 'Jenis dokumen',
  `nama_file` varchar(255) DEFAULT NULL COMMENT 'Nama file dokumen',
  `jenis_file` varchar(100) DEFAULT NULL COMMENT 'Mime type dokumen',
  `tanggal_upload` datetime DEFAULT NULL COMMENT 'Waktu upload',
  `tautan` text DEFAULT NULL COMMENT 'Tautan dokumen',
  `keterangan` text DEFAULT NULL COMMENT 'Keterangan dokumen',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `litabmas`
--

CREATE TABLE `litabmas` (
  `id` char(36) NOT NULL COMMENT 'UUID penelitian/pengabdian dari SISTER',
  `id_kategori_kegiatan` int(11) DEFAULT NULL COMMENT 'ID kategori kegiatan',
  `judul` varchar(500) NOT NULL COMMENT 'Judul kegiatan',
  `id_afiliasi` char(36) DEFAULT NULL COMMENT 'UUID perguruan tinggi / lembaga afiliasi',
  `afiliasi` varchar(255) DEFAULT NULL COMMENT 'Nama perguruan tinggi / lembaga afiliasi',
  `id_kelompok_bidang` char(36) DEFAULT NULL COMMENT 'UUID kelompok bidang litabmas',
  `kelompok_bidang` varchar(255) DEFAULT NULL COMMENT 'Nama kelompok bidang litabmas',
  `id_litabmas_sebelumnya` char(36) DEFAULT NULL COMMENT 'UUID litabmas sebelumnya (lanjutan)',
  `litabmas_sebelumnya` varchar(500) DEFAULT NULL COMMENT 'Judul litabmas sebelumnya (lanjutan)',
  `id_jenis_skim` char(36) DEFAULT NULL COMMENT 'UUID skim kegiatan',
  `jenis_skim` varchar(255) DEFAULT NULL COMMENT 'Nama skim kegiatan',
  `lokasi` varchar(500) DEFAULT NULL COMMENT 'Lokasi kegiatan',
  `tahun_usulan` int(11) DEFAULT NULL COMMENT 'Tahun usulan',
  `tahun_kegiatan` int(11) DEFAULT NULL COMMENT 'Tahun kegiatan',
  `tahun_pelaksanaan` int(11) DEFAULT NULL COMMENT 'Tahun pelaksanaan',
  `lama_kegiatan` int(11) DEFAULT NULL COMMENT 'Lama pelaksanaan (tahun)',
  `tahun_pelaksanaan_ke` int(11) DEFAULT NULL COMMENT 'Tahun pelaksanaan ke',
  `dana_dikti` decimal(15,2) DEFAULT 0.00 COMMENT 'Dana dari DIKTI (Rp)',
  `dana_perguruan_tinggi` decimal(15,2) DEFAULT 0.00 COMMENT 'Dana dari PT (Rp)',
  `dana_institusi_lain` decimal(15,2) DEFAULT 0.00 COMMENT 'Dana dari institusi lain (Rp)',
  `in_kind` text DEFAULT NULL COMMENT 'In kind',
  `sk_penugasan` varchar(255) DEFAULT NULL COMMENT 'Nomor SK penugasan',
  `tanggal_sk_penugasan` date DEFAULT NULL COMMENT 'Tanggal SK',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mitra`
--

CREATE TABLE `mitra` (
  `id` char(36) NOT NULL COMMENT 'UUID mitra dari SISTER',
  `litabmas_id` char(36) NOT NULL COMMENT 'FK ke litabmas.id',
  `nama` varchar(255) NOT NULL COMMENT 'Nama mitra',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` char(255) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `nidn` char(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `provider_id` varchar(255) DEFAULT NULL,
  `avatar` text DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `fakultas_id` bigint(20) UNSIGNED DEFAULT NULL,
  `prodi_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nama`, `nidn`, `email`, `email_verified_at`, `provider_id`, `avatar`, `password`, `remember_token`, `created_at`, `updated_at`, `fakultas_id`, `prodi_id`) VALUES
('dedcfebd-6976-450e-be30-bddf79ae3c86', 'AAN NURHASANAH', '0304056705', '0304056705@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('4ad8d199-a8f2-4778-b203-ca1b00be305d', 'ABDULLAH HIBRAWAN PRATALA W.', '0308048308', '0308048308@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('dc2dac2e-e62c-4716-af07-b4a32ec425c0', 'ADE FIRMANSYAH', '0329028402', '0329028402@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('88c93c7d-583f-420d-9a59-f4c6dda70a9e', 'ADRIYAN KUSUMA', '8980250022', '8980250022@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('74370568-187f-4645-b0e7-53662f2c539b', 'ADRYAN RACHMAN', '0405088405', '0405088405@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('67e22f8d-9697-4c7d-ac6d-261964098198', 'AFIFAH TRISTA AYUNDA', '0322059702', '0322059702@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('4ee6be47-7ade-4179-859c-3e88e024765c', 'AJENG ANDRIANI HAPSARI', '0419118504', '0419118504@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('3e6f0569-d5b2-45e6-9312-9d5d92069f60', 'ALFA RYANO YOHANNIS', '0316078403', '0316078403@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('661b3628-814b-47a9-809f-be52cd2a559f', 'ALIFIA WIDA IZZATI', '0316128901', '0316128901@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('99f39d9f-0ad0-4dd3-839f-9f301fbdc94b', 'ANDI MUHAMMAD AHSAN MUKHLIS', '0308019003', '0308019003@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('58d8c603-f755-4a3c-a7f6-35fa11df18c8', 'ANDREAS KIKY', '0320069001', '0320069001@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('187d1613-a088-47b8-b9f7-cc9df0f2cb00', 'ANISZA RATNASARI', '0315128503', '0315128503@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('75669bc1-7e44-412d-a93d-4cabe5d3e2ce', 'ARDI MAKKI PANTOW GUNAWAN', '0322018308', '0322018308@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('c5c4667e-b4db-4f43-85a2-e39c52b06be6', 'ARYANING ARYA KRESNA', '0319027402', '0319027402@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('ec16ce1d-1cb7-4923-96c8-7446f173356b', 'ARYA SANJAYA', '0313046703', '0313046703@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('b5ebe2f9-4d5c-4e48-8971-112fad22783c', 'AULINA ADAMY', '1331077901', '1331077901@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('5da10402-561e-4410-9d3f-592ea6d1b3b0', 'BAYU LAKSMA PRADANA', '0309067701', '0309067701@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('0b132388-fb53-40b8-8cb8-94372c6e6e3b', 'BELLA KOES PAULINA CANTIK', '0321059701', '0321059701@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('aaf1f359-f540-4af1-be66-83e3415ea3c3', 'BOIKE JANUS ANSHORY', '0302017503', '0302017503@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('48f010ba-2a89-4278-9757-e97dd093b5b1', 'BRAMANTA OCTA DANU PUTRA', '0305108601', '0305108601@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('974bdd70-8250-4ca4-824a-e18daa996b60', 'BUDI SETIAWAN', '0314037401', '0314037401@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('297d9b00-af27-47e4-bb41-60c0a0e62bb1', 'CAROLUS ASTABRATA', '0302019202', '0302019202@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('cf5dc6c6-d26a-4529-ad6b-7e81c95555c4', 'DANA PERSADA', '0329056301', '0329056301@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('84dd1263-832a-481d-9621-b28829774d14', 'DEASY OLIVIA', '0323079103', '0323079103@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('1c02f7da-02ea-469a-a463-94fe1f8d21ac', 'DIKKI ZUCHRADI CHOESRANI', '0317056801', '0317056801@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('8dfb2013-0a43-4e2c-af8f-620651b61a37', 'DYAH CAHYASARI', '0313028501', '0313028501@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('473d3aab-49d2-4635-9c85-bc81c71597c2', 'ERICK DAZKI', '0302059002', '0302059002@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('c5460c19-b4dc-4a6e-8754-7f3fc4237c1a', 'FEBRYANTI SIMON', '0307039001', '0307039001@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('95244bff-5e87-4eae-b5fb-7cee9f13c619', 'GREYSIA SUSILO', '0328047506', '0328047506@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('3f700e2b-0696-4ee2-ab74-7d566bc97b42', 'GUFRON', '0305027606', '0305027606@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('175601d7-0f6d-43e8-9488-4f2ec72aa5e7', 'HANDRI SANTOSO', '0419077104', '0419077104@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('49363cde-25fa-46ec-ae42-8968b0bdb6ee', 'HANUGRAH ADHI BUWONO', '0314068906', '0314068906@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('d4b3ebae-d31c-4087-a58a-2d583e01b6ed', 'HARYONO', '0302058104', '0302058104@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('812045df-48d5-48ac-8f70-db05faea48d6', 'HENDRA MAYATOPANI', '0401038401', '0401038401@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('ce9fd538-aad6-4a6c-bd7b-c24756947c25', 'HENDRO SUSANTO', '0703117401', '0703117401@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('89bcbbc1-f6a3-403b-9c4b-0ea9f72109a8', 'IDA AYU SAWITRI DIAN MAWARNI', '0318038901', '0318038901@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('ab02ebf6-dcce-4396-828d-06d6f6b271ef', 'IMANIAR SOFIA ASHARHANI', '0311049006', '0311049006@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('6008d7b3-6402-44dd-81e1-cb3e260251db', 'IRWAN HARNOKO', '0318077101', '0318077101@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('931a44c9-a3dc-4e35-a457-0c0417f5efd0', 'ITO WASITO', '0008096610', '0008096610@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('3b4eba27-2d7c-4648-80a3-4445e47536e4', 'JANUPONSA DIO FIRIZQI', '0314019501', '0314019501@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('66ff8e68-b069-4736-8d1a-c5e612a3605d', 'JAROT SEMBODO', '0308106408', '0308106408@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('2a45c61d-50f5-49f4-83ee-a1d2e03ab733', 'JASON LIM', '0326076603', '0326076603@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('4fb1eebe-8e8f-45fb-91f0-d8af50a6e35b', 'JOHANN WAHYU HASMORO PRAWIRO', '0314029701', '0314029701@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('c105d0af-f350-4440-9adc-4ac466baf1e4', 'KEZIA ELSTY', '0321059202', '0321059202@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('3ab4cc42-6c6b-41bd-b047-c39489f0f85d', 'LILIK HARIYANTO', '0319057901', '0319057901@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('d000f20f-6172-45bf-8c83-79f42dcb6958', 'LUH PUTU PUJI TRISNAWATI', '0305037005', '0305037005@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('472ac69b-f495-4f30-8280-d1ff6f242269', 'MARCHELIA GUPITA SARI', '0321039004', '0321039004@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('57aee623-6886-48f1-b1d1-450700e5ba75', 'MASTER EDISON SIREGAR', '0323077202', '0323077202@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('39228d71-cbb2-40eb-afbe-7ec99cf55da8', 'MAULANA MALIK MUHAMMAD', '0316109001', '0316109001@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('17b46a89-64e7-4aec-a047-f604adc2e615', 'MEILISA ALVITA', '0322059601', '0322059601@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('dc851c3b-b28b-4a4d-b5e2-e80b75fe080f', 'MICHAEL', '0315099002', '0315099002@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('84803d6f-9273-4786-b23f-b668f4c8eb82', 'MOHAMAD HISYAM', '0412069101', '0412069101@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('0c2c0928-01e8-490e-9491-b05c00f3f64f', 'MUHAMMAD IQBAL', '0311048503', '0311048503@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('b5463aec-0538-40dc-9808-7289667ad9f8', 'MUHAMMAD IRFAN', '0312027704', '0312027704@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('e3df98a9-6897-4bcb-a3b1-ad44a5bdc150', 'MUH MASRI SARI', '0319039603', '0319039603@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('5cb48431-bc1c-4c94-968b-3c16b226d16f', 'MULYADI SUGIH DHARSONO', '0324106303', '0324106303@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('91ac4dd5-c091-4400-88c4-7cc911ad95ea', 'NADIA DIANDRA', '0330109502', '0330109502@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('1ca0e00e-642c-4b11-812d-014dc156ab7f', 'NUGROHO WIDYA PRIO UTOMO', '0319118304', '0319118304@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('7e5f23fe-25b8-4d19-8464-8ba5720ce5dd', 'NUR AMALYNA YUSRIN', '0319059402', '0319059402@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('4eff3281-f48d-41f5-b574-4344c4ebefea', 'OKTAVIANUS MARTI NANGOY', '0331017404', '0331017404@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('e2cc865b-7f5a-41c2-9546-a6a011f8b4e8', 'PENGKI SUANTO', '0230098803', '0230098803@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('82a49335-c091-4150-8eb5-6b422b481362', 'PRITA KARINA DIANDRA', '0324109801', '0324109801@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('dce704c3-eebf-43e1-9ae0-3f1882072cb2', 'RACHMAT TAUFICK HARDI', '0325096804', '0325096804@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('96a6bf69-8e9e-4de3-823e-313a6204a2f1', 'RAFAEL JONATHAN', '0312098804', '0312098804@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('7275d98f-b84f-4ab0-ba68-6744c58b86d5', 'RAHMAT KUSNEDI', '0311037405', '0311037405@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('d0946348-63f0-4d09-b2db-f1977a64e016', 'REFGIUFI PATRIA AVRIANTO', '0309059801', '0309059801@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('903f500b-6ccf-4211-a201-fe55fecf6f31', 'RENDY AKBAR', '0326049002', '0326049002@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('54398f13-cf19-44c8-b4aa-099a1e3be88c', 'RICHARDUS EKO INDRAJIT', '0324016902', '0324016902@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('d99e2692-1181-4503-a98d-d6b3603ae136', 'RIDO DWI KURNIAWAN', '0302049502', '0302049502@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('732727ba-d894-4626-9de9-6b72cc4daf42', 'RINTHO RANTE RERUNG', '0417099003', '0417099003@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('eb2e7488-006c-4c78-81e7-0be289bd4c5b', 'ROELS NI MADE SRI PUSPADEWI', '0425029401', '0425029401@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('cd0c6299-e5c2-4cae-867a-731adcc7cda2', 'SABDA IMANI RUBIARKO, SE., MT', '0324049103', '0324049103@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('a0d6acb6-4d66-4dad-8ddc-b137539ad72c', 'SHIERLI WIJAYA', '0307108406', '0307108406@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('9d699554-57ee-4f56-8adc-05407d3ef8a6', 'SINTA BINARY LAZUARDI', '9990584654', '9990584654@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('46b82cff-320d-4a24-9e0a-ff0d211054c9', 'SOFTY NUZZELA', '0305099104', '0305099104@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('8adac6d6-3024-4b95-9f87-b7011944b7a4', 'SRI PUJIASTUTI', '0429108106', '0429108106@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('d2387ff9-4ded-4e1d-a6d7-0975c114da4e', 'THAMRIN SOFIAN', '0316048002', '0316048002@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('1dafd39c-16e7-4717-abc2-5db54d52dd0e', 'THERESIA HERLINA ROCHADIANI', '0423038208', '0423038208@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('c74da4f7-2fbd-4494-81a7-ff827bcafdb0', 'TONI ANWAR', '0427116002', '0427116002@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('06a3e262-8e57-46cd-92b0-69dc3ff0546e', 'UBED ABDILAH SYARIF', '0427027504', '0427027504@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('db27b96a-6e74-43e5-aae3-237fe0bafab6', 'VAN BASTEN', '0027048902', '0027048902@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('79c3aef7-3184-47f4-a688-2d91a6fb1a6c', 'WAHYU TISNO ATMOJO', '0326108301', '0326108301@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('3bd38ba2-25cd-45ba-bfbd-d1573aaeb2aa', 'WIDASAPTA SUTAPA', '0320078104', '0320078104@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('d3f2726c-9ba2-4e3f-92a5-08596b52c4ab', 'WILLIAM WIDJAJA', '0412028803', '0412028803@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('4e739619-5474-4670-ae5c-26548c07b3ba', ' WIWI IDAWATI', '0407027106', '0407027106@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('69974df1-3da4-4cb8-a2db-0aba0f7427e9', 'WIWIK NIRMALA SARI', '0805039302', '0805039302@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('983c611a-b726-4f2a-873e-d349d882f545', 'YOVITA ARIANI WINOTO', '0308048404', '0308048404@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL),
('4c9d4466-5a31-461f-abea-1f77bb6a0c1e', 'YUDI AMBORO', '0306097501', '0306097501@sister.sync', NULL, NULL, NULL, 'password123', NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anggota`
--
ALTER TABLE `anggota`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_anggota_litabmas` (`litabmas_id`),
  ADD KEY `idx_anggota_sdm` (`id_sdm`),
  ADD KEY `idx_anggota_peserta` (`id_peserta_didik`),
  ADD KEY `idx_anggota_orang` (`id_orang`);

--
-- Indexes for table `dokumen`
--
ALTER TABLE `dokumen`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_dokumen_litabmas` (`litabmas_id`);

--
-- Indexes for table `litabmas`
--
ALTER TABLE `litabmas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mitra`
--
ALTER TABLE `mitra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mitra_litabmas` (`litabmas_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anggota`
--
ALTER TABLE `anggota`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `anggota`
--
ALTER TABLE `anggota`
  ADD CONSTRAINT `fk_anggota_litabmas` FOREIGN KEY (`litabmas_id`) REFERENCES `litabmas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `dokumen`
--
ALTER TABLE `dokumen`
  ADD CONSTRAINT `fk_dokumen_litabmas` FOREIGN KEY (`litabmas_id`) REFERENCES `litabmas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `mitra`
--
ALTER TABLE `mitra`
  ADD CONSTRAINT `fk_mitra_litabmas` FOREIGN KEY (`litabmas_id`) REFERENCES `litabmas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
