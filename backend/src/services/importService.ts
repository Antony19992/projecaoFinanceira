import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ImportRow {
  id?: string;
  date: string;        // DD/MM/YYYY
  description: string;
  category: string;
  type: string;        // 'Receita' | 'Despesa'
  amount: number;
}

function parseDate(str: string): Date {
  const [d, m, y] = str.split('/').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export async function importTransactions(rows: ImportRow[]) {
  let inserted = 0;
  let updated = 0;
  const errors: string[] = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const lineLabel = `Linha ${i + 2}`;

    try {
      if (!row.date || !row.description || !row.amount) {
        errors.push(`${lineLabel}: campos obrigatórios faltando`);
        continue;
      }

      const date = parseDate(row.date);
      if (isNaN(date.getTime())) {
        errors.push(`${lineLabel}: data inválida "${row.date}"`);
        continue;
      }

      const type = row.type === 'Receita' ? 'INCOME' : 'EXPENSE';
      const amount = Number(row.amount);
      if (isNaN(amount) || amount <= 0) {
        errors.push(`${lineLabel}: valor inválido "${row.amount}"`);
        continue;
      }

      const data = {
        date,
        description: String(row.description).trim(),
        category: String(row.category ?? 'Outros').trim(),
        type,
        amount,
      };

      if (row.id) {
        const existing = await prisma.transaction.findUnique({ where: { id: row.id } });
        if (existing) {
          await prisma.transaction.update({ where: { id: row.id }, data });
          updated++;
        } else {
          errors.push(`${lineLabel}: ID não encontrado — linha ignorada`);
        }
      } else {
        await prisma.transaction.create({ data: { ...data, source: 'import' } });
        inserted++;
      }
    } catch {
      errors.push(`${lineLabel}: erro inesperado`);
    }
  }

  return { inserted, updated, errors };
}
