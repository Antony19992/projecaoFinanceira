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

export default function CaixinhaCard({ caixinha, currentMonth, currentYear, onUpdate }: Props) {
  const [toggling, setToggling] = useState(false);

  const totalSaved = caixinha.checkIns.length * caixinha.monthlyContribution;
  const remaining = Math.max(0, caixinha.targetValue - totalSaved);
  const progress = Math.min(100, (totalSaved / caixinha.targetValue) * 100);
  const monthsLeft = remaining > 0 ? Math.ceil(remaining / caixinha.monthlyContribution) : 0;
  const isCheckedThisMonth = caixinha.checkIns.some(
    (c) => c.month === currentMonth && c.year === currentYear,
  );
  const isComplete = totalSaved >= caixinha.targetValue;

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
        {isComplete && (
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full whitespace-nowrap">
            Concluída
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
        <span>{caixinha.checkIns.length} contribuições</span>
      </div>

      {/* Botão check-in do mês */}
      {!isComplete && (
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`w-full py-2 rounded-lg text-xs font-medium transition-colors ${
            isCheckedThisMonth
              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
          }`}
        >
          {toggling
            ? 'Salvando...'
            : isCheckedThisMonth
            ? 'Guardei este mês'
            : 'Marcar como guardado este mês'}
        </button>
      )}
    </div>
  );
}
