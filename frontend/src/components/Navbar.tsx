'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Radar' },
  { href: '/transacoes', label: 'Nova' },
  { href: '/recorrentes', label: 'Fixas' },
  { href: '/limites', label: 'Limites' },
  { href: '/historico', label: 'Histórico' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900 border-t border-slate-800 md:static md:border-t-0 md:border-b">
      <div className="max-w-2xl mx-auto flex justify-around md:justify-start md:gap-6 md:px-6 md:py-4">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center py-3 px-4 text-xs font-medium transition-colors md:text-sm md:py-0 ${
                active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {link.label}
              {active && (
                <span className="mt-1 w-1 h-1 rounded-full bg-white md:hidden" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
