import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Radar de Gastos',
  description: 'Radar comportamental de gastos mensais',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Radar' },
  icons: {
    apple: '/icons/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#0f172a]">
        <div className="max-w-2xl mx-auto pb-20 md:pb-0">
          <header className="px-4 pt-6 pb-2 flex items-center justify-between md:hidden">
            <h1 className="text-lg font-bold text-white tracking-tight">📡 Radar</h1>
          </header>
          <main className="px-4 pt-2">{children}</main>
        </div>
        <Navbar />
      </body>
    </html>
  );
}
