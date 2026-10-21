'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RoleType, ProdiId, UserSession } from '@/types/tracer';
import { PROGRAM_STUDI_LIST } from '@/lib/data/initialData';

interface AuthContextType {
  user: UserSession;
  loginAs: (role: RoleType, prodiId?: ProdiId, nama?: string) => void;
  logout: () => void;
  canManageAllProdi: boolean;
  activeProdiId?: ProdiId;
}

const DEFAULT_USER: UserSession = {
  role: 'admin_jurusan',
  nama: 'Marson J. Budiman, ST., MT',
  email: 'marson.budiman@polimdo.ac.id'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession>(DEFAULT_USER);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('polimdo_tracer_user');
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          // fallback
        }
      }
    }
  }, []);

  const loginAs = (role: RoleType, prodiId?: ProdiId, nama?: string) => {
    let prodiNama: string | undefined;
    if (prodiId) {
      const p = PROGRAM_STUDI_LIST.find(item => item.id === prodiId);
      prodiNama = p?.nama;
    }

    let defaultName = nama;
    if (!defaultName) {
      if (role === 'admin_jurusan') defaultName = 'Dr. Marson J. Budiman, ST., MT (Kajur)';
      else if (role === 'admin_prodi') {
        const p = PROGRAM_STUDI_LIST.find(item => item.id === prodiId);
        defaultName = p?.kaprodi || 'Admin Program Studi';
      } else {
        defaultName = 'Alumni Polimdo';
      }
    }

    const newUser: UserSession = {
      role,
      nama: defaultName,
      prodiId: role === 'admin_prodi' ? (prodiId || 'D3-TL') : prodiId,
      prodiNama,
      email: role === 'admin_jurusan' ? 'jurusan.elektro@polimdo.ac.id' : 'tracer.study@polimdo.ac.id'
    };

    setUser(newUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem('polimdo_tracer_user', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    loginAs('alumni', undefined, 'Tamu / Alumni');
  };

  const canManageAllProdi = user.role === 'admin_jurusan';

  return (
    <AuthContext.Provider value={{ user, loginAs, logout, canManageAllProdi, activeProdiId: user.prodiId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
