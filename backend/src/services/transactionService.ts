import prisma from '../lib/prisma';
import { CreateTransactionDTO } from '../types';

export async function createTransaction(data: CreateTransactionDTO, userId: string) {
  return prisma.transaction.create({
    data: {
      userId,
      amount: data.amount,
      date: new Date(data.date),
      description: data.description,
      category: data.category,
      type: data.type,
      source: data.source ?? 'manual',
    },
  });
}

async function materializeRecurring(month: number, year: number, userId: string) {
  const recurring = await prisma.recurringTransaction.findMany({
    where: { active: true, userId },
    include: {
      transactions: {
        where: { date: { gte: new Date(year, month - 1, 1), lte: new Date(year, month, 0, 23, 59, 59) } },
      },
    },
  });

  const requestedPeriod = year * 12 + month;
  const toCreate = recurring.filter((r) => {
    const ref = r.startDate ?? r.createdAt;
    const startPeriod = ref.getFullYear() * 12 + (ref.getMonth() + 1);
    return r.transactions.length === 0 && requestedPeriod >= startPeriod;
  });

  if (toCreate.length === 0) return;

  const daysInMonth = new Date(year, month, 0).getDate();

  await prisma.transaction.createMany({
    data: toCreate.map((r) => ({
      userId,
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

export async function getTransactionsByMonth(month: number, year: number, userId: string) {
  await materializeRecurring(month, year, userId);

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  return prisma.transaction.findMany({
    where: { userId, date: { gte: start, lte: end } },
    orderBy: { date: 'desc' },
  });
}

export async function getRecentTransactions(userId: string, limit = 10) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: limit,
  });
}

export async function deleteTransaction(id: string) {
  return prisma.transaction.delete({ where: { id } });
}
