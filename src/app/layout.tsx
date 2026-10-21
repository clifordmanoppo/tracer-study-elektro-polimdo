import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/authContext';
import { TracerProvider } from '@/lib/store/tracerStore';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Tracer Study Jurusan Elektro • Politeknik Negeri Manado (2023–2026)',
  description: 'Portal Resmi Sistem Tracer Study dan Survei Kepuasan Pengguna Lulusan Jurusan Teknik Elektro Politeknik Negeri Manado (D4 Teknik Informatika, D3 Teknik Listrik, D4 Teknik Listrik, D3 Teknik Informatika). Kebutuhan IKU, LKPS, dan Akreditasi LAM Teknik/BAN-PT.',
  keywords: [
    'Tracer Study',
    'Politeknik Negeri Manado',
    'POLIMDO',
    'Teknik Elektro',
    'Teknik Listrik',
    'Teknik Informatika',
    'Akreditasi LAM Teknik',
    'IKU Perguruan Tinggi'
  ],
  authors: [{ name: 'Jurusan Teknik Elektro Politeknik Negeri Manado' }],
  icons: {
    icon: '/logo-polimdo.png',
    apple: '/logo-polimdo.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">
        <AuthProvider>
          <TracerProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </TracerProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
