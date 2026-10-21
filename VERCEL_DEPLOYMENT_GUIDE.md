# PANDUAN LENGKAP DEPLOYMENT KE VERCEL (FREE TIER) & SUPABASE
## Website Tracer Study Jurusan Elektro Politeknik Negeri Manado

Dokumen ini memandu langkah demi langkah penerapan (*deployment*) website Tracer Study Jurusan Teknik Elektro Politeknik Negeri Manado ke platform cloud **Vercel** dan **Supabase** secara 100% gratis (*Free Tier*).

---

## 1. Persiapan Database Supabase (Free Tier)

Supabase menyediakan PostgreSQL cloud gratis (500 MB database, 50.000 pengguna bulanan) yang dilengkapi keamanan **Row Level Security (RLS)**.

### Langkah 1.1: Buat Proyek Supabase Baru
1. Buka [https://supabase.com](https://supabase.com) dan login / daftar menggunakan akun GitHub Anda.
2. Klik tombol **New Project**.
3. Isi data proyek:
   - **Name**: `tracer-study-elektro-polimdo`
   - **Database Password**: Buat password yang kuat dan catat dengan aman.
   - **Region**: Pilih **Singapore (ap-southeast-1)** (paling dekat dan cepat untuk Indonesia/Manado).
   - **Pricing Plan**: Pilih **Free Tier ($0/month)**.
4. Klik **Create new project** dan tunggu 1-2 menit hingga database aktif.

### Langkah 1.2: Eksekusi Skema Database & Migrasi Data Laporan
1. Di sidebar dashboard Supabase, klik menu **SQL Editor**.
2. Klik tombol **New Query**.
3. Buka file [`supabase/schema.sql`](supabase/schema.sql) dari proyek ini, salin seluruh kodenya, tempel di SQL Editor, lalu klik tombol **Run**.
   - *Ini akan membuat tabel `prodi`, `alumni`, `tracer_summary_stats`, `employer_surveys`, `user_profiles`, indeks, dan seluruh aturan keamanan RLS.*
4. Buka file [`supabase/seed.sql`](supabase/seed.sql), salin seluruh kodenya, tempel di SQL Editor baru, lalu klik **Run**.
   - *Ini akan memigrasikan angka resmi Laporan Tracer Study 2024 & 2025 (D3 Teknik Listrik), 4 Program Studi, 17 instansi mitra, dan kohort alumni tanpa mengubah angka sedikitpun.*

### Langkah 1.3: Ambil Kredensial API Supabase
1. Di dashboard Supabase, klik ikon **Project Settings** (ikon gerigi di kiri bawah).
2. Pilih submenu **API**.
3. Salin dua nilai berikut:
   - **Project URL** (contoh: `https://xyzcompany.supabase.co`)
   - **Project API keys -> `anon` / `public`** (kunci JWT publik yang aman untuk browser)

---

## 2. Pengujian Lokal

Aplikasi sudah mendukung **mode dual-engine**:
- Jika kredensial Supabase di `.env.local` belum diisi, website otomatis aktif menggunakan *in-memory & local-storage reactive store* yang sudah terisi data resmi 2024 & 2025 sehingga langsung bisa dipakai dan didemokan.
- Jika kredensial diisi, data otomatis tersinkronisasi ke PostgreSQL cloud Supabase.

Jalankan server pengembangan di terminal:
```bash
cd "d:\GEMINI\tracer-study-elektro-polimdo"
npm run dev
```
Buka browser pada alamat: `http://localhost:3000`

---

## 3. Langkah Deployment ke Vercel (100% Free Tier)

Vercel adalah platform hosting serverless resmi dari kreator Next.js dengan performa tinggi dan bandwidth gratis melimpah.

### Langkah 3.1: Push Kode ke GitHub
1. Inisialisasi Git di repositori lokal:
   ```powershell
   cd "d:\GEMINI\tracer-study-elektro-polimdo"
   git init
   git add .
   git commit -m "Initial commit Tracer Study Elektro Polimdo"
   ```
2. Buat repositori baru di akun [GitHub](https://github.com/new) Anda (misal dinamai: `tracer-study-elektro-polimdo`).
3. Hubungkan repositori lokal ke GitHub:
   ```powershell
   git remote add origin https://github.com/username-anda/tracer-study-elektro-polimdo.git
   git branch -M main
   git push -u origin main
   ```

### Langkah 3.2: Hubungkan Repositori ke Vercel
1. Masuk ke [https://vercel.com](https://vercel.com) (login menggunakan akun GitHub).
2. Klik tombol **Add New...** -> **Project**.
3. Pada daftar repositori GitHub, cari `tracer-study-elektro-polimdo` lalu klik tombol **Import**.
4. Pada form konfigurasi proyek:
   - **Framework Preset**: Biarkan otomatis `Next.js`.
   - **Root Directory**: `./`
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
5. Buka bagian **Environment Variables**, lalu tambahkan dua variabel dari Supabase:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Project URL Anda dari Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (Anon public key Anda dari Supabase)
6. Klik tombol **Deploy**.

Dalam waktu 1-2 menit, Vercel akan selesai mem-build dan memberikan domain publik gratis, contoh:
`https://tracer-study-elektro-polimdo.vercel.app`

---

## 4. Fitur-Fitur Siap Pakai yang Tersedia

1. **Dashboard Statistik Real-Time**:
   - Filter tahun: 2023, 2024, 2025, 2026, dan Semua Tahun.
   - Filter 4 prodi: D4 Teknik Informatika, D3 Teknik Listrik, D4 Teknik Listrik, D3 Teknik Informatika.
   - Visualisasi Donut Kesesuaian, Bar Waktu Tunggu, Bar Skala Tempat Kerja, dan Radar 7 Aspek Kepuasan.
   - Panel Audit Mutu & Catatan Validasi sesuai dokumen asli.
2. **Manajemen Data Alumni (`/alumni`)**:
   - Pencarian cerdas (NIM, Nama, Perusahaan, Jabatan).
   - Ekspor Excel (.xlsx) dengan SheetJS satu klik.
   - Impor Excel / CSV dengan fitur validasi dan pratinjau sebelum simpan.
   - Tambah, Edit, Hapus, dan Modal Detail Profil lengkap.
3. **Kuesioner Online Alumni (`/kuesioner`)**:
   - Multi-step form interaktif mengacu pada Instrumen Resmi 2026.
   - Lembar Bukti Pengisian Kuesioner berstempel resmi yang dapat langsung dicetak.
4. **Survei Kepuasan Pengguna Lulusan (`/kepuasan-pengguna`)**:
   - Rekap 17 instansi industri mitra resmi.
   - Evaluasi 7 aspek kompetensi standar akreditasi LAM Teknik & BAN-PT.
   - Formulir khusus atasan / HRD industri.
5. **Analisis Komparasi (`/analisis-komparasi`)**:
   - Grafik tren multi-tahun 2023–2026.
   - Benchmark antar 4 program studi.
   - Analisis gap kompetensi (Bahasa Asing vs Software Digital vs Etika).
6. **Laporan Otomatis Akreditasi (`/laporan-akreditasi`)**:
   - Kop surat resmi Politeknik Negeri Manado.
   - Tabel LKPS Kriteria 8.d.1, 8.d.2, 8.e.1, dan Capaian IKU 1.
   - Lembar pengesahan bertanda tangan Ketua Jurusan & Koordinator Prodi.
   - Cetak langsung atau simpan ke PDF dengan print layout bersih tanpa tombol navigasi.

---
*Dibuat untuk Tim Akreditasi Jurusan Teknik Elektro Politeknik Negeri Manado &copy; 2026.*
