import Link from "next/link";

export default function NotFound() {
  return (
    <section className="py-20 md:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-6xl md:text-8xl font-bold text-foreground font-brush mb-4">
          404
        </p>
        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-3">
          ページが見つかりません
        </h1>
        <p className="text-sm text-foreground-muted mb-8">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-foreground text-white font-medium rounded hover:bg-foreground/90 transition-colors text-sm"
        >
          トップページへ戻る
        </Link>
      </div>
    </section>
  );
}
