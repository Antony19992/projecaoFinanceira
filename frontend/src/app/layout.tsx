import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import LogoutButton from '@/components/LogoutButton';

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
        <AuthProvider>
          <AuthGuard>
            <Navbar />
            {/* Cabeçalho mobile */}
            <header className="px-4 pt-6 pb-2 flex items-center justify-between md:hidden">
              <h1 className="text-lg font-bold text-white tracking-tight">📡 Radar</h1>
              <LogoutButton />
            </header>
            {/* Conteúdo: margem esquerda para a sidebar no desktop */}
            <div className="md:ml-56">
              <main className="px-4 pt-2 pb-20 md:pb-10 md:px-10 md:pt-8 max-w-5xl">
                {children}
              </main>
            </div>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
