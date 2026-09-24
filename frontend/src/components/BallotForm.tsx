import { useState } from 'react';
import type { ElectionMeta, ElectionStatus, VoteChoice } from '../lib/types';

interface Props {
  meta: ElectionMeta;
  status: ElectionStatus;
  hasVoted: boolean;
  onVote: (choice: VoteChoice) => Promise<void>;
}

export function BallotForm({ meta, status, hasVoted, onVote }: Props) {
  const [submitting, setSubmitting] = useState<VoteChoice | null>(null);

  const disabled = status !== 'OPEN' || hasVoted || submitting !== null;

  async function handleVote(choice: VoteChoice) {
    setSubmitting(choice);
    try {
      await onVote(choice);
    } finally {
      setSubmitting(null);
    }
  }

  return (
    <div className="bg-white/80 rounded-[2rem] border border-white shadow-xl p-8 backdrop-blur-md">
      <h3 className="font-display text-sm font-bold uppercase tracking-widest text-blue-500">
        Cast your ballot
      </h3>
      <p className="mt-2 text-sm font-medium text-slate-500">{meta.description}</p>

      {hasVoted ? (
        <div className="mt-6 rounded-xl border border-accent-yes/30 bg-emerald-50/50 p-5 text-sm font-medium text-emerald-800 shadow-sm">
          Your ballot was recorded. A nullifier now sits in the public registry so nobody — including this
          app — can tell it was cast by you, and you can't vote again with this device key.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleVote('YES')}
            className="group flex flex-col items-center gap-1 rounded-2xl border border-emerald-200 bg-white px-4 py-5 font-display font-semibold text-emerald-500 transition-all hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none active:scale-95 shadow-sm"
          >
            <span className="text-xl font-bold">{meta.yesLabel}</span>
            <span className="text-[12px] font-medium text-emerald-600/70">
              {submitting === 'YES' ? 'Signing in wallet…' : 'Vote'}
            </span>
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleVote('NO')}
            className="group flex flex-col items-center gap-1 rounded-2xl border border-rose-200 bg-white px-4 py-5 font-display font-semibold text-rose-400 transition-all hover:bg-rose-50 hover:border-rose-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none active:scale-95 shadow-sm"
          >
            <span className="text-xl font-bold">{meta.noLabel}</span>
            <span className="text-[12px] font-medium text-rose-600/70">
              {submitting === 'NO' ? 'Signing in wallet…' : 'Vote'}
            </span>
          </button>
        </div>
      )}

      {status !== 'OPEN' && !hasVoted && (
        <p className="mt-5 text-sm font-medium text-slate-500">
          {status === 'CREATED' ? 'Voting has not opened yet.' : 'Voting has closed for this election.'}
        </p>
      )}
    </div>
  );
}
