import { RadarResult, RadarStatus } from '../types';

export function calculateRadar(
  totalExpenses: number,
  totalIncome: number,
  totalLimit: number,
  dayOfMonth: number,
  daysInMonth: number
): RadarResult {
  // Nos primeiros 7 dias não extrapolamos: gastos recorrentes são
  // materializados de uma vez e distorceriam a projeção diária.
  const MIN_DAYS = 7;
  const projection =
    dayOfMonth >= MIN_DAYS
      ? (totalExpenses / dayOfMonth) * daysInMonth
      : totalExpenses;

  const balance = totalIncome - totalExpenses;

  // Para o status, comparar com o limite total (não pro-rated) quando
  // ainda estamos cedo no mês.
  const expectedByToday =
    totalLimit > 0
      ? dayOfMonth >= MIN_DAYS
        ? (totalLimit / daysInMonth) * dayOfMonth
        : totalLimit
      : 0;

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
