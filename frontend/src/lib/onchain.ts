import '../polyfills';
import { midnightWallet } from './midnightWallet';
import type { VoteChoice } from './types';

// Contract deployment info — hardcoded to avoid Vite bundling ambiguity
// with JSON files outside the frontend/ root. Update this after each deployment.
const deployedContractInfo = {
  contractAddress: '332fb482e52e939bbc63a6a6b5094587d059054cfcbd36198605dff12bcce450',
  explorerUrl: 'https://preprod.midnightexplorer.com/contracts/332fb482e52e939bbc63a6a6b5094587d059054cfcbd36198605dff12bcce450',
  indexer: 'https://indexer.preprod.midnight.network/api/v4/graphql',
  network: 'preprod',
};

export const CONTRACT_ADDRESS = deployedContractInfo.contractAddress;

export type OnChainResult =
  | { ok: true; txId: string; explorerUrl: string }
  | { ok: false; error: string };

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export async function callContractCircuit(
  circuitName: 'openElection' | 'closeElection' | 'castVote',
  args: { adminSkHex?: string; voterSecretHex?: string; choice?: VoteChoice }
): Promise<OnChainResult> {
  try {
    // Dynamically import the Midnight SDK
    const [
      { indexerPublicDataProvider },
      { httpClientProofProvider },
      { FetchZkConfigProvider },
      { findDeployedContract },
      { CompiledBBoardContractContract }, { setNetworkId }, { Transaction }, { toHex, fromHex } ] = await Promise.all([
      import('@midnight-ntwrk/midnight-js-indexer-public-data-provider'),
      import('@midnight-ntwrk/midnight-js-http-client-proof-provider'),
      import('@midnight-ntwrk/midnight-js-fetch-zk-config-provider'),
      import('@midnight-ntwrk/midnight-js-contracts'),
      import('@midnight-ntwrk/bboard-contract'),
      import('@midnight-ntwrk/midnight-js-network-id'), import('@midnight-ntwrk/midnight-js-protocol/ledger'), import('@midnight-ntwrk/midnight-js-utils') ]);

    // Patch the Compact runtime globals that the compiled contract needs.
    // These are normally injected server-side by the Node.js runtime but
    // are undefined in the browser bundle, causing the crash.
    const _g = globalThis as Record<string, unknown>;
    if (!_g['currentQueryContext']) {
      _g['currentQueryContext'] = () => ({ queryContext: null, witnessContext: null, ledgerContext: null });
    }
    if (!_g['copyCircuitContext']) {
      _g['copyCircuitContext'] = (ctx: unknown) => ctx;
    }
    if (!_g['finalizeCallProofData']) {
      _g['finalizeCallProofData'] = () => null;
    }


    setNetworkId('preprod');

    const indexerHttp = deployedContractInfo.indexer;
    const indexerWs = indexerHttp.replace('https', 'wss').replace('http', 'ws');
    const zkConfigPath = `${window.location.origin}/managed/bboard`;

    // The ONEAM proof server is required for compatibility with 1AM wallet.
    const ONEAM_PROOF_SERVER = 'https://api-preprod.1am.xyz';

    // The wallet MUST be connected to proceed
    const walletState = midnightWallet.getState();
    if (!walletState.isConnected) {
      throw new Error('Wallet not connected');
    }

    // Reach into the wallet manager to get the raw API provider object
    interface InjectedMidnight {
      midnight?: Record<string, any>;
    }
    const win = window as unknown as InjectedMidnight;
    
    // Fallback to searching the window for the active provider.
    const walletId = walletState.walletId || '1am';
    let activeProvider = win.midnight?.[walletId] || win.midnight?.['1am'] || win.midnight?.oneam;
    if (!activeProvider) {
      // Find the first one that matches 1am
      for (const key of Object.keys(win.midnight || {})) {
        if (key.toLowerCase().includes('1am')) {
          activeProvider = win.midnight![key];
          break;
        }
      }
    }
    
    if (!activeProvider) {
      throw new Error('Could not locate active wallet provider in window.');
    }

    const connectedAPI = midnightWallet.getConnectedAPI();
    if (!connectedAPI) {
      throw new Error('Wallet API not initialized. Please connect your wallet first.');
    }

    const ap = connectedAPI as Record<string, any>;

    // Try to get coinPublicKey from wallet state first, then fall back to live API calls
    let coinPublicKey: string | null = walletState.coinPublicKey;
    let encryptionPublicKey: string | null = null;
    if (!coinPublicKey) {
      // 1AM wallet may expose it via getPublicKeys(), state, or directly on the API
      try {
        if (typeof ap.getPublicKeys === 'function') {
          const keys = await ap.getPublicKeys();
          coinPublicKey = keys?.coinPublicKey ?? keys?.coin_public_key ?? null;
        }
        if (!coinPublicKey && ap.coinPublicKey) coinPublicKey = ap.coinPublicKey;
        if (!coinPublicKey && ap.state?.coinPublicKey) coinPublicKey = ap.state.coinPublicKey;
        
        if (!coinPublicKey && typeof ap.getAddresses === 'function') {
          const addresses = await ap.getAddresses();
          if (addresses && addresses.length > 0) {
            const a = addresses[0];
            coinPublicKey = a.shieldedCoinPublicKey || a.coinPublicKey || (typeof a === 'string' ? a : null);
          }
        }
        if (!coinPublicKey && ap.address) coinPublicKey = ap.address;
        if (!coinPublicKey && ap.state?.address) coinPublicKey = ap.state.address;
        if (!coinPublicKey && typeof ap.getState === 'function') {
          const s = await ap.getState();
          coinPublicKey = s?.coinPublicKey ?? null;
        }
      } catch { /* ignore */ }
    }
    if (typeof ap.getShieldedAddresses === 'function') {
      try {
        const shield = await ap.getShieldedAddresses();
        if (shield) {
          if (Array.isArray(shield) && shield.length > 0) {
            coinPublicKey = shield[0].shieldedCoinPublicKey || shield[0].coinPublicKey || shield[0];
            encryptionPublicKey = shield[0].shieldedEncryptionPublicKey || shield[0].encryptionPublicKey || null;
          } else {
            coinPublicKey = shield.shieldedCoinPublicKey || shield.coinPublicKey;
            encryptionPublicKey = shield.shieldedEncryptionPublicKey || shield.encryptionPublicKey || null;
          }
        }
      } catch (e: any) { 
        console.error('getShieldedAddresses failed', e); 
        if (e && e.message && e.message.includes('syncing')) {
          throw new Error('Your 1AM Wallet is currently syncing. Please open the 1AM wallet extension, wait for it to finish syncing, and then try again.');
        }
      }
    }
    if (!coinPublicKey) {
      throw new Error('Wallet coin public key not found. Please disconnect and reconnect your 1AM wallet.');
    }

    
    // Set up the providers for the SDK
    const zkConfigProvider = new FetchZkConfigProvider(zkConfigPath, fetch.bind(window));
    const proofProvider = httpClientProofProvider(ONEAM_PROOF_SERVER, zkConfigProvider);

    // Provide the expected WalletProvider interface
    const walletProvider = {
      getCoinPublicKey: () => coinPublicKey,
      getEncryptionPublicKey: () => (encryptionPublicKey || coinPublicKey),
      balanceTx: async (tx: any) => {
        
        const serializedTx = toHex(tx.serialize());
        if (typeof ap?.balanceUnsealedTransaction === 'function') {
          const received = await ap.balanceUnsealedTransaction(serializedTx);
          return Transaction.deserialize('signature', 'proof', 'binding', fromHex(received.tx));
        }
        throw new Error('Could not balance transaction: balanceUnsealedTransaction missing');
      }
    };

    // Provide the expected MidnightProvider interface
    const midnightProvider = {
      submitTx: async (tx: any) => {
        
        const txHex = toHex(tx.serialize());
        if (typeof ap?.submitTransaction === 'function') {
          const res = await ap.submitTransaction(txHex);
          let returnedId = '';
          if (typeof res === 'string' && res.length > 0) returnedId = res;
          else if (typeof res === 'object' && res !== null) returnedId = res.txHash || res.id;
          return returnedId.replace(/^0x/, '');
        }
        throw new Error('Connected wallet does not support submitting transactions.');
      }
    };

    // Private state provider
    const privateStateId = 'bboard-voter';
    const { levelPrivateStateProvider } = await import('@midnight-ntwrk/midnight-js-level-private-state-provider');
    const privateStateProvider = levelPrivateStateProvider({
      privateStateStoreName: `bboard-private-state-`,
      signingKeyStoreName: `bboard-signing-`,
      privateStoragePasswordProvider: () => "TempPassword123!Secure",
      accountId: coinPublicKey,
    });

    const providers = {
      privateStateProvider,
      publicDataProvider: indexerPublicDataProvider(indexerHttp, indexerWs),
      zkConfigProvider,
      proofProvider,
      walletProvider,
      midnightProvider,
    };

    const findArgs: any = {
      contractAddress: CONTRACT_ADDRESS,
      compiledContract: CompiledBBoardContractContract,
    };
    
    findArgs.privateStateId = privateStateId;
    findArgs.initialPrivateState = { voterSecretKey: args.voterSecretHex ? hexToBytes(args.voterSecretHex.padStart(64, '0').slice(0, 64)) : new Uint8Array(32) };

    // Find the deployed contract on the ledger
    const deployedContract = (await findDeployedContract(providers as any, findArgs)) as any;

    let txId = '';
    
    if (circuitName === 'openElection') {
      const adminSk = hexToBytes(args.adminSkHex!.padStart(64, '0').slice(0, 64));
      const tx = await deployedContract.callTx.openElection(adminSk);
      txId = tx.public.txHash || tx.txHash;
    } else if (circuitName === 'closeElection') {
      const adminSk = hexToBytes(args.adminSkHex!.padStart(64, '0').slice(0, 64));
      const tx = await deployedContract.callTx.closeElection(adminSk);
      txId = tx.public.txHash || tx.txHash;
    } else if (circuitName === 'castVote') {
      const isYes = args.choice === 'YES';
      const tx = await deployedContract.callTx.castVote(isYes);
      txId = tx.public.txHash || tx.txHash;
    }

    const cleanId = txId.replace(/^0x/, '');
    const explorerUrl = `https://explorer.1am.xyz/tx/${cleanId}?network=preprod`;

    return { ok: true, txId, explorerUrl };
  } catch (error: any) {
    console.error('Onchain error:', error);
    return { ok: false, error: error.message || String(error) };
  }
}


