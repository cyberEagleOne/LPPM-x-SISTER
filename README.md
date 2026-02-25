# SIPPM X SISTER Integration Platform (LPPM)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Standard: Clean Code](https://img.shields.io/badge/Standard-Clean%20Code-brightgreen)](https://github.com/clean-code-javascript/clean-code-javascript)
[![Security: UU PDP Compliant](https://img.shields.io/badge/Security-UU%20PDP-blue)](https://id.wikipedia.org/wiki/Undang-Undang_Pelindungan_Data_Pribadi)

## 📌 Project Overview
[cite_start]**SIPPM X SISTER** adalah platform integrasi data penelitian dan pengabdian masyarakat yang dirancang untuk menjembatani sistem internal LPPM dengan skema API SISTER pusat. [cite: 265, 268] [cite_start]Proyek ini merupakan **Capstone Project** yang mengintegrasikan tiga mata kuliah utama: **Arsitektur Perangkat Lunak**, **Rekayasa Perangkat Lunak**, dan **Pemrograman Web**. [cite: 271, 272]

[cite_start]Fokus utama sistem adalah pada integritas data, keamanan informasi sesuai regulasi **UU PDP Indonesia**, dan skalabilitas arsitektur. [cite: 265, 269]

## 👥 The Team (Tim 1B - Pak Haryono)
[cite_start]Anggota tim yang bertanggung jawab atas pengembangan platform ini: [cite: 549]
* [cite_start]**Ceeley Richela** [cite: 550]
* [cite_start]**Cyril Natasha Setiawan** [cite: 551]
* **M. [cite_start]Ariq Fakhrizaki P.** [cite: 552]
* **Nicolas Julian Kurnia P.** [cite: 553]
* [cite_start]**Pius Petra Lovinno** [cite: 554]
* [cite_start]**Dierlyawan Wiguna** [cite: 555]
* **Hugo Alexander Tanoto** [cite: 556]

## 🚀 Key Features
### 1. Authentication & Governance
* [cite_start]**SSO/Integrated Auth:** Menggunakan **JWT** untuk otentikasi dan **Bcrypt** untuk hashing password. [cite: 268]
* [cite_start]**Role-Based Access Control (RBAC):** Akses terpisah untuk Admin, Dosen, Reviewer, dan Mahasiswa/Umum. [cite: 1, 268]

### 2. Proposal Lifecycle Management
* **CRUD Operations:** Manajemen siklus hidup proposal (Draft, Submitted, Under Review, Approved). [cite: 268]
* [cite_start]**Multi-Version Upload:** Pelacakan versi file PDF (V1, V2, Final) dengan batas maksimal 5MB. [cite: 268]
* [cite_start]**Feedback Loop:** Anotasi dan komentar langsung dari Reviewer pada dashboard Dosen. [cite: 268]

### 3. SISTER Integration Engine
* **Data Mapping:** Modul otomatisasi pemetaan field data SIPPM ke skema API SISTER. [cite: 268]
* [cite_start]**Export Engine:** Ekspor data tervalidasi ke format JSON/Excel sesuai template SISTER. [cite: 268]

## 🛠 Technical Specification
### Architecture & Security
* [cite_start]**Arsitektur:** Menggunakan **Layered Architecture** untuk memastikan pemisahan *Business Logic* dan *Data Access*. [cite: 304]
* **Database:** Dirancang dengan standar **3NF** untuk konsistensi data. [cite: 269]
* [cite_start]**Keamanan PDP:** Enkripsi **AES-256 (At Rest)** untuk data pribadi dan penggunaan **TLS/HTTPS** untuk transmisi. [cite: 269]
* [cite_start]**Performance:** Response time pencarian data dipastikan **< 2 detik** untuk 10.000 record/tahun. [cite: 269]

### Technology Stack
* **Frontend:** HTML5, CSS3, JavaScript (Framework: React/Vue). [cite: 326, 332]
* [cite_start]**Backend:** Node.js/Express atau Python (Django/Flask). [cite: 327, 333]
* [cite_start]**Database:** PostgreSQL atau MySQL. [cite: 327, 334]

## 📁 Repository Structure
[cite_start]Struktur repositori ini mengikuti standar **Clean Code** dan metodologi **RPL**: [cite: 269, 316]
* [cite_start]`/docs`: Dokumentasi SRS, UML, dan Test Plan. [cite: 311, 312, 315]
* `/backend`: API server dan Business Logic. [cite: 333]
* [cite_start]`/frontend`: UI/UX responsif. [cite: 332]
* [cite_start]`/testing`: Unit Testing dan Integration Testing scripts. [cite: 315, 389, 390]

## 📝 Installation & Setup
[cite_start]*(Instruksi ini akan diperbarui pada Fase Implementasi Minggu 5-11)* [cite: 294, 371]
1. Clone repositori: `git clone [url-repo]`
2. Install dependencies: `npm install` atau `pip install -r requirements.txt`
3. [cite_start]Konfigurasi `.env` untuk enkripsi AES-256 dan JWT Secret. [cite: 268, 269]
4. [cite_start]Run migrations untuk setup schema database 3NF. [cite: 269, 375]

## 📊 Project Progress (Sprint-based)
[cite_start]Kami menggunakan metodologi **Agile Scrum** dengan sprint 2 mingguan. [cite: 318]
* **Sprint 1:** Setup & Core Features (Auth, DB Schema). [cite: 373]
* [cite_start]**Sprint 2:** Main Features (Proposal CRUD, Reviewer UI). [cite: 376]
* [cite_start]**Sprint 3:** Advanced Features (SISTER Integration, File Upload). [cite: 378]
* **Sprint 4:** Testing, QA, and Deployment. [cite: 386, 402]

---
*Proyek ini dikembangkan untuk memenuhi syarat kelulusan Capstone Project di **Pradita University**.* [cite: 273, 534]
