export type ProdiId = 'D4-TI' | 'D3-TL' | 'D4-TL' | 'D3-TI';

export interface ProdiInfo {
  id: ProdiId;
  nama: string;
  jenjang: 'D3' | 'D4';
  jurusan: string;
  kaprodi: string;
  nipKaprodi: string;
}

export type StatusAktivitas = 
  | 'bekerja' 
  | 'wirausaha' 
  | 'studi_lanjut' 
  | 'mencari_kerja' 
  | 'belum_memungkinkan';

export type RuangLingkup = 'lokal' | 'nasional' | 'multinasional';

export type TingkatKesesuaian = 'tinggi' | 'sedang' | 'rendah';

export interface AlumniRecord {
  id: string;
  nim: string;
  nama: string;
  prodiId: ProdiId;
  tahunLulus: number; // 2022, 2023, 2024, 2025, 2026
  tahunMasuk?: number;
  statusAktivitas: StatusAktivitas;
  terlacak: boolean;
  
  // Data Pekerjaan
  namaInstansi?: string;
  lokasiInstansi?: string;
  jenisInstansi?: 'pemerintah' | 'bumn' | 'swasta_nasional' | 'multinasional' | 'wirausaha' | 'organisasi_nirlaba' | 'lainnya';
  ruangLingkup?: RuangLingkup;
  jabatan?: string;
  bidangPekerjaan?: string;
  pendapatanBulanan?: number; // F505
  waktuTungguBulan?: number; // C1 / F502
  dipesanSebelumLulus?: boolean;
  
  // Kesesuaian
  keselarasanHorizontal?: 'sangat_relevan' | 'relevan' | 'cukup_relevan' | 'kurang_relevan' | 'tidak_relevan';
  keselarasanKategori?: TingkatKesesuaian; // Rendah, Sedang, Tinggi
  keselarasanVertikal?: 'tidak_memerlukan_pt' | 'lebih_rendah' | 'sesuai_jenjang' | 'lebih_tinggi';
  
  // Kontak
  noHp?: string;
  email?: string;
  domisiliProvinsi?: string;
  domisiliKota?: string;
  
  // Metadata
  sumberData?: 'laporan_resmi_2024' | 'laporan_resmi_2025' | 'kuesioner_mandiri' | 'impor_excel';
  catatanValidasi?: string;
  createdAt: string;
}

export interface EmployerSatisfactionAspect {
  id: string;
  nama: string;
  sangatBaik: number; // Percentage, e.g. 70.00
  baik: number;       // Percentage, e.g. 30.00
  cukup: number;      // Percentage, e.g. 0.00
  kurang: number;     // Percentage, e.g. 0.00
  total: number;      // e.g. 100.00 or 94.00
  positif: number;    // sangatBaik + baik
  catatan?: string;
  rencanaTindakLanjut?: string;
  implikasi?: string;
}

export interface YearReportSummary {
  tahunLaporan: number; // e.g. 2024, 2025
  tahunLulusanLabel: string; // e.g. "TA 2022/2023", "Kohort 2024"
  prodiId: ProdiId;
  totalLulusan: number;
  lulusanTerlacak: number;
  lulusanBelumTerlacak: number;
  tingkatKeterlacakan: number; // Percentage
  
  tempatKerja: {
    lokal: number;
    nasional: number;
    multinasional: number;
    totalTercatat: number;
    catatanValidasi?: string;
  };
  
  kesesuaianBidang: {
    tinggi: number;
    sedang: number;
    rendah: number;
    persenTinggi: number;
    persenSedangTinggi: number;
  };
  
  waktuTunggu: {
    kurang3Bulan: number;
    antara3Sd6Bulan: number;
    lebih6Bulan: number;
    dipesanSebelumLulus: number;
    catatanAudit?: string;
  };
  
  kepuasanPengguna: {
    responden: number;
    aspek: EmployerSatisfactionAspect[];
  };
  
  auditMutu: {
    status: 'terverifikasi' | 'perlu_klarifikasi' | 'draft';
    poinTemuan: string[];
    tindakLanjut: string[];
  };
}

export interface EmployerFeedback {
  id: string;
  namaInstansi: string;
  namaPenilai: string;
  jabatanPenilai: string;
  namaAlumni: string;
  prodiId: ProdiId;
  tahunLulusAlumni: number;
  lamaBekerja: string;
  skor: {
    etika: number; // 1-4
    keahlian: number;
    bahasaAsing: number;
    teknologiInformasi: number;
    komunikasi: number;
    kerjasamaTim: number;
    pengembanganDiri: number;
  };
  kekuatanAlumni: string;
  aspekPeningkatan: string;
  saranKurikulum: string;
  kesediaanMerekrutKembali: boolean;
  createdAt: string;
}

export type RoleType = 'admin_jurusan' | 'admin_prodi' | 'alumni';

export interface UserSession {
  role: RoleType;
  nama: string;
  prodiId?: ProdiId;
  prodiNama?: string;
  email?: string;
}
