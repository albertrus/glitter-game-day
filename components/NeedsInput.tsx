/**
 * Marks a block of a policy page that Albert has to fill in himself.
 *
 * These are business and legal decisions (return windows, processing times,
 * what data is collected, which state's law governs). Inventing that text
 * would create a published promise to customers that nobody actually made,
 * which is worse than an obvious blank. The banner is deliberately visible
 * so an unfinished page cannot quietly ship.
 */
export default function NeedsInput({
  what,
  children,
}: {
  what: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-amber-400/40 bg-amber-400/5 p-5 my-6">
      <p className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-2">
        Needs your decision: {what}
      </p>
      <div className="text-white/60 text-sm leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}
