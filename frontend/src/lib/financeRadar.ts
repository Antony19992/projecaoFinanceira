import { RadarStatus } from '@/types';

export function statusColor(status: RadarStatus): string {
  return { GREEN: '#22c55e', YELLOW: '#eab308', RED: '#ef4444' }[status];
}

export function statusLabel(status: RadarStatus): string {
  return { GREEN: 'No Plano', YELLOW: 'Atenção', RED: 'Fora do Plano' }[status];
}

export function statusBg(status: RadarStatus): string {
  return {
    GREEN: 'bg-green-500/10 border-green-500/30 text-green-400',
    YELLOW: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    RED: 'bg-red-500/10 border-red-500/30 text-red-400',
  }[status];
}

export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
