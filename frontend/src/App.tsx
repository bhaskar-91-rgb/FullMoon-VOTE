import { useElection } from './hooks/useElection';
import { StatusBadge } from './components/StatusBadge';
import { TallyChart } from './components/TallyChart';
import { BallotForm } from './components/BallotForm';
import { NullifierLedger } from './components/NullifierLedger';
import { PrivacyPanel } from './components/PrivacyPanel';
import { AdminControls } from './components/AdminControls';
import { WalletConnectButton } from './components/WalletConnectButton';
import type { ElectionMeta } from './lib/types';
import { CONTRACT_ADDRESS } from './lib/onchain';

const ELECTION: ElectionMeta = {
  id: 'first-quarter-proposal-01',
  title: 'Should the treasury fund the Q2 community grants round?',
  description:
    'A single anonymous ballot per device key. Your choice is never linked to your wallet — only the running tally changes on-chain.',
  yesLabel: 'Yes, fund it',
  noLabel: 'No, hold off',
};

export default function App() {
  const { state, loading, error, lastMessage, hasVoted, myNullifier, lastTxId, lastExplorerUrl, castVote, openElection, closeElection } =
    useElection(ELECTION.id);

  return (
    <div className="min-h-screen font-body text-slate-800 bg-[#f4f7f9] selection:bg-accent-primary/30 relative">
      {/* Animated Background Mesh */}
      <div className="bg-mesh-container">
        <div className="bg-mesh-gradient"></div>
      </div>
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <MoonMark />
            <div>
              <p className="font-display text-2xl font-bold leading-tight text-blue-500 tracking-wide">Half Light</p>
              <p className="text-xs text-slate-500 font-medium">Private Voting on Midnight Preprod</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <WalletConnectButton />
          </div>
        </div>
      </header>

      {/* Network & Verifiable Contract Banner */}
      <div className="hidden border-b border-white/10 bg-black/30 px-6 py-2.5 text-xs text-slate-300 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="h-2 w-2 rounded-full bg-accent-yes shadow-[0_0_8px_rgba(52,211,153,0.6)] animate-pulse" />
            <span>Target Network: <strong className="text-white tracking-wide">Midnight Preprod</strong></span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono">
              Contract:{' '}
              <a
                href={`https://preprod.midnightexplorer.com/contracts/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="text-accent-primary hover:text-accent-secondary underline decoration-accent-primary/30 transition-colors font-medium"
                title="View contract on Midnight Preprod Explorer"
              >
                {CONTRACT_ADDRESS.slice(0, 8)}...{CONTRACT_ADDRESS.slice(-6)} ↗
              </a>
            </span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-5xl px-6 py-10 relative z-10">
        <section className="mb-10 text-center mt-12">
          <div className="mb-4 flex flex-wrap justify-center items-center gap-3">
            {state && <StatusBadge status={state.status} />}
          </div>
          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl text-slate-800 tracking-tight">{ELECTION.title}</h1>
        </section>

        {/* On-Chain Transaction Verification Card */}
        {lastTxId && (
          <div className="mb-8 rounded-2xl border border-accent-yes/30 bg-emerald-50/50 p-5 text-emerald-900 backdrop-blur-md shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm text-lg">⛓️</div>
                <div>
                  <p className="font-bold text-sm">On-Chain Transaction Confirmed</p>
                  <p className="text-xs font-mono text-emerald-700/80 mt-0.5">Tx: {lastTxId}</p>
                </div>
              </div>
              {lastExplorerUrl && (
                <a
                  href={lastExplorerUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-xs font-bold text-emerald-600 transition-all hover:bg-emerald-50 shadow-sm hover:shadow active:scale-95"
                >
                  Verify on Explorer ↗
                </a>
              )}
            </div>
            {lastMessage && <p className="mt-3 text-sm text-emerald-700 font-medium">{lastMessage}</p>}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-accent-primary border-t-transparent rounded-full" />
          </div>
        )}
        
        {error && (
          <div role="alert" className="mb-8 rounded-2xl border border-accent-no/30 bg-rose-50/80 p-5 text-sm font-medium text-rose-800 shadow-sm backdrop-blur">
            {error}
          </div>
        )}

        {state && (
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-8">
              <BallotForm meta={ELECTION} status={state.status} hasVoted={hasVoted} onVote={castVote} />
              <TallyChart meta={ELECTION} state={state} />
              <PrivacyPanel />
            </div>
            <div className="space-y-8">
              <NullifierLedger nullifiers={state.nullifiers} myNullifier={myNullifier} />
              <AdminControls status={state.status} onOpen={openElection} onClose={closeElection} />
            </div>
          </div>
        )}
      </main>

      <footer className="mx-auto max-w-5xl px-6 pb-12 pt-8 text-center text-sm font-medium text-glass-mutedText border-t border-glass-border relative z-10">
        Built for the Midnight Builder Challenge — Level 3 · Verifiable On-Chain on Midnight Preprod
      </footer>
    </div>
  );
}

function MoonMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true" className="drop-shadow-sm">
      <path
        d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14V2z"
        fill="url(#moon-gradient)"
      />
      <circle cx="16" cy="16" r="14" stroke="rgba(129, 140, 248, 0.4)" strokeWidth="1.5" />
      <defs>
        <linearGradient id="moon-gradient" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818cf8" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
    </svg>
  );
}
