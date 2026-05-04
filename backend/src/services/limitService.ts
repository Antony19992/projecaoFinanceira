import prisma from '../lib/prisma';
import { CreateLimitDTO } from '../types';

export async function upsertLimit(data: CreateLimitDTO, userId: string) {
  const existing = await prisma.monthlyLimit.findFirst({
    where: { userId, category: data.category, month: data.month, year: data.year },
  });
  if (existing) {
    return prisma.monthlyLimit.update({
      where: { id: existing.id },
      data: { limitValue: data.limitValue },
    });
  }
  return prisma.monthlyLimit.create({ data: { ...data, userId } });
}

export async function getLimitsByMonth(month: number, year: number, userId: string) {
  return prisma.monthlyLimit.findMany({ where: { userId, month, year } });
}

export async function deleteLimit(id: string) {
  return prisma.monthlyLimit.delete({ where: { id } });
}

export async function getTotalLimitByMonth(month: number, year: number, userId: string) {
  const limits = await getLimitsByMonth(month, year, userId);
  return limits.reduce((sum, l) => sum + l.limitValue, 0);
}
