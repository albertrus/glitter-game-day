import Link from "next/link";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <div className="pt-40 pb-24 px-4 text-center">
        <p className="text-6xl mb-4" aria-hidden="true">&#10022;</p>
        <h1 className="text-4xl font-extrabold mb-3">Nothing here</h1>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          That page does not exist, or the piece has been taken down.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/shop"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-yellow-400 text-black font-bold hover:opacity-90 transition-opacity"
          >
            Shop everything
          </Link>
          <Link
            href="/"
            className="px-8 py-3 rounded-full border border-white/20 font-bold hover:bg-white/10 transition-colors"
          >
            Back home
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
