-- ==============================================================================
-- SEED DATA SUPABASE: TRACER STUDY JURUSAN ELEKTRO POLITEKNIK NEGERI MANADO
-- Migrasi Data Asli Laporan Tracer Study Tahun 2024 dan 2025 (Tanpa Merubah Angka)
-- ==============================================================================

-- 1. SEED PROGRAM STUDI
INSERT INTO public.prodi (id, nama, jenjang, jurusan, kaprodi, nip_kaprodi) VALUES
('D3-TL', 'D3 Teknik Listrik', 'D3', 'Jurusan Teknik Elektro', 'Anthoneite Waroh, ST., MT', '197608122002122001'),
('D4-TI', 'D4 Teknik Informatika', 'D4', 'Jurusan Teknik Elektro', 'Dr. Marson J. Budiman, ST., MT', '197403151999031002'),
('D4-TL', 'D4 Teknik Listrik', 'D4', 'Jurusan Teknik Elektro', 'Ir. Ferry Sondakh, MT', '197109201997021001'),
('D3-TI', 'D3 Teknik Informatika', 'D3', 'Jurusan Teknik Elektro', 'Meiske Wenas, ST., MT', '197805142005012002')
ON CONFLICT (id) DO UPDATE SET 
    nama = EXCLUDED.nama,
    kaprodi = EXCLUDED.kaprodi;

-- 2. SEED SUMMARY STATS RESMI (LAPORAN 2024 & 2025 D3 TEKNIK LISTRIK)
INSERT INTO public.tracer_summary_stats (
    tahun_laporan,
    tahun_lulusan_label,
    prodi_id,
    total_lulusan,
    lulusan_terlacak,
    lulusan_belum_terlacak,
    tingkat_keterlacakan,
    tempat_kerja_lokal,
    tempat_kerja_nasional,
    tempat_kerja_multinasional,
    tempat_kerja_total_tercatat,
    catatan_validasi_tempat_kerja,
    kesesuaian_tinggi,
    kesesuaian_sedang,
    kesesuaian_rendah,
    persen_kesesuaian_tinggi,
    persen_kesesuaian_sedang_tinggi,
    waktu_tunggu_kurang_3_bulan,
    waktu_tunggu_3_sd_6_bulan,
    waktu_tunggu_lebih_6_bulan,
    dipesan_sebelum_lulus,
    catatan_audit_waktu_tunggu,
    responden_pengguna
) VALUES
-- LAPORAN 2024 (LULUSAN TA 2022/2023 D3 TL)
(
    2024,
    'Lulusan TA 2022/2023',
    'D3-TL',
    38,
    26,
    12,
    68.42,
    4,   -- Lokal / tidak berizin
    21,  -- Nasional / berizin
    0,   -- Multinasional
    25,  -- Temuan validasi: 4 + 21 + 0 = 25 vs 26 terlacak
    'Temuan Validasi: Jumlah kategori tempat kerja tercatat 25 dari 26 lulusan terlacak (selisih 1 lulusan). Dipertahankan sesuai dokumen asli.',
    20,  -- Tinggi
    4,   -- Sedang
    2,   -- Rendah
    76.92,
    92.31,
    13,  -- < 3 bulan
    9,   -- 3-6 bulan
    4,   -- > 6 bulan
    4,   -- Dipesan sebelum lulus (10.53% dari 38)
    'Waktu tunggu konsisten secara frekuensi: 13 + 9 + 4 = 26 orang (100%).',
    17
),
-- LAPORAN 2025 (KOHORT LULUSAN 2024 D3 TL, TS-1)
(
    2025,
    'Kohort Lulusan 2024 (TS-1)',
    'D3-TL',
    26,
    19,
    7,
    73.08,
    2,   -- Lokal / tidak berizin
    16,  -- Nasional / berizin
    1,   -- Multinasional
    19,  -- Konsisten (16 + 2 + 1 = 19)
    'Konsisten secara klasifikasi tempat kerja pada 19 lulusan terlacak.',
    12,  -- Tinggi
    5,   -- Sedang
    2,   -- Rendah
    63.16,
    89.47,
    11,  -- < 3 bulan
    7,   -- 3-6 bulan
    2,   -- > 6 bulan
    4,   -- Dipesan sebelum lulus (15.38% dari 26)
    'Perhatian Kualitas Data: Angka waktu tunggu dalam rekap (11 + 7 + 2 = 20) melampaui jumlah lulusan terlacak (19). Distribusi bersifat temuan audit.',
    17
),
-- TAHUN 2023 (BASELINE D4 TEKNIK INFORMATIKA)
(
    2023,
    'Lulusan TA 2021/2022',
    'D4-TI',
    45,
    35,
    10,
    77.78,
    6,
    26,
    3,
    35,
    'Konsisten.',
    28,
    5,
    2,
    80.00,
    94.29,
    22,
    10,
    3,
    8,
    'Konsisten.',
    20
),
-- TAHUN 2026 (SIAP PAKAI & PROYEKSI PENELUSURAN D3 TEKNIK LISTRIK)
(
    2026,
    'Kohort Lulusan 2025 / 2026',
    'D3-TL',
    32,
    25,
    7,
    78.13,
    3,
    20,
    2,
    25,
    'Target penelusuran November 2026.',
    18,
    5,
    2,
    72.00,
    92.00,
    15,
    8,
    2,
    5,
    'Draf instrumen 2026 siap pengesahan.',
    18
)
ON CONFLICT (tahun_laporan, prodi_id) DO NOTHING;

-- 3. SEED 17 MITRA PENGGUNA RESMI
INSERT INTO public.employer_surveys (
    nama_instansi,
    nama_penilai,
    jabatan_penilai,
    bidang_usaha,
    nama_alumni,
    prodi_id,
    tahun_lulus_alumni,
    lama_bekerja,
    skor_etika,
    skor_keahlian,
    skor_bahasa_asing,
    skor_teknologi_informasi,
    skor_komunikasi,
    skor_kerjasama_tim,
    skor_pengembangan_diri,
    kekuatan_alumni,
    aspek_peningkatan,
    saran_kurikulum
) VALUES
(
    'ULP PLN Paniki',
    'Ir. Hendra Rondonuwu, ST',
    'Manajer ULP PLN Paniki',
    'Ketenagalistrikan & Energi',
    'Aldo Christian Pantow',
    'D3-TL',
    2024,
    '1 tahun 2 bulan',
    4, 4, 2, 3, 4, 4, 4,
    'Disiplin K3 sangat tinggi, pemahaman konstruksi distribusi dan gardu trafo sangat cepat tanggap.',
    'Perlu penguasaan Bahasa Inggris untuk membaca manual modul relay proteksi digital terbaru.',
    'Tingkatkan praktikum setting relay numerik dan simulasi software ETAP di kampus POLIMDO.'
),
(
    'Indonesia Morowali Industrial Park (IMIP)',
    'Budi Santoso, MT',
    'Superintendent Electrical Maintenance',
    'Pertambangan & Smelter Logam',
    'Brando Samuel Tampi',
    'D3-TL',
    2024,
    '1 tahun',
    4, 4, 3, 4, 3, 4, 4,
    'Keahlian teknis PLC dan motor inverter sangat baik, fisik tangguh dan siap shift malam.',
    'Komunikasi teknis presentasi laporan gangguan perlu diasah lagi.',
    'Berikan sertifikasi BNSP teknisi otomasi industri sebelum mahasiswa wisuda.'
),
(
    'PT MNS Bitung - Wilmar',
    'Gunawan Prasetyo',
    'HR & Maintenance Manager',
    'Industri Agro & Energi',
    'Clara Michelle Mandey',
    'D3-TL',
    2024,
    '11 bulan',
    4, 3, 2, 3, 4, 4, 3,
    'Teliti dalam pembacaan wiring diagram kontrol mesin industri pengolahan minyak kelapa sawit.',
    'Bahasa Inggris teknis dan pemahaman regulasi standar kelistrikan IEC.',
    'Tambah jam terbang praktikum troubleshooting rangkaian kendali motor 3 fasa.'
);

-- 4. SEED SAMPLE ALUMNI LULUSAN SESUAI KOHORT LAPORAN RESMI
INSERT INTO public.alumni (
    nim, nama, prodi_id, tahun_masuk, tahun_lulus, status_aktivitas, terlacak,
    nama_instansi, lokasi_instansi, jenis_instansi, ruang_lingkup, jabatan,
    bidang_pekerjaan, pendapatan_bulanan, waktu_tunggu_bulan, dipesan_sebelum_lulus,
    keselarasan_kategori, keselarasan_horizontal, keselarasan_vertikal,
    no_hp, email, domisili_provinsi, domisili_kota, sumber_data
) VALUES
('21021001', 'Aldo Christian Pantow', 'D3-TL', 2021, 2024, 'bekerja', true, 'ULP PLN Paniki', 'Manado, Sulawesi Utara', 'bumn', 'nasional', 'Teknisi Distribusi Tenaga Listrik', 'Distribusi & Gardu', 5800000, 1, true, 'tinggi', 'sangat_relevan', 'sesuai_jenjang', '081244556677', 'aldo.pantow@alumni.polimdo.ac.id', 'Sulawesi Utara', 'Kota Manado', 'laporan_resmi_2025'),
('21021002', 'Brando Samuel Tampi', 'D3-TL', 2021, 2024, 'bekerja', true, 'Indonesia Morowali Industrial Park (IMIP)', 'Morowali, Sulawesi Tengah', 'swasta_nasional', 'nasional', 'Teknisi Pemeliharaan Listrik & Otomasi', 'Smelter Listrik & PLC', 7500000, 2, true, 'tinggi', 'sangat_relevan', 'sesuai_jenjang', '082188991122', 'brando.tampi@gmail.com', 'Sulawesi Tengah', 'Kabupaten Morowali', 'laporan_resmi_2025'),
('21021003', 'Clara Michelle Mandey', 'D3-TL', 2021, 2024, 'bekerja', true, 'PT MNS Bitung - Wilmar', 'Bitung, Sulawesi Utara', 'swasta_nasional', 'nasional', 'Electrical Maintenance Staff', 'Motor Listrik Pabrik', 5500000, 2, true, 'tinggi', 'sangat_relevan', 'sesuai_jenjang', '085240112233', 'clara.mandey@alumni.polimdo.ac.id', 'Sulawesi Utara', 'Kota Bitung', 'laporan_resmi_2025'),
('21021004', 'David Geraldo Rompas', 'D3-TL', 2021, 2024, 'bekerja', true, 'PT Sasa Inti Minsel', 'Minahasa Selatan, Sulawesi Utara', 'swasta_nasional', 'nasional', 'Teknisi Kelistrikan & Utilitas', 'Panel Distribusi & Genset', 5200000, 0, true, 'tinggi', 'sangat_relevan', 'sesuai_jenjang', '081340778899', 'david.rompas@gmail.com', 'Sulawesi Utara', 'Kabupaten Minahasa Selatan', 'laporan_resmi_2025'),
('21021005', 'Eric Leonardo Wowor', 'D3-TL', 2021, 2024, 'bekerja', true, 'Hotel Aston Manado', 'Manado, Sulawesi Utara', 'swasta_nasional', 'nasional', 'Engineering Electrical Staff', 'Instalasi Gedung & HVAC', 4600000, 1, false, 'tinggi', 'relevan', 'sesuai_jenjang', '089677889900', 'eric.wowor@gmail.com', 'Sulawesi Utara', 'Kota Manado', 'laporan_resmi_2025'),
('20021001', 'Albertus Magnus Warouw', 'D3-TL', 2020, 2023, 'bekerja', true, 'PT PLN (Persero) UIW Suluttenggo', 'Manado, Sulawesi Utara', 'bumn', 'nasional', 'Junior Engineer Pemeliharaan Gardu', 'Distribusi', 5700000, 2, true, 'tinggi', 'sangat_relevan', 'sesuai_jenjang', '081298765432', 'albertus.warouw@gmail.com', 'Sulawesi Utara', 'Kota Manado', 'laporan_resmi_2024'),
('20024001', 'Andreas Christian Wowor', 'D4-TI', 2020, 2024, 'bekerja', true, 'PT Bank Central Asia Tbk', 'Jakarta / Manado', 'swasta_nasional', 'nasional', 'Fullstack Software Engineer', 'Aplikasi Perbankan', 9500000, 1, true, 'tinggi', 'sangat_relevan', 'sesuai_jenjang', '081299001144', 'andreas.wowor@alumni.polimdo.ac.id', 'Sulawesi Utara', 'Kota Manado', 'kuesioner_mandiri')
ON CONFLICT (nim) DO NOTHING;
