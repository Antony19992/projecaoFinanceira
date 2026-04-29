import prisma from '../lib/prisma';
import { CreateLimitDTO } from '../types';

export async function upsertLimit(data: CreateLimitDTO) {
  return prisma.monthlyLimit.upsert({
    where: {
      category_month_year: {
        category: data.category,
        month: data.month,
        year: data.year,
      },
    },
    update: { limitValue: data.limitValue },
    create: data,
  });
}

export async function getLimitsByMonth(month: number, year: number) {
  return prisma.monthlyLimit.findMany({ where: { month, year } });
}

export async function deleteLimit(id: string) {
  return prisma.monthlyLimit.delete({ where: { id } });
}

export async function getTotalLimitByMonth(month: number, year: number) {
  const limits = await getLimitsByMonth(month, year);
  return limits.reduce((sum, l) => sum + l.limitValue, 0);
}
