const SkeletonCard = () => {
  return (
    <div className="relative group h-[320px] overflow-hidden border border-white/10 bg-black">

      {/* Image layer (static, no shimmer) */}
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900" />

      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-50 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <div className="flex items-end justify-between gap-4">

          {/* Text */}
          <div className="min-w-0 flex-1">
            <div className="h-5 w-3/4 rounded bg-white/10 skeleton-shimmer" />
            <div className="mt-2 h-3 w-full rounded bg-white/10 skeleton-shimmer" />

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-14 rounded-full bg-white/10 skeleton-shimmer"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Vote buttons */}
          <div className="flex gap-2 flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/10 skeleton-shimmer" />
            <div className="w-9 h-9 rounded-full bg-white/10 skeleton-shimmer" />
          </div>

        </div>
      </div>
    </div>
  );
};



const FeaturedCardSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
          {Array.from({ length: count }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedCardSkeleton;
