import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sizing Guide",
  description:
    "How Glitter Game Day sequin jerseys fit, and how to pick your size.",
  alternates: { canonical: absoluteUrl("/sizing") },
};

const rows = [
  { size: "S", bust: "34–36″", length: "28″", usual: "US 2–4" },
  { size: "M", bust: "36–38″", length: "29″", usual: "US 6–8" },
  { size: "L", bust: "38–41″", length: "30″", usual: "US 10–12" },
  { size: "XL", bust: "41–44″", length: "31″", usual: "US 14–16" },
  { size: "2XL", bust: "44–48″", length: "32″", usual: "US 18–20" },
];

export default function SizingPage() {
  return (
    <PageShell
      title="Sizing"
      intro="These are cut oversized on purpose. Most people wear their normal size and get a relaxed, drapey fit. Size down one if you want it closer to the body."
    >
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <caption className="sr-only">
            Size chart with bust and body length measurements
          </caption>
          <thead className="bg-white/5 text-white/60 text-xs uppercase tracking-wider">
            <tr>
              <th scope="col" className="text-left px-4 py-3">Size</th>
              <th scope="col" className="text-left px-4 py-3">Bust</th>
              <th scope="col" className="text-left px-4 py-3">Length</th>
              <th scope="col" className="text-left px-4 py-3">Usually fits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r) => (
              <tr key={r.size}>
                <th scope="row" className="text-left px-4 py-3 font-bold text-white">
                  {r.size}
                </th>
                <td className="px-4 py-3 text-white/70">{r.bust}</td>
                <td className="px-4 py-3 text-white/70">{r.length}</td>
                <td className="px-4 py-3 text-white/70">{r.usual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-white pt-4">How to measure</h2>
      <p>
        Measure across the fullest part of your bust with a soft tape, keeping
        it level and not pulled tight. Length is measured from the shoulder
        seam straight down to the hem.
      </p>

      <h2 className="text-xl font-bold text-white pt-4">A note on sequins</h2>
      <p>
        Sequin fabric has very little stretch compared with a normal knit. If
        you are between sizes, take the larger one. A sequin garment that is
        snug across the bust will show gaps between the sequin rows.
      </p>

      <p className="text-sm text-white/40 pt-4">
        Measurements are taken flat and can vary by about half an inch between
        pieces because each one is finished by hand.
      </p>
    </PageShell>
  );
}
