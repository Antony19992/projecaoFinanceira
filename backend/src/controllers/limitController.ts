import { Request, Response } from 'express';
import * as limitService from '../services/limitService';

export async function upsert(req: Request, res: Response) {
  try {
    const limit = await limitService.upsertLimit(req.body);
    res.status(201).json(limit);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao salvar limite', details: err });
  }
}

export async function listByMonth(req: Request, res: Response) {
  try {
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();
    const limits = await limitService.getLimitsByMonth(month, year);
    res.json(limits);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar limites' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await limitService.deleteLimit(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: 'Limite não encontrado' });
  }
}
