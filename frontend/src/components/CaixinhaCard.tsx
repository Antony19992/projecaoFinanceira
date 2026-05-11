'use client';

import { Caixinha } from '@/types';
import { formatCurrency } from '@/lib/financeRadar';
import { toggleCheckIn } from '@/services/caixinhaService';
import { useState } from 'react';

interface Props {
  caixinha: Caixinha;
  currentMonth: number;
  currentYear: number;
  onUpdate: (updated: Caixinha) => void;
}

function getElapsedMonths(createdAt: string, currentMonth: number, currentYear: number): number {
  const start = new Date(createdAt);
  const startMonth = start.getMonth() + 1;
  const startYear = start.getFullYear();
  return Math.max(1, (currentYear - startYear) * 12 + (currentMonth - startMonth) + 1);
}

export default function CaixinhaCard({ caixinha, currentMonth, currentYear, onUpdate }: Props) {
  const [toggling, setToggling] = useState(false);

  const elapsedMonths = getElapsedMonths(caixinha.createdAt, currentMonth, currentYear);
  const missedMonths = caixinha.checkIns.length;
  const savedMonths = Math.max(0, elapsedMonths - missedMonths);
  const totalSaved = savedMonths * caixinha.monthlyContribution;
  const remaining = Math.max(0, caixinha.targetValue - totalSaved);
  const progress = Math.min(100, (totalSaved / caixinha.targetValue) * 100);
  const monthsLeft = remaining > 0 ? Math.ceil(remaining / caixinha.monthlyContribution) : 0;
  const isComplete = totalSaved >= caixinha.targetValue;

  const isMissedThisMonth = caixinha.checkIns.some(
    (c) => c.month === currentMonth && c.year === currentYear,
  );

  async function handleToggle() {
    setToggling(true);
    try {
      const result = await toggleCheckIn(caixinha.id, currentMonth, currentYear);
      const updatedCheckIns = result.checked
        ? [
            ...caixinha.checkIns,
            {
              id: 'temp',
              caixinhaId: caixinha.id,
              month: currentMonth,
              year: currentYear,
              createdAt: new Date().toISOString(),
            },
          ]
        : caixinha.checkIns.filter(
            (c) => !(c.month === currentMonth && c.year === currentYear),
          );
      onUpdate({ ...caixinha, checkIns: updatedCheckIns });
    } finally {
      setToggling(false);
    }
  }

  return (
    <div className="bg-slate-800 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{caixinha.name}</p>
          <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{caixinha.description}</p>
        </div>
        {isComplete ? (
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full whitespace-nowrap">
            Concluída
          </span>
        ) : isMissedThisMonth ? (
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full whitespace-nowrap">
            Não guardou
          </span>
        ) : (
          <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full whitespace-nowrap">
            Em dia
          </span>
        )}
      </div>

      {/* Barra de progresso */}
      <div>
        <div className="flex justify-between text-xs text-slate-400 mb-1.5">
          <span>{formatCurrency(totalSaved)}</span>
          <span>{formatCurrency(caixinha.targetValue)}</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-1.5">
          <span className="text-slate-500">{progress.toFixed(0)}% alcançado</span>
          {!isComplete && (
            <span className="text-slate-500">
              {monthsLeft} {monthsLeft === 1 ? 'mês' : 'meses'} restantes
            </span>
          )}
        </div>
      </div>

      {/* Informações */}
      <div className="flex justify-between text-xs text-slate-400 border-t border-slate-700 pt-2">
        <span>Mensal: {formatCurrency(caixinha.monthlyContribution)}</span>
        {missedMonths > 0 && (
          <span className="text-red-400">{missedMonths} {missedMonths === 1 ? 'mês perdido' : 'meses perdidos'}</span>
        )}
      </div>

      {/* Botão para marcar mês perdido */}
      {!isComplete && (
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`w-full py-2 rounded-lg text-xs font-medium transition-colors ${
            isMissedThisMonth
              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
              : 'bg-slate-700 text-red-400 hover:bg-red-500/10'
          }`}
        >
          {toggling
            ? 'Salvando...'
            : isMissedThisMonth
            ? 'Guardei afinal este mês'
            : 'Não guardei este mês'}
        </button>
      )}
    </div>
  );
}
