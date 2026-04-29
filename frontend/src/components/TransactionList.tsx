'use client';

import { Transaction } from '@/types';
import { formatCurrency } from '@/lib/financeRadar';

interface Props {
  transactions: Transaction[];
  onDelete?: (id: string) => void;
}

const categoryIcons: Record<string, string> = {
  Alimentação: '🍽',
  Transporte: '🚗',
  Moradia: '🏠',
  Saúde: '💊',
  Lazer: '🎮',
  Educação: '📚',
  Salário: '💰',
  Freelance: '💻',
  Outros: '📦',
};

export default function TransactionList({ transactions, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500 text-sm">
        Nenhuma transação encontrada.
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {transactions.map((t) => (
        <li
          key={t.id}
          className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{categoryIcons[t.category] ?? '📦'}</span>
            <div>
              <p className="text-sm font-medium text-white">{t.description}</p>
              <p className="text-xs text-slate-500">
                {t.category} · {new Date(t.date).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-bold ${
                t.type === 'INCOME' ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {t.type === 'INCOME' ? '+' : '-'} {formatCurrency(t.amount)}
            </span>
            {onDelete && (
              <button
                onClick={() => onDelete(t.id)}
                className="text-slate-600 hover:text-red-400 transition-colors text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
