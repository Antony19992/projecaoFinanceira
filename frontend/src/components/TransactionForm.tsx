'use client';

import { useState } from 'react';
import { CreateTransactionDTO, CreateRecurringDTO, TransactionType } from '@/types';

const CATEGORIES = [
  'Alimentação', 'Transporte', 'Moradia', 'Saúde',
  'Lazer', 'Educação', 'Salário', 'Freelance', 'Outros',
];

interface Props {
  onSubmitTransaction: (data: CreateTransactionDTO) => Promise<void>;
  onSubmitRecurring: (data: CreateRecurringDTO) => Promise<void>;
}

export default function TransactionForm({ onSubmitTransaction, onSubmitRecurring }: Props) {
  const today = new Date().toISOString().split('T')[0];

  const [recurring, setRecurring] = useState(false);
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Outros');
  const [date, setDate] = useState(today);
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function reset() {
    setAmount(0); setDescription(''); setCategory('Outros');
    setType('EXPENSE'); setDate(today); setDayOfMonth(1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return setError('Informe uma descrição.');
    if (amount <= 0) return setError('Valor deve ser maior que zero.');
    setError('');
    setLoading(true);
    try {
      if (recurring) {
        await onSubmitRecurring({ amount, description, category, type, source: 'manual', dayOfMonth });
      } else {
        await onSubmitTransaction({ amount, date, description, category, type, source: 'manual' });
      }
      reset();
    } finally {
      setLoading(false);
    }
  }

  const inputCls = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-slate-500';
  const labelCls = 'text-xs text-slate-400 mb-1 block';

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Tipo */}
      <div className="grid grid-cols-2 gap-2">
        {(['EXPENSE', 'INCOME'] as TransactionType[]).map((t) => (
          <button key={t} type="button" onClick={() => setType(t)}
            className={`py-2 rounded-lg text-sm font-semibold border transition-colors ${
              type === t
                ? t === 'EXPENSE' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-green-500/20 border-green-500/50 text-green-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {t === 'EXPENSE' ? '- Despesa' : '+ Receita'}
          </button>
        ))}
      </div>

      {/* Toggle recorrente */}
      <button
        type="button"
        onClick={() => setRecurring((r) => !r)}
        className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border text-sm transition-colors ${
          recurring
            ? 'bg-blue-500/10 border-blue-500/40 text-blue-400'
            : 'bg-slate-800 border-slate-700 text-slate-400'
        }`}
      >
        <span>Lançamento recorrente (mensal)</span>
        <span className={`w-4 h-4 rounded-full border-2 transition-colors ${recurring ? 'bg-blue-400 border-blue-400' : 'border-slate-500'}`} />
      </button>

      <div>
        <label className={labelCls}>Valor (R$)</label>
        <input type="number" step="0.01" min="0" className={inputCls}
          value={amount || ''} onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} placeholder="0,00" />
      </div>

      <div>
        <label className={labelCls}>Descrição</label>
        <input type="text" className={inputCls} value={description}
          onChange={(e) => setDescription(e.target.value)} placeholder="Ex: Salário, Mercado..." />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>Categoria</label>
          <select className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          {recurring ? (
            <>
              <label className={labelCls}>Dia do mês</label>
              <input type="number" min="1" max="31" className={inputCls}
                value={dayOfMonth} onChange={(e) => setDayOfMonth(parseInt(e.target.value) || 1)} />
            </>
          ) : (
            <>
              <label className={labelCls}>Data</label>
              <input type="date" className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
            </>
          )}
        </div>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-200 transition-colors disabled:opacity-50">
        {loading ? 'Salvando...' : recurring ? 'Salvar Recorrência' : 'Salvar Transação'}
      </button>
    </form>
  );
}
