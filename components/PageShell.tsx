import Footer from "./Footer";

export default function PageShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">{title}</h1>
          {intro ? (
            <p className="text-white/60 text-lg leading-relaxed mb-10">
              {intro}
            </p>
          ) : null}
          <div className="prose-invert space-y-6 text-white/75 leading-relaxed">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
