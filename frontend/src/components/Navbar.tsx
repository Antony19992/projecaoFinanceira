'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './LogoutButton';

const links = [
  { href: '/', label: 'Radar' },
  { href: '/transacoes', label: 'Nova transação' },
  { href: '/recorrentes', label: 'Fixas' },
  { href: '/limites', label: 'Limites' },
  { href: '/caixinhas', label: 'Caixinhas' },
  { href: '/historico', label: 'Histórico' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile: barra inferior */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 md:hidden">
        <div className="flex justify-around">
          {links.map((link) => {
            const active = pathname === link.href;
            const shortLabel = link.label === 'Nova transação' ? 'Nova' : link.label;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center py-3 px-4 text-xs font-medium transition-colors ${
                  active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {shortLabel}
                {active && <span className="mt-1 w-1 h-1 rounded-full bg-white" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop: sidebar esquerda */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-56 flex-col bg-slate-900 border-r border-slate-800 z-50">
        <div className="px-6 py-6 border-b border-slate-800">
          <h1 className="text-lg font-bold text-white tracking-tight">📡 Radar</h1>
          <p className="text-xs text-slate-500 mt-0.5">Gastos mensais</p>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-6 py-4 border-t border-slate-800">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
