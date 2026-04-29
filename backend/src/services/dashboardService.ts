import { getTransactionsByMonth, getRecentTransactions } from './transactionService';
import { getTotalLimitByMonth } from './limitService';
import { calculateRadar } from '../lib/financeRadar';

export async function getDashboardData(month: number, year: number) {
  const transactions = await getTransactionsByMonth(month, year);
  const recent = await getRecentTransactions(8);
  const totalLimit = await getTotalLimitByMonth(month, year);

  const totalExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const today = new Date();
  const dayOfMonth = today.getDate();
  const daysInMonth = new Date(year, month, 0).getDate();

  const radar = calculateRadar(
    totalExpenses,
    totalIncome,
    totalLimit,
    dayOfMonth,
    daysInMonth
  );

  return { radar, recentTransactions: recent, month, year };
}
