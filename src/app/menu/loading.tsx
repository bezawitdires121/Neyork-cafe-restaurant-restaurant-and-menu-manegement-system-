import { MenuCardSkeleton } from "@/components/Skeleton";

export default function MenuLoading() {
  return (
    <div className="min-h-screen bg-nyc-base dark:bg-nyc-base light:bg-nyc-cream p-6">
      <div className="max-w-6xl mx-auto">
        <div className="h-8 w-48 bg-nyc-taupe/20 rounded-md animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <MenuCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}