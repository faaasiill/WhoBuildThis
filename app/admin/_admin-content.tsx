import ProductList from "@/components/admin/product-list";
import SearchFilter from "@/components/admin/search-filter";
import StatCard from "@/components/admin/stats-card";
import { ProductStatus } from "@/lib/product-status";
import {
  getAdminProducts,
  getAdminStats,
  getAllTags,
} from "@/lib/products/product-select";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

//  Admin Content
export default async function AdminContent({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    search?: string;
    tags?: string;
  }>;
}) {
  const { userId } = await auth();

  if (!userId) redirect("/");

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  if (!user.publicMetadata?.isAdmin) {
    redirect("/");
  }

  const params = await searchParams;

  const [stats, tags, products] = await Promise.all([
    getAdminStats(),
    getAllTags(),
    getAdminProducts({
      status: params.status as ProductStatus | undefined,
      search: params.search,
      tags: params.tags?.split(",").filter(Boolean),
    }),
  ]);

  const pending = products.filter((p) => p.status === "pending");
  const others = products.filter((p) => p.status !== "pending");

  return (
    <div className="min-h-screen mt-20 mb-80 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tighter text-white">
          Admin Panel
        </h2>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Products" value={stats.total} icon="chart" />
          <StatCard title="Pending Review" value={stats.pending} icon="clock" />
          <StatCard title="Approved" value={stats.approved} icon="check" />
          <StatCard title="Rejected" value={stats.rejected} icon="close" />
        </div>

        {/* Filters */}
        <div className="mt-8">
          <Suspense fallback={<SearchFilterSkeleton />}>
            <SearchFilter availableTags={tags} />
          </Suspense>
        </div>

        {/* Pending */}
        {!params.status || params.status === "pending" ? (
          <div className="mt-8">
            <ProductList
              products={pending}
              title={`Pending Approval (${pending.length})`}
              emptyMessage="No pending products"
            />
          </div>
        ) : null}

        {/* Others */}
        <div className="mt-8">
          <ProductList
            products={others}
            title={`All Products (${others.length})`}
            emptyMessage="No products found"
          />
        </div>
      </div>
    </div>
  );
}

//  Filter Skeleton
function SearchFilterSkeleton() {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-6">
      <div className="flex gap-3">
        <div className="h-10 flex-1 bg-zinc-900 animate-pulse rounded" />
        <div className="h-10 w-40 bg-zinc-900 animate-pulse rounded" />
        <div className="h-10 w-24 bg-zinc-900 animate-pulse rounded" />
      </div>
    </div>
  );
}
