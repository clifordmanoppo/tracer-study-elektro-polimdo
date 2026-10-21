'use client';

import React, { useState } from 'react';
import { useTracer } from '@/lib/store/tracerStore';
import { PROGRAM_STUDI_LIST, DAFTAR_17_INSTANSI_MITRA, OFFICIAL_SUMMARIES } from '@/lib/data/initialData';
import { ProdiId } from '@/types/tracer';
import { 
  Building2, 
  Award, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Sparkles,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';

export default function KepuasanPenggunaPage() {
  const { addEmployerFeedback, employerFeedbacks } = useTracer();
  const [activeTab, setActiveTab] = useState<'laporan' | 'formulir' | 'instansi'>('laporan');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Official aspect data from Laporan 2024 / 2025
  const aspekData = OFFICIAL_SUMMARIES[0].kepuasanPengguna.aspek;

  // Chart data formatted for horizontal stacked bar
  const stackedChartData = aspekData.map((item) => ({
    name: item.nama.split('(')[0].trim(),
    'Sangat Baik': item.sangatBaik,
    'Baik': item.baik,
    'Cukup': item.cukup,
    'Kurang': item.kurang,
    'Belum Teralokasi': item.id === 'teknologi_informasi' ? 6 : 0
  }));

  // Form State for Employer Survey
  const [formState, setFormState] = useState({
    namaInstansi: 'PT PLN (Persero)',
    namaPenilai: '',
    jabatanPenilai: '',
    bidangUsaha: 'Ketenagalistrikan & Energi',
    namaAlumni: '',
    prodiId: 'D3-TL' as ProdiId,
    tahunLulusAlumni: 2024,
    lamaBekerja: '1 tahun',
    skor: {
      etika: 4,
      keahlian: 3,
      bahasaAsing: 2,
      teknologiInformasi: 3,
      komunikasi: 4,
      kerjasamaTim: 4,
      pengembanganDiri: 4
    },
    kekuatanAlumni: '',
    aspekPeningkatan: '',
    saranKurikulum: '',
    kesediaanMerekrutKembali: true
  });

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.namaPenilai || !formState.namaInstansi || !formState.namaAlumni) {
      alert('Mohon lengkapi Nama Penilai, Nama Instansi, dan Nama Alumni yang dinilai!');
      return;
    }

    await addEmployerFeedback(formState);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Survei Penilaian Industri & Pengguna Lulusan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Survei Kepuasan Pengguna Lulusan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Pengukuran kinerja, integritas, dan kompetensi alumni Jurusan Teknik Elektro Politeknik Negeri Manado oleh atasan langsung dan mitra industri (Standar Akreditasi LAM Teknik & BAN-PT).
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-2xl bg-white p-1.5 border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setActiveTab('laporan')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'laporan'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Rekap Hasil Evaluasi (17 Responden)
            </button>
            <button
              onClick={() => setActiveTab('instansi')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'instansi'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Daftar 17 Instansi Pengguna
            </button>
            <button
              onClick={() => setActiveTab('formulir')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'formulir'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Isi Survei Online (Khusus Atasan)
            </button>
          </div>
        </div>

        {/* TAB 1: REKAP HASIL EVALUASI RESMI */}
        {activeTab === 'laporan' && (
          <div className="space-y-6">
            {/* Top Summary Banner */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                    Laporan Resmi Kepuasan Pengguna Lulusan
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Penilaian 7 Aspek Kemampuan • 17 Responden Industri
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                    Evaluasi komprehensif terhadap lulusan Program Studi D3 Teknik Listrik oleh atasan industri mitra.
                  </p>
                </div>
                <div className="flex items-center space-x-6 text-center">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/15">
                    <div className="text-2xl font-extrabold text-amber-400">100%</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">Etika & Integritas</div>
                  </div>
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/15">
                    <div className="text-2xl font-extrabold text-blue-300">94%</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">Kerja Sama Tim</div>
                  </div>
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs border border-white/15">
                    <div className="text-2xl font-extrabold text-rose-300">47%</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">Bahasa Asing (RTL)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stacked Chart Visualization */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Distribusi Komposisi Tingkat Kepuasan (%)</h3>
                  <p className="text-xs text-slate-500">Sebaran kategori Sangat Baik, Baik, Cukup, dan Kurang per aspek kompetensi</p>
                </div>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Dokumen Sumber: Bab V
                </span>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stackedChartData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 90, bottom: 5 }}
                  >
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#1e293b' }} />
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Bar dataKey="Sangat Baik" stackId="a" fill="#10b981" />
                    <Bar dataKey="Baik" stackId="a" fill="#3b82f6" />
                    <Bar dataKey="Cukup" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="Kurang" stackId="a" fill="#ef4444" />
                    <Bar dataKey="Belum Teralokasi" stackId="a" fill="#cbd5e1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                * Keterangan bagian abu-abu pada aspek Teknologi Informasi (6%): Menandai ketidaklengkapan jumlah angka pada tabel sumber asli (41% + 41% + 12% = 94%), bukan kategori jawaban kelima.
              </div>
            </div>

            {/* Official Table 5.1 */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tabel Rekapitulasi Tingkat Kepuasan Pengguna (%)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Berdasarkan Laporan Kepuasan Pengguna Lulusan & Akreditasi LAM Teknik Kriteria 9
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">No</th>
                      <th className="py-3 px-4">Jenis Kemampuan</th>
                      <th className="py-3 px-4 text-center">Sangat Baik (%)</th>
                      <th className="py-3 px-4 text-center">Baik (%)</th>
                      <th className="py-3 px-4 text-center">Cukup (%)</th>
                      <th className="py-3 px-4 text-center">Kurang (%)</th>
                      <th className="py-3 px-4 text-center">Jumlah (%)</th>
                      <th className="py-3 px-4 text-center">Total Positif (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {aspekData.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-4 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">{item.nama}</td>
                        <td className="py-3 px-4 text-center font-mono text-emerald-700 font-medium">{item.sangatBaik.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center font-mono text-blue-700 font-medium">{item.baik.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center font-mono text-amber-700 font-medium">{item.cukup.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center font-mono text-rose-700 font-medium">{item.kurang.toFixed(2)}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold">
                          {item.id === 'teknologi_informasi' ? '94.00*' : item.total.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.positif >= 80 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {item.positif.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    {/* Baris Total di Dokumen Sumber */}
                    <tr className="bg-slate-100/80 font-bold text-slate-900 border-t-2 border-slate-300">
                      <td colSpan={2} className="py-3 px-4 text-center">Jumlah Kumulatif Dokumen Asli</td>
                      <td className="py-3 px-4 text-center font-mono">370.00%</td>
                      <td className="py-3 px-4 text-center font-mono">212.00%</td>
                      <td className="py-3 px-4 text-center font-mono">94.00%</td>
                      <td className="py-3 px-4 text-center font-mono">18.00%</td>
                      <td className="py-3 px-4 text-center font-mono">694.00%</td>
                      <td className="py-3 px-4 text-center font-mono text-blue-800">582.00%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Prioritas RTL Per Aspek */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Pemetaan Prioritas Tindak Lanjut Perbaikan Mutu</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {aspekData.map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{item.nama}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        item.positif >= 85 ? 'bg-emerald-100 text-emerald-800' : item.positif >= 70 ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {item.positif}% Positif
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      <strong>Rencana Tindak Lanjut:</strong> {item.implikasi || 'Pertahankan capaian dan evaluasi berkelanjutan.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DAFTAR 17 INSTANSI PENGGUNA */}
        {activeTab === 'instansi' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <span>Daftar 17 Instansi Pengguna Lulusan Resmi</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Surat Tugas Penetapan Koordinator Prodi D3 Teknik Listrik: Anthoneite Waroh, ST., MT.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {DAFTAR_17_INSTANSI_MITRA.map((instansi) => (
                  <div
                    key={instansi.no}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all space-y-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {instansi.no}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-slate-900 text-xs truncate" title={instansi.nama}>
                          {instansi.nama}
                        </h4>
                        <span className="text-[10px] text-blue-600 font-medium block">{instansi.lokasi}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      Bidang: {instansi.bidang}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Catatan Daftar Cadangan & Unit Tambahan:</span>
                </div>
                <p className="text-slate-700">
                  Qzone Manado dicatat sebagai cadangan berdasarkan penetapan prodi. Rujukan resmi PLN menyebut ULP Manado Utara dan ULP Manado Selatan sebagai unit konfirmasi tambahan.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FORMULIR ISIAN SURVEI OLEH PENGGUNA (ATASAN) */}
        {activeTab === 'formulir' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            {isSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Survei Pengguna Berhasil Dikirimkan!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Terima kasih atas penilaian Anda terhadap lulusan Politeknik Negeri Manado. Data ini sangat berharga bagi evaluasi kurikulum dan akreditasi kami.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setActiveTab('laporan');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
                >
                  Kembali ke Ringkasan
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitForm} className="space-y-6 text-xs">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                    <FileCheck className="w-5 h-5 text-purple-600" />
                    <span>Kuesioner Penilaian Pengguna Lulusan (Atasan)</span>
                  </h3>
                  <p className="text-slate-500 mt-0.5">
                    Isilah survei ini untuk mengevaluasi kinerja lulusan Politeknik Negeri Manado di institusi Anda.
                  </p>
                </div>

                {/* Section A: Identitas Penilai */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nama Instansi / Perusahaan *</label>
                    <input
                      type="text"
                      required
                      value={formState.namaInstansi}
                      onChange={(e) => setFormState({ ...formState, namaInstansi: e.target.value })}
                      className="w-full px-3.5 py-2.5 border rounded-xl"
                      placeholder="Contoh: PT PLN Paniki / IMIP Morowali"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Bidang Usaha / Industri</label>
                    <input
                      type="text"
                      value={formState.bidangUsaha}
                      onChange={(e) => setFormState({ ...formState, bidangUsaha: e.target.value })}
                      className="w-full px-3.5 py-2.5 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nama Penilai (Atasan / Pimpinan) *</label>
                    <input
                      type="text"
                      required
                      value={formState.namaPenilai}
                      onChange={(e) => setFormState({ ...formState, namaPenilai: e.target.value })}
                      className="w-full px-3.5 py-2.5 border rounded-xl"
                      placeholder="Nama lengkap & gelar"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Jabatan Penilai</label>
                    <input
                      type="text"
                      value={formState.jabatanPenilai}
                      onChange={(e) => setFormState({ ...formState, jabatanPenilai: e.target.value })}
                      className="w-full px-3.5 py-2.5 border rounded-xl"
                      placeholder="Contoh: Manager Maintenance / HRD"
                    />
                  </div>
                </div>

                {/* Section B: Profil Alumni */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-3">
                  <h4 className="font-bold text-blue-900 text-sm">Profil Alumni yang Dinilai</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Nama Alumni *</label>
                      <input
                        type="text"
                        required
                        value={formState.namaAlumni}
                        onChange={(e) => setFormState({ ...formState, namaAlumni: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                        placeholder="Nama alumni Polimdo"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Program Studi</label>
                      <select
                        value={formState.prodiId}
                        onChange={(e) => setFormState({ ...formState, prodiId: e.target.value as ProdiId })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                      >
                        {PROGRAM_STUDI_LIST.map((p) => (
                          <option key={p.id} value={p.id}>{p.nama}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Lama Bekerja</label>
                      <input
                        type="text"
                        value={formState.lamaBekerja}
                        onChange={(e) => setFormState({ ...formState, lamaBekerja: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-white"
                        placeholder="Contoh: 1 tahun"
                      />
                    </div>
                  </div>
                </div>

                {/* Section C: Penilaian 7 Aspek Standar Akreditasi */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Penilaian 7 Aspek Kompetensi (4 = Sangat Baik, 3 = Baik, 2 = Cukup, 1 = Kurang)
                  </h4>

                  {[
                    { key: 'etika', label: '1. Etika & Integritas (Kedisiplinan, K3, kejujuran kerja)' },
                    { key: 'keahlian', label: '2. Keahlian Bidang Ilmu (Kompetensi utama teknik)' },
                    { key: 'bahasaAsing', label: '3. Kemampuan Bahasa Asing (Bahasa Inggris manual/teknis)' },
                    { key: 'teknologiInformasi', label: '4. Penggunaan Teknologi Informasi & Software' },
                    { key: 'komunikasi', label: '5. Kemampuan Berkomunikasi (Lisan & tulisan)' },
                    { key: 'kerjasamaTim', label: '6. Kerja Sama Tim & Koordinasi' },
                    { key: 'pengembanganDiri', label: '7. Pengembangan Diri & Kemampuan Beradaptasi' },
                  ].map((aspect) => (
                    <div
                      key={aspect.key}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <span className="font-semibold text-slate-800">{aspect.label}</span>
                      <div className="flex items-center space-x-2">
                        {[
                          { score: 4, label: 'SB' },
                          { score: 3, label: 'B' },
                          { score: 2, label: 'C' },
                          { score: 1, label: 'K' },
                        ].map((btn) => (
                          <button
                            key={btn.score}
                            type="button"
                            onClick={() => setFormState({
                              ...formState,
                              skor: {
                                ...formState.skor,
                                [aspect.key]: btn.score
                              }
                            })}
                            className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                              (formState.skor as Record<string, number>)[aspect.key] === btn.score
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {btn.label} ({btn.score})
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section D: Masukan Kualitatif */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Kekuatan / Kompetensi Alumni yang Paling Menonjol:
                    </label>
                    <textarea
                      rows={2}
                      value={formState.kekuatanAlumni}
                      onChange={(e) => setFormState({ ...formState, kekuatanAlumni: e.target.value })}
                      className="w-full px-3.5 py-2.5 border rounded-xl"
                      placeholder="Contoh: Sangat disiplin, taat SOP K3, pengoperasian panel listrik mandiri..."
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Kompetensi yang Masih Perlu Ditingkatkan oleh Program Studi:
                    </label>
                    <textarea
                      rows={2}
                      value={formState.aspekPeningkatan}
                      onChange={(e) => setFormState({ ...formState, aspekPeningkatan: e.target.value })}
                      className="w-full px-3.5 py-2.5 border rounded-xl"
                      placeholder="Contoh: Pemahaman bahasa Inggris untuk buku manual teknis luar negeri..."
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">
                      Saran untuk Kurikulum, Praktik Laboratorium, Sertifikasi, atau Kerja Sama Industri:
                    </label>
                    <textarea
                      rows={2}
                      value={formState.saranKurikulum}
                      onChange={(e) => setFormState({ ...formState, saranKurikulum: e.target.value })}
                      className="w-full px-3.5 py-2.5 border rounded-xl"
                      placeholder="Contoh: Sertifikasi BNSP bagi calon lulusan, update software simulasi PLC..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="submit"
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Kirim Penilaian Pengguna Lulusan</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
