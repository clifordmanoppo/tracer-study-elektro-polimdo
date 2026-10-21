'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, Mail, Phone, MapPin, ShieldCheck, Award } from 'lucide-react';
import { PROGRAM_STUDI_LIST } from '@/lib/data/initialData';

export default function Footer() {
  return (
    <footer className="bg-[#0a1c30] text-slate-300 border-t border-slate-800 mt-16 print-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Identity */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src="/logo-polimdo.png"
                  alt="Logo Politeknik Negeri Manado"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-bold text-base leading-tight">TRACER STUDY</h3>
                <p className="text-xs text-amber-400 font-semibold tracking-wider">JURUSAN TEKNIK ELEKTRO</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sistem Penelusuran Lulusan & Survei Kepuasan Pengguna Alumni resmi Politeknik Negeri Manado. Dirancang untuk evaluasi kurikulum berbasis OBE dan akreditasi LAM Teknik & BAN-PT.
            </p>
            <div className="pt-1 flex items-center space-x-3 text-xs">
              <a
                href="https://www.instagram.com/ts_polimdo/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1.5 text-pink-400 hover:text-pink-300 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <span>@ts_polimdo</span>
              </a>
            </div>
          </div>

          {/* Column 2: Program Studi */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wide border-b border-slate-800 pb-2">
              Program Studi
            </h4>
            <ul className="space-y-2 text-xs">
              {PROGRAM_STUDI_LIST.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/alumni?prodi=${p.id}`}
                    className="hover:text-amber-400 transition-colors flex items-center justify-between group"
                  >
                    <span>{p.nama}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 group-hover:bg-amber-500/20 group-hover:text-amber-300">
                      {p.jenjang}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Menu Cepat & Akreditasi */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wide border-b border-slate-800 pb-2">
              Pelaporan & Akreditasi
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/laporan-akreditasi" className="hover:text-amber-400 transition-colors flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tabel LKPS Kriteria 8 & 9 (LAM Teknik)</span>
                </Link>
              </li>
              <li>
                <Link href="/analisis-komparasi" className="hover:text-amber-400 transition-colors flex items-center space-x-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-400" />
                  <span>Analisis Tren IKU 1 (2023–2026)</span>
                </Link>
              </li>
              <li>
                <Link href="/kepuasan-pengguna" className="hover:text-amber-400 transition-colors flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Survei Kepuasan 17 Mitra Industri</span>
                </Link>
              </li>
              <li>
                <Link href="/kuesioner" className="hover:text-amber-400 transition-colors flex items-center space-x-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Kuesioner Instrumen Tracer 2026</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Kontak Kampus */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wide border-b border-slate-800 pb-2">
              Kampus POLIMDO
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>Jl. Raya Politeknik, Kelurahan Buha, Kec. Mapanget, Kota Manado, Sulawesi Utara 95252 (PO BOX 1256)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Telp: (0431) 811568</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>informasi@polimdo.ac.id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 space-y-3 sm:space-y-0">
          <div>
            &copy; 2026 Jurusan Teknik Elektro Politeknik Negeri Manado. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Database: Supabase PostgreSQL (RLS Secured)</span>
            <span>•</span>
            <span className="text-slate-400">Deployment: Vercel Free Tier</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
