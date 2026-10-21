'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AlumniRecord, EmployerFeedback, YearReportSummary, ProdiId } from '@/types/tracer';
import { INITIAL_ALUMNI_DATA, OFFICIAL_SUMMARIES, INITIAL_EMPLOYER_FEEDBACK } from '@/lib/data/initialData';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

interface TracerContextType {
  alumniList: AlumniRecord[];
  summaries: YearReportSummary[];
  employerFeedbacks: EmployerFeedback[];
  loading: boolean;
  addAlumni: (record: Omit<AlumniRecord, 'id' | 'createdAt'>) => Promise<AlumniRecord>;
  updateAlumni: (id: string, updates: Partial<AlumniRecord>) => Promise<void>;
  deleteAlumni: (id: string) => Promise<void>;
  importAlumni: (records: Omit<AlumniRecord, 'id' | 'createdAt'>[]) => Promise<number>;
  addEmployerFeedback: (feedback: Omit<EmployerFeedback, 'id' | 'createdAt'>) => Promise<EmployerFeedback>;
  resetToDefault: () => void;
  getFilteredStats: (selectedYear: string, selectedProdi: string) => {
    totalLulusan: number;
    lulusanTerlacak: number;
    lulusanBelumTerlacak: number;
    tingkatKeterlacakan: number;
    kesesuaianTinggi: number;
    kesesuaianSedang: number;
    kesesuaianRendah: number;
    persenKesesuaianTinggi: number;
    persenKesesuaianSedangTinggi: number;
    waktuTungguKurang3: number;
    waktuTunggu3sd6: number;
    waktuTungguLebih6: number;
    persenWaktuTungguKurang6: number;
    dipesanSebelumLulus: number;
    persenDipesanSebelumLulus: number;
    tempatKerjaLokal: number;
    tempatKerjaNasional: number;
    tempatKerjaMultinasional: number;
    totalTempatKerja: number;
    catatanValidasi?: string;
  };
}

const TracerContext = createContext<TracerContextType | undefined>(undefined);

export function TracerProvider({ children }: { children: React.ReactNode }) {
  const [alumniList, setAlumniList] = useState<AlumniRecord[]>(INITIAL_ALUMNI_DATA);
  const [summaries] = useState<YearReportSummary[]>(OFFICIAL_SUMMARIES);
  const [employerFeedbacks, setEmployerFeedbacks] = useState<EmployerFeedback[]>(INITIAL_EMPLOYER_FEEDBACK);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize data from Supabase or localStorage
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        if (isSupabaseConfigured && supabase) {
          const { data, error } = await supabase.from('alumni').select('*');
          if (!error && data && data.length > 0) {
            setAlumniList(data as unknown as AlumniRecord[]);
          } else {
            // fallback to local storage
            loadFromLocalStorage();
          }
        } else {
          loadFromLocalStorage();
        }
      } catch (e) {
        console.warn('Using local tracer store:', e);
        loadFromLocalStorage();
      } finally {
        setLoading(false);
      }
    }

    function loadFromLocalStorage() {
      if (typeof window !== 'undefined') {
        const savedAlumni = localStorage.getItem('polimdo_tracer_alumni');
        if (savedAlumni) {
          try {
            setAlumniList(JSON.parse(savedAlumni));
          } catch {
            setAlumniList(INITIAL_ALUMNI_DATA);
          }
        } else {
          setAlumniList(INITIAL_ALUMNI_DATA);
        }

        const savedFeedback = localStorage.getItem('polimdo_employer_feedback');
        if (savedFeedback) {
          try {
            setEmployerFeedbacks(JSON.parse(savedFeedback));
          } catch {
            setEmployerFeedbacks(INITIAL_EMPLOYER_FEEDBACK);
          }
        }
      }
    }

    loadData();
  }, []);

  // Save to localStorage whenever data changes
  const persistAlumniLocally = (data: AlumniRecord[]) => {
    setAlumniList(data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('polimdo_tracer_alumni', JSON.stringify(data));
    }
  };

  const persistFeedbackLocally = (data: EmployerFeedback[]) => {
    setEmployerFeedbacks(data);
    if (typeof window !== 'undefined') {
      localStorage.setItem('polimdo_employer_feedback', JSON.stringify(data));
    }
  };

  const addAlumni = async (record: Omit<AlumniRecord, 'id' | 'createdAt'>): Promise<AlumniRecord> => {
    const newRecord: AlumniRecord = {
      ...record,
      id: `alm-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('alumni').insert([newRecord]);
      } catch (err) {
        console.error('Supabase insert failed, saving locally:', err);
      }
    }

    const updated = [newRecord, ...alumniList];
    persistAlumniLocally(updated);
    return newRecord;
  };

  const updateAlumni = async (id: string, updates: Partial<AlumniRecord>) => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('alumni').update(updates).eq('id', id);
      } catch (err) {
        console.error('Supabase update error:', err);
      }
    }

    const updated = alumniList.map(item => item.id === id ? { ...item, ...updates } : item);
    persistAlumniLocally(updated);
  };

  const deleteAlumni = async (id: string) => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('alumni').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase delete error:', err);
      }
    }

    const updated = alumniList.filter(item => item.id !== id);
    persistAlumniLocally(updated);
  };

  const importAlumni = async (records: Omit<AlumniRecord, 'id' | 'createdAt'>[]): Promise<number> => {
    const timestamp = Date.now();
    const formattedRecords: AlumniRecord[] = records.map((rec, idx) => ({
      ...rec,
      id: `alm-imp-${timestamp}-${idx}`,
      createdAt: new Date().toISOString(),
      sumberData: 'impor_excel'
    }));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('alumni').insert(formattedRecords);
      } catch (err) {
        console.error('Supabase bulk insert error:', err);
      }
    }

    const updated = [...formattedRecords, ...alumniList];
    persistAlumniLocally(updated);
    return formattedRecords.length;
  };

  const addEmployerFeedback = async (feedback: Omit<EmployerFeedback, 'id' | 'createdAt'>): Promise<EmployerFeedback> => {
    const newFeedback: EmployerFeedback = {
      ...feedback,
      id: `emp-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('employer_feedback').insert([newFeedback]);
      } catch (err) {
        console.error('Supabase employer feedback insert error:', err);
      }
    }

    const updated = [newFeedback, ...employerFeedbacks];
    persistFeedbackLocally(updated);
    return newFeedback;
  };

  const resetToDefault = () => {
    persistAlumniLocally(INITIAL_ALUMNI_DATA);
    persistFeedbackLocally(INITIAL_EMPLOYER_FEEDBACK);
  };

  /**
   * Helper to compute filtered statistics.
   * If filtering matches specific official cohorts (e.g. 2024 D3-TL, or 2025 D3-TL),
   * returns the EXACT official report figures so report audit fidelity is 100% maintained!
   */
  const getFilteredStats = (selectedYear: string, selectedProdi: string) => {
    // Check if matches Official 2024 Report (Lulusan 2023 D3-TL)
    if ((selectedYear === '2024' || selectedYear === '2023') && (selectedProdi === 'D3-TL' || selectedProdi === 'all')) {
      const summary2024 = OFFICIAL_SUMMARIES.find(s => s.tahunLaporan === 2024);
      if (summary2024 && selectedProdi === 'D3-TL') {
        return {
          totalLulusan: summary2024.totalLulusan,
          lulusanTerlacak: summary2024.lulusanTerlacak,
          lulusanBelumTerlacak: summary2024.lulusanBelumTerlacak,
          tingkatKeterlacakan: summary2024.tingkatKeterlacakan,
          kesesuaianTinggi: summary2024.kesesuaianBidang.tinggi,
          kesesuaianSedang: summary2024.kesesuaianBidang.sedang,
          kesesuaianRendah: summary2024.kesesuaianBidang.rendah,
          persenKesesuaianTinggi: summary2024.kesesuaianBidang.persenTinggi,
          persenKesesuaianSedangTinggi: summary2024.kesesuaianBidang.persenSedangTinggi,
          waktuTungguKurang3: summary2024.waktuTunggu.kurang3Bulan,
          waktuTunggu3sd6: summary2024.waktuTunggu.antara3Sd6Bulan,
          waktuTungguLebih6: summary2024.waktuTunggu.lebih6Bulan,
          persenWaktuTungguKurang6: 84.62,
          dipesanSebelumLulus: summary2024.waktuTunggu.dipesanSebelumLulus,
          persenDipesanSebelumLulus: 10.53,
          tempatKerjaLokal: summary2024.tempatKerja.lokal,
          tempatKerjaNasional: summary2024.tempatKerja.nasional,
          tempatKerjaMultinasional: summary2024.tempatKerja.multinasional,
          totalTempatKerja: summary2024.tempatKerja.totalTercatat,
          catatanValidasi: summary2024.tempatKerja.catatanValidasi
        };
      }
    }

    // Check if matches Official 2025 Report (Kohort 2024 D3-TL)
    if (selectedYear === '2025' && (selectedProdi === 'D3-TL' || selectedProdi === 'all')) {
      const summary2025 = OFFICIAL_SUMMARIES.find(s => s.tahunLaporan === 2025);
      if (summary2025 && selectedProdi === 'D3-TL') {
        return {
          totalLulusan: summary2025.totalLulusan,
          lulusanTerlacak: summary2025.lulusanTerlacak,
          lulusanBelumTerlacak: summary2025.lulusanBelumTerlacak,
          tingkatKeterlacakan: summary2025.tingkatKeterlacakan,
          kesesuaianTinggi: summary2025.kesesuaianBidang.tinggi,
          kesesuaianSedang: summary2025.kesesuaianBidang.sedang,
          kesesuaianRendah: summary2025.kesesuaianBidang.rendah,
          persenKesesuaianTinggi: summary2025.kesesuaianBidang.persenTinggi,
          persenKesesuaianSedangTinggi: summary2025.kesesuaianBidang.persenSedangTinggi,
          waktuTungguKurang3: summary2025.waktuTunggu.kurang3Bulan,
          waktuTunggu3sd6: summary2025.waktuTunggu.antara3Sd6Bulan,
          waktuTungguLebih6: summary2025.waktuTunggu.lebih6Bulan,
          persenWaktuTungguKurang6: 94.74,
          dipesanSebelumLulus: summary2025.waktuTunggu.dipesanSebelumLulus,
          persenDipesanSebelumLulus: 15.38,
          tempatKerjaLokal: summary2025.tempatKerja.lokal,
          tempatKerjaNasional: summary2025.tempatKerja.nasional,
          tempatKerjaMultinasional: summary2025.tempatKerja.multinasional,
          totalTempatKerja: summary2025.tempatKerja.totalTercatat,
          catatanValidasi: summary2025.waktuTunggu.catatanAudit
        };
      }
    }

    // Otherwise calculate dynamically from the actual alumni list
    let filtered = alumniList;
    if (selectedYear !== 'all') {
      const yr = parseInt(selectedYear, 10);
      filtered = filtered.filter(item => item.tahunLulus === yr);
    }
    if (selectedProdi !== 'all') {
      filtered = filtered.filter(item => item.prodiId === selectedProdi);
    }

    const totalLulusan = filtered.length;
    const terlacakItems = filtered.filter(item => item.terlacak);
    const lulusanTerlacak = terlacakItems.length;
    const lulusanBelumTerlacak = totalLulusan - lulusanTerlacak;
    const tingkatKeterlacakan = totalLulusan > 0 ? Number(((lulusanTerlacak / totalLulusan) * 100).toFixed(2)) : 0;

    const kesesuaianTinggi = terlacakItems.filter(item => item.keselarasanKategori === 'tinggi').length;
    const kesesuaianSedang = terlacakItems.filter(item => item.keselarasanKategori === 'sedang').length;
    const kesesuaianRendah = terlacakItems.filter(item => item.keselarasanKategori === 'rendah').length;
    const persenKesesuaianTinggi = lulusanTerlacak > 0 ? Number(((kesesuaianTinggi / lulusanTerlacak) * 100).toFixed(2)) : 0;
    const persenKesesuaianSedangTinggi = lulusanTerlacak > 0 ? Number((((kesesuaianTinggi + kesesuaianSedang) / lulusanTerlacak) * 100).toFixed(2)) : 0;

    const waktuTungguKurang3 = terlacakItems.filter(item => (item.waktuTungguBulan ?? 99) < 3).length;
    const waktuTunggu3sd6 = terlacakItems.filter(item => (item.waktuTungguBulan ?? 99) >= 3 && (item.waktuTungguBulan ?? 99) <= 6).length;
    const waktuTungguLebih6 = terlacakItems.filter(item => (item.waktuTungguBulan ?? 0) > 6).length;
    const persenWaktuTungguKurang6 = lulusanTerlacak > 0 ? Number((((waktuTungguKurang3 + waktuTunggu3sd6) / lulusanTerlacak) * 100).toFixed(2)) : 0;

    const dipesanSebelumLulus = filtered.filter(item => item.dipesanSebelumLulus).length;
    const persenDipesanSebelumLulus = totalLulusan > 0 ? Number(((dipesanSebelumLulus / totalLulusan) * 100).toFixed(2)) : 0;

    const tempatKerjaLokal = terlacakItems.filter(item => item.ruangLingkup === 'lokal').length;
    const tempatKerjaNasional = terlacakItems.filter(item => item.ruangLingkup === 'nasional').length;
    const tempatKerjaMultinasional = terlacakItems.filter(item => item.ruangLingkup === 'multinasional').length;

    return {
      totalLulusan,
      lulusanTerlacak,
      lulusanBelumTerlacak,
      tingkatKeterlacakan,
      kesesuaianTinggi,
      kesesuaianSedang,
      kesesuaianRendah,
      persenKesesuaianTinggi,
      persenKesesuaianSedangTinggi,
      waktuTungguKurang3,
      waktuTunggu3sd6,
      waktuTungguLebih6,
      persenWaktuTungguKurang6,
      dipesanSebelumLulus,
      persenDipesanSebelumLulus,
      tempatKerjaLokal,
      tempatKerjaNasional,
      tempatKerjaMultinasional,
      totalTempatKerja: tempatKerjaLokal + tempatKerjaNasional + tempatKerjaMultinasional
    };
  };

  return (
    <TracerContext.Provider
      value={{
        alumniList,
        summaries,
        employerFeedbacks,
        loading,
        addAlumni,
        updateAlumni,
        deleteAlumni,
        importAlumni,
        addEmployerFeedback,
        resetToDefault,
        getFilteredStats
      }}
    >
      {children}
    </TracerContext.Provider>
  );
}

export function useTracer() {
  const context = useContext(TracerContext);
  if (!context) {
    throw new Error('useTracer must be used within a TracerProvider');
  }
  return context;
}
