import { RadarResult, RadarStatus } from '../types';

export function calculateRadar(
  totalExpenses: number,
  totalIncome: number,
  totalLimit: number,
  dayOfMonth: number,
  daysInMonth: number
): RadarResult {
  const dailyRate = dayOfMonth > 0 ? totalExpenses / dayOfMonth : 0;
  const projection = dailyRate * daysInMonth;
  const balance = totalIncome - totalExpenses;

  const expectedByToday =
    totalLimit > 0 ? (totalLimit / daysInMonth) * dayOfMonth : 0;

  const percentageUsed =
    expectedByToday > 0 ? (totalExpenses / expectedByToday) * 100 : 0;

  let status: RadarStatus;
  if (percentageUsed <= 90) {
    status = 'GREEN';
  } else if (percentageUsed <= 105) {
    status = 'YELLOW';
  } else {
    status = 'RED';
  }

  const diff = totalLimit - projection;
  const message =
    diff < 0
      ? `Se continuar nesse ritmo, você ultrapassará o orçamento em R$ ${Math.abs(diff).toFixed(2)}`
      : `Mantendo esse ritmo, você poderá guardar R$ ${diff.toFixed(2)}`;

  return {
    status,
    totalExpenses,
    totalIncome,
    balance,
    projection,
    percentageUsed,
    expectedByToday,
    totalLimit,
    message,
  };
}
