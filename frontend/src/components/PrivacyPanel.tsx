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
    <div className="glass-panel p-8">
      <h3 className="font-display text-sm font-bold uppercase tracking-widest text-accent-primary">
        Privacy model — full moon brightness
      </h3>
      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        <div>
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-secondary">
            <span className="h-2 w-2 rounded-full bg-accent-secondary shadow-[0_0_8px_rgba(56,189,248,0.5)]" /> What any observer can see
          </p>
          <ul className="space-y-3 text-sm font-medium text-glass-mutedText">
            {VISIBLE.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-0.5 text-accent-secondary text-lg leading-none">◐</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-primary">
            <span className="h-2 w-2 rounded-full bg-accent-primary shadow-[0_0_8px_rgba(129,140,248,0.5)]" /> What stays private, always
          </p>
          <ul className="space-y-3 text-sm font-medium text-glass-mutedText">
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
