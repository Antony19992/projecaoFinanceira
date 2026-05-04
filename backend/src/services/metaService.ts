import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getLatestUpdatedAt(key: string, userId: string): Promise<Date | null> {
  const parts = key.split(':');
  const name = parts[0];

  if (name === 'recurring') {
    const result = await prisma.recurringTransaction.findFirst({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    });
    return result?.updatedAt ?? null;
  }

  const month = parseInt(parts[1]);
  const year = parseInt(parts[2]);
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  if (name === 'transactions') {
    const result = await prisma.transaction.findFirst({
      where: { userId, date: { gte: startDate, lt: endDate } },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    });
    return result?.updatedAt ?? null;
  }

  if (name === 'dashboard') {
    const [txResult, recResult] = await Promise.all([
      prisma.transaction.findFirst({
        where: { userId, date: { gte: startDate, lt: endDate } },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
      prisma.recurringTransaction.findFirst({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        select: { updatedAt: true },
      }),
    ]);
    const dates = [txResult?.updatedAt, recResult?.updatedAt].filter(Boolean) as Date[];
    return dates.length > 0 ? new Date(Math.max(...dates.map((d) => d.getTime()))) : null;
  }

  if (name === 'limits') {
    const result = await prisma.monthlyLimit.findFirst({
      where: { userId, month, year },
      orderBy: { updatedAt: 'desc' },
      select: { updatedAt: true },
    });
    return result?.updatedAt ?? null;
  }

  return null;
}
