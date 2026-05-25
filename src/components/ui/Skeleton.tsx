interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-sand-200/80 ${className}`}
      aria-hidden="true"
    />
  );
}

export function TourCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[4/3] w-full rounded-xl" />
      <div className="mt-5 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
