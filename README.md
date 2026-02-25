# SIPPM X SISTER Integration Platform (LPPM)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Standard: Clean Code](https://img.shields.io/badge/Standard-Clean%20Code-brightgreen)](https://github.com/clean-code-javascript/clean-code-javascript)
[![Security: UU PDP Compliant](https://img.shields.io/badge/Security-UU%20PDP-blue)](https://id.wikipedia.org/wiki/Undang-Undang_Pelindungan_Data_Pribadi)

## 📌 Project Overview
**SIPPM X SISTER** adalah platform integrasi data penelitian dan pengabdian masyarakat yang dirancang untuk menjembatani sistem internal LPPM dengan skema API SISTER pusat. Proyek ini merupakan **Capstone Project** yang mengintegrasikan tiga mata kuliah utama: **Arsitektur Perangkat Lunak**, **Rekayasa Perangkat Lunak**, dan **Pemrograman Web**.

Fokus utama sistem adalah pada integritas data, keamanan informasi sesuai regulasi **UU PDP Indonesia**, dan skalabilitas arsitektur.

## 👥 The Team (Tim 1B - Pak Haryono)
Anggota tim yang bertanggung jawab atas pengembangan platform ini:
* **Ceeley Richela**
* **Cyril Natasha Setiawan**
* **M. Ariq Fakhrizaki P.**
* **Nicolas Julian Kurnia P.**
* **Pius Petra Lovinno**
* **Dierlyawan Wiguna**
* **Hugo Alexander Tanoto**

## 🚀 Key Features
### 1. Authentication & Governance
* **SSO/Integrated Auth:** Menggunakan **JWT** untuk otentikasi dan **Bcrypt** untuk hashing password.
* **Role-Based Access Control (RBAC):** Akses terpisah untuk Admin, Dosen, Reviewer, dan Mahasiswa/Umum.

### 2. Proposal Lifecycle Management
* **CRUD Operations:** Manajemen siklus hidup proposal (Draft, Submitted, Under Review, Approved).
* **Multi-Version Upload:** Pelacakan versi file PDF (V1, V2, Final) dengan batas maksimal 5MB.
* **Feedback Loop:** Anotasi dan komentar langsung dari Reviewer pada dashboard Dosen.

### 3. SISTER Integration Engine
* **Data Mapping:** Modul otomatisasi pemetaan field data SIPPM ke skema API SISTER.
* **Export Engine:** Ekspor data tervalidasi ke format JSON/Excel sesuai template SISTER.

## 🛠 Technical Specification
### Architecture & Security
* **Arsitektur:** Menggunakan **Layered Architecture** untuk memastikan pemisahan *Business Logic* dan *Data Access*.
* **Database:** Dirancang dengan standar **3NF** untuk konsistensi data.
* **Keamanan PDP:** Enkripsi **AES-256 (At Rest)** untuk data pribadi dan penggunaan **TLS/HTTPS** untuk transmisi.
* **Performance:** Response time pencarian data dipastikan **< 2 detik** untuk 10.000 record/tahun.

### Technology Stack
* **Frontend:** React.js / Vue.js + Tailwind CSS.
* **Backend:** Node.js (Express) / Python (Django/Flask).
* **Database:** PostgreSQL / MySQL.

## 📁 Repository Structure
Struktur repositori ini mengikuti standar **Clean Code** dan metodologi **RPL**:
* `/docs`: Dokumentasi SRS, UML, dan Test Plan.
* `/backend`: API server dan Business Logic.
* `/frontend`: UI/UX responsif.
* `/testing`: Unit Testing dan Integration Testing scripts.

## 📝 Installation & Setup (Draft)
1. Clone repositori: `git clone [url-repo]`
2. Install dependencies: `npm install` atau `pip install -r requirements.txt`
3. Konfigurasi `.env` untuk enkripsi AES-256 dan JWT Secret.
4. Run migrations untuk setup schema database 3NF.

---
*Proyek ini dikembangkan untuk memenuhi syarat Capstone Project di **Pradita University**.*
