import { RadarResult, RadarStatus } from '../types';

export function calculateRadar(
  totalExpenses: number,
  totalIncome: number,
  totalLimit: number,
  dayOfMonth: number,
  daysInMonth: number,
): RadarResult {
  const projection = totalExpenses;
  const balance = totalIncome - totalExpenses;

  const percentageUsed =
    totalLimit > 0 ? (totalExpenses / totalLimit) * 100 : 0;

  const remainingDays = Math.max(daysInMonth - dayOfMonth + 1, 1);
  const dailyAllowance =
    totalLimit > 0 ? (totalLimit - totalExpenses) / remainingDays : 0;

  let status: RadarStatus;
  if (percentageUsed <= 90) {
    status = 'GREEN';
  } else if (percentageUsed <= 105) {
    status = 'YELLOW';
  } else {
    status = 'RED';
  }

  const diff = totalLimit - totalExpenses;
  const message =
    totalLimit <= 0
      ? balance >= 0
        ? `Saldo positivo de R$ ${balance.toFixed(2)} — nenhum limite definido`
        : `Saldo negativo de R$ ${Math.abs(balance).toFixed(2)} — nenhum limite definido`
      : diff < 0
      ? `Você ultrapassou o orçamento em R$ ${Math.abs(diff).toFixed(2)}`
      : `Você tem R$ ${diff.toFixed(2)} disponíveis no orçamento`;

  return {
    status,
    totalExpenses,
    totalIncome,
    balance,
    projection,
    percentageUsed,
    expectedByToday: totalLimit,
    totalLimit,
    dailyAllowance,
    message,
  };
}
