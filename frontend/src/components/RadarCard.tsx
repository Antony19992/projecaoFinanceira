'use client';

import { RadarResult } from '@/types';
import { statusColor, statusLabel, formatCurrency } from '@/lib/financeRadar';
import StatusBadge from './StatusBadge';

interface Props {
  radar: RadarResult;
}

export default function RadarCard({ radar }: Props) {
  const color = statusColor(radar.status);
  const pct = Math.min(Math.round(radar.percentageUsed), 100);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Radar do Mês</h2>
        <StatusBadge status={radar.status} size="sm" />
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Gasto proporcional ao dia</span>
          <span>{radar.percentageUsed.toFixed(0)}%</span>
        </div>
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>Esperado: {formatCurrency(radar.expectedByToday)}</span>
          <span>Gasto: {formatCurrency(radar.totalExpenses)}</span>
        </div>
      </div>

      {/* Message */}
      <div
        className="rounded-xl p-4 text-sm font-medium border"
        style={{
          borderColor: `${color}44`,
          backgroundColor: `${color}11`,
          color,
        }}
      >
        {radar.message}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-xs text-slate-500">Projeção</p>
          <p className="text-sm font-bold text-white">{formatCurrency(radar.projection)}</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Limite</p>
          <p className="text-sm font-bold text-white">
            {radar.totalLimit > 0 ? formatCurrency(radar.totalLimit) : '—'}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Saldo</p>
          <p className={`text-sm font-bold ${radar.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(radar.balance)}
          </p>
        </div>
      </div>
    </div>
  );
}
