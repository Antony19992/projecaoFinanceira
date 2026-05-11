'use client';

import { useState } from 'react';
import { Caixinha } from '@/types';
import { formatCurrency } from '@/lib/financeRadar';
import { toggleCheckIn, addExtra, removeExtra } from '@/services/caixinhaService';

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
  const [showExtraInput, setShowExtraInput] = useState(false);
  const [extraAmount, setExtraAmount] = useState('');
  const [savingExtra, setSavingExtra] = useState(false);

  const elapsedMonths = getElapsedMonths(caixinha.createdAt, currentMonth, currentYear);
  const missedMonths = caixinha.checkIns.length;
  const savedMonths = Math.max(0, elapsedMonths - missedMonths);
  const extrasTotal = caixinha.extras.reduce((sum, e) => sum + e.amount, 0);
  const totalSaved = savedMonths * caixinha.monthlyContribution + extrasTotal;
  const remaining = Math.max(0, caixinha.targetValue - totalSaved);
  const progress = Math.min(100, (totalSaved / caixinha.targetValue) * 100);
  const monthsLeft = remaining > 0 ? Math.ceil(remaining / caixinha.monthlyContribution) : 0;
  const isComplete = totalSaved >= caixinha.targetValue;

  const isMissedThisMonth = caixinha.checkIns.some(
    (c) => c.month === currentMonth && c.year === currentYear,
  );
  const currentMonthExtras = caixinha.extras.filter(
    (e) => e.month === currentMonth && e.year === currentYear,
  );

  const completionDate = (() => {
    if (isComplete) return null;
    const d = new Date(currentYear, currentMonth - 1 + monthsLeft, 1);
    return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  })();

  async function handleToggle() {
    setToggling(true);
    try {
      const result = await toggleCheckIn(caixinha.id, currentMonth, currentYear);
      const updatedCheckIns = result.checked
        ? [...caixinha.checkIns, { id: 'temp', caixinhaId: caixinha.id, month: currentMonth, year: currentYear, createdAt: new Date().toISOString() }]
        : caixinha.checkIns.filter((c) => !(c.month === currentMonth && c.year === currentYear));
      onUpdate({ ...caixinha, checkIns: updatedCheckIns });
    } finally {
      setToggling(false);
    }
  }

  async function handleAddExtra() {
    const amount = parseFloat(extraAmount.replace(',', '.'));
    if (!amount || amount <= 0) return;
    setSavingExtra(true);
    try {
      const extra = await addExtra(caixinha.id, currentMonth, currentYear, amount);
      onUpdate({ ...caixinha, extras: [...caixinha.extras, extra] });
      setExtraAmount('');
      setShowExtraInput(false);
    } finally {
      setSavingExtra(false);
    }
  }

  async function handleRemoveExtra(extraId: string) {
    await removeExtra(caixinha.id, extraId);
    onUpdate({ ...caixinha, extras: caixinha.extras.filter((e) => e.id !== extraId) });
  }

  return (
    <div className="bg-slate-800 rounded-xl p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{caixinha.name}</p>
          <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{caixinha.description}</p>
        </div>
        {isComplete ? (
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full whitespace-nowrap">Concluída</span>
        ) : isMissedThisMonth ? (
          <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full whitespace-nowrap">Não guardou</span>
        ) : (
          <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full whitespace-nowrap">Em dia</span>
        )}
      </div>

      {/* Progresso */}
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
            <span className="text-slate-500">{monthsLeft} {monthsLeft === 1 ? 'mês' : 'meses'} restantes</span>
          )}
        </div>
      </div>

      {/* Rodapé de info */}
      <div className="flex justify-between text-xs text-slate-400 border-t border-slate-700 pt-2">
        <span>Mensal: {formatCurrency(caixinha.monthlyContribution)}</span>
        {missedMonths > 0 && (
          <span className="text-red-400">{missedMonths} {missedMonths === 1 ? 'mês perdido' : 'meses perdidos'}</span>
        )}
      </div>

      {/* Extras do mês atual */}
      {currentMonthExtras.length > 0 && (
        <div className="flex flex-col gap-1">
          {currentMonthExtras.map((e) => (
            <div key={e.id} className="flex items-center justify-between bg-emerald-500/10 rounded-lg px-3 py-1.5">
              <span className="text-xs text-emerald-400">+ {formatCurrency(e.amount)} a mais este mês</span>
              <button onClick={() => handleRemoveExtra(e.id)} className="text-slate-500 hover:text-red-400 text-xs ml-2">✕</button>
            </div>
          ))}
        </div>
      )}

      {/* Input de extra */}
      {showExtraInput && (
        <div className="flex gap-2">
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Valor extra (R$)"
            value={extraAmount}
            onChange={(e) => setExtraAmount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddExtra()}
            autoFocus
            className="flex-1 bg-slate-700 text-white text-xs rounded-lg px-3 py-2 outline-none placeholder:text-slate-500"
          />
          <button
            onClick={handleAddExtra}
            disabled={savingExtra}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-2 rounded-lg transition-colors"
          >
            {savingExtra ? '...' : 'OK'}
          </button>
          <button
            onClick={() => { setShowExtraInput(false); setExtraAmount(''); }}
            className="bg-slate-700 text-slate-400 text-xs px-3 py-2 rounded-lg hover:bg-slate-600 transition-colors"
          >
            ✕
          </button>
        </div>
      )}

      {/* Mensagem motivacional */}
      {completionDate && (
        <p className="text-xs text-slate-400 text-center">
          Continue assim e você atingirá a meta em{' '}
          <span className="text-emerald-400 font-medium">{completionDate}</span>
        </p>
      )}

      {/* Ações */}
      {!isComplete && (
        <div className="flex gap-2">
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
              isMissedThisMonth
                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                : 'bg-slate-700 text-red-400 hover:bg-red-500/10'
            }`}
          >
            {toggling ? '...' : isMissedThisMonth ? 'Guardei afinal' : 'Não guardei este mês'}
          </button>

          {!showExtraInput && (
            <button
              onClick={() => setShowExtraInput(true)}
              className="bg-slate-700 hover:bg-slate-600 text-emerald-400 text-xs px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              + Extra
            </button>
          )}
        </div>
      )}
    </div>
  );
}
