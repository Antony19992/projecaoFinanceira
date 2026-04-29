'use client';

import { useState } from 'react';
import TransactionForm from '@/components/TransactionForm';
import { createTransaction } from '@/services/transactionService';
import { createRecurring } from '@/services/recurringService';
import { CreateTransactionDTO, CreateRecurringDTO } from '@/types';

export default function NovaTransacao() {
  const [success, setSuccess] = useState('');

  async function handleTransaction(data: CreateTransactionDTO) {
    await createTransaction(data);
    setSuccess('Transação salva!');
    setTimeout(() => setSuccess(''), 3000);
  }

  async function handleRecurring(data: CreateRecurringDTO) {
    await createRecurring(data);
    setSuccess('Recorrência criada! Ela aparecerá automaticamente todo mês.');
    setTimeout(() => setSuccess(''), 4000);
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      <h2 className="text-xl font-bold text-white">Nova Transação</h2>

      {success && (
        <div className="rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3">
          {success}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <TransactionForm
          onSubmitTransaction={handleTransaction}
          onSubmitRecurring={handleRecurring}
        />
      </div>
    </div>
  );
}
