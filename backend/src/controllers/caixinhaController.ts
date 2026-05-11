import { Request, Response } from 'express';
import * as svc from '../services/caixinhaService';


export async function getCaixinhas(req: Request, res: Response) {
  try {
    const data = await svc.listCaixinhas(req.userId!);
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Erro ao buscar caixinhas' });
  }
}

export async function postCaixinha(req: Request, res: Response) {
  const { name, description, targetValue, monthlyContribution } = req.body;
  if (!name || !description || !targetValue || !monthlyContribution) {
    return res.status(400).json({ error: 'Campos obrigatórios: name, description, targetValue, monthlyContribution' });
  }
  try {
    const data = await svc.createCaixinha(req.userId!, { name, description, targetValue, monthlyContribution });
    res.status(201).json(data);
  } catch {
    res.status(500).json({ error: 'Erro ao criar caixinha' });
  }
}

export async function putCaixinha(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const data = await svc.updateCaixinha(id, req.userId!, req.body);
    if (!data) return res.status(404).json({ error: 'Caixinha não encontrada' });
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Erro ao atualizar caixinha' });
  }
}

export async function deleteCaixinha(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const ok = await svc.deleteCaixinha(id, req.userId!);
    if (!ok) return res.status(404).json({ error: 'Caixinha não encontrada' });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Erro ao deletar caixinha' });
  }
}

export async function postCheckIn(req: Request, res: Response) {
  const { id } = req.params;
  const { month, year } = req.body;
  if (!month || !year) return res.status(400).json({ error: 'month e year são obrigatórios' });
  try {
    const result = await svc.toggleCheckIn(id, req.userId!, Number(month), Number(year));
    if (!result) return res.status(404).json({ error: 'Caixinha não encontrada' });
    res.json(result);
  } catch {
    res.status(500).json({ error: 'Erro ao registrar check-in' });
  }
}

export async function postExtra(req: Request, res: Response) {
  const { id } = req.params;
  const { month, year, amount } = req.body;
  if (!month || !year || !amount) {
    return res.status(400).json({ error: 'month, year e amount são obrigatórios' });
  }
  try {
    const result = await svc.addExtra(id, req.userId!, Number(month), Number(year), Number(amount));
    if (!result) return res.status(404).json({ error: 'Caixinha não encontrada' });
    res.status(201).json(result);
  } catch {
    res.status(500).json({ error: 'Erro ao adicionar extra' });
  }
}

export async function deleteExtra(req: Request, res: Response) {
  const { extraId } = req.params;
  try {
    const ok = await svc.removeExtra(extraId, req.userId!);
    if (!ok) return res.status(404).json({ error: 'Extra não encontrado' });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Erro ao remover extra' });
  }
}
