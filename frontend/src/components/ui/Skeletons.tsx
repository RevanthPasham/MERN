type SkeletonProps = {
  className?: string;
};

function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`} />;
}

function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm animate-pulse">
      <Skeleton className="aspect-[3/4]" />
      <div className="p-3 md:p-4 space-y-2.5">
        <Skeleton className="h-2.5 w-20 rounded-full" />
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-4/5 rounded-full" />
        <div className="h-px bg-gray-100" />
        <Skeleton className="h-5 w-1/2 rounded-full" />
        <Skeleton className="h-3 w-2/3 rounded-full" />
      </div>
    </div>
  );
}

function SectionTitleSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-3 w-24 rounded-full" />
      <Skeleton className="h-8 w-48 rounded-full" />
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-1 w-8 rounded-full" />
        <Skeleton className="h-1 w-3 rounded-full" />
      </div>
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="min-h-[50vh]">
      <section className="px-3 md:px-4 py-4 md:py-5">
        <div className="relative rounded-2xl overflow-hidden shadow-lg min-h-[300px] md:min-h-[440px] bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 animate-pulse">
          <div className="relative z-10 flex flex-col justify-center h-full min-h-[300px] md:min-h-[440px] px-7 py-10 md:px-14 md:py-14 md:w-[50%] space-y-4">
            <Skeleton className="h-3 w-28 rounded-full bg-gray-300" />
            <Skeleton className="h-9 md:h-12 w-11/12 rounded-full bg-gray-300" />
            <Skeleton className="h-5 md:h-6 w-4/5 rounded-full bg-gray-300" />
            <Skeleton className="h-12 w-36 rounded-none bg-gray-300" />
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12 bg-gray-50">
        <div className="px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-6 md:mb-8">
            <SectionTitleSkeleton />
            <Skeleton className="hidden sm:block h-4 w-20 rounded-full" />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-none [-webkit-overflow-scrolling:touch]">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="snap-start flex-shrink-0 w-44 md:w-52">
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-14 bg-white">
        <div className="px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex justify-center mb-8 md:mb-10">
            <Skeleton className="h-8 w-56 rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center text-center gap-2.5">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="w-full aspect-square rounded-xl" />
              </div>
            ))}
          </div>
          <div className="mt-12 md:mt-16 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="px-8 py-8 md:py-10 md:w-56 md:border-r border-gray-200 bg-white flex-shrink-0 flex items-center justify-center md:justify-start">
                <div className="space-y-3 w-full">
                  <Skeleton className="h-8 w-36 rounded-full" />
                  <Skeleton className="h-8 w-28 rounded-full" />
                </div>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex flex-col items-center justify-center gap-3 px-6 py-7 md:py-9 text-center">
                    <Skeleton className="h-3 w-28 rounded-full" />
                    <Skeleton className="h-7 w-40 rounded-full" />
                    <Skeleton className="h-9 w-24 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        <div>
          <Skeleton className="aspect-[3/4] rounded-lg" />
          <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="shrink-0 w-16 h-20 rounded-md" />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-3">
            <Skeleton className="h-7 md:h-8 w-11/12 rounded-full" />
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-9 w-28 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-4 space-y-3">
            <Skeleton className="h-5 w-2/3 rounded-full" />
            <Skeleton className="h-3 w-5/6 rounded-full" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-48 rounded-full" />
            <div className="grid grid-cols-3 gap-2.5">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-xl border border-gray-100 bg-gray-50 p-3 space-y-3">
                  <Skeleton className="h-3 w-16 rounded-full mx-auto" />
                  <Skeleton className="h-6 w-24 rounded-full mx-auto" />
                  <Skeleton className="h-px w-full" />
                  <Skeleton className="h-3 w-14 rounded-full mx-auto" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-5 w-32 rounded-full" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-10 w-16 rounded-full" />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Skeleton className="h-12 rounded-full" />
            <Skeleton className="h-12 rounded-full" />
          </div>
        </div>
      </div>

      <div className="mt-10 md:mt-12 space-y-4">
        <Skeleton className="h-6 w-40 rounded-full" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </main>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Skeleton className="h-8 w-2/5 max-w-[280px] rounded-full" />
        <Skeleton className="h-4 w-32 rounded-full" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export function SearchOverlaySkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex gap-3 p-2 rounded-lg">
          <Skeleton className="w-16 h-20 rounded" />
          <div className="min-w-0 flex-1 space-y-2 pt-1">
            <Skeleton className="h-4 w-4/5 rounded-full" />
            <Skeleton className="h-3 w-2/5 rounded-full" />
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-3 w-14 rounded-full" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListPageSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <Skeleton className="h-8 w-52 rounded-full" />
        <Skeleton className="h-4 w-36 rounded-full" />
      </div>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="rounded-2xl border border-gray-200 bg-white p-4 md:p-5 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-3 w-28 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-4/5 rounded-full" />
            <Skeleton className="h-4 w-3/5 rounded-full" />
            <Skeleton className="h-4 w-2/3 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
