'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTracer } from '@/lib/store/tracerStore';
import { PROGRAM_STUDI_LIST, OFFICIAL_SUMMARIES, DAFTAR_17_INSTANSI_MITRA } from '@/lib/data/initialData';
import { 
  Award, 
  Printer, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Building2, 
  Clock, 
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function LaporanAkreditasiPage() {
  const { summaries, alumniList } = useTracer();
  const [selectedReportId, setSelectedReportId] = useState<'2025' | '2024' | '2026'>('2025');

  const report2024 = OFFICIAL_SUMMARIES.find(s => s.tahunLaporan === 2024)!;
  const report2025 = OFFICIAL_SUMMARIES.find(s => s.tahunLaporan === 2025)!;
  const activeReport = selectedReportId === '2024' ? report2024 : report2025;

  const handlePrint = () => {
    window.print();
  };

  const handleExportSummaryExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Waktu Tunggu
    const ws1Data = [
      ['TABEL 8.d.1 WAKTU TUNGGU LULUSAN'],
      ['Tahun Laporan', 'Kohort Lulusan', 'Total Lulusan (N)', 'Lulusan Terlacak (n)', '< 3 Bulan', '3-6 Bulan', '> 6 Bulan', 'Dipesan Pra-Lulus', 'Tingkat Keterlacakan (%)'],
      [
        report2024.tahunLaporan,
        report2024.tahunLulusanLabel,
        report2024.totalLulusan,
        report2024.lulusanTerlacak,
        report2024.waktuTunggu.kurang3Bulan,
        report2024.waktuTunggu.antara3Sd6Bulan,
        report2024.waktuTunggu.lebih6Bulan,
        report2024.waktuTunggu.dipesanSebelumLulus,
        `${report2024.tingkatKeterlacakan}%`
      ],
      [
        report2025.tahunLaporan,
        report2025.tahunLulusanLabel,
        report2025.totalLulusan,
        report2025.lulusanTerlacak,
        report2025.waktuTunggu.kurang3Bulan,
        report2025.waktuTunggu.antara3Sd6Bulan,
        report2025.waktuTunggu.lebih6Bulan,
        report2025.waktuTunggu.dipesanSebelumLulus,
        `${report2025.tingkatKeterlacakan}%`
      ]
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(ws1Data);
    XLSX.utils.book_append_sheet(wb, ws1, 'Tabel_Waktu_Tunggu');

    // Sheet 2: Kepuasan Pengguna
    const ws2Data = [
      ['TABEL 8.e.1 KEPUASAN PENGGUNA LULUSAN (17 RESPONDEN)'],
      ['No', 'Jenis Kemampuan', 'Sangat Baik (%)', 'Baik (%)', 'Cukup (%)', 'Kurang (%)', 'Total (%)', 'Positif (%)', 'Rencana Tindak Lanjut'],
      ...activeReport.kepuasanPengguna.aspek.map((a, i) => [
        i + 1,
        a.nama,
        `${a.sangatBaik}%`,
        `${a.baik}%`,
        `${a.cukup}%`,
        `${a.kurang}%`,
        `${a.total}%`,
        `${a.positif}%`,
        a.implikasi || '-'
      ])
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
    XLSX.utils.book_append_sheet(wb, ws2, 'Kepuasan_Pengguna');

    XLSX.writeFile(wb, `Laporan_Akreditasi_LAM_Teknik_Polimdo_${selectedReportId}.xlsx`);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Controls / Non-Print Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4 no-print">
          <div className="flex items-center space-x-3">
            <Award className="w-6 h-6 text-blue-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Format Laporan Akreditasi Resmi</h2>
              <p className="text-xs text-slate-500">Standar Borang LKPS LAM Teknik & BAN-PT (Siap Cetak / PDF)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Select Report Version */}
            <select
              value={selectedReportId}
              onChange={(e) => setSelectedReportId(e.target.value as '2025' | '2024' | '2026')}
              className="px-3 py-2 border rounded-xl text-xs font-semibold bg-slate-50 text-slate-800"
            >
              <option value="2025">Laporan 2025 (Kohort 2024 TS-1)</option>
              <option value="2024">Laporan 2024 (Lulusan TA 2022/2023)</option>
            </select>

            <button
              onClick={handleExportSummaryExcel}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ekspor Tabel Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold shadow-md transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* PRINTABLE OFFICIAL DOCUMENT CONTAINER */}
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-300 shadow-xl print:shadow-none print:border-none print:p-0 text-slate-900 space-y-8">
          {/* Official Letterhead (KOP SURAT) */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex items-center justify-between">
              <div className="w-20 h-20 relative flex-shrink-0">
                <Image
                  src="/logo-polimdo.png"
                  alt="Logo Resmi Politeknik Negeri Manado"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>

              <div className="text-center flex-1 px-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  KEMENTERIAN PENDIDIKAN TINGGI, SAINS, DAN TEKNOLOGI
                </h3>
                <h2 className="text-lg font-black tracking-tight text-slate-950">
                  POLITEKNIK NEGERI MANADO
                </h2>
                <h4 className="text-sm font-bold text-slate-800">
                  JURUSAN TEKNIK ELEKTRO • PROGRAM STUDI D3 TEKNIK LISTRIK
                </h4>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  Jl. Raya Politeknik, Kelurahan Buha, Kec. Mapanget, Manado 95252 • Telp: (0431) 811568 • www.polimdo.ac.id
                </p>
              </div>

              <div className="w-20 text-right text-[10px] text-slate-400 font-mono">
                LKPS-D3TL
                <br />
                DOC-2026
              </div>
            </div>
          </div>

          {/* Title Header */}
          <div className="text-center space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight uppercase underline decoration-2 underline-offset-4">
              REKAPITULASI LAPORAN TRACER STUDY & KEPUASAN PENGGUNA LULUSAN
            </h1>
            <p className="text-xs font-semibold text-slate-700">
              {activeReport.tahunLulusanLabel} • Evaluasi Tahun {activeReport.tahunLaporan}
            </p>
            <p className="text-[11px] text-slate-500">
              Dokumen Pendukung Akreditasi LAM Teknik Kriteria 8 (Kelulusan) & Kriteria 9 (Keluaran & Capaian Tridharma)
            </p>
          </div>

          {/* Ringkasan Eksekutif Angka Kinerja */}
          <div className="grid grid-cols-4 gap-3 text-center border border-slate-200 rounded-xl p-3 bg-slate-50/50">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Total Lulusan (N)</span>
              <span className="text-xl font-extrabold text-slate-900">{activeReport.totalLulusan}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Lulusan Terlacak (n)</span>
              <span className="text-xl font-extrabold text-blue-700">{activeReport.lulusanTerlacak} ({activeReport.tingkatKeterlacakan}%)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Kesesuaian Kerja Tinggi</span>
              <span className="text-xl font-extrabold text-emerald-700">{activeReport.kesesuaianBidang.tinggi} ({activeReport.kesesuaianBidang.persenTinggi}%)</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Responden Pengguna</span>
              <span className="text-xl font-extrabold text-purple-700">{activeReport.kepuasanPengguna.responden} Mitra</span>
            </div>
          </div>

          {/* Tabel 1: Waktu Tunggu Lulusan (Standar LKPS 8.d.1) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-slate-900 border-l-3 border-blue-600 pl-2">
              1. Tabel Waktu Tunggu Memperoleh Pekerjaan Pertama
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="border border-slate-300 p-2">Tahun Lulusan</th>
                  <th className="border border-slate-300 p-2 text-center">Jumlah Lulusan (N)</th>
                  <th className="border border-slate-300 p-2 text-center">Jumlah Terlacak (n)</th>
                  <th className="border border-slate-300 p-2 text-center">&lt; 3 Bulan</th>
                  <th className="border border-slate-300 p-2 text-center">3 – 6 Bulan</th>
                  <th className="border border-slate-300 p-2 text-center">&gt; 6 Bulan</th>
                  <th className="border border-slate-300 p-2 text-center">Dipesan Pra-Lulus</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold">{activeReport.tahunLulusanLabel}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono">{activeReport.totalLulusan}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono font-bold">{activeReport.lulusanTerlacak}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono">{activeReport.waktuTunggu.kurang3Bulan}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono">{activeReport.waktuTunggu.antara3Sd6Bulan}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono">{activeReport.waktuTunggu.lebih6Bulan}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono font-semibold text-blue-700">
                    {activeReport.waktuTunggu.dipesanSebelumLulus} ({Number(((activeReport.waktuTunggu.dipesanSebelumLulus / activeReport.totalLulusan) * 100).toFixed(1))}%)
                  </td>
                </tr>
              </tbody>
            </table>
            {activeReport.waktuTunggu.catatanAudit && (
              <p className="text-[10px] text-amber-800 italic bg-amber-50 p-1.5 rounded border border-amber-200">
                * {activeReport.waktuTunggu.catatanAudit}
              </p>
            )}
          </div>

          {/* Tabel 2: Kesesuaian Bidang Kerja (Standar LKPS 8.d.2) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-slate-900 border-l-3 border-emerald-600 pl-2">
              2. Tabel Kesesuaian Bidang Kerja Lulusan
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="border border-slate-300 p-2">Tahun Lulusan</th>
                  <th className="border border-slate-300 p-2 text-center">Jumlah Terlacak (n)</th>
                  <th className="border border-slate-300 p-2 text-center">Tinggi (Sesuai)</th>
                  <th className="border border-slate-300 p-2 text-center">Sedang</th>
                  <th className="border border-slate-300 p-2 text-center">Rendah</th>
                  <th className="border border-slate-300 p-2 text-center">Persentase Sedang + Tinggi (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2 font-semibold">{activeReport.tahunLulusanLabel}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono font-bold">{activeReport.lulusanTerlacak}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono text-emerald-800 font-semibold">{activeReport.kesesuaianBidang.tinggi}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono text-amber-800">{activeReport.kesesuaianBidang.sedang}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono text-rose-800">{activeReport.kesesuaianBidang.rendah}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono font-bold text-blue-800">{activeReport.kesesuaianBidang.persenSedangTinggi}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Tabel 3: Tempat Kerja Lulusan (Lokal, Nasional, Multinasional) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase text-slate-900 border-l-3 border-purple-600 pl-2">
              3. Tabel Kategori & Skala Tempat Kerja Lulusan
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="border border-slate-300 p-2">Klasifikasi Sesuai Sumber</th>
                  <th className="border border-slate-300 p-2 text-center">Frekuensi (Orang)</th>
                  <th className="border border-slate-300 p-2 text-center">Persentase dari Terlacak (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2">Lokal / Wilayah / Berwirausaha Tidak Berizin</td>
                  <td className="border border-slate-300 p-2 text-center font-mono">{activeReport.tempatKerja.lokal}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono">
                    {Number(((activeReport.tempatKerja.lokal / activeReport.lulusanTerlacak) * 100).toFixed(2))}%
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2 font-medium">Nasional / Berwirausaha Berizin</td>
                  <td className="border border-slate-300 p-2 text-center font-mono font-bold text-blue-700">{activeReport.tempatKerja.nasional}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono font-bold text-blue-700">
                    {Number(((activeReport.tempatKerja.nasional / activeReport.lulusanTerlacak) * 100).toFixed(2))}%
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2">Multinasional / Internasional</td>
                  <td className="border border-slate-300 p-2 text-center font-mono">{activeReport.tempatKerja.multinasional}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono">
                    {Number(((activeReport.tempatKerja.multinasional / activeReport.lulusanTerlacak) * 100).toFixed(2))}%
                  </td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="border border-slate-300 p-2">Jumlah Kategori Tercatat</td>
                  <td className="border border-slate-300 p-2 text-center font-mono">{activeReport.tempatKerja.totalTercatat}</td>
                  <td className="border border-slate-300 p-2 text-center font-mono">
                    {Number(((activeReport.tempatKerja.totalTercatat / activeReport.lulusanTerlacak) * 100).toFixed(2))}%
                  </td>
                </tr>
              </tbody>
            </table>
            {activeReport.tempatKerja.catatanValidasi && (
              <p className="text-[10px] text-amber-800 italic bg-amber-50 p-1.5 rounded border border-amber-200">
                * {activeReport.tempatKerja.catatanValidasi}
              </p>
            )}
          </div>

          {/* Tabel 4: Kepuasan Pengguna Lulusan 7 Aspek (LKPS 8.e.1) */}
          <div className="space-y-2 page-break">
            <h3 className="text-xs font-bold uppercase text-slate-900 border-l-3 border-amber-600 pl-2">
              4. Tabel Evaluasi Kepuasan Pengguna Lulusan ({activeReport.kepuasanPengguna.responden} Responden Industri)
            </h3>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800">
                  <th className="border border-slate-300 p-2">No</th>
                  <th className="border border-slate-300 p-2">Jenis Kemampuan</th>
                  <th className="border border-slate-300 p-2 text-center">Sangat Baik (%)</th>
                  <th className="border border-slate-300 p-2 text-center">Baik (%)</th>
                  <th className="border border-slate-300 p-2 text-center">Cukup (%)</th>
                  <th className="border border-slate-300 p-2 text-center">Kurang (%)</th>
                  <th className="border border-slate-300 p-2 text-center">Total (%)</th>
                  <th className="border border-slate-300 p-2">Rencana Tindak Lanjut UPPS / PS</th>
                </tr>
              </thead>
              <tbody>
                {activeReport.kepuasanPengguna.aspek.map((aspek, i) => (
                  <tr key={aspek.id}>
                    <td className="border border-slate-300 p-2 text-center font-mono">{i + 1}</td>
                    <td className="border border-slate-300 p-2 font-semibold text-slate-900">{aspek.nama}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono">{aspek.sangatBaik.toFixed(2)}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono">{aspek.baik.toFixed(2)}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono">{aspek.cukup.toFixed(2)}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono">{aspek.kurang.toFixed(2)}</td>
                    <td className="border border-slate-300 p-2 text-center font-mono font-bold">
                      {aspek.id === 'teknologi_informasi' ? '94.00*' : aspek.total.toFixed(2)}
                    </td>
                    <td className="border border-slate-300 p-2 text-[11px] text-slate-600">
                      {aspek.implikasi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Audit Mutu & Keabsahan Data */}
          <div className="p-4 rounded-xl border border-slate-300 bg-slate-50 text-xs space-y-2">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Matriks Audit dan Keabsahan Data (Prinsip Ketertelusuran):</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              {activeReport.auditMutu.poinTemuan.map((pt, idx) => (
                <li key={idx}>{pt}</li>
              ))}
            </ul>
          </div>

          {/* Lembar Pengesahan Resmi (Signatures) */}
          <div className="pt-8 border-t border-slate-200">
            <div className="text-right text-xs text-slate-600 mb-6">
              Manado, {selectedReportId === '2024' ? 'Desember 2024' : 'Desember 2025'}
            </div>

            <div className="grid grid-cols-2 gap-8 text-center text-xs">
              <div>
                <p className="text-slate-600">Mengetahui,</p>
                <p className="font-bold text-slate-900">Ketua Jurusan Teknik Elektro</p>
                <div className="h-20 flex items-center justify-center">
                  <span className="font-serif italic text-slate-300 text-lg">[Tanda Tangan & Cap Jurusan]</span>
                </div>
                <p className="font-bold text-slate-900 underline">Dr. Marson J. Budiman, ST., MT</p>
                <p className="text-slate-500 font-mono text-[10px]">NIP. 197403151999031002</p>
              </div>

              <div>
                <p className="text-slate-600">Menyetujui,</p>
                <p className="font-bold text-slate-900">Koordinator Program Studi D3 Teknik Listrik</p>
                <div className="h-20 flex items-center justify-center">
                  <span className="font-serif italic text-slate-300 text-lg">[Tanda Tangan & Cap Prodi]</span>
                </div>
                <p className="font-bold text-slate-900 underline">Anthoneite Waroh, ST., MT</p>
                <p className="text-slate-500 font-mono text-[10px]">NIP. 197608122002122001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
