import api from './api';
import { DashboardData } from '@/types';

export async function getDashboard(month: number, year: number): Promise<DashboardData> {
  const res = await api.get<DashboardData>('/dashboard', { params: { month, year } });
  return res.data;
}
