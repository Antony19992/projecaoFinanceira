import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';

export async function create(req: Request, res: Response) {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar transação', details: err });
  }
}

export async function listByMonth(req: Request, res: Response) {
  try {
    const month = Number(req.query.month) || new Date().getMonth() + 1;
    const year = Number(req.query.year) || new Date().getFullYear();
    const transactions = await transactionService.getTransactionsByMonth(month, year);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await transactionService.deleteTransaction(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(404).json({ error: 'Transação não encontrada' });
  }
}
