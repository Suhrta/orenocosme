"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-5xl md:text-7xl font-bold text-foreground font-brush mb-4">
          Error
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-3">
          エラーが発生しました
        </h1>
        <p className="text-sm text-foreground-muted mb-8">
          申し訳ございません。しばらく時間を置いてから再度お試しください。
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center px-6 py-3 bg-foreground text-white font-medium rounded hover:bg-foreground/90 transition-colors text-sm"
        >
          もう一度試す
        </button>
      </div>
    </section>
  );
}
