'use client';

import { useEffect, useState } from 'react';
import { RecurringTransaction } from '@/types';
import { getRecurring, toggleRecurring, deleteRecurring } from '@/services/recurringService';
import { formatCurrency } from '@/lib/financeRadar';

export default function Recorrentes() {
  const [items, setItems] = useState<RecurringTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getRecurring().then(setItems).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleToggle(item: RecurringTransaction) {
    const updated = await toggleRecurring(item.id, !item.active);
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  }

  async function handleDelete(id: string) {
    await deleteRecurring(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const active = items.filter((i) => i.active);
  const inactive = items.filter((i) => !i.active);
  const totalIncome = active.filter((i) => i.type === 'INCOME').reduce((s, i) => s + i.amount, 0);
  const totalExpense = active.filter((i) => i.type === 'EXPENSE').reduce((s, i) => s + i.amount, 0);

  return (
    <div className="flex flex-col gap-5 pb-6">
      <h2 className="text-xl font-bold text-white">Lançamentos Fixos</h2>

      {/* Summary */}
      {active.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Receitas fixas</p>
            <p className="text-xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Despesas fixas</p>
            <p className="text-xl font-bold text-red-400">{formatCurrency(totalExpense)}</p>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-center py-10 text-slate-500">Carregando...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-slate-500 text-sm">
          <p className="text-3xl mb-3">🔁</p>
          <p>Nenhum lançamento fixo cadastrado.</p>
          <p className="mt-1 text-slate-600">Use o toggle "Recorrente" ao criar uma transação.</p>
        </div>
      ) : (
        <>
          {active.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Ativos</h3>
              <ul className="flex flex-col gap-2">
                {active.map((item) => (
                  <RecurringItem key={item.id} item={item} onToggle={handleToggle} onDelete={handleDelete} />
                ))}
              </ul>
            </section>
          )}
          {inactive.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Pausados</h3>
              <ul className="flex flex-col gap-2 opacity-50">
                {inactive.map((item) => (
                  <RecurringItem key={item.id} item={item} onToggle={handleToggle} onDelete={handleDelete} />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function RecurringItem({
  item,
  onToggle,
  onDelete,
}: {
  item: RecurringTransaction;
  onToggle: (i: RecurringTransaction) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <li className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{item.description}</p>
        <p className="text-xs text-slate-500">
          {item.category} · todo dia {item.dayOfMonth}
        </p>
      </div>
      <span className={`text-sm font-bold shrink-0 ${item.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
        {item.type === 'INCOME' ? '+' : '-'} {formatCurrency(item.amount)}
      </span>
      <div className="flex items-center gap-2 shrink-0">
        {/* Toggle pause/resume */}
        <button
          onClick={() => onToggle(item)}
          title={item.active ? 'Pausar' : 'Reativar'}
          className={`w-8 h-5 rounded-full transition-colors relative ${item.active ? 'bg-blue-500' : 'bg-slate-700'}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${item.active ? 'translate-x-3' : 'translate-x-0.5'}`} />
        </button>
        <button onClick={() => onDelete(item.id)} className="text-slate-600 hover:text-red-400 transition-colors text-xs">
          ✕
        </button>
      </div>
    </li>
  );
}
