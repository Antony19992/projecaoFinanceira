import prisma from '../lib/prisma';

export async function listCaixinhas(userId: string) {
  return prisma.caixinha.findMany({
    where: { userId },
    include: {
      checkIns: { orderBy: [{ year: 'asc' }, { month: 'asc' }] },
      extras: { orderBy: [{ year: 'asc' }, { month: 'asc' }] },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function createCaixinha(
  userId: string,
  data: { name: string; description: string; targetValue: number; monthlyContribution: number },
) {
  return prisma.caixinha.create({
    data: { userId, ...data },
    include: { checkIns: true },
  });
}

export async function updateCaixinha(
  id: string,
  userId: string,
  data: { name?: string; description?: string; targetValue?: number; monthlyContribution?: number },
) {
  const count = await prisma.caixinha.updateMany({ where: { id, userId }, data });
  if (count.count === 0) return null;
  return prisma.caixinha.findFirst({ where: { id }, include: { checkIns: true } });
}

export async function deleteCaixinha(id: string, userId: string) {
  const count = await prisma.caixinha.deleteMany({ where: { id, userId } });
  return count.count > 0;
}

export async function toggleCheckIn(
  caixinhaId: string,
  userId: string,
  month: number,
  year: number,
) {
  const caixinha = await prisma.caixinha.findFirst({ where: { id: caixinhaId, userId } });
  if (!caixinha) return null;

  const existing = await prisma.caixinhaCheckIn.findUnique({
    where: { caixinhaId_month_year: { caixinhaId, month, year } },
  });

  if (existing) {
    await prisma.caixinhaCheckIn.delete({ where: { id: existing.id } });
    return { checked: false };
  }

  await prisma.caixinhaCheckIn.create({ data: { caixinhaId, month, year } });
  return { checked: true };
}

export async function addExtra(
  caixinhaId: string,
  userId: string,
  month: number,
  year: number,
  amount: number,
) {
  const caixinha = await prisma.caixinha.findFirst({ where: { id: caixinhaId, userId } });
  if (!caixinha) return null;
  return prisma.caixinhaExtra.create({ data: { caixinhaId, month, year, amount } });
}

export async function removeExtra(extraId: string, userId: string) {
  const extra = await prisma.caixinhaExtra.findFirst({
    where: { id: extraId, caixinha: { userId } },
  });
  if (!extra) return false;
  await prisma.caixinhaExtra.delete({ where: { id: extraId } });
  return true;
}
