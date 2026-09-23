import { shortHex } from '../lib/hash';

interface Props {
  nullifiers: string[];
  myNullifier: string | null;
}

export function NullifierLedger({ nullifiers, myNullifier }: Props) {
  return (
    <div className="glass-panel p-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-bold uppercase tracking-widest text-accent-primary">
          Nullifier registry
        </h3>
        <span className="text-xs font-semibold text-glass-mutedText bg-white/60 px-3 py-1 rounded-full border border-white shadow-sm">{nullifiers.length} entr{nullifiers.length === 1 ? 'y' : 'ies'}</span>
      </div>
      <p className="mb-5 text-xs font-medium leading-relaxed text-glass-mutedText">
        Every ballot leaves exactly one entry here — a one-way hash that stops double-voting without ever
        linking back to a wallet or identity.
      </p>
      <ul className="max-h-48 space-y-2 overflow-y-auto pr-2 font-mono text-xs custom-scrollbar">
        {nullifiers.length === 0 && <li className="text-glass-mutedText/60 p-2 text-center">No ballots cast yet.</li>}
        {nullifiers
          .slice()
          .reverse()
          .map((n) => (
            <li
              key={n}
              className={`flex items-center justify-between rounded-xl px-4 py-2.5 transition-colors shadow-sm border border-white/40 ${
                n === myNullifier ? 'bg-accent-primary/10 text-accent-primary ring-1 ring-accent-primary/40' : 'bg-white/60 text-glass-darkText'
              }`}
            >
              <span className="font-bold">{shortHex(n, 8)}</span>
              {n === myNullifier && <span className="text-[10px] uppercase tracking-widest font-bold">you</span>}
            </li>
          ))}
      </ul>
    </div>
  );
}
