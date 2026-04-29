import api from './api';
import { CreateLimitDTO, MonthlyLimit } from '@/types';

export async function upsertLimit(data: CreateLimitDTO): Promise<MonthlyLimit> {
  const res = await api.post<MonthlyLimit>('/limits', data);
  return res.data;
}

export async function getLimits(month: number, year: number): Promise<MonthlyLimit[]> {
  const res = await api.get<MonthlyLimit[]>('/limits', { params: { month, year } });
  return res.data;
}

export async function deleteLimit(id: string): Promise<void> {
  await api.delete(`/limits/${id}`);
}
