# SIPPM X SISTER Integration Platform (LPPM)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Security](https://img.shields.io/badge/compliance-UU_PDP-blue)
![License](https://img.shields.io/badge/license-MIT-green)

Platform integrasi antara Sistem Informasi Penelitian dan Pengabdian Masyarakat (SIPPM) dengan sistem SISTER (Sistem Informasi Sumberdaya Terintegrasi). Proyek ini difokuskan pada sinkronisasi data penelitian dosen secara aman dan efisien.

## 🚀 Fitur Utama
- [cite_start]**SSO & Integrated Auth**: Otentikasi menggunakan JWT dengan hashing password Bcrypt[cite: 4].
- [cite_start]**Proposal Lifecycle**: Manajemen status proposal (Draft, Submitted, Under Review, Approved)[cite: 4].
- [cite_start]**Multi-Version Upload**: Pelacakan versi file PDF otomatis (max 5MB)[cite: 4].
- [cite_start]**SISTER Data Mapping**: Modul transformasi data untuk menyesuaikan skema API SISTER[cite: 4].
- [cite_start]**Security & Privacy**: Enkripsi PII (Personally Identifiable Information) di database sesuai UU PDP Indonesia.

## 🏗️ Arsitektur & Teknologi
- **Backend**: Node.js & Express.js
- [cite_start]**Database**: PostgreSQL/MySQL (Skema 3NF) 
- [cite_start]**Authentication**: JWT (JSON Web Token) [cite: 4]
- [cite_start]**Security**: TLS/HTTPS, AES-256 for At-Rest Encryption 

## 🛠️ Panduan Instalasi (Development)

1. **Clone Repositori**
   ```bash
   git clone [https://github.com/username/sippm-sister-platform.git](https://github.com/username/sippm-sister-platform.git)
   cd sippm-sister-platform
