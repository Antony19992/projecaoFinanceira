'use client';

import { useEffect, useState } from 'react';
import { Transaction } from '@/types';
import { getTransactions, deleteTransaction } from '@/services/transactionService';
import TransactionList from '@/components/TransactionList';

const MONTHS = [
  '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export default function Historico() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    getTransactions(month, year)
      .then(setTransactions)
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [month, year]);

  async function handleDelete(id: string) {
    await deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

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
      <h2 className="text-xl font-bold text-white">Histórico</h2>

      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="text-slate-400 hover:text-white px-2 py-1">‹</button>
        <span className="text-white font-semibold">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="text-slate-400 hover:text-white px-2 py-1">›</button>
      </div>

      {loading ? (
        <p className="text-center py-10 text-slate-500">Carregando...</p>
      ) : (
        <TransactionList transactions={transactions} onDelete={handleDelete} />
      )}
    </div>
  );
}
