interface Props {
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}

export default function SummaryCard({ label, value, sub, highlight }: Props) {
  return (
    <div className={`rounded-xl border p-4 flex flex-col gap-1 ${highlight ? 'border-slate-600 bg-slate-800/60' : 'border-slate-800 bg-slate-900'}`}>
      <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
      <span className="text-2xl font-bold text-white">{value}</span>
      {sub && <span className="text-xs text-slate-500">{sub}</span>}
    </div>
  );
}
