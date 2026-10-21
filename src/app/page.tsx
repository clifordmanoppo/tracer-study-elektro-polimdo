'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTracer } from '@/lib/store/tracerStore';
import { useAuth } from '@/lib/auth/authContext';
import { PROGRAM_STUDI_LIST, DAFTAR_17_INSTANSI_MITRA, OFFICIAL_SUMMARIES } from '@/lib/data/initialData';
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Building2, 
  AlertTriangle, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  ShieldCheck, 
  Compass, 
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

export default function DashboardPage() {
  const { alumniList, getFilteredStats } = useTracer();
  const { user } = useAuth();

  const [selectedYear, setSelectedYear] = useState<string>('2025'); // Default to latest official report 2025
  const [selectedProdi, setSelectedProdi] = useState<string>('D3-TL'); // Default to D3-TL which matches report

  const stats = getFilteredStats(selectedYear, selectedProdi);
  const activeReport = OFFICIAL_SUMMARIES.find(s => s.tahunLaporan.toString() === selectedYear && s.prodiId === selectedProdi);

  // Colors for charts
  const COLORS = {
    primary: '#0f2b48',
    blue: '#2563eb',
    blueLight: '#60a5fa',
    gold: '#f59e0b',
    goldDark: '#d97706',
    emerald: '#10b981',
    rose: '#f43f5e',
    slate: '#64748b',
    grayLight: '#e2e8f0'
  };

  // Data for Kesesuaian Bidang Kerja Pie Chart
  const kesesuaianData = [
    { name: 'Tinggi', value: stats.kesesuaianTinggi, color: COLORS.emerald, percent: stats.persenKesesuaianTinggi },
    { name: 'Sedang', value: stats.kesesuaianSedang, color: COLORS.gold, percent: Number(((stats.kesesuaianSedang / (stats.lulusanTerlacak || 1)) * 100).toFixed(2)) },
    { name: 'Rendah', value: stats.kesesuaianRendah, color: COLORS.rose, percent: Number(((stats.kesesuaianRendah / (stats.lulusanTerlacak || 1)) * 100).toFixed(2)) },
  ].filter(d => d.value > 0);

  // Data for Waktu Tunggu Bar Chart
  const waktuTungguData = [
    { name: '< 3 Bulan', jumlah: stats.waktuTungguKurang3, color: COLORS.emerald },
    { name: '3 - 6 Bulan', jumlah: stats.waktuTunggu3sd6, color: COLORS.blue },
    { name: '> 6 Bulan', jumlah: stats.waktuTungguLebih6, color: COLORS.gold },
  ];

  // Data for Tempat Kerja Bar Chart
  const tempatKerjaData = [
    { name: 'Nasional / Berizin', jumlah: stats.tempatKerjaNasional, fill: COLORS.blue },
    { name: 'Lokal / Tidak Berizin', jumlah: stats.tempatKerjaLokal, fill: COLORS.gold },
    { name: 'Multinasional', jumlah: stats.tempatKerjaMultinasional, fill: COLORS.emerald }
  ];

  // Radar Data for Employer Satisfaction (from 2025/2024 reports)
  const defaultAspek = activeReport?.kepuasanPengguna.aspek || OFFICIAL_SUMMARIES[0].kepuasanPengguna.aspek;
  const radarData = defaultAspek.map(asp => ({
    aspek: asp.nama.split('(')[0].trim(),
    sangatBaik: asp.sangatBaik,
    positif: asp.positif,
    cukupKurang: Number((100 - asp.positif).toFixed(1))
  }));

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Hero Header Section */}
      <section className="bg-gradient-to-r from-[#0a1c30] via-[#0f2b48] to-[#1e3a8a] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-amber-300 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Portal Resmi Akreditasi LAM Teknik & BAN-PT (IKU 1)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-white">
                TRACER STUDY JURUSAN ELEKTRO
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Pusat data keterlacakan lulusan, kesesuaian bidang kerja, masa tunggu, dan survei kepuasan 17 mitra industri Politeknik Negeri Manado Tahun 2023–2026.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap sm:flex-nowrap gap-3">
              <Link
                href="/kuesioner"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                <FileText className="w-4 h-4" />
                <span>Kuesioner Alumni</span>
              </Link>
              <Link
                href="/kepuasan-pengguna"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all"
              >
                <Building2 className="w-4 h-4 text-cyan-300" />
                <span>Survei Pengguna (17 Mitra)</span>
              </Link>
              <Link
                href="/laporan-akreditasi"
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Rekap Akreditasi</span>
              </Link>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                <span>Filter Laporan:</span>
              </div>

              {/* Year Select Buttons */}
              <div className="inline-flex rounded-xl bg-black/30 p-1 border border-white/10">
                {['2023', '2024', '2025', '2026', 'all'].map((yr) => (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedYear === yr
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {yr === 'all' ? 'Semua Tahun' : yr}
                  </button>
                ))}
              </div>

              {/* Prodi Select */}
              <select
                value={selectedProdi}
                onChange={(e) => setSelectedProdi(e.target.value)}
                className="bg-black/30 text-white text-xs font-medium rounded-xl px-3 py-2 border border-white/15 focus:outline-hidden focus:ring-2 focus:ring-amber-400"
              >
                <option value="all" className="bg-slate-900 text-white">Semua Program Studi (Jurusan Elektro)</option>
                {PROGRAM_STUDI_LIST.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.nama} ({p.jenjang})
                  </option>
                ))}
              </select>
            </div>

            {/* Active Dataset Indicator */}
            <div className="text-xs text-amber-200/90 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>
                {selectedYear === '2024' && selectedProdi === 'D3-TL' && 'Data Asli: Laporan 2024 (Lulusan TA 2022/2023)'}
                {selectedYear === '2025' && selectedProdi === 'D3-TL' && 'Data Asli: Laporan 2025 TS-1 (Kohort Lulusan 2024)'}
                {selectedYear === '2026' && 'Instrumen & Jadwal Penelusuran 2026'}
                {selectedYear === '2023' && 'Data Kohort TA 2021/2022'}
                {(selectedYear === 'all' || selectedProdi !== 'D3-TL') && `Agregat Terintegrasi: ${selectedProdi} (${selectedYear})`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Card 1: Total Lulusan */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Total Lulusan (N)</span>
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {stats.totalLulusan}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Kohort sasaran
            </p>
          </div>

          {/* Card 2: Terlacak & Rate */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Lulusan Terlacak</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-600">
              {stats.lulusanTerlacak}
              <span className="text-xs font-normal text-slate-400 ml-1">({stats.tingkatKeterlacakan}%)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {stats.lulusanBelumTerlacak} belum terlacak
            </p>
          </div>

          {/* Card 3: Keselarasan Kerja */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Kesesuaian Kerja</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-extrabold text-blue-600">
              {stats.persenKesesuaianSedangTinggi}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Tinggi ({stats.kesesuaianTinggi}) + Sedang ({stats.kesesuaianSedang})
            </p>
          </div>

          {/* Card 4: Waktu Tunggu < 6 Bulan */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Tunggu &lt; 6 Bulan</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-extrabold text-amber-600">
              {stats.persenWaktuTungguKurang6}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {stats.waktuTungguKurang3 + stats.waktuTunggu3sd6} dari {stats.lulusanTerlacak} orang
            </p>
          </div>

          {/* Card 5: Dipesan Sebelum Lulus */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Dipesan Pra-Lulus</span>
              <Briefcase className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-extrabold text-indigo-600">
              {stats.dipesanSebelumLulus}
              <span className="text-xs font-normal text-slate-400 ml-1">({stats.persenDipesanSebelumLulus}%)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Magang langsung rekrut
            </p>
          </div>

          {/* Card 6: Responden Pengguna */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-medium">Mitra Pengguna</span>
              <Building2 className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-extrabold text-purple-600">
              {activeReport?.kepuasanPengguna.responden || 17}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              17 instansi mitra resmi
            </p>
          </div>
        </div>

        {/* Charts Grid Row 1: Kesesuaian & Waktu Tunggu */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Kesesuaian Bidang Kerja */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Kesesuaian Bidang Pekerjaan</h3>
                <p className="text-xs text-slate-500">
                  Relevansi pekerjaan terhadap kompetensi program studi (n = {stats.lulusanTerlacak})
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {stats.persenKesesuaianSedangTinggi}% Relevan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4">
              <div className="h-60 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={kesesuaianData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                    >
                      {kesesuaianData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name, item) => [`${val} orang (${(item as { payload: { percent: number } }).payload.percent}%)`, name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend & Breakdown */}
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-emerald-900">Kategori Tinggi</span>
                    <span className="font-bold text-emerald-700">{stats.kesesuaianTinggi} orang ({stats.persenKesesuaianTinggi}%)</span>
                  </div>
                  <div className="w-full bg-emerald-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${stats.persenKesesuaianTinggi}%` }}></div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-amber-900">Kategori Sedang</span>
                    <span className="font-bold text-amber-700">
                      {stats.kesesuaianSedang} orang ({Number(((stats.kesesuaianSedang / (stats.lulusanTerlacak || 1)) * 100).toFixed(1))}%)
                    </span>
                  </div>
                  <div className="w-full bg-amber-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(stats.kesesuaianSedang / (stats.lulusanTerlacak || 1)) * 100}%` }}></div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-rose-900">Kategori Rendah</span>
                    <span className="font-bold text-rose-700">
                      {stats.kesesuaianRendah} orang ({Number(((stats.kesesuaianRendah / (stats.lulusanTerlacak || 1)) * 100).toFixed(1))}%)
                    </span>
                  </div>
                  <div className="w-full bg-rose-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: `${(stats.kesesuaianRendah / (stats.lulusanTerlacak || 1)) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart 2: Waktu Tunggu Memperoleh Pekerjaan */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Waktu Tunggu Kerja Pertama</h3>
                <p className="text-xs text-slate-500">
                  Distribusi masa transisi lulusan dari kelulusan hingga pekerjaan pertama
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                IKU 1: &lt; 6 Bulan ({stats.persenWaktuTungguKurang6}%)
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={waktuTungguData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip formatter={(value) => [`${value} orang`, 'Frekuensi']} />
                  <Bar dataKey="jumlah" radius={[6, 6, 0, 0]}>
                    {waktuTungguData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>
                  <strong>Dipesan Sebelum Lulus:</strong> {stats.dipesanSebelumLulus} lulusan ({stats.persenDipesanSebelumLulus}% dari total {stats.totalLulusan} lulusan)
                </span>
              </div>
              <span className="text-[11px] bg-blue-200 text-blue-800 font-bold px-2 py-0.5 rounded">
                Pra-Wisuda
              </span>
            </div>
          </div>
        </div>

        {/* Charts Grid Row 2: Tempat Kerja & Kepuasan Pengguna 7 Aspek */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 3: Tingkat / Skala Tempat Kerja */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Skala & Lingkup Tempat Kerja</h3>
                <p className="text-xs text-slate-500">
                  Klasifikasi institusi / tempat berwirausaha lulusan
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                Total Tercatat: {stats.totalTempatKerja}
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tempatKerjaData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#334155' }} width={120} />
                  <Tooltip formatter={(value) => [`${value} orang`, 'Jumlah Lulusan']} />
                  <Bar dataKey="jumlah" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 text-xs text-slate-500 flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span>Mayoritas bekerja pada perusahaan skala <strong>Nasional / Usaha Berizin</strong> ({stats.tempatKerjaNasional} orang).</span>
              <span className="text-blue-600 font-bold">
                {Number(((stats.tempatKerjaNasional / (stats.lulusanTerlacak || 1)) * 100).toFixed(1))}%
              </span>
            </div>
          </div>

          {/* Chart 4: Radar Kepuasan Pengguna Lulusan 7 Aspek */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Kepuasan Pengguna (7 Aspek)</h3>
                <p className="text-xs text-slate-500">
                  Hasil penilaian 17 pimpinan/supervisor instansi mitra kerja
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                17 Responden Industri
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="aspek" tick={{ fontSize: 10, fill: '#475569' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Positif (SB + Baik %)" dataKey="positif" stroke="#2563eb" fill="#3b82f6" fillOpacity={0.4} />
                  <Tooltip formatter={(val) => [`${val}%`, 'Tingkat Positif']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-900">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Prioritas Perbaikan:</strong> Kemampuan Bahasa Asing (Positif 47%, Cukup/Kurang 53%).
                </span>
              </div>
              <Link href="/kepuasan-pengguna" className="text-blue-700 font-bold hover:underline flex items-center space-x-1">
                <span>RTL</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Official Audit & Data Quality Findings Card */}
        <div className="bg-white rounded-2xl p-6 border-l-4 border-amber-500 border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Audit Mutu & Validasi Data Resmi (Buku Laporan 2024 & 2025)
                </h3>
                <p className="text-xs text-slate-500">
                  Prinsip Ketertelusuran Sesuai Dokumen Sumber: Tidak mengubah angka mentah atau membuat asumsi fiktif.
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800">
              Audit Status: Tervalidasi
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Finding 1 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800 flex items-center space-x-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Laporan 2024 (Lulusan 2023)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Kategori tempat kerja tercatat <strong>25 dari 26 terlacak</strong> (4 lokal + 21 nasional + 0 multi). Terdapat selisih 1 lulusan pada rekap asal yang dipertahankan sebagai temuan audit resmi.
              </p>
            </div>

            {/* Finding 2 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800 flex items-center space-x-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Teknologi Informasi (94%)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Pada tabel kepuasan pengguna sumber: 41% + 41% + 12% + 0% = <strong>94.00%</strong>. Terdapat selisih 6 poin persentase yang tidak dialokasikan tanpa izin ketua program studi.
              </p>
            </div>

            {/* Finding 3 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="font-bold text-slate-800 flex items-center space-x-1.5 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>Laporan 2025 (Waktu Tunggu = 20)</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Frekuensi waktu tunggu pada rekap kohort 2024: 11 (&lt;3 bln) + 7 (3-6 bln) + 2 (&gt;6 bln) = <strong>20 entri</strong>, melampaui jumlah terlacak (19). Dinyatakan sebagai catatan audit mutu.
              </p>
            </div>
          </div>
        </div>

        {/* 17 Instansi Pengguna Lulusan Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Daftar 17 Instansi Pengguna Lulusan Terdaftar</h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Mitra kerja sama resmi tempat lulusan Jurusan Elektro berkarier dan menjadi responden survei kepuasan
              </p>
            </div>
            <Link
              href="/kepuasan-pengguna"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center space-x-1"
            >
              <span>Lihat Detail Survei & Masukan Industri</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {DAFTAR_17_INSTANSI_MITRA.map((instansi) => (
              <div
                key={instansi.no}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all flex items-start space-x-2.5"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold flex items-center justify-center">
                  {instansi.no}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate" title={instansi.nama}>
                    {instansi.nama}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate">{instansi.bidang}</p>
                  <span className="text-[10px] text-blue-700 font-medium">{instansi.lokasi}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>
              <strong>Daftar Cadangan:</strong> Qzone Manado, ULP PLN Manado Utara, ULP PLN Manado Selatan.
            </span>
            <span className="text-[11px] text-slate-400">
              Sumber: Surat Tugas Program Studi D3 Teknik Listrik 2025
            </span>
          </div>
        </div>

        {/* 5 Rencana Tindak Lanjut Terukur (Bab VII Laporan) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center space-x-2 pb-4 mb-4 border-b border-slate-100">
            <Compass className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">5 Rencana Tindak Lanjut Terukur Program Studi</h3>
              <p className="text-xs text-slate-500">
                Tindak lanjut kurikulum dan fasilitas berdasarkan analisis empiris tracer study
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Prioritas</th>
                  <th className="py-2.5 px-3">Fokus RTL</th>
                  <th className="py-2.5 px-3">Kegiatan yang Disarankan</th>
                  <th className="py-2.5 px-3">Bukti / Indikator Pemantauan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-bold text-rose-600">1 • Mendesak</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">Validasi Data</td>
                  <td className="py-2.5 px-3">Telusuri selisih 1 kategori tempat kerja dan 6 poin persentase TI.</td>
                  <td className="py-2.5 px-3 text-slate-500">Rekap revisi bertanggal dengan paraf pemeriksa.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-bold text-amber-600">2 • Tinggi</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">Jangkauan Alumni</td>
                  <td className="py-2.5 px-3">Penelusuran lanjutan terhadap alumni yang belum terlacak melalui WA Blast & medsos.</td>
                  <td className="py-2.5 px-3 text-slate-500">Daftar status kontak dan log respons.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-bold text-amber-600">3 • Tinggi</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">Bahasa Asing</td>
                  <td className="py-2.5 px-3">Integrasikan Inggris teknis pada modul, pembacaan manual perangkat, dan presentasi proyek.</td>
                  <td className="py-2.5 px-3 text-slate-500">RPS revisi, tugas mahasiswa, rubrik keterampilan bahasa.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-bold text-blue-600">4 • Menengah</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">Keahlian Digital & Software</td>
                  <td className="py-2.5 px-3">Tambahkan latihan simulasi kelistrikan (ETAP, AutoCAD Listrik, PLC) dan software teknik.</td>
                  <td className="py-2.5 px-3 text-slate-500">Bukti praktikum, jobsheet, modul asesmen.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-2.5 px-3 font-bold text-blue-600">5 • Menengah</td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">Kolaborasi Industri</td>
                  <td className="py-2.5 px-3">Telaah sertifikasi kompetensi BNSP dan masukan mitra saat evaluasi kurikulum berkala.</td>
                  <td className="py-2.5 px-3 text-slate-500">Notula rapat, MoU kemitraan industri.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
