'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/authContext';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Building2, 
  LineChart, 
  Award, 
  Menu, 
  X, 
  ShieldCheck, 
  Database,
  ChevronDown,
  UserCheck
} from 'lucide-react';
import { PROGRAM_STUDI_LIST } from '@/lib/data/initialData';
import { RoleType, ProdiId } from '@/types/tracer';

export default function Navbar() {
  const pathname = usePathname();
  const { user, loginAs, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/', icon: BarChart3 },
    { label: 'Data Alumni', href: '/alumni', icon: Users },
    { label: 'Kuesioner Alumni', href: '/kuesioner', icon: FileText },
    { label: 'Survei Pengguna', href: '/kepuasan-pengguna', icon: Building2 },
    { label: 'Analisis & Tren', href: '/analisis-komparasi', icon: LineChart },
    { label: 'Laporan Akreditasi', href: '/laporan-akreditasi', icon: Award },
  ];

  const getRoleBadge = (role: RoleType) => {
    switch (role) {
      case 'admin_jurusan':
        return { text: 'Admin Jurusan', color: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'admin_prodi':
        return { text: `Admin ${user.prodiId || 'Prodi'}`, color: 'bg-blue-100 text-blue-800 border-blue-300' };
      default:
        return { text: 'Alumni / Publik', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    }
  };

  const badge = getRoleBadge(user.role);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        {/* Top Info Bar */}
        <div className="bg-[#0f2b48] text-white text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="font-semibold tracking-wide text-amber-300">TRACER STUDY POLIMDO</span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <span className="hidden sm:inline text-slate-200">Jurusan Teknik Elektro • Politeknik Negeri Manado</span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Database indicator */}
            <div className="flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden md:inline text-slate-300">Database:</span>
              <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium ${
                isSupabaseConfigured 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {isSupabaseConfigured ? 'Supabase Live' : 'Demo State (Ready)'}
              </span>
            </div>

            {/* Role switch button */}
            <button
              onClick={() => setRoleModalOpen(true)}
              className="flex items-center space-x-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors text-[11px] text-amber-200 hover:text-white"
              title="Ganti Hak Akses / Role Demo"
            >
              <UserCheck className="w-3 h-3 text-amber-300" />
              <span>{badge.text}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
            </button>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-18">
            {/* Logo & Identity */}
            <Link href="/" className="flex items-center space-x-3.5 group">
              <div className="relative w-12 h-12 flex-shrink-0 transition-transform group-hover:scale-105">
                <Image
                  src="/logo-polimdo.png"
                  alt="Logo Politeknik Negeri Manado"
                  width={48}
                  height={48}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-slate-900 text-lg tracking-tight leading-tight group-hover:text-blue-700 transition-colors">
                    TRACER STUDY
                  </span>
                  <span className="text-[11px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
                    ELEKTRO
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Politeknik Negeri Manado (2023–2026)
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Role Selection Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Hak Akses & Pengguna</h3>
              </div>
              <button
                onClick={() => setRoleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Pilih mode autentikasi untuk menguji hak akses berjenjang (Row Level Security):
            </p>

            <div className="space-y-2.5 mb-6">
              {/* Admin Jurusan */}
              <button
                onClick={() => {
                  loginAs('admin_jurusan');
                  setRoleModalOpen(false);
                }}
                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start space-x-3 ${
                  user.role === 'admin_jurusan'
                    ? 'border-amber-500 bg-amber-50/50 ring-2 ring-amber-200'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm flex items-center space-x-2">
                    <span>Admin Jurusan Elektro</span>
                    {user.role === 'admin_jurusan' && (
                      <span className="text-[10px] font-bold bg-amber-600 text-white px-1.5 py-0.2 rounded">Aktif</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Akses penuh ke seluruh 4 Program Studi, komparasi antar-prodi, dan laporan jurusan akreditasi.
                  </p>
                </div>
              </button>

              {/* Admin Prodi Options */}
              <div className="border-t border-slate-100 pt-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Admin Program Studi
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {PROGRAM_STUDI_LIST.map((prodi) => (
                    <button
                      key={prodi.id}
                      onClick={() => {
                        loginAs('admin_prodi', prodi.id);
                        setRoleModalOpen(false);
                      }}
                      className={`text-left p-2.5 rounded-lg border text-xs font-medium transition-all ${
                        user.role === 'admin_prodi' && user.prodiId === prodi.id
                          ? 'border-blue-500 bg-blue-50/70 text-blue-900 ring-2 ring-blue-200'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="font-bold">{prodi.id}</div>
                      <div className="text-[11px] text-slate-500 truncate">{prodi.nama}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Alumni Mode */}
              <button
                onClick={() => {
                  logout();
                  setRoleModalOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start space-x-3 ${
                  user.role === 'alumni'
                    ? 'border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 mt-0.5">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm flex items-center space-x-2">
                    <span>Alumni / Tamu Umum</span>
                    {user.role === 'alumni' && (
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded">Aktif</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mengisi Kuesioner Tracer Study Alumni dan melihat ringkasan statistik publik.
                  </p>
                </div>
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setRoleModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
