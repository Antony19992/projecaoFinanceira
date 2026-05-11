'use client';

import { useEffect, useState } from 'react';
import { Caixinha, DashboardData } from '@/types';
import { getDashboard } from '@/services/dashboardService';
import { getCaixinhas } from '@/services/caixinhaService';
import { formatCurrency } from '@/lib/financeRadar';
import { apiService } from '@/lib/apiService';
import RadarCard from '@/components/RadarCard';
import SummaryCard from '@/components/SummaryCard';
import CaixinhaCard from '@/components/CaixinhaCard';
import Link from 'next/link';

const MONTHS = [
  '', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

export default function Dashboard() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState<DashboardData | null>(null);
  const [caixinhas, setCaixinhas] = useState<Caixinha[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiService.getCached(
        `dashboard:${month}:${year}`,
        () => getDashboard(month, year),
        (fresh) => setData(fresh),
      ),
      getCaixinhas(),
    ])
      .then(([dashData, caixinhasData]) => {
        setData(dashData);
        setCaixinhas(caixinhasData);
      })
      .finally(() => setLoading(false));
  }, [month, year]);

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  function handleCaixinhaUpdate(updated: Caixinha) {
    setCaixinhas((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Month selector */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="text-slate-400 hover:text-white px-2 py-1">‹</button>
        <span className="text-white font-semibold">
          {MONTHS[month]} {year}
        </span>
        <button onClick={nextMonth} className="text-slate-400 hover:text-white px-2 py-1">›</button>
      </div>

      {loading && (
        <div className="text-center py-16 text-slate-500">Carregando...</div>
      )}

      {!loading && data && (
        <>
          <RadarCard radar={data.radar} />

          <div className="grid grid-cols-2 gap-3">
            <SummaryCard
              label="Receitas"
              value={formatCurrency(data.radar.totalIncome)}
              highlight
            />
            <SummaryCard
              label="Despesas"
              value={formatCurrency(data.radar.totalExpenses)}
              highlight
            />
          </div>
        </>
      )}

      {!loading && !data && (
        <p className="text-center text-slate-500 text-sm py-16">
          Sem dados para este período.
        </p>
      )}

      {!loading && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Caixinhas
            </h3>
            <Link
              href="/caixinhas"
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Gerenciar
            </Link>
          </div>

          {caixinhas.length === 0 ? (
            <Link
              href="/caixinhas"
              className="block text-center text-slate-500 text-sm py-8 border border-dashed border-slate-700 rounded-xl hover:border-slate-500 transition-colors"
            >
              + Criar primeira caixinha
            </Link>
          ) : (
            <div className="flex flex-col gap-3">
              {caixinhas.map((c) => (
                <CaixinhaCard
                  key={c.id}
                  caixinha={c}
                  currentMonth={month}
                  currentYear={year}
                  onUpdate={handleCaixinhaUpdate}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
