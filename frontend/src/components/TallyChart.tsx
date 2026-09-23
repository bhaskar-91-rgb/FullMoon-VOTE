import type { ElectionMeta, ElectionPublicState } from '../lib/types';

interface Props {
  meta: ElectionMeta;
  state: ElectionPublicState;
}

export function TallyChart({ meta, state }: Props) {
  const total = state.yesVotes + state.noVotes;
  const yesPct = total === 0 ? 50 : Math.round((state.yesVotes / total) * 100);
  const noPct = total === 0 ? 50 : 100 - yesPct;

  return (
    <div data-testid="tally-chart" className="glass-panel p-8">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-widest text-accent-primary">
          Live public tally
        </h3>
        <span className="text-xs font-semibold text-glass-mutedText bg-white/60 px-3 py-1 rounded-full border border-white shadow-sm">{total} ballot{total === 1 ? '' : 's'} cast</span>
      </div>

      <div className="space-y-5">
        <Bar label={meta.yesLabel} value={state.yesVotes} pct={yesPct} colorClass="bg-gradient-to-r from-emerald-400 to-accent-yes" />
        <Bar label={meta.noLabel} value={state.noVotes} pct={noPct} colorClass="bg-gradient-to-r from-rose-400 to-accent-no" />
      </div>

      <p className="mt-6 text-xs font-medium leading-relaxed text-glass-mutedText">
        These totals are the only per-vote signal ever written to the public ledger — individual ballots
        are never revealed, only the running counters.
      </p>
    </div>
  );
}

function Bar({ label, value, pct, colorClass }: { label: string; value: number; pct: number; colorClass: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-bold text-glass-darkText">{label}</span>
        <span className="tabular-nums font-semibold text-glass-mutedText">
          {value} · <span className="text-glass-darkText">{pct}%</span>
        </span>
      </div>
      <div className="h-3.5 w-full overflow-hidden rounded-full bg-white/60 shadow-inner border border-white/40">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out shadow-sm`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
