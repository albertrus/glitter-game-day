import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Care Instructions",
  description:
    "How to wash, dry and store a sequin game day jersey so it keeps its shine.",
  alternates: { canonical: absoluteUrl("/care") },
};

export default function CarePage() {
  return (
    <PageShell
      title="Care"
      intro="Sequins are plastic discs sewn onto a knit backing. Heat is what ruins them, not water. Keep it cool and it will last for seasons."
    >
      <h2 className="text-xl font-bold text-white">Washing</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Turn it inside out first. This protects the sequin faces from rubbing.</li>
        <li>Hand wash in cold water with a mild detergent, or machine wash cold on the gentle cycle inside a mesh laundry bag.</li>
        <li>No bleach and no fabric softener. Softener leaves a film that dulls the shine.</li>
        <li>Do not wring it. Press the water out between two towels.</li>
      </ul>

      <h2 className="text-xl font-bold text-white pt-4">Drying</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Lay flat to dry, away from direct sun.</li>
        <li>Never put it in the dryer. Dryer heat will curl, melt and cloud the sequins, and that damage cannot be undone.</li>
      </ul>

      <h2 className="text-xl font-bold text-white pt-4">Ironing and steaming</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Do not iron directly on the sequins.</li>
        <li>If you need to release a wrinkle, turn it inside out, set the iron to its lowest setting, and press through a cotton cloth.</li>
        <li>A steamer held a few inches away, on the inside of the garment, is safer than an iron.</li>
      </ul>

      <h2 className="text-xl font-bold text-white pt-4">Storage</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>Hang it rather than folding it. Folds leave creases in the sequin rows.</li>
        <li>Give it a little space on the rail so the sequins are not crushed against other garments.</li>
      </ul>

      <h2 className="text-xl font-bold text-white pt-4">If a sequin comes loose</h2>
      <p>
        A few will, eventually. They are sewn in a chain, so pull the loose
        thread to the inside and knot it rather than cutting it flush. Cutting
        the chain lets the neighbouring sequins unravel.
      </p>
    </PageShell>
  );
}
