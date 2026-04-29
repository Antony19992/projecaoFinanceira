import prisma from '../lib/prisma';
import { CreateTransactionDTO } from '../types';

export async function createTransaction(data: CreateTransactionDTO) {
  return prisma.transaction.create({
    data: {
      amount: data.amount,
      date: new Date(data.date),
      description: data.description,
      category: data.category,
      type: data.type,
      source: data.source ?? 'manual',
    },
  });
}

async function materializeRecurring(month: number, year: number) {
  const recurring = await prisma.recurringTransaction.findMany({
    where: { active: true },
    include: { transactions: { where: { date: { gte: new Date(year, month - 1, 1), lte: new Date(year, month, 0, 23, 59, 59) } } } },
  });

  const requestedPeriod = year * 12 + month;
  const toCreate = recurring.filter((r) => {
    const createdPeriod = r.createdAt.getFullYear() * 12 + (r.createdAt.getMonth() + 1);
    return r.transactions.length === 0 && requestedPeriod >= createdPeriod;
  });

  if (toCreate.length === 0) return;

  const daysInMonth = new Date(year, month, 0).getDate();

  await prisma.transaction.createMany({
    data: toCreate.map((r) => ({
      amount: r.amount,
      date: new Date(year, month - 1, Math.min(r.dayOfMonth, daysInMonth)),
      description: r.description,
      category: r.category,
      type: r.type,
      source: r.source,
      recurringId: r.id,
    })),
  });
}

export async function getTransactionsByMonth(month: number, year: number) {
  await materializeRecurring(month, year);

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  return prisma.transaction.findMany({
    where: { date: { gte: start, lte: end } },
    orderBy: { date: 'desc' },
  });
}

export async function getRecentTransactions(limit = 10) {
  return prisma.transaction.findMany({
    orderBy: { date: 'desc' },
    take: limit,
  });
}

export async function deleteTransaction(id: string) {
  return prisma.transaction.delete({ where: { id } });
}
