'use client';

import React, { useState } from 'react';
import { useTracer } from '@/lib/store/tracerStore';
import { PROGRAM_STUDI_LIST } from '@/lib/data/initialData';
import { ProdiId, StatusAktivitas, TingkatKesesuaian, RuangLingkup } from '@/types/tracer';
import { 
  FileText, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Send, 
  Sparkles, 
  AlertCircle,
  Building2,
  GraduationCap,
  Briefcase,
  Award,
  Phone,
  Mail,
  CheckCircle
} from 'lucide-react';

export default function KuesionerPage() {
  const { addAlumni } = useTracer();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedNIM, setSubmittedNIM] = useState('');

  // Form State matching Official Instrument 2026
  const [formData, setFormData] = useState({
    // Bagian A: Identitas
    nama: '',
    nim: '',
    prodiId: 'D3-TL' as ProdiId,
    tahunMasuk: 2021,
    tahunLulus: 2025,
    bulanYudisium: 'Agustus 2025',
    noHp: '',
    email: '',
    provinsi: 'Sulawesi Utara',
    kabupatenKota: 'Kota Manado',
    sumberBiaya: 'Biaya sendiri/keluarga',

    // Bagian B: Status
    statusAktivitas: 'bekerja' as StatusAktivitas,

    // Bagian C: Pekerjaan
    waktuTungguBulan: 2,
    mulaiMencariKerja: 'Sebelum lulus',
    dipesanSebelumLulus: false,
    namaInstansi: '',
    jenisInstansi: 'swasta_nasional',
    ruangLingkup: 'nasional' as RuangLingkup,
    bidangUsaha: 'Ketenagalistrikan dan energi',
    jabatan: '',
    bidangPekerjaan: 'Teknisi instalasi listrik',
    statusKerja: 'Pegawai tetap',
    pendapatanBulanan: 4800000,
    keselarasanHorizontal: 'sangat_relevan',
    keselarasanVertikal: 'sesuai_jenjang',

    // Bagian D: Wirausaha (jika wirausaha)
    namaUsaha: '',
    legalitasUsaha: 'Sudah',
    omsetUsaha: 5000000,

    // Bagian G: 11 Kompetensi
    kompetensi: {
      etika: 4,
      keahlian: 4,
      bahasaInggris: 3,
      teknologiInformasi: 4,
      komunikasi: 4,
      kerjasamaTim: 4,
      pengembanganDiri: 4,
      berpikirKritis: 4,
      kreativitas: 4,
      kewirausahaan: 3,
      adaptasi: 4
    },

    // Bagian H: Sertifikasi & Masukan
    sertifikasiDimiliki: 'Sertifikasi Kompetensi K3 Listrik BNSP',
    sertifikasiDibutuhkan: 'Setting Proteksi Relay Numerik & PLC Siemens',
    saranPengembangan: 'Perbanyak praktikum perbaikan motor listrik dan simulasi software sebelum magang industri.',

    // Bagian K: Kontak Atasan
    namaAtasan: '',
    jabatanAtasan: '',
    kontakAtasan: '',
    kesediaanDihubungi: true
  });

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.nama || !formData.nim || !formData.noHp) {
        alert('Mohon lengkapi Nama, NIM, dan Nomor WhatsApp!');
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Map keselarasanHorizontal to kategori Kesesuaian (Tinggi, Sedang, Rendah)
    let kesesuaianKategori: TingkatKesesuaian = 'tinggi';
    if (formData.keselarasanHorizontal === 'cukup_relevan') kesesuaianKategori = 'sedang';
    if (formData.keselarasanHorizontal === 'kurang_relevan' || formData.keselarasanHorizontal === 'tidak_relevan') {
      kesesuaianKategori = 'rendah';
    }

    await addAlumni({
      nim: formData.nim,
      nama: formData.nama,
      prodiId: formData.prodiId,
      tahunMasuk: formData.tahunMasuk,
      tahunLulus: formData.tahunLulus,
      statusAktivitas: formData.statusAktivitas,
      terlacak: true,
      namaInstansi: formData.statusAktivitas === 'wirausaha' ? formData.namaUsaha : formData.namaInstansi,
      lokasiInstansi: `${formData.kabupatenKota}, ${formData.provinsi}`,
      jenisInstansi: formData.statusAktivitas === 'wirausaha' ? 'wirausaha' : (formData.jenisInstansi as 'swasta_nasional'),
      ruangLingkup: formData.ruangLingkup,
      jabatan: formData.jabatan || (formData.statusAktivitas === 'wirausaha' ? 'Pemilik Usaha' : '-'),
      bidangPekerjaan: formData.bidangPekerjaan,
      pendapatanBulanan: formData.statusAktivitas === 'wirausaha' ? formData.omsetUsaha : formData.pendapatanBulanan,
      waktuTungguBulan: formData.waktuTungguBulan,
      dipesanSebelumLulus: formData.dipesanSebelumLulus,
      keselarasanHorizontal: formData.keselarasanHorizontal as 'sangat_relevan',
      keselarasanKategori: kesesuaianKategori,
      keselarasanVertikal: formData.keselarasanVertikal as 'sesuai_jenjang',
      noHp: formData.noHp,
      email: formData.email,
      domisiliProvinsi: formData.provinsi,
      domisiliKota: formData.kabupatenKota,
      sumberData: 'kuesioner_mandiri'
    });

    setSubmittedNIM(formData.nim);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Terima Kasih Atas Partisipasi Anda!
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Data Tracer Study Anda telah berhasil tersimpan dalam Sistem Informasi Jurusan Teknik Elektro Politeknik Negeri Manado.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-left text-xs space-y-2">
            <div className="font-bold text-blue-900 text-sm">Bukti Pengisian Resmi:</div>
            <div className="flex justify-between py-1 border-b border-blue-100">
              <span className="text-slate-500">Nama Lulusan:</span>
              <span className="font-bold text-slate-800">{formData.nama}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-blue-100">
              <span className="text-slate-500">NIM:</span>
              <span className="font-mono font-bold text-slate-800">{submittedNIM}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-blue-100">
              <span className="text-slate-500">Program Studi:</span>
              <span className="font-bold text-blue-700">{formData.prodiId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-blue-100">
              <span className="text-slate-500">Tahun Lulus:</span>
              <span className="font-bold text-slate-800">{formData.tahunLulus}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Waktu Simpan:</span>
              <span className="font-mono text-slate-600">{new Date().toLocaleString('id-ID')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
            >
              Cetak / Simpan Bukti Pengisian
            </button>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition-colors"
            >
              Isi Data Lulusan Lain
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Instrumen Kuesioner Resmi Tracer Study 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kuesioner Penelusuran Lulusan (Alumni)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
            Program Studi D3 Teknik Listrik, D4 Teknik Informatika, D4 Teknik Listrik, dan D3 Teknik Informatika • Jurusan Teknik Elektro Politeknik Negeri Manado.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className={`p-2.5 rounded-xl border transition-all ${currentStep === 1 ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-slate-100 text-slate-400'}`}>
              <span className="block text-[10px] font-mono">LANGKAH 1</span>
              <span>Identitas Diri</span>
            </div>
            <div className={`p-2.5 rounded-xl border transition-all ${currentStep === 2 ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-slate-100 text-slate-400'}`}>
              <span className="block text-[10px] font-mono">LANGKAH 2</span>
              <span>Status & Pekerjaan</span>
            </div>
            <div className={`p-2.5 rounded-xl border transition-all ${currentStep === 3 ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-slate-100 text-slate-400'}`}>
              <span className="block text-[10px] font-mono">LANGKAH 3</span>
              <span>11 Kompetensi</span>
            </div>
            <div className={`p-2.5 rounded-xl border transition-all ${currentStep === 4 ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-slate-100 text-slate-400'}`}>
              <span className="block text-[10px] font-mono">LANGKAH 4</span>
              <span>Sertifikasi & Kirim</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          {/* STEP 1: IDENTITAS RESPONDEN */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <span>Bagian A: Identitas Lulusan</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Isilah identitas sesuai dengan data ijazah resmi Politeknik Negeri Manado.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap (sesuai ijazah) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: Christian Samuel Wowor"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nomor Induk Mahasiswa (NIM) *</label>
                  <input
                    type="text"
                    required
                    value={formData.nim}
                    onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 font-mono"
                    placeholder="Contoh: 21021001"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Program Studi *</label>
                  <select
                    value={formData.prodiId}
                    onChange={(e) => setFormData({ ...formData, prodiId: e.target.value as ProdiId })}
                    className="w-full px-3.5 py-2.5 border rounded-xl font-medium"
                  >
                    {PROGRAM_STUDI_LIST.map((p) => (
                      <option key={p.id} value={p.id}>{p.nama} ({p.jenjang})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tahun Lulus *</label>
                  <select
                    value={formData.tahunLulus}
                    onChange={(e) => setFormData({ ...formData, tahunLulus: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 border rounded-xl font-medium"
                  >
                    <option value={2026}>2026 (Kohort Target 2026)</option>
                    <option value={2025}>2025 (Kohort 2025)</option>
                    <option value={2024}>2024 (Kohort Lulusan 2024)</option>
                    <option value={2023}>2023 (TA 2022/2023)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tahun Masuk Kuliah</label>
                  <input
                    type="number"
                    value={formData.tahunMasuk}
                    onChange={(e) => setFormData({ ...formData, tahunMasuk: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Bulan dan Tahun Yudisium</label>
                  <input
                    type="text"
                    value={formData.bulanYudisium}
                    onChange={(e) => setFormData({ ...formData, bulanYudisium: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl"
                    placeholder="Contoh: Agustus 2024"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nomor WhatsApp Aktif *</label>
                  <input
                    type="tel"
                    required
                    value={formData.noHp}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl font-mono"
                    placeholder="Contoh: 081244556677"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email Aktif</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl"
                    placeholder="alumni@gmail.com"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Provinsi Domisili Saat Ini</label>
                  <input
                    type="text"
                    value={formData.provinsi}
                    onChange={(e) => setFormData({ ...formData, provinsi: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kabupaten / Kota Domisili</label>
                  <input
                    type="text"
                    value={formData.kabupatenKota}
                    onChange={(e) => setFormData({ ...formData, kabupatenKota: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Sumber Utama Pembiayaan Kuliah (A10)</label>
                  <select
                    value={formData.sumberBiaya}
                    onChange={(e) => setFormData({ ...formData, sumberBiaya: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl"
                  >
                    <option value="Biaya sendiri/keluarga">Biaya sendiri / keluarga</option>
                    <option value="KIP Kuliah/Bidikmisi">KIP Kuliah / Bidikmisi</option>
                    <option value="Beasiswa ADIK">Beasiswa ADIK</option>
                    <option value="Beasiswa PPA">Beasiswa PPA</option>
                    <option value="Beasiswa Perusahaan">Beasiswa Perusahaan / Industri</option>
                    <option value="Beasiswa Pemda">Beasiswa Pemerintah Daerah</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: STATUS AKTIVITAS & INFORMASI PEKERJAAN */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span>Bagian B & C: Status Aktivitas & Pekerjaan</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kondisi transisi ke dunia kerja, waktu tunggu pertama, dan relevansi kurikulum.
                </p>
              </div>

              {/* Status Radio Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Status Aktivitas Utama Saat Ini (F8):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  {[
                    { val: 'bekerja', label: 'Bekerja (penuh waktu / paruh waktu)' },
                    { val: 'wirausaha', label: 'Berwirausaha / Pekerja Lepas' },
                    { val: 'studi_lanjut', label: 'Melanjutkan Studi ke Jenjang Lebih Tinggi' },
                    { val: 'mencari_kerja', label: 'Tidak bekerja tetapi sedang aktif mencari pekerjaan' },
                    { val: 'belum_memungkinkan', label: 'Belum memungkinkan untuk bekerja' },
                  ].map((item) => (
                    <label
                      key={item.val}
                      className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer transition-all ${
                        formData.statusAktivitas === item.val
                          ? 'border-blue-500 bg-blue-50/70 font-semibold text-blue-900 ring-1 ring-blue-400'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="statusAktivitas"
                        value={item.val}
                        checked={formData.statusAktivitas === item.val}
                        onChange={() => setFormData({ ...formData, statusAktivitas: item.val as StatusAktivitas })}
                        className="text-blue-600"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Jika Bekerja atau Wirausaha */}
              {(formData.statusAktivitas === 'bekerja' || formData.statusAktivitas === 'wirausaha') && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm">Detail Instansi / Perusahaan & Gaji</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">
                        {formData.statusAktivitas === 'wirausaha' ? 'Nama Usaha / Bisnis' : 'Nama Perusahaan / Instansi Tempat Bekerja'}
                      </label>
                      <input
                        type="text"
                        value={formData.statusAktivitas === 'wirausaha' ? formData.namaUsaha : formData.namaInstansi}
                        onChange={(e) => {
                          if (formData.statusAktivitas === 'wirausaha') {
                            setFormData({ ...formData, namaUsaha: e.target.value });
                          } else {
                            setFormData({ ...formData, namaInstansi: e.target.value });
                          }
                        }}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                        placeholder="Contoh: PT PLN / Morowali / Gacoan"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Jabatan / Posisi Kerja</label>
                      <input
                        type="text"
                        value={formData.jabatan}
                        onChange={(e) => setFormData({ ...formData, jabatan: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                        placeholder="Contoh: Teknisi Pemeliharaan Listrik"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Skala & Ruang Lingkup Tempat Kerja (C8)</label>
                      <select
                        value={formData.ruangLingkup}
                        onChange={(e) => setFormData({ ...formData, ruangLingkup: e.target.value as RuangLingkup })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                      >
                        <option value="nasional">Nasional / Berwirausaha Berizin</option>
                        <option value="lokal">Lokal / Wilayah / Usaha Tidak Berizin</option>
                        <option value="multinasional">Multinasional / Internasional</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Masa Tunggu Mendapat Kerja (Bulan - C1)</label>
                      <input
                        type="number"
                        min={0}
                        value={formData.waktuTungguBulan}
                        onChange={(e) => setFormData({ ...formData, waktuTungguBulan: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                        placeholder="0 jika sebelum lulus"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Rata-rata Pendapatan Bersih Bulanan (Rp - F505)</label>
                      <input
                        type="number"
                        step={100000}
                        value={formData.statusAktivitas === 'wirausaha' ? formData.omsetUsaha : formData.pendapatanBulanan}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (formData.statusAktivitas === 'wirausaha') setFormData({ ...formData, omsetUsaha: val });
                          else setFormData({ ...formData, pendapatanBulanan: val });
                        }}
                        className="w-full px-3 py-2 border rounded-lg bg-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Relevansi Studi dengan Pekerjaan (F14)</label>
                      <select
                        value={formData.keselarasanHorizontal}
                        onChange={(e) => setFormData({ ...formData, keselarasanHorizontal: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                      >
                        <option value="sangat_relevan">Sangat Relevan (Tinggi)</option>
                        <option value="relevan">Relevan (Tinggi)</option>
                        <option value="cukup_relevan">Cukup Relevan (Sedang)</option>
                        <option value="kurang_relevan">Kurang Relevan (Rendah)</option>
                        <option value="tidak_relevan">Tidak Relevan (Rendah)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 pt-2">
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.dipesanSebelumLulus}
                          onChange={(e) => setFormData({ ...formData, dipesanSebelumLulus: e.target.checked })}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                        <span className="text-slate-800 font-semibold">
                          Saya memperoleh tawaran kerja / dipesan oleh industri sebelum wisuda kelulusan.
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: PENILAIAN 11 ASPEK KOMPETENSI */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-blue-600" />
                  <span>Bagian G: Penilaian 11 Kompetensi Lulusan</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Berikan penilaian terhadap tingkat penguasaan kompetensi Anda saat lulus (Skala 1 = Sangat Rendah hingga 5 = Sangat Tinggi).
                </p>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { key: 'etika', label: '1. Etika dan Tanggung Jawab Profesional' },
                  { key: 'keahlian', label: '2. Keahlian Berdasarkan Bidang Ilmu Utama' },
                  { key: 'bahasaInggris', label: '3. Kemampuan Bahasa Inggris Teknis' },
                  { key: 'teknologiInformasi', label: '4. Penggunaan Teknologi Informasi / Software' },
                  { key: 'komunikasi', label: '5. Kemampuan Berkomunikasi' },
                  { key: 'kerjasamaTim', label: '6. Kerja Sama Tim' },
                  { key: 'pengembanganDiri', label: '7. Kemauan Pengembangan Diri & Belajar Mandiri' },
                  { key: 'berpikirKritis', label: '8. Berpikir Kritis & Pemecahan Masalah' },
                  { key: 'kreativitas', label: '9. Kreativitas & Inovasi' },
                  { key: 'kewirausahaan', label: '10. Kewirausahaan' },
                  { key: 'adaptasi', label: '11. Kemampuan Beradaptasi di Lingkungan Kerja' },
                ].map((item) => (
                  <div key={item.key} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-semibold text-slate-800">{item.label}</span>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => setFormData({
                            ...formData,
                            kompetensi: {
                              ...formData.kompetensi,
                              [item.key]: score
                            }
                          })}
                          className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${
                            (formData.kompetensi as Record<string, number>)[item.key] === score
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: SERTIFIKASI & KONTAK ATASAN */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Bagian H, J & K: Masukan Kurikulum & Jejaring Industri</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bantuan Anda untuk evaluasi kurikulum dan survei kepuasan atasan (akreditasi LAM Teknik).
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Sertifikasi Kompetensi yang Telah Anda Miliki (H11):
                  </label>
                  <input
                    type="text"
                    value={formData.sertifikasiDimiliki}
                    onChange={(e) => setFormData({ ...formData, sertifikasiDimiliki: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl"
                    placeholder="Contoh: K3 Listrik BNSP, CCNA, Sertifikasi PLC"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Sertifikasi / Kompetensi yang Sangat Dibutuhkan Industri Tetapi Belum Cukup Diperoleh (H12):
                  </label>
                  <input
                    type="text"
                    value={formData.sertifikasiDibutuhkan}
                    onChange={(e) => setFormData({ ...formData, sertifikasiDibutuhkan: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl"
                    placeholder="Contoh: Proteksi Relay Numerik, AutoCAD Electrical, Cloud AWS"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Saran & Masukan Bagi Peningkatan Program Studi (J13):
                  </label>
                  <textarea
                    rows={3}
                    value={formData.saranPengembangan}
                    onChange={(e) => setFormData({ ...formData, saranPengembangan: e.target.value })}
                    className="w-full px-3.5 py-2.5 border rounded-xl"
                    placeholder="Tuliskan masukan untuk kurikulum, fasilitas praktikum, atau laboratorium..."
                  />
                </div>

                {/* Bagian Kontak Atasan */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <h4 className="font-bold text-amber-900 text-sm flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-amber-700" />
                    <span>Kontak Pimpinan / Atasan untuk Survei Kepuasan (K2)</span>
                  </h4>
                  <p className="text-slate-600">
                    Mohon cantumkan kontak atasan langsung / HRD di tempat kerja Anda untuk pengisian Survei Pengguna Lulusan (keperluan Akreditasi LAM Teknik):
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Nama Atasan / Supervisor</label>
                      <input
                        type="text"
                        value={formData.namaAtasan}
                        onChange={(e) => setFormData({ ...formData, namaAtasan: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                        placeholder="Contoh: Ir. Budi Santoso"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Jabatan Atasan</label>
                      <input
                        type="text"
                        value={formData.jabatanAtasan}
                        onChange={(e) => setFormData({ ...formData, jabatanAtasan: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                        placeholder="Contoh: Manajer Pemeliharaan Listrik"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-medium mb-1">No. WhatsApp / Email Kantor Atasan</label>
                      <input
                        type="text"
                        value={formData.kontakAtasan}
                        onChange={(e) => setFormData({ ...formData, kontakAtasan: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-white font-mono"
                        placeholder="Contoh: 0812xxxxxx / hrd@perusahaan.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>
            ) : <div></div>}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <span>Lanjutkan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg hover:shadow-xl transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Jawaban Kuesioner</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
