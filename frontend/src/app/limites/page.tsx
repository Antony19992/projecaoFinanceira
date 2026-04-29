'use client';

import { useEffect, useState } from 'react';
import { MonthlyLimit, CreateLimitDTO } from '@/types';
import { getLimits, upsertLimit, deleteLimit } from '@/services/limitService';
import { apiService } from '@/lib/apiService';
import { formatCurrency } from '@/lib/financeRadar';

const CATEGORIES = [
  'Alimentação', 'Transporte', 'Moradia', 'Saúde',
  'Lazer', 'Educação', 'Outros',
];

const MONTHS = [
  '', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

export default function Limites() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [limits, setLimits] = useState<MonthlyLimit[]>([]);
  const [form, setForm] = useState<CreateLimitDTO>({ category: 'Alimentação', limitValue: 0, month, year });
  const [loading, setLoading] = useState(false);

  function load() {
    apiService
      .getCached(`limits:${month}:${year}`, () => getLimits(month, year), setLimits)
      .then(setLimits);
  }

  useEffect(() => {
    load();
    setForm((f) => ({ ...f, month, year }));
  }, [month, year]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.limitValue <= 0) return;
    setLoading(true);
    try {
      await upsertLimit({ ...form, month, year });
      apiService.invalidate(`limits:${month}:${year}`);
      apiService.invalidatePattern('dashboard:');
      load();
      setForm((f) => ({ ...f, limitValue: 0 }));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    await deleteLimit(id);
    apiService.invalidate(`limits:${month}:${year}`);
    apiService.invalidatePattern('dashboard:');
    setLimits((prev) => prev.filter((l) => l.id !== id));
  }

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  const inputCls = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-slate-500';
  const labelCls = 'text-xs text-slate-400 mb-1 block';
  const total = limits.reduce((s, l) => s + l.limitValue, 0);

  return (
    <div className="flex flex-col gap-5 pb-6">
      <h2 className="text-xl font-bold text-white">Limites Mensais</h2>

      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="text-slate-400 hover:text-white px-2 py-1">‹</button>
        <span className="text-white font-semibold">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="text-slate-400 hover:text-white px-2 py-1">›</button>
      </div>

      {/* Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Definir limite</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Categoria</label>
              <select
                className={inputCls}
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Limite (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                className={inputCls}
                value={form.limitValue || ''}
                onChange={(e) => setForm((f) => ({ ...f, limitValue: parseFloat(e.target.value) || 0 }))}
                placeholder="0,00"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Limite'}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="flex flex-col gap-2">
        {limits.length === 0 ? (
          <p className="text-center text-slate-500 text-sm py-8">Nenhum limite definido.</p>
        ) : (
          <>
            {limits.map((l) => (
              <div
                key={l.id}
                className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-4 py-3"
              >
                <span className="text-sm text-white">{l.category}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-white">{formatCurrency(l.limitValue)}</span>
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="text-slate-600 hover:text-red-400 transition-colors text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between px-4 py-3 border-t border-slate-800 mt-1">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total</span>
              <span className="text-sm font-bold text-white">{formatCurrency(total)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
