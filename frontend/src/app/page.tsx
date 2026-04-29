'use client';

import { useEffect, useState } from 'react';
import { DashboardData } from '@/types';
import { getDashboard } from '@/services/dashboardService';
import { formatCurrency } from '@/lib/financeRadar';
import RadarCard from '@/components/RadarCard';
import SummaryCard from '@/components/SummaryCard';
import TransactionList from '@/components/TransactionList';

const MONTHS = [
  '', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

export default function Dashboard() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getDashboard(month, year)
      .then(setData)
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

          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
              Últimas transações
            </h3>
            <TransactionList transactions={data.recentTransactions} />
          </div>
        </>
      )}

      {!loading && !data && (
        <p className="text-center text-slate-500 text-sm py-16">
          Sem dados para este período.
        </p>
      )}
    </div>
  );
}
