# 📘 Panduan Pembuatan Database SISTER (Litabmas)

Panduan langkah-langkah pembuatan database MySQL sesuai endpoint **SISTER API** untuk data **Penelitian/Pengabdian**.

> **API:** `https://sister-api.kemdiktisaintek.go.id/`

---

## 📋 Daftar Tabel

| No | Nama Tabel | Keterangan |
|----|-----------|------------|
| 1 | `litabmas` | Tabel utama penelitian/pengabdian |
| 2 | `mitra` | Mitra litabmas (dunia usaha/industri) |
| 3 | `anggota` | Anggota (Dosen/Mahasiswa/Profesional) |
| 4 | `dokumen` | Dokumen pendukung litabmas |

### Relasi Antar Tabel

```
litabmas (PK: id)
    ├── 1:N ──► mitra (FK: litabmas_id)
    ├── 1:N ──► anggota (FK: litabmas_id)
    └── 1:N ──► dokumen (FK: litabmas_id)
```

---

## 🚀 Langkah-Langkah

### 1. Login ke MySQL via Command Line

```bash
mysql -u root -ppassword
```

> Password CLI = `password` | phpMyAdmin server = `password123`

### 2. Jalankan File SQL

**Via Command Line:**

```bash
mysql -u root -ppassword < /path/to/LPPM-x-SISTER/SIPPM/sister_litabmas.sql
```

**Via phpMyAdmin:**

1. Buka `http://localhost/phpmyadmin` → Login: `root` / `password123`
2. Klik **"Import"** → pilih file `sister_litabmas.sql` → klik **"Go"**

### 3. Verifikasi

```sql
USE penelitian;
SHOW TABLES;
```

Output:

```
+----------------------+
| Tables_in_penelitian |
+-------------------+
| litabmas          |
| mitra             |
| anggota           |
| dokumen           |
+----------------------+
```

---

## 📥 Import Data dari SISTER API

### Prasyarat — File `.env`

```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=password
DB_NAME=penelitian

SISTER_ID_USER=<id_pengguna_sister>
SISTER_USERNAME=<username_sister>
SISTER_PASSWORD=<password_sister>
```

### Jalankan Sync

```bash
cd SIPPM
npm install
npx ts-node src/services/syncToDb.ts
```

---

## 📊 Mapping SISTER API → MySQL

### Tabel `litabmas`

| Field SISTER | Kolom MySQL | Tipe |
|---|---|---|
| `id` | `id` | CHAR(36) |
| `id_kategori_kegiatan` | `id_kategori_kegiatan` | INT |
| `judul` | `judul` | VARCHAR(500) |
| `id_afiliasi` | `id_afiliasi` | CHAR(36) |
| `afiliasi` | `afiliasi` | VARCHAR(255) |
| `id_kelompok_bidang` | `id_kelompok_bidang` | CHAR(36) |
| `kelompok_bidang` | `kelompok_bidang` | VARCHAR(255) |
| `id_litabmas_sebelumnya` | `id_litabmas_sebelumnya` | CHAR(36) |
| `litabmas_sebelumnya` | `litabmas_sebelumnya` | VARCHAR(500) |
| `id_jenis_skim` | `id_jenis_skim` | CHAR(36) |
| `jenis_skim` | `jenis_skim` | VARCHAR(255) |
| `lokasi` | `lokasi` | VARCHAR(500) |
| `tahun_usulan` | `tahun_usulan` | INT |
| `tahun_kegiatan` | `tahun_kegiatan` | INT |
| `tahun_pelaksanaan` | `tahun_pelaksanaan` | INT |
| `lama_kegiatan` | `lama_kegiatan` | INT |
| `tahun_pelaksanaan_ke` | `tahun_pelaksanaan_ke` | INT |
| `dana_dikti` | `dana_dikti` | DECIMAL(15,2) |
| `dana_perguruan_tinggi` | `dana_perguruan_tinggi` | DECIMAL(15,2) |
| `dana_institusi_lain` | `dana_institusi_lain` | DECIMAL(15,2) |
| `in_kind` | `in_kind` | TEXT |
| `sk_penugasan` | `sk_penugasan` | VARCHAR(255) |
| `tanggal_sk_penugasan` | `tanggal_sk_penugasan` | DATE |

### Tabel `mitra` (dari array `mitra_litabmas`)

| Field SISTER | Kolom MySQL | Tipe |
|---|---|---|
| `id` | `id` | CHAR(36) |
| — | `litabmas_id` | CHAR(36) FK |
| `nama` | `nama` | VARCHAR(255) |

### Tabel `anggota` (dari array `anggota`)

| Field SISTER | Kolom MySQL | Tipe |
|---|---|---|
| — | `id` | BIGINT AUTO_INCREMENT |
| — | `litabmas_id` | CHAR(36) FK |
| `nama` | `nama` | VARCHAR(255) |
| `jenis` | `jenis` | ENUM |
| `id_sdm` | `id_sdm` | CHAR(36) |
| `id_peserta_didik` | `id_peserta_didik` | CHAR(36) |
| `nomor_induk_peserta_didik` | `nomor_induk_peserta_didik` | VARCHAR(50) |
| `id_orang` | `id_orang` | CHAR(36) |
| `aktif` | `aktif` | TINYINT(1) |
| `peran` | `peran` | VARCHAR(50) |

### Tabel `dokumen` (dari array `dokumen`)

| Field SISTER | Kolom MySQL | Tipe |
|---|---|---|
| `id` | `id` | CHAR(36) |
| — | `litabmas_id` | CHAR(36) FK |
| `nama` | `nama` | VARCHAR(255) |
| `jenis_dokumen` | `jenis_dokumen` | VARCHAR(100) |
| `nama_file` | `nama_file` | VARCHAR(255) |
| `jenis_file` | `jenis_file` | VARCHAR(100) |
| `tanggal_upload` | `tanggal_upload` | DATETIME |
| `tautan` | `tautan` | TEXT |
| `keterangan` | `keterangan` | TEXT |

---

## 🔧 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `Unknown database 'penelitian'` | Jalankan `CREATE DATABASE penelitian;` dulu |
| `Access denied for user 'root'` | Cek password: `password` (CLI) / `password123` (server) |
| `Cannot add foreign key` | Pastikan tabel `litabmas` sudah dibuat duluan |
| `Data truncated for 'jenis'` | Value harus: `Dosen`, `Mahasiswa`, atau `Profesional/Mitra` |
