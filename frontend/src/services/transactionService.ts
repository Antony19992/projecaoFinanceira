import api from './api';
import { CreateTransactionDTO, Transaction } from '@/types';

export async function createTransaction(data: CreateTransactionDTO): Promise<Transaction> {
  const res = await api.post<Transaction>('/transactions', data);
  return res.data;
}

export async function getTransactions(month: number, year: number): Promise<Transaction[]> {
  const res = await api.get<Transaction[]>('/transactions', { params: { month, year } });
  return res.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/transactions/${id}`);
}
