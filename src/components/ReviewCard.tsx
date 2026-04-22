export function ReviewCard({
  review,
}: {
  review: {
    id: number;
    productName: string;
    rating: number;
    comment: string;
    age: string;
    skinType: string;
  };
}) {
  return (
    <div className="bg-white rounded-lg border border-border p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-background-secondary rounded flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#999"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="12" cy="10" r="3" />
            <path d="M6 21v-1a6 6 0 0 1 12 0v1" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground-muted truncate">
            {review.productName}
          </p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill={i < Math.floor(review.rating) ? "#111" : "#ddd"}
                stroke="none"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
            <span className="text-xs font-medium ml-1">{review.rating}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed mb-3">
        {review.comment}
      </p>
      <p className="text-xs text-foreground-muted">
        {review.age} / {review.skinType}
      </p>
    </div>
  );
}
