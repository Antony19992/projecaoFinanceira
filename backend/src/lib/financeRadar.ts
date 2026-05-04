import { RadarResult, RadarStatus } from '../types';

export function calculateRadar(
  totalExpenses: number,
  totalIncome: number,
  totalLimit: number,
): RadarResult {
  const projection = totalExpenses;
  const balance = totalIncome - totalExpenses;

  const percentageUsed =
    totalLimit > 0 ? (totalExpenses / totalLimit) * 100 : 0;

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
    diff < 0
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
    message,
  };
}
