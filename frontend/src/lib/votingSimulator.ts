import { deriveNullifier } from './hash';
import type { CastVoteResult, ElectionPublicState, ElectionStatus, VoteChoice } from './types';

/**
 * votingSimulator.ts
 * -------------------------------------------------------------------------
 * A pure, in-memory mirror of the public ledger transitions defined in
 * `contract/src/private-voting.compact`.
 *
 * Persists to localStorage so the UI state survives page refreshes!
 * -------------------------------------------------------------------------
 */
export class VotingSimulator {
  readonly electionId: string;
  private _status: ElectionStatus = 'CREATED';
  private _yesVotes = 0;
  private _noVotes = 0;
  private _round = 0;
  private _nullifiers = new Set<string>();

  constructor(electionId: string) {
    this.electionId = electionId;
    this.loadState();
  }

  private getStorageKey(): string {
    return `fullmoon_sim_state_${this.electionId}`;
  }

  private loadState(): void {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(this.getStorageKey());
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this._status = parsed.status ?? 'CREATED';
        this._yesVotes = parsed.yesVotes ?? 0;
        this._noVotes = parsed.noVotes ?? 0;
        this._round = parsed.round ?? 0;
        if (Array.isArray(parsed.nullifiers)) {
          this._nullifiers = new Set(parsed.nullifiers);
        }
      } catch (e) {
        console.error('Failed to parse simulator state', e);
      }
    }
  }

  private saveState(): void {
    if (typeof window === 'undefined') return;
    const toStore = {
      status: this._status,
      yesVotes: this._yesVotes,
      noVotes: this._noVotes,
      round: this._round,
      nullifiers: Array.from(this._nullifiers)
    };
    window.localStorage.setItem(this.getStorageKey(), JSON.stringify(toStore));
  }

  get state(): ElectionPublicState {
    return {
      status: this._status,
      yesVotes: this._yesVotes,
      noVotes: this._noVotes,
      nullifiers: Array.from(this._nullifiers),
      round: this._round,
    };
  }

  openElection(): void {
    if (this._status !== 'CREATED') {
      throw new Error('Election has already been opened');
    }
    this._status = 'OPEN';
    this.saveState();
  }

  /** Force-set status to OPEN regardless of current state.
   *  Used when the on-chain state says OPEN but local sim is out of sync. */
  forceSetOpen(): void {
    this._status = 'OPEN';
    this.saveState();
  }

  closeElection(): void {
    if (this._status !== 'OPEN') {
      throw new Error('Election is not currently open');
    }
    this._status = 'CLOSED';
    this.saveState();
  }

  hasNullifierVoted(nullifier: string): boolean {
    return this._nullifiers.has(nullifier);
  }

  async castVote(secretHex: string, choice: VoteChoice): Promise<CastVoteResult> {
    if (this._status !== 'OPEN') {
      return { ok: false, message: 'Voting is not currently open.' };
    }

    const nullifier = await deriveNullifier(this.electionId, secretHex);

    if (this._nullifiers.has(nullifier)) {
      return { ok: false, message: 'This voter has already cast a ballot.', nullifier };
    }

    this._nullifiers.add(nullifier);
    if (choice === 'YES') {
      this._yesVotes += 1;
    } else {
      this._noVotes += 1;
    }
    this._round += 1;
    this.saveState();

    return { ok: true, message: 'Ballot recorded.', nullifier };
  }
}

export function computeResult(state: ElectionPublicState): 'YES' | 'NO' | 'TIE' | 'PENDING' {
  if (state.status !== 'CLOSED') return 'PENDING';
  if (state.yesVotes === state.noVotes) return 'TIE';
  return state.yesVotes > state.noVotes ? 'YES' : 'NO';
}

export function turnout(state: ElectionPublicState): number {
  return state.yesVotes + state.noVotes;
}
