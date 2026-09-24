const VISIBLE = [
  'Election metadata hash, lifecycle status (created / open / closed)',
  'The running yes/no tally after every vote',
  'The set of nullifiers already used (proves "no double voting" is being enforced)',
  'That a valid ballot was submitted by someone holding a fresh, unused secret',
];

const HIDDEN = [
  'Which wallet or person cast any specific ballot',
  'How any individual voted (yes or no)',
  "A voter's device secret key — it never leaves the browser except as a one-way hash",
  'Any link between two ballots from the same person across separate elections',
];

export function PrivacyPanel() {
  return (
    <div className="bg-white/80 rounded-[2rem] border border-white shadow-xl p-8 backdrop-blur-md">
      <h3 className="font-display text-sm font-bold uppercase tracking-widest text-blue-500">
        Privacy model — full moon brightness
      </h3>
      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-700">
            <span className="h-2 w-2 rounded-full bg-slate-400 shadow-sm" /> What any observer can see
          </p>
          <ul className="space-y-3 text-sm font-medium text-slate-500">
            {VISIBLE.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-0.5 text-accent-secondary text-lg leading-none">◐</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-700">
            <span className="h-2 w-2 rounded-full bg-blue-400 shadow-sm" /> What stays private, always
          </p>
          <ul className="space-y-3 text-sm font-medium text-slate-500">
            {HIDDEN.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-0.5 text-accent-primary text-lg leading-none">◑</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
