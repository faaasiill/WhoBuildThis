import { Suspense } from "react";
import AdminContent from "./_admin-content";

export default function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    search?: string;
    tags?: string;
  }>;
}) {
  return (
    <Suspense fallback={<AdminPageSkeleton />}>
      <AdminContent searchParams={searchParams} />
    </Suspense>
  );
}

  //  Page Skeleton
function AdminPageSkeleton() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="h-10 w-64 bg-zinc-900 animate-pulse rounded" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-lg bg-zinc-900 animate-pulse"
            />
          ))}
        </div>

        <div className="h-24 rounded-lg bg-zinc-900 animate-pulse" />
        <div className="h-64 rounded-lg bg-zinc-900 animate-pulse" />
      </div>
    </div>
  );
}