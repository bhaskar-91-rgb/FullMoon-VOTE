import type { ElectionStatus } from '../lib/types';

interface Props {
  status: ElectionStatus;
  onOpen: () => Promise<void>;
  onClose: () => Promise<void>;
}

export function AdminControls({ status, onOpen, onClose }: Props) {
  return (
    <div className="rounded-[2rem] border border-dashed border-blue-200 bg-white/40 p-6 backdrop-blur-md shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-500">
          Admin — election organizer
        </h3>
        <span className="rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-500">
          Gated by admin key
        </span>
      </div>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onOpen}
          disabled={status !== 'CREATED'}
          className="flex-1 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium px-4 py-3 text-sm disabled:opacity-50 disabled:shadow-none disabled:bg-slate-100 shadow-sm transition-colors"
        >
          Open voting
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={status !== 'OPEN'}
          className="flex-1 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium px-4 py-3 text-sm disabled:opacity-50 disabled:shadow-none disabled:bg-slate-100 shadow-sm transition-colors"
        >
          Close voting
        </button>
      </div>
    </div>
  );
}
