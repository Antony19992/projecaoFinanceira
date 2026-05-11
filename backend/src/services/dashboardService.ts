import { getTransactionsByMonth, getRecentTransactions } from './transactionService';
import { getTotalLimitByMonth } from './limitService';
import { listCaixinhas } from './caixinhaService';
import { calculateRadar } from '../lib/financeRadar';

export async function getDashboardData(month: number, year: number, userId: string) {
  const [transactions, recent, totalLimit, caixinhas] = await Promise.all([
    getTransactionsByMonth(month, year, userId),
    getRecentTransactions(userId, 8),
    getTotalLimitByMonth(month, year, userId),
    listCaixinhas(userId),
  ]);

  const totalExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const caixinhaExpenses = caixinhas.reduce((sum, c) => {
    const startDate = new Date(c.createdAt);
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1;
    const isActiveThisMonth =
      year > startYear || (year === startYear && month >= startMonth);
    if (!isActiveThisMonth) return sum;

    const isMissed = c.checkIns.some((ci) => ci.month === month && ci.year === year);
    const monthlyAmount = isMissed ? 0 : c.monthlyContribution;
    const extras = c.extras as Array<{ month: number; year: number; amount: number }>;
    const extrasAmount = extras
      .filter((e) => e.month === month && e.year === year)
      .reduce((s, e) => s + e.amount, 0);

    return sum + monthlyAmount + extrasAmount;
  }, 0);

  const today = new Date();
  const dayOfMonth = today.getDate();
  const daysInMonth = new Date(year, month, 0).getDate();

  const radar = calculateRadar(
    totalExpenses + caixinhaExpenses,
    totalIncome,
    totalLimit,
    dayOfMonth,
    daysInMonth,
  );

  return { radar, recentTransactions: recent, month, year };
}
