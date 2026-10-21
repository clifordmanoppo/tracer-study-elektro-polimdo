'use client';

import React, { useState } from 'react';
import { useTracer } from '@/lib/store/tracerStore';
import { PROGRAM_STUDI_LIST, OFFICIAL_SUMMARIES } from '@/lib/data/initialData';
import { 
  LineChart as LineChartIcon, 
  BarChart3, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  AlertTriangle, 
  Layers,
  ArrowUpRight,
  Sparkles,
  Compass
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';

export default function AnalisisKomparasiPage() {
  const { alumniList, summaries } = useTracer();
  const [metricTab, setMetricTab] = useState<'tren_tahun' | 'antar_prodi' | 'gap_kompetensi'>('tren_tahun');

  // Trend data across years (2023, 2024, 2025, 2026)
  const yearlyTrendData = [
    {
      tahun: '2023',
      label: 'TA 2021/2022',
      keterlacakan: 77.78,
      kesesuaianKerja: 94.29,
      waktuTungguKurang6Bln: 91.43,
      dipesanSebelumLulus: 17.78,
      totalLulusan: 45,
      terlacak: 35
    },
    {
      tahun: '2024',
      label: 'Laporan 2024 (TA 2022/2023)',
      keterlacakan: 68.42,
      kesesuaianKerja: 92.31,
      waktuTungguKurang6Bln: 84.62,
      dipesanSebelumLulus: 10.53,
      totalLulusan: 38,
      terlacak: 26
    },
    {
      tahun: '2025',
      label: 'Laporan 2025 TS-1 (Kohort 2024)',
      keterlacakan: 73.08,
      kesesuaianKerja: 89.47,
      waktuTungguKurang6Bln: 94.74,
      dipesanSebelumLulus: 15.38,
      totalLulusan: 26,
      terlacak: 19
    },
    {
      tahun: '2026',
      label: 'Kohort 2025 / Target 2026',
      keterlacakan: 78.13,
      kesesuaianKerja: 92.00,
      waktuTungguKurang6Bln: 92.00,
      dipesanSebelumLulus: 15.63,
      totalLulusan: 32,
      terlacak: 25
    }
  ];

  // Cross-Prodi benchmark data
  const prodiBenchmarkData = PROGRAM_STUDI_LIST.map((prodi) => {
    const list = alumniList.filter(item => item.prodiId === prodi.id);
    const total = list.length || 1;
    const terlacak = list.filter(item => item.terlacak).length;
    const rate = Number(((terlacak / total) * 100).toFixed(1));
    const sesuaiTinggi = list.filter(item => item.keselarasanKategori === 'tinggi').length;
    const persenTinggi = Number(((sesuaiTinggi / (terlacak || 1)) * 100).toFixed(1));
    const salaries = list.filter(item => item.pendapatanBulanan).map(item => item.pendapatanBulanan || 0);
    const avgSalary = salaries.length > 0 
      ? Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length) 
      : 5000000;

    return {
      prodi: prodi.id,
      nama: prodi.nama,
      total,
      terlacak,
      rate,
      persenTinggi,
      avgSalaryJt: Number((avgSalary / 1000000).toFixed(1))
    };
  });

  return (
    <div className="min-h-screen bg-slate-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Analisis Multidimensi & Evaluasi Berkala</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Analisis Komparasi 2023–2026 & Antar-Program Studi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Perbandingan tren indikator kinerja utama (IKU 1), keterlacakan lulusan, relevansi pekerjaan, dan disparitas kompetensi lintas tahun serta antarprogram studi Jurusan Teknik Elektro.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-2xl bg-white p-1.5 border border-slate-200/80 shadow-xs">
            <button
              onClick={() => setMetricTab('tren_tahun')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                metricTab === 'tren_tahun'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Tren Tahunan (2023–2026)
            </button>
            <button
              onClick={() => setMetricTab('antar_prodi')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                metricTab === 'antar_prodi'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Komparasi 4 Program Studi
            </button>
            <button
              onClick={() => setMetricTab('gap_kompetensi')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                metricTab === 'gap_kompetensi'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Analisis Gap & Kebutuhan Industri
            </button>
          </div>
        </div>

        {/* TAB 1: TREN TAHUNAN 2023 - 2026 */}
        {metricTab === 'tren_tahun' && (
          <div className="space-y-6">
            {/* Chart 1: Line Chart Tren IKU & Keterlacakan */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 gap-2">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tren Tingkat Keterlacakan & Relevansi Bidang Kerja (%)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pergerakan capaian indikator dari Laporan 2023 hingga Proyeksi 2026
                  </p>
                </div>
                <div className="flex items-center space-x-4 text-xs font-semibold">
                  <span className="flex items-center space-x-1.5 text-blue-600">
                    <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                    <span>Kesesuaian Kerja (%)</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-emerald-600">
                    <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
                    <span>Keterlacakan (%)</span>
                  </span>
                </div>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={yearlyTrendData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="tahun" tick={{ fontSize: 12, fill: '#334155' }} />
                    <YAxis domain={[50, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip formatter={(value) => [`${value}%`, '']} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="kesesuaianKerja"
                      name="Kesesuaian Bidang Kerja (Sedang + Tinggi %)"
                      stroke="#2563eb"
                      strokeWidth={3}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="keterlacakan"
                      name="Tingkat Keterlacakan (%)"
                      stroke="#10b981"
                      strokeWidth={3}
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="waktuTungguKurang6Bln"
                      name="Masa Tunggu < 6 Bulan (%)"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Data Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">Tahun Laporan</th>
                      <th className="py-2.5 px-3">Kohort Sasaran</th>
                      <th className="py-2.5 px-3 text-center">Populasi (N)</th>
                      <th className="py-2.5 px-3 text-center">Terlacak (n)</th>
                      <th className="py-2.5 px-3 text-center">Keterlacakan (%)</th>
                      <th className="py-2.5 px-3 text-center">Kesesuaian Kerja (%)</th>
                      <th className="py-2.5 px-3 text-center">Tunggu &lt; 6 Bln (%)</th>
                      <th className="py-2.5 px-3 text-center">Dipesan Pra-Lulus (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {yearlyTrendData.map((row) => (
                      <tr key={row.tahun} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-bold text-blue-900">{row.tahun}</td>
                        <td className="py-2.5 px-3 text-slate-600">{row.label}</td>
                        <td className="py-2.5 px-3 text-center font-mono">{row.totalLulusan}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-semibold">{row.terlacak}</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-700">{row.keterlacakan}%</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-blue-700">{row.kesesuaianKerja}%</td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold text-amber-700">{row.waktuTungguKurang6Bln}%</td>
                        <td className="py-2.5 px-3 text-center font-mono text-purple-700">{row.dipesanSebelumLulus}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KOMPARASI 4 PROGRAM STUDI */}
        {metricTab === 'antar_prodi' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Relevansi Bidang Antar-Prodi */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-base font-bold text-slate-900">Kesesuaian Bidang Kerja Kategori Tinggi (%)</h3>
                  <p className="text-xs text-slate-500">Perbandingan relevansi pendidikan antar 4 prodi</p>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prodiBenchmarkData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                      <XAxis dataKey="prodi" tick={{ fontSize: 12, fill: '#334155' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(val) => [`${val}%`, 'Kesesuaian Tinggi']} />
                      <Bar dataKey="persenTinggi" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Estimasi Rata-rata Pendapatan (F505) */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
                <div className="border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-base font-bold text-slate-900">Rata-rata Pendapatan Lulusan (Juta Rp / Bulan)</h3>
                  <p className="text-xs text-slate-500">Standar pemenuhan IKU 1 (&gt; 1.2x UMR)</p>
                </div>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prodiBenchmarkData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                      <XAxis dataKey="prodi" tick={{ fontSize: 12, fill: '#334155' }} />
                      <YAxis domain={[0, 12]} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(val) => [`Rp ${val} Juta`, 'Rata-rata Gaji']} />
                      <Bar dataKey="avgSalaryJt" fill="#10b981" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Cross-Prodi Table */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4">Ringkasan Benchmark 4 Program Studi Jurusan Elektro</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {prodiBenchmarkData.map((item) => (
                  <div key={item.prodi} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-blue-900 text-sm">{item.prodi}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {item.total} Lulusan
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 line-clamp-1">{item.nama}</div>
                    <div className="pt-2 border-t border-slate-200 space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Tingkat Keterlacakan:</span>
                        <span className="font-bold text-emerald-700">{item.rate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Kesesuaian Tinggi:</span>
                        <span className="font-bold text-blue-700">{item.persenTinggi}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rata-rata Gaji:</span>
                        <span className="font-bold text-slate-900">Rp {item.avgSalaryJt} Jt</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ANALISIS GAP KOMPETENSI */}
        {metricTab === 'gap_kompetensi' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Analisis Kesenjangan (Gap Analysis) Antara Kurikulum & Industri
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Berdasarkan Laporan Tracer Study 2024 (Bab VII) & 2025 (Bab VI) Jurusan Teknik Elektro
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                {/* Aspek Kuat */}
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Kompetensi Sangat Kuat (Dipertahankan)</span>
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Etika & Integritas (100% Positif):</strong> Alumni dinilai sangat patuh pada aturan K3, disiplin waktu kerja, dan memiliki sikap profesional yang baik.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Kerja Sama Tim (94% Positif):</strong> Keberhasilan model pembelajaran berbasis proyek (Project-Based Learning) dan praktikum kelompok.</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span><strong>Pengembangan Diri (89% Positif):</strong> Lulusan memiliki inisiatif belajar hal baru di pabrik/smelter secara mandiri.</span>
                    </li>
                  </ul>
                </div>

                {/* Aspek Gap Kebutuhan Industri */}
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                  <div className="flex items-center space-x-2 text-rose-900 font-bold text-sm">
                    <AlertTriangle className="w-5 h-5 text-rose-600" />
                    <span>Area Kesenjangan Utama (Prioritas Peningkatan)</span>
                  </div>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start space-x-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span><strong>Bahasa Asing (Positif hanya 47% | 53% Cukup/Kurang):</strong> Kesulitan memahami datasheet berbahasa Inggris, manual alat kelistrikan impor, dan standar internasional (IEC/IEEE).</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span><strong>Software Simulasi & CAD (Rekap 94%):</strong> Kebutuhan industri smelter dan pembangkit akan penguasaan software spesifik (ETAP, AutoCAD Electrical, PLC Omron/Siemens).</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span><strong>Sertifikasi Kompetensi:</strong> Kebutuhan sertifikat kompetensi resmi BNSP sebelum lulusan memasuki bursa kerja.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Rencana Strategis Perbaikan Pembelajaran */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-blue-600" />
                  <span>Rencana Tindakan Kurikulum & Laboratorium 2026</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Menindaklanjuti temuan ini, Jurusan Teknik Elektro Politeknik Negeri Manado menerapkan 3 program percepatan:
                  1) Penyelenggaraan <em>English for Electrical Engineering</em> terpadu pada jobsheet praktikum;
                  2) Uji kompetensi sertifikasi profesi BNSP pada semester akhir;
                  3) Penguatan kemitraan magang 6 bulan di 17 instansi mitra (PLN, Wilmar, IMIP Morowali, PT Sasa Inti).
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
