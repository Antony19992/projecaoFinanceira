'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'next/navigation';

export default function LogoutButton() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  if (!user || pathname === '/login') return null;

  return (
    <button
      onClick={signOut}
      className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1"
    >
      Sair
    </button>
  );
}
