export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-nyc-taupe/20 dark:bg-nyc-taupe/20 light:bg-nyc-base/10 rounded-md ${className}`}
    />
  );
}

export function MenuCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-card)] overflow-hidden border border-nyc-gold/10 bg-nyc-cream/5 light:bg-nyc-base/5">
      <Skeleton className="w-full h-36" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-8 w-full mt-3 rounded-full" />
      </div>
    </div>
  );
}