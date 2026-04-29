import api from './api';
import { CreateRecurringDTO, RecurringTransaction } from '@/types';

export async function createRecurring(data: CreateRecurringDTO): Promise<RecurringTransaction> {
  const res = await api.post<RecurringTransaction>('/recurring', data);
  return res.data;
}

export async function getRecurring(): Promise<RecurringTransaction[]> {
  const res = await api.get<RecurringTransaction[]>('/recurring');
  return res.data;
}

export async function toggleRecurring(id: string, active: boolean): Promise<RecurringTransaction> {
  const res = await api.patch<RecurringTransaction>(`/recurring/${id}/toggle`, { active });
  return res.data;
}

export async function deleteRecurring(id: string): Promise<void> {
  await api.delete(`/recurring/${id}`);
}
