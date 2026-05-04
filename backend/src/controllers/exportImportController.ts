import { Request, Response } from 'express';
import { generateTransactionsXlsx } from '../services/exportService';
import { importTransactions } from '../services/importService';

export async function exportTransactions(req: Request, res: Response) {
  try {
    const buffer = await generateTransactionsXlsx();
    const filename = `radar-gastos-${new Date().toISOString().slice(0, 10)}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar planilha' });
  }
}

export async function importTransactionsHandler(req: Request, res: Response) {
  const { rows } = req.body as { rows: any[] };
  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ error: 'Nenhuma linha recebida' });
  }
  try {
    const result = await importTransactions(rows);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao importar planilha' });
  }
}
