-- ==============================================================================
-- SKEMA DATABASE SUPABASE POSTGRESQL DENGAN KEAMANAN ROW LEVEL SECURITY (RLS)
-- TRACER STUDY JURUSAN TEKNIK ELEKTRO - POLITEKNIK NEGERI MANADO
-- Program Studi: D4 Teknik Informatika, D3 Teknik Listrik, D4 Teknik Listrik, D3 Teknik Informatika
-- Tahun Evaluasi: 2023, 2024, 2025, 2026
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABEL PROGRAM STUDI (prodi)
CREATE TABLE IF NOT EXISTS public.prodi (
    id VARCHAR(10) PRIMARY KEY, -- 'D4-TI', 'D3-TL', 'D4-TL', 'D3-TI'
    nama VARCHAR(100) NOT NULL,
    jenjang VARCHAR(5) NOT NULL CHECK (jenjang IN ('D3', 'D4')),
    jurusan VARCHAR(100) NOT NULL DEFAULT 'Jurusan Teknik Elektro',
    kaprodi VARCHAR(100),
    nip_kaprodi VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL ALUMNI (alumni)
CREATE TABLE IF NOT EXISTS public.alumni (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nim VARCHAR(30) UNIQUE NOT NULL,
    nama VARCHAR(150) NOT NULL,
    prodi_id VARCHAR(10) REFERENCES public.prodi(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    tahun_masuk INT,
    tahun_lulus INT NOT NULL CHECK (tahun_lulus BETWEEN 2018 AND 2030),
    status_aktivitas VARCHAR(30) NOT NULL CHECK (
        status_aktivitas IN ('bekerja', 'wirausaha', 'studi_lanjut', 'mencari_kerja', 'belum_memungkinkan')
    ),
    terlacak BOOLEAN DEFAULT TRUE,
    
    -- Informasi Pekerjaan / Usaha
    nama_instansi VARCHAR(200),
    lokasi_instansi VARCHAR(200),
    jenis_instansi VARCHAR(50) DEFAULT 'swasta_nasional',
    ruang_lingkup VARCHAR(30) CHECK (ruang_lingkup IN ('lokal', 'nasional', 'multinasional')),
    jabatan VARCHAR(150),
    bidang_pekerjaan VARCHAR(150),
    pendapatan_bulanan BIGINT DEFAULT 0, -- F505
    waktu_tunggu_bulan INT DEFAULT 0,    -- C1 / F502
    dipesan_sebelum_lulus BOOLEAN DEFAULT FALSE,
    
    -- Kesesuaian Kurikulum & Relevansi (IKU 1 & LAM Teknik)
    keselarasan_kategori VARCHAR(20) CHECK (keselarasan_kategori IN ('tinggi', 'sedang', 'rendah')),
    keselarasan_horizontal VARCHAR(50), -- sangat_relevan, relevan, cukup_relevan, kurang_relevan, tidak_relevan
    keselarasan_vertikal VARCHAR(50),   -- sesuai_jenjang, lebih_tinggi, lebih_rendah, tidak_memerlukan_pt
    
    -- Kontak & Domisili
    no_hp VARCHAR(30),
    email VARCHAR(100),
    domisili_provinsi VARCHAR(100),
    domisili_kota VARCHAR(100),
    
    -- Metadata Pelaporan
    sumber_data VARCHAR(50) DEFAULT 'kuesioner_mandiri',
    catatan_validasi TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL REKAPITULASI RESMI TAHUNAN (tracer_summary_stats)
CREATE TABLE IF NOT EXISTS public.tracer_summary_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tahun_laporan INT NOT NULL, -- 2023, 2024, 2025, 2026
    tahun_lulusan_label VARCHAR(100) NOT NULL,
    prodi_id VARCHAR(10) REFERENCES public.prodi(id),
    total_lulusan INT NOT NULL,
    lulusan_terlacak INT NOT NULL,
    lulusan_belum_terlacak INT NOT NULL,
    tingkat_keterlacakan NUMERIC(5,2) NOT NULL,
    
    -- Tempat Kerja
    tempat_kerja_lokal INT DEFAULT 0,
    tempat_kerja_nasional INT DEFAULT 0,
    tempat_kerja_multinasional INT DEFAULT 0,
    tempat_kerja_total_tercatat INT DEFAULT 0,
    catatan_validasi_tempat_kerja TEXT,
    
    -- Kesesuaian
    kesesuaian_tinggi INT DEFAULT 0,
    kesesuaian_sedang INT DEFAULT 0,
    kesesuaian_rendah INT DEFAULT 0,
    persen_kesesuaian_tinggi NUMERIC(5,2) DEFAULT 0,
    persen_kesesuaian_sedang_tinggi NUMERIC(5,2) DEFAULT 0,
    
    -- Waktu Tunggu
    waktu_tunggu_kurang_3_bulan INT DEFAULT 0,
    waktu_tunggu_3_sd_6_bulan INT DEFAULT 0,
    waktu_tunggu_lebih_6_bulan INT DEFAULT 0,
    dipesan_sebelum_lulus INT DEFAULT 0,
    catatan_audit_waktu_tunggu TEXT,
    
    responden_pengguna INT DEFAULT 17,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tahun_laporan, prodi_id)
);

-- 5. TABEL SURVEI PENGGUNA LULUSAN / ATASAN (employer_surveys)
CREATE TABLE IF NOT EXISTS public.employer_surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama_instansi VARCHAR(200) NOT NULL,
    nama_penilai VARCHAR(150) NOT NULL,
    jabatan_penilai VARCHAR(150),
    bidang_usaha VARCHAR(150),
    nama_alumni VARCHAR(150) NOT NULL,
    prodi_id VARCHAR(10) REFERENCES public.prodi(id),
    tahun_lulus_alumni INT,
    lama_bekerja VARCHAR(50),
    
    -- 7 Aspek Penilaian Standar Akreditasi (Skala 1-4: 4=SB, 3=B, 2=C, 1=K)
    skor_etika INT CHECK (skor_etika BETWEEN 1 AND 4),
    skor_keahlian INT CHECK (skor_keahlian BETWEEN 1 AND 4),
    skor_bahasa_asing INT CHECK (skor_bahasa_asing BETWEEN 1 AND 4),
    skor_teknologi_informasi INT CHECK (skor_teknologi_informasi BETWEEN 1 AND 4),
    skor_komunikasi INT CHECK (skor_komunikasi BETWEEN 1 AND 4),
    skor_kerjasama_tim INT CHECK (skor_kerjasama_tim BETWEEN 1 AND 4),
    skor_pengembangan_diri INT CHECK (skor_pengembangan_diri BETWEEN 1 AND 4),
    
    -- Masukan Kualitatif
    kekuatan_alumni TEXT,
    aspek_peningkatan TEXT,
    saran_kurikulum TEXT,
    kesediaan_merekrut_kembali BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL USER PROFILES & ROLE-BASED ACCESS
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nama VARCHAR(150) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin_jurusan', 'admin_prodi', 'alumni')),
    prodi_id VARCHAR(10) REFERENCES public.prodi(id),
    email VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- KEAMANAN ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Aktifkan RLS di setiap tabel
ALTER TABLE public.prodi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracer_summary_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 1. Kebijakan Tabel PRODI
CREATE POLICY "Publik dapat membaca daftar prodi" 
    ON public.prodi FOR SELECT USING (true);

-- 2. Kebijakan Tabel TRACER_SUMMARY_STATS (Statistik Agregat Publik & Akreditasi)
CREATE POLICY "Publik dapat membaca rekapitulasi statistik" 
    ON public.tracer_summary_stats FOR SELECT USING (true);

CREATE POLICY "Admin Jurusan dapat mengelola ringkasan statistik" 
    ON public.tracer_summary_stats FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin_jurusan'
        )
    );

-- 3. Kebijakan Tabel ALUMNI
CREATE POLICY "Publik & Alumni dapat menginput data kuesioner" 
    ON public.alumni FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Semua pengguna terotentikasi dan tamu dapat melihat agregat alumni" 
    ON public.alumni FOR SELECT 
    USING (true);

CREATE POLICY "Admin Jurusan memiliki akses penuh seluruh data alumni" 
    ON public.alumni FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_profiles.id = auth.uid() AND user_profiles.role = 'admin_jurusan'
        )
    );

CREATE POLICY "Admin Prodi hanya mengelola data prodi masing-masing" 
    ON public.alumni FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'admin_prodi' 
            AND user_profiles.prodi_id = alumni.prodi_id
        )
    );

-- 4. Kebijakan Tabel EMPLOYER_SURVEYS (Survei Mitra Industri)
CREATE POLICY "Siapapun penilai mitra industri dapat mengisi kuesioner pengguna" 
    ON public.employer_surveys FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Publik dan tim akreditasi dapat melihat hasil survei kepuasan" 
    ON public.employer_surveys FOR SELECT 
    USING (true);

CREATE POLICY "Admin Jurusan dan Prodi dapat mengelola data survei pengguna" 
    ON public.employer_surveys FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles 
            WHERE user_profiles.id = auth.uid() AND user_profiles.role IN ('admin_jurusan', 'admin_prodi')
        )
    );

-- 5. Kebijakan Tabel USER_PROFILES
CREATE POLICY "Pengguna dapat melihat profil mereka sendiri" 
    ON public.user_profiles FOR SELECT 
    USING (auth.uid() = id);

-- Indexes untuk akselerasi query
CREATE INDEX IF NOT EXISTS idx_alumni_prodi_tahun ON public.alumni(prodi_id, tahun_lulus);
CREATE INDEX IF NOT EXISTS idx_alumni_status ON public.alumni(status_aktivitas);
CREATE INDEX IF NOT EXISTS idx_employer_prodi ON public.employer_surveys(prodi_id);
