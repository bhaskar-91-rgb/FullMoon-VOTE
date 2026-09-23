import type { ElectionStatus } from '../lib/types';

interface Props {
  status: ElectionStatus;
  onOpen: () => Promise<void>;
  onClose: () => Promise<void>;
}

export function AdminControls({ status, onOpen, onClose }: Props) {
  return (
    <div className="rounded-3xl border border-dashed border-accent-primary/20 bg-white/40 p-6 backdrop-blur-md shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-glass-mutedText">
          Admin — election organizer
        </h3>
        <span className="rounded-full bg-accent-primary/10 border border-accent-primary/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-accent-primary">
          Gated by admin key
        </span>
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onOpen}
          disabled={status !== 'CREATED'}
          className="flex-1 glass-button px-4 py-3 text-sm disabled:opacity-50 disabled:shadow-none disabled:hover:-translate-y-0 disabled:bg-white/30"
        >
          Open voting
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={status !== 'OPEN'}
          className="flex-1 glass-button px-4 py-3 text-sm disabled:opacity-50 disabled:shadow-none disabled:hover:-translate-y-0 disabled:bg-white/30"
        >
          Close voting
        </button>
      </div>
    </div>
  );
}
