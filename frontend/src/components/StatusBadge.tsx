import type { ElectionStatus } from '../lib/types';

const STYLES: Record<ElectionStatus, string> = {
  CREATED: 'bg-slate-100 text-slate-500 border border-slate-200 shadow-sm',
  OPEN: 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm',
  CLOSED: 'bg-rose-50 text-rose-600 border border-rose-200 shadow-sm',
};

const LABELS: Record<ElectionStatus, string> = {
  CREATED: 'Not yet open',
  OPEN: 'Voting open',
  CLOSED: 'Voting closed',
};

export function StatusBadge({ status }: { status: ElectionStatus }) {
  return (
    <span
      data-testid="status-badge"
      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest ${STYLES[status]}`}
    >
      <span className={`h-2 w-2 rounded-full ${status === 'OPEN' ? 'animate-pulse bg-emerald-500' : status === 'CLOSED' ? 'bg-rose-500' : 'bg-slate-400'}`} />
      {LABELS[status]}
    </span>
  );
}
