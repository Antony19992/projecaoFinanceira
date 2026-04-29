import prisma from '../lib/prisma';
import { CreateRecurringDTO } from '../types';

export async function createRecurring(data: CreateRecurringDTO) {
  return prisma.recurringTransaction.create({
    data: {
      amount: data.amount,
      description: data.description,
      category: data.category,
      type: data.type,
      source: data.source ?? 'manual',
      dayOfMonth: data.dayOfMonth,
    },
  });
}

export async function listRecurring() {
  return prisma.recurringTransaction.findMany({ orderBy: { createdAt: 'asc' } });
}

export async function toggleRecurring(id: string, active: boolean) {
  return prisma.recurringTransaction.update({ where: { id }, data: { active } });
}

export async function deleteRecurring(id: string) {
  await prisma.transaction.deleteMany({ where: { recurringId: id } });
  return prisma.recurringTransaction.delete({ where: { id } });
}
