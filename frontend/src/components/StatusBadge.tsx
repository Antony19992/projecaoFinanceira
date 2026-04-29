import { RadarStatus } from '@/types';
import { statusBg, statusLabel } from '@/lib/financeRadar';

interface Props {
  status: RadarStatus;
  size?: 'sm' | 'lg';
}

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const base = statusBg(status);
  const text = size === 'lg' ? 'text-2xl font-bold px-6 py-3' : 'text-sm font-semibold px-3 py-1';

  return (
    <span className={`inline-block rounded-full border ${base} ${text}`}>
      {statusLabel(status)}
    </span>
  );
}
