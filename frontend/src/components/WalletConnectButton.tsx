/**
 * WalletConnectButton.tsx
 * -------------------------------------------------------------------------
 * Wallet connection UI using the same pattern as Signet (github.com/anshusingh97/Signet).
 *
 * - Shows a modal listing all detected Midnight wallets (1AM, Lace)
 * - Triggers browser extension popup on wallet select
 * - Session persists across page refreshes (localStorage)
 * - Only disconnects when user explicitly clicks ✕
 * -------------------------------------------------------------------------
 */
import { useEffect, useRef, useState } from 'react';
import {
  midnightWallet,
  discoverMidnightWallets,
  type MidnightWalletState,
  type DiscoveredWallet,
  type WalletId,
} from '../lib/midnightWallet';

export function WalletConnectButton() {
  const [walletState, setWalletState] = useState<MidnightWalletState>(midnightWallet.getState());
  const [connecting, setConnecting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [wallets, setWallets] = useState<DiscoveredWallet[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  // Subscribe to wallet state changes (including auto-reconnect)
  useEffect(() => {
    return midnightWallet.subscribe((state) => {
      setWalletState(state);
    });
  }, []);

  // Refresh wallet list when modal opens
  useEffect(() => {
    if (showModal) {
      setWallets(discoverMidnightWallets());
    }
  }, [showModal]);

  // Close modal on outside click
  useEffect(() => {
    if (!showModal) return;
    function onOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowModal(false);
      }
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [showModal]);

  async function handleSelectWallet(walletId: WalletId) {
    setConnecting(true);
    try {
      await midnightWallet.connect(walletId);
      setShowModal(false);
    } catch (e: any) {
      console.warn('[WalletConnect] Error:', e?.message ?? e);
    } finally {
      setConnecting(false);
    }
  }

  function handleDisconnect() {
    midnightWallet.disconnect();
  }

  const formatAddress = (addr: string) => {
    if (addr.length <= 16) return addr;
    return `${addr.slice(0, 8)}…${addr.slice(-6)}`;
  };

  const anyInstalled = wallets.some((w) => w.installed);

  // ── Connected state ───────────────────────────────────────────────────────
  if (walletState.isConnected && walletState.address) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs text-emerald-800 shadow-sm">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-bold text-emerald-700 text-[10px] uppercase">
          {walletState.walletName ?? '1AM'}
        </span>
        <span className="font-mono font-medium">{formatAddress(walletState.address)}</span>
        <span className="text-emerald-600/70 font-bold uppercase text-[10px]">Preprod</span>
        <button
          type="button"
          onClick={handleDisconnect}
          title="Disconnect wallet"
          className="ml-1 rounded-full px-1 text-emerald-600/50 hover:text-emerald-700 hover:bg-emerald-200 transition-colors"
        >
          ✕
        </button>
      </div>
    );
  }

  // ── Disconnected state + Modal ────────────────────────────────────────────
  return (
    <>
      <button
        type="button"
        disabled={connecting}
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 rounded-full border border-accent-secondary/30 bg-white/70 px-4 py-1.5 text-xs font-bold text-accent-secondary shadow-sm transition hover:bg-white hover:shadow-md disabled:opacity-50"
      >
        <span className="h-2 w-2 rounded-full bg-accent-secondary" />
        {connecting ? 'Waiting for wallet…' : 'Connect Midnight Wallet'}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md">
          <div
            ref={modalRef}
            className="w-full max-w-sm rounded-[2rem] border border-white bg-white shadow-2xl overflow-hidden"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
              <div>
                <h3 className="font-display text-lg font-bold text-slate-800">
                  Connect Midnight Wallet
                </h3>
                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  Select a wallet to sign transactions on Midnight Preprod
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 transition text-lg leading-none"
              >
                ✕
              </button>
            </div>

            {/* Wallet list */}
            <div className="p-5 space-y-3 bg-slate-50/50">
              {wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  type="button"
                  disabled={!wallet.installed || connecting}
                  onClick={() => handleSelectWallet(wallet.id)}
                  className={[
                    'w-full flex items-center justify-between rounded-2xl border px-4 py-4 text-sm font-medium transition-all shadow-sm',
                    wallet.installed
                      ? 'border-accent-primary/20 bg-white text-slate-800 hover:border-accent-primary hover:shadow-md cursor-pointer active:scale-[0.98]'
                      : 'border-slate-200 bg-slate-100/50 text-slate-400 cursor-not-allowed',
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3">
                    {wallet.icon ? (
                      <img
                        src={wallet.icon}
                        alt={wallet.name}
                        className="h-8 w-8 rounded-xl object-contain drop-shadow-sm"
                      />
                    ) : (
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-lg shadow-inner">
                        {wallet.id === '1am' ? '🌑' : '✨'}
                      </span>
                    )}
                    <div className="text-left">
                      <div className="font-bold text-base">{wallet.name}</div>
                      {wallet.id === '1am' && (
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                          Midnight DApp Connector
                        </div>
                      )}
                    </div>
                  </div>

                  {wallet.installed ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-600 border border-emerald-200">
                      {connecting ? 'Connecting…' : 'Detected ↗'}
                    </span>
                  ) : (
                    <a
                      href={wallet.id === '1am' ? 'https://1am.com/' : 'https://www.lace.io/'}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-full border border-slate-300 bg-white px-3 py-1 text-[10px] font-bold text-slate-500 hover:text-slate-800 hover:border-slate-400 transition shadow-sm"
                    >
                      Install ↗
                    </a>
                  )}
                </button>
              ))}

              {/* No wallets at all */}
              {!anyInstalled && (
                <p className="text-center text-xs font-medium text-slate-500 py-3 bg-slate-100 rounded-xl border border-slate-200">
                  No Midnight wallet detected.<br/>Please install 1AM Wallet or Lace Wallet.
                </p>
              )}
            </div>

            {/* Footer note */}
            <div className="border-t border-slate-100 bg-slate-50 px-6 py-4 text-[11px] font-medium text-slate-500">
              ⛓️ Signing triggers a wallet popup. Transactions go to{' '}
              <strong className="text-slate-700">Midnight Preprod</strong> and generate a verifiable
              block explorer link.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
