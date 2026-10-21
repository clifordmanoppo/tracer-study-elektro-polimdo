'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useTracer } from '@/lib/store/tracerStore';
import { useAuth } from '@/lib/auth/authContext';
import { PROGRAM_STUDI_LIST } from '@/lib/data/initialData';
import { AlumniRecord, ProdiId, StatusAktivitas, TingkatKesesuaian, RuangLingkup } from '@/types/tracer';
import * as XLSX from 'xlsx';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Upload, 
  Eye, 
  Edit3, 
  Trash2, 
  X, 
  CheckCircle2, 
  Briefcase, 
  Building2, 
  DollarSign, 
  Clock, 
  GraduationCap,
  AlertCircle,
  FileSpreadsheet,
  ChevronRight
} from 'lucide-react';

export default function AlumniPage() {
  const { alumniList, addAlumni, updateAlumni, deleteAlumni, importAlumni } = useTracer();
  const { user, canManageAllProdi } = useAuth();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterProdi, setFilterProdi] = useState(user.role === 'admin_prodi' && user.prodiId ? user.prodiId : 'all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterKesesuaian, setFilterKesesuaian] = useState('all');

  // Modals state
  const [selectedAlumni, setSelectedAlumni] = useState<AlumniRecord | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<AlumniRecord>>({});

  // Import Excel state
  const [importedRows, setImportedRows] = useState<Omit<AlumniRecord, 'id' | 'createdAt'>[]>([]);
  const [importFileName, setImportFileName] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State for Add Alumni
  const [newAlumni, setNewAlumni] = useState<Omit<AlumniRecord, 'id' | 'createdAt'>>({
    nim: '',
    nama: '',
    prodiId: 'D3-TL',
    tahunMasuk: 2021,
    tahunLulus: 2024,
    statusAktivitas: 'bekerja',
    terlacak: true,
    namaInstansi: '',
    lokasiInstansi: '',
    jenisInstansi: 'swasta_nasional',
    ruangLingkup: 'nasional',
    jabatan: '',
    bidangPekerjaan: '',
    pendapatanBulanan: 4500000,
    waktuTungguBulan: 2,
    dipesanSebelumLulus: false,
    keselarasanKategori: 'tinggi',
    keselarasanHorizontal: 'sangat_relevan',
    keselarasanVertikal: 'sesuai_jenjang',
    noHp: '',
    email: '',
    domisiliProvinsi: 'Sulawesi Utara',
    domisiliKota: 'Kota Manado'
  });

  // Filtered dataset
  const filteredData = useMemo(() => {
    return alumniList.filter((item) => {
      // Role enforcement: admin prodi only sees their prodi unless authorized
      if (!canManageAllProdi && user.role === 'admin_prodi' && user.prodiId && item.prodiId !== user.prodiId) {
        return false;
      }

      // Search term
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchNim = item.nim?.toLowerCase().includes(q);
        const matchNama = item.nama?.toLowerCase().includes(q);
        const matchInstansi = item.namaInstansi?.toLowerCase().includes(q);
        const matchJabatan = item.jabatan?.toLowerCase().includes(q);
        if (!matchNim && !matchNama && !matchInstansi && !matchJabatan) {
          return false;
        }
      }

      // Filter Year
      if (filterYear !== 'all' && item.tahunLulus.toString() !== filterYear) {
        return false;
      }

      // Filter Prodi
      if (filterProdi !== 'all' && item.prodiId !== filterProdi) {
        return false;
      }

      // Filter Status
      if (filterStatus !== 'all' && item.statusAktivitas !== filterStatus) {
        return false;
      }

      // Filter Kesesuaian
      if (filterKesesuaian !== 'all' && item.keselarasanKategori !== filterKesesuaian) {
        return false;
      }

      return true;
    });
  }, [alumniList, searchTerm, filterYear, filterProdi, filterStatus, filterKesesuaian, user, canManageAllProdi]);

  // Export to Excel (.xlsx) using SheetJS
  const handleExportExcel = () => {
    const exportRows = filteredData.map((item, index) => ({
      No: index + 1,
      NIM: item.nim,
      Nama_Lengkap: item.nama,
      Program_Studi: item.prodiId,
      Tahun_Masuk: item.tahunMasuk || '-',
      Tahun_Lulus: item.tahunLulus,
      Status_Aktivitas: item.statusAktivitas,
      Terlacak: item.terlacak ? 'Ya' : 'Tidak',
      Instansi_Perusahaan: item.namaInstansi || '-',
      Lokasi_Instansi: item.lokasiInstansi || '-',
      Skala_Tempat_Kerja: item.ruangLingkup || '-',
      Jabatan_Posisi: item.jabatan || '-',
      Bidang_Pekerjaan: item.bidangPekerjaan || '-',
      Pendapatan_Bulanan_Rp: item.pendapatanBulanan || 0,
      Waktu_Tunggu_Bulan: item.waktuTungguBulan ?? '-',
      Dipesan_Sebelum_Lulus: item.dipesanSebelumLulus ? 'Ya' : 'Tidak',
      Kesesuaian_Bidang: item.keselarasanKategori || '-',
      Relevansi_Kurikulum: item.keselarasanHorizontal || '-',
      No_Handphone: item.noHp || '-',
      Email: item.email || '-',
      Domisili_Kota: item.domisiliKota || '-',
      Sumber_Data: item.sumberData || 'sistem'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data_Alumni');
    
    // Auto-width columns
    const maxProps = Object.keys(exportRows[0] || {});
    worksheet['!cols'] = maxProps.map(() => ({ wch: 18 }));

    const fileName = `Tracer_Study_Polimdo_Alumni_${filterProdi}_${filterYear}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Import Excel (.xlsx / .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

        const parsed: Omit<AlumniRecord, 'id' | 'createdAt'>[] = data.map((row, idx) => {
          const nim = String(row['NIM'] || row['nim'] || `2402${1000 + idx}`);
          const nama = String(row['Nama_Lengkap'] || row['Nama'] || row['nama'] || `Alumni ${idx + 1}`);
          const prodiId = (row['Program_Studi'] || row['prodi'] || 'D3-TL') as ProdiId;
          const tahunLulus = Number(row['Tahun_Lulus'] || row['tahun_lulus'] || 2024);
          const statusAktivitas = (row['Status_Aktivitas'] || row['status'] || 'bekerja') as StatusAktivitas;
          const namaInstansi = String(row['Instansi_Perusahaan'] || row['instansi'] || row['Perusahaan'] || '');
          const jabatan = String(row['Jabatan_Posisi'] || row['jabatan'] || '');
          const pendapatan = Number(row['Pendapatan_Bulanan_Rp'] || row['gaji'] || 4500000);
          const waktuTunggu = Number(row['Waktu_Tunggu_Bulan'] || row['waktu_tunggu'] || 2);
          const kesesuaian = (row['Kesesuaian_Bidang'] || 'tinggi') as TingkatKesesuaian;

          return {
            nim,
            nama,
            prodiId,
            tahunLulus,
            statusAktivitas,
            terlacak: true,
            namaInstansi,
            jabatan,
            pendapatanBulanan: pendapatan,
            waktuTungguBulan: waktuTunggu,
            keselarasanKategori: kesesuaian,
            ruangLingkup: 'nasional',
            sumberData: 'impor_excel'
          };
        });

        setImportedRows(parsed);
        setImportStatus(`Berhasil membaca ${parsed.length} baris data dari file.`);
      } catch (err) {
        console.error(err);
        setImportStatus('Gagal membaca file Excel. Pastikan format file valid (.xlsx atau .csv).');
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleConfirmImport = async () => {
    if (importedRows.length === 0) return;
    const count = await importAlumni(importedRows);
    setIsImportModalOpen(false);
    setImportedRows([]);
    setImportFileName('');
    setImportStatus(null);
    alert(`Berhasil mengimpor ${count} data alumni ke dalam sistem!`);
  };

  // Add Alumni Submit
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlumni.nim || !newAlumni.nama) {
      alert('NIM dan Nama Lengkap wajib diisi!');
      return;
    }
    await addAlumni(newAlumni);
    setIsAddModalOpen(false);
    // Reset form
    setNewAlumni({
      nim: '',
      nama: '',
      prodiId: 'D3-TL',
      tahunMasuk: 2021,
      tahunLulus: 2024,
      statusAktivitas: 'bekerja',
      terlacak: true,
      namaInstansi: '',
      lokasiInstansi: '',
      jenisInstansi: 'swasta_nasional',
      ruangLingkup: 'nasional',
      jabatan: '',
      bidangPekerjaan: '',
      pendapatanBulanan: 4500000,
      waktuTungguBulan: 2,
      dipesanSebelumLulus: false,
      keselarasanKategori: 'tinggi',
      keselarasanHorizontal: 'sangat_relevan',
      keselarasanVertikal: 'sesuai_jenjang',
      noHp: '',
      email: '',
      domisiliProvinsi: 'Sulawesi Utara',
      domisiliKota: 'Kota Manado'
    });
  };

  // Edit Alumni Submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlumni) return;
    await updateAlumni(selectedAlumni.id, editFormData);
    setIsEditModalOpen(false);
    setSelectedAlumni(null);
  };

  // Delete Alumni
  const handleDelete = async (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus data alumni: ${nama}?`)) {
      await deleteAlumni(id);
    }
  };

  const getStatusBadge = (status: StatusAktivitas) => {
    switch (status) {
      case 'bekerja':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Bekerja</span>;
      case 'wirausaha':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Wirausaha</span>;
      case 'studi_lanjut':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Studi Lanjut</span>;
      case 'mencari_kerja':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Mencari Kerja</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Belum Memungkinkan</span>;
    }
  };

  const getKesesuaianBadge = (kategori?: TingkatKesesuaian) => {
    switch (kategori) {
      case 'tinggi':
        return <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">Tinggi</span>;
      case 'sedang':
        return <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded text-[11px] border border-amber-200">Sedang</span>;
      case 'rendah':
        return <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-200">Rendah</span>;
      default:
        return <span className="text-slate-400 text-[11px]">-</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <span>Tracer Study</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-blue-600 font-semibold">Direktori Data Alumni</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manajemen Data Alumni
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Data individual kohort 2023, 2024, 2025, dan 2026 Jurusan Teknik Elektro Politeknik Negeri Manado.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold shadow-xs transition-colors"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Impor Excel</span>
            </button>

            <button
              onClick={handleExportExcel}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Ekspor Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Alumni Baru</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari NIM, Nama, Perusahaan, atau Jabatan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Year */}
            <div>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="all">Semua Tahun Lulus</option>
                <option value="2026">Tahun Lulus 2026</option>
                <option value="2025">Tahun Lulus 2025</option>
                <option value="2024">Tahun Lulus 2024 (Kohort 2024)</option>
                <option value="2023">Tahun Lulus 2023 (TA 2022/2023)</option>
              </select>
            </div>

            {/* Filter Prodi */}
            <div>
              <select
                value={filterProdi}
                onChange={(e) => setFilterProdi(e.target.value)}
                disabled={!canManageAllProdi && user.role === 'admin_prodi'}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium disabled:opacity-60"
              >
                <option value="all">Semua Program Studi</option>
                {PROGRAM_STUDI_LIST.map((p) => (
                  <option key={p.id} value={p.id}>{p.id} - {p.nama}</option>
                ))}
              </select>
            </div>

            {/* Filter Status */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full py-2 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="all">Semua Status Aktivitas</option>
                <option value="bekerja">Bekerja</option>
                <option value="wirausaha">Berwirausaha</option>
                <option value="studi_lanjut">Studi Lanjut</option>
                <option value="mencari_kerja">Mencari Kerja</option>
                <option value="belum_memungkinkan">Belum Memungkinkan</option>
              </select>
            </div>
          </div>

          {/* Quick counts */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div>
              Menampilkan <strong>{filteredData.length}</strong> dari total {alumniList.length} alumni terdata.
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Terlacak: {filteredData.filter(d => d.terlacak).length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span>
                <span>Belum Terlacak: {filteredData.filter(d => !d.terlacak).length}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Alumni Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-700 text-xs font-bold border-b border-slate-200">
                  <th className="py-3 px-4">No</th>
                  <th className="py-3 px-4">NIM & Nama</th>
                  <th className="py-3 px-4">Prodi & Thn</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Instansi & Jabatan</th>
                  <th className="py-3 px-4">Waktu Tunggu</th>
                  <th className="py-3 px-4">Kesesuaian</th>
                  <th className="py-3 px-4">Gaji (F505)</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      Tidak ada data alumni yang cocok dengan filter yang dipilih.
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{item.nama}</div>
                        <div className="font-mono text-[11px] text-slate-500">{item.nim}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold">
                          {item.prodiId}
                        </span>
                        <div className="text-[11px] text-slate-500 mt-0.5">Lulus {item.tahunLulus}</div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(item.statusAktivitas)}
                      </td>
                      <td className="py-3 px-4">
                        {item.namaInstansi ? (
                          <div>
                            <div className="font-semibold text-slate-900 truncate max-w-[180px]" title={item.namaInstansi}>
                              {item.namaInstansi}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-[180px]" title={item.jabatan}>
                              {item.jabatan || '-'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Belum bekerja / mencari</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {item.waktuTungguBulan !== undefined ? (
                          <div>
                            <span className="font-medium text-slate-900">
                              {item.waktuTungguBulan === 0 ? '< 1 Bulan' : `${item.waktuTungguBulan} Bulan`}
                            </span>
                            {item.dipesanSebelumLulus && (
                              <span className="block text-[10px] font-bold text-blue-600">
                                Dipesan Pra-Lulus
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {getKesesuaianBadge(item.keselarasanKategori)}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-900">
                        {item.pendapatanBulanan 
                          ? `Rp ${item.pendapatanBulanan.toLocaleString('id-ID')}`
                          : '-'
                        }
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center space-x-1.5">
                          <button
                            onClick={() => setSelectedAlumni(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail Profil"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAlumni(item);
                              setEditFormData(item);
                              setIsEditModalOpen(true);
                            }}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit Data"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.nama)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus Data"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* DETAIL ALUMNI MODAL */}
      {selectedAlumni && !isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  {selectedAlumni.prodiId}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1">{selectedAlumni.nama}</h3>
                <p className="text-xs text-slate-500 font-mono">NIM: {selectedAlumni.nim} • Lulusan Tahun {selectedAlumni.tahunLulus}</p>
              </div>
              <button
                onClick={() => setSelectedAlumni(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-xs">
              {/* Row 1: Status & Pekerjaan */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Informasi Karir & Pekerjaan</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Status Saat Ini</span>
                    <div className="mt-0.5">{getStatusBadge(selectedAlumni.statusAktivitas)}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nama Instansi / Perusahaan</span>
                    <span className="font-semibold text-slate-800">{selectedAlumni.namaInstansi || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Jabatan / Posisi</span>
                    <span className="font-semibold text-slate-800">{selectedAlumni.jabatan || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Skala Tempat Kerja</span>
                    <span className="font-semibold text-slate-800 capitalize">{selectedAlumni.ruangLingkup || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Masa Tunggu Kerja</span>
                    <span className="font-semibold text-slate-800">
                      {selectedAlumni.waktuTungguBulan !== undefined ? `${selectedAlumni.waktuTungguBulan} Bulan` : '-'}
                      {selectedAlumni.dipesanSebelumLulus && ' (Dipesan sebelum lulus)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Pendapatan Bulanan (F505)</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {selectedAlumni.pendapatanBulanan ? `Rp ${selectedAlumni.pendapatanBulanan.toLocaleString('id-ID')}` : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 2: Kesesuaian Kurikulum */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span>Relevansi Kurikulum & Kesesuaian (IKU)</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Kategori Kesesuaian</span>
                    <div className="mt-0.5">{getKesesuaianBadge(selectedAlumni.keselarasanKategori)}</div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Relevansi Horizontal (F14)</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {selectedAlumni.keselarasanHorizontal?.replace('_', ' ') || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Kesesuaian Jenjang Vertikal (F15)</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {selectedAlumni.keselarasanVertikal?.replace('_', ' ') || '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Sumber Data Pelaporan</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {selectedAlumni.sumberData?.replace(/_/g, ' ') || 'Sistem Tracer'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Row 3: Kontak & Domisili */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm">Kontak & Domisili</div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nomor WhatsApp</span>
                    <span className="font-semibold text-slate-800">{selectedAlumni.noHp || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email Aktif</span>
                    <span className="font-semibold text-slate-800">{selectedAlumni.email || '-'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Domisili</span>
                    <span className="font-semibold text-slate-800">{selectedAlumni.domisiliKota}, {selectedAlumni.domisiliProvinsi}</span>
                  </div>
                  {selectedAlumni.catatanValidasi && (
                    <div className="col-span-2 p-2 bg-amber-50 text-amber-800 rounded border border-amber-200">
                      <strong>Catatan Audit:</strong> {selectedAlumni.catatanValidasi}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedAlumni(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD ALUMNI MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Tambah Data Alumni Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">NIM *</label>
                  <input
                    type="text"
                    required
                    value={newAlumni.nim}
                    onChange={(e) => setNewAlumni({ ...newAlumni, nim: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Contoh: 21021035"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={newAlumni.nama}
                    onChange={(e) => setNewAlumni({ ...newAlumni, nama: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama sesuai ijazah"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Program Studi</label>
                  <select
                    value={newAlumni.prodiId}
                    onChange={(e) => setNewAlumni({ ...newAlumni, prodiId: e.target.value as ProdiId })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {PROGRAM_STUDI_LIST.map((p) => (
                      <option key={p.id} value={p.id}>{p.nama}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tahun Lulus</label>
                  <select
                    value={newAlumni.tahunLulus}
                    onChange={(e) => setNewAlumni({ ...newAlumni, tahunLulus: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value={2026}>2026</option>
                    <option value={2025}>2025</option>
                    <option value={2024}>2024</option>
                    <option value={2023}>2023</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status Aktivitas</label>
                  <select
                    value={newAlumni.statusAktivitas}
                    onChange={(e) => setNewAlumni({ ...newAlumni, statusAktivitas: e.target.value as StatusAktivitas })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="bekerja">Bekerja</option>
                    <option value="wirausaha">Berwirausaha</option>
                    <option value="studi_lanjut">Melanjutkan Studi</option>
                    <option value="mencari_kerja">Mencari Pekerjaan</option>
                    <option value="belum_memungkinkan">Belum Memungkinkan Bekerja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Skala Tempat Kerja</label>
                  <select
                    value={newAlumni.ruangLingkup}
                    onChange={(e) => setNewAlumni({ ...newAlumni, ruangLingkup: e.target.value as RuangLingkup })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="lokal">Lokal / Usaha Tidak Berizin</option>
                    <option value="nasional">Nasional / Berwirausaha Berizin</option>
                    <option value="multinasional">Multinasional / Internasional</option>
                  </select>
                </div>
              </div>

              {/* Data Pekerjaan */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-800 mb-2">Pekerjaan & Waktu Tunggu</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Nama Instansi / Usaha</label>
                    <input
                      type="text"
                      value={newAlumni.namaInstansi || ''}
                      onChange={(e) => setNewAlumni({ ...newAlumni, namaInstansi: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Contoh: PT PLN / Morowali"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Jabatan / Posisi</label>
                    <input
                      type="text"
                      value={newAlumni.jabatan || ''}
                      onChange={(e) => setNewAlumni({ ...newAlumni, jabatan: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="Contoh: Teknisi Listrik"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Waktu Tunggu (Bulan)</label>
                    <input
                      type="number"
                      min={0}
                      value={newAlumni.waktuTungguBulan}
                      onChange={(e) => setNewAlumni({ ...newAlumni, waktuTungguBulan: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Pendapatan Bulanan (Rp)</label>
                    <input
                      type="number"
                      step={100000}
                      value={newAlumni.pendapatanBulanan}
                      onChange={(e) => setNewAlumni({ ...newAlumni, pendapatanBulanan: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Kesesuaian Bidang Kerja</label>
                    <select
                      value={newAlumni.keselarasanKategori}
                      onChange={(e) => setNewAlumni({ ...newAlumni, keselarasanKategori: e.target.value as TingkatKesesuaian })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="tinggi">Tinggi (Sesuai Kompetensi)</option>
                      <option value="sedang">Sedang</option>
                      <option value="rendah">Rendah (Tidak Sesuai)</option>
                    </select>
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newAlumni.dipesanSebelumLulus}
                        onChange={(e) => setNewAlumni({ ...newAlumni, dipesanSebelumLulus: e.target.checked })}
                        className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                      />
                      <span className="text-slate-700 font-semibold">Dipesan Sebelum Lulus (Pra-Wisuda)</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 text-xs font-semibold shadow-xs"
                >
                  Simpan Data Alumni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT ALUMNI MODAL */}
      {isEditModalOpen && selectedAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Edit Data Alumni: {selectedAlumni.nama}</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={editFormData.nama || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, nama: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status Aktivitas</label>
                  <select
                    value={editFormData.statusAktivitas || 'bekerja'}
                    onChange={(e) => setEditFormData({ ...editFormData, statusAktivitas: e.target.value as StatusAktivitas })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="bekerja">Bekerja</option>
                    <option value="wirausaha">Berwirausaha</option>
                    <option value="studi_lanjut">Studi Lanjut</option>
                    <option value="mencari_kerja">Mencari Kerja</option>
                    <option value="belum_memungkinkan">Belum Memungkinkan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Instansi</label>
                  <input
                    type="text"
                    value={editFormData.namaInstansi || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, namaInstansi: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Jabatan / Posisi</label>
                  <input
                    type="text"
                    value={editFormData.jabatan || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, jabatan: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Waktu Tunggu (Bulan)</label>
                  <input
                    type="number"
                    value={editFormData.waktuTungguBulan ?? 0}
                    onChange={(e) => setEditFormData({ ...editFormData, waktuTungguBulan: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Kesesuaian Bidang</label>
                  <select
                    value={editFormData.keselarasanKategori || 'tinggi'}
                    onChange={(e) => setEditFormData({ ...editFormData, keselarasanKategori: e.target.value as TingkatKesesuaian })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="tinggi">Tinggi</option>
                    <option value="sedang">Sedang</option>
                    <option value="rendah">Rendah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Gaji Bulanan (Rp)</label>
                  <input
                    type="number"
                    value={editFormData.pendapatanBulanan ?? 0}
                    onChange={(e) => setEditFormData({ ...editFormData, pendapatanBulanan: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Skala Tempat Kerja</label>
                  <select
                    value={editFormData.ruangLingkup || 'nasional'}
                    onChange={(e) => setEditFormData({ ...editFormData, ruangLingkup: e.target.value as RuangLingkup })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="lokal">Lokal</option>
                    <option value="nasional">Nasional</option>
                    <option value="multinasional">Multinasional</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 text-xs font-semibold shadow-xs"
                >
                  Perbarui Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT EXCEL MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-bold text-slate-900">Impor Data Alumni dari Excel / CSV</h3>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Unggah file Excel (<strong>.xlsx</strong>) atau <strong>.csv</strong> yang berisi daftar alumni. Kolom yang didukung: <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-700">NIM, Nama_Lengkap, Program_Studi, Tahun_Lulus, Status_Aktivitas, Instansi_Perusahaan, Jabatan_Posisi, Waktu_Tunggu_Bulan, Kesesuaian_Bidang, Pendapatan_Bulanan_Rp</code>.
              </p>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-bold hover:bg-blue-100 transition-colors"
                >
                  Pilih File Excel / CSV
                </button>
                {importFileName && (
                  <p className="mt-2 text-xs font-semibold text-slate-700">
                    File terpilih: <span className="text-blue-600">{importFileName}</span>
                  </p>
                )}
              </div>

              {importStatus && (
                <div className="p-3 rounded-xl bg-blue-50 text-blue-800 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>{importStatus}</span>
                </div>
              )}

              {importedRows.length > 0 && (
                <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="p-1.5">NIM</th>
                        <th className="p-1.5">Nama</th>
                        <th className="p-1.5">Prodi</th>
                        <th className="p-1.5">Tahun</th>
                        <th className="p-1.5">Instansi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {importedRows.slice(0, 5).map((row, i) => (
                        <tr key={i}>
                          <td className="p-1.5 font-mono">{row.nim}</td>
                          <td className="p-1.5 font-semibold">{row.nama}</td>
                          <td className="p-1.5">{row.prodiId}</td>
                          <td className="p-1.5">{row.tahunLulus}</td>
                          <td className="p-1.5">{row.namaInstansi || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {importedRows.length > 5 && (
                    <div className="p-1.5 text-center text-slate-400 bg-slate-50">
                      ...dan {importedRows.length - 5} data lainnya.
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={importedRows.length === 0}
                  onClick={handleConfirmImport}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50 text-xs font-semibold shadow-xs"
                >
                  Simpan {importedRows.length} Data ke Database
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
