import { Request, Response } from 'express';
import { getDashboardData } from '../services/dashboardService';

export async function getDashboard(req: Request, res: Response) {
  try {
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();
    const data = await getDashboardData(month, year, req.userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao calcular dashboard' });
  }
}
