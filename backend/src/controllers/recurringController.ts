import { Request, Response } from 'express';
import * as recurringService from '../services/recurringService';

export async function create(req: Request, res: Response) {
  try {
    const recurring = await recurringService.createRecurring(req.body, req.userId);
    res.status(201).json(recurring);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar recorrência', details: err });
  }
}

export async function list(req: Request, res: Response) {
  try {
    const items = await recurringService.listRecurring(req.userId);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar recorrências' });
  }
}

export async function toggle(req: Request, res: Response) {
  try {
    const { active } = req.body as { active: boolean };
    const item = await recurringService.toggleRecurring(req.params.id, active);
    res.json(item);
  } catch (err) {
    res.status(404).json({ error: 'Recorrência não encontrada' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await recurringService.deleteRecurring(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: 'Recorrência não encontrada' });
  }
}
