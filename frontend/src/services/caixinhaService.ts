import api from './api';
import { Caixinha, CaixinhaExtra, CreateCaixinhaDTO } from '@/types';

export async function getCaixinhas(): Promise<Caixinha[]> {
  const res = await api.get<Caixinha[]>('/caixinhas');
  return res.data;
}

export async function createCaixinha(data: CreateCaixinhaDTO): Promise<Caixinha> {
  const res = await api.post<Caixinha>('/caixinhas', data);
  return res.data;
}

export async function updateCaixinha(id: string, data: Partial<CreateCaixinhaDTO>): Promise<Caixinha> {
  const res = await api.put<Caixinha>(`/caixinhas/${id}`, data);
  return res.data;
}

export async function deleteCaixinha(id: string): Promise<void> {
  await api.delete(`/caixinhas/${id}`);
}

export async function toggleCheckIn(
  id: string,
  month: number,
  year: number,
): Promise<{ checked: boolean }> {
  const res = await api.post<{ checked: boolean }>(`/caixinhas/${id}/checkin`, { month, year });
  return res.data;
}

export async function addExtra(
  id: string,
  month: number,
  year: number,
  amount: number,
): Promise<CaixinhaExtra> {
  const res = await api.post<CaixinhaExtra>(`/caixinhas/${id}/extra`, { month, year, amount });
  return res.data;
}

export async function removeExtra(id: string, extraId: string): Promise<void> {
  await api.delete(`/caixinhas/${id}/extra/${extraId}`);
}
