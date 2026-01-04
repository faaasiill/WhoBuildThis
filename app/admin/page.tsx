import ProductList from "@/components/admin/product-list";
import SearchFilter from "@/components/admin/search-filter";
import StatCard from "@/components/admin/stats-card";
import SectionHeader from "@/components/common/section-header";
import { ProductStatus } from "@/lib/product-status";
import {
  getAdminProducts,
  getAdminStats,
  getAllTags,
} from "@/lib/products/product-select";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface AdminPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
    tags?: string;
  }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);

  const metadata = user.publicMetadata;
  const isAdmin = metadata?.isAdmin ?? false;

  if (!isAdmin) {
    redirect("/");
  }

  const params = await searchParams;

  // Fetch data
  const [stats, allTags, products] = await Promise.all([
    getAdminStats(),
    getAllTags(),
    getAdminProducts({
      status: params.status as ProductStatus | undefined,
      search: params.search,
      tags: params.tags?.split(",").filter(Boolean),
    }),
  ]);

  // Separate pending products
  const pendingProducts = products.filter((p) => p.status === "pending");
  const otherProducts = products.filter((p) => p.status !== "pending");

  return (
    <div className="min-h-screen mt-20 mb-80 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tighter text-white">
          Admin Panel
        </h2>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Products"
            value={stats.total}
            icon="chart"
            color="#a1a1aa"
            delay={0}
          />

          <StatCard
            title="Pending Review"
            value={stats.pending}
            icon="clock"
            color="#eab308"
            delay={0.1}
          />

          <StatCard
            title="Approved"
            value={stats.approved}
            icon="check"
            color="#22c55e"
            delay={0.2}
          />

          <StatCard
            title="Rejected"
            value={stats.rejected}
            icon="close"
            color="#ef4444"
            delay={0.3}
          />
        </div>

        {/* Search & Filters */}
        <div className="mt-8">
          <Suspense fallback={<SearchFilterSkeleton />}>
            <SearchFilter availableTags={allTags} />
          </Suspense>
        </div>

        {/* Pending Products Section */}
        {!params.status || params.status === "pending" ? (
          <div className="mt-8">
            <ProductList
              products={pendingProducts}
              title={`Pending Approval (${pendingProducts.length})`}
              emptyMessage="No pending products to review"
            />
          </div>
        ) : null}

        {/* All Products Section */}
        <div className="mt-8">
          <ProductList
            products={otherProducts}
            title={`All Products (${otherProducts.length})`}
            emptyMessage="No products found"
          />
        </div>
      </div>
    </div>
  );
}

// Skeleton loader for search filter
function SearchFilterSkeleton() {
  return (
    <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950 p-6">
      <div className="flex items-center gap-3">
        <div className="h-10 flex-1 animate-pulse rounded-md bg-zinc-900" />
        <div className="h-10 w-[160px] animate-pulse rounded-md bg-zinc-900" />
        <div className="h-10 w-24 animate-pulse rounded-md bg-zinc-900" />
        <div className="h-10 w-24 animate-pulse rounded-md bg-zinc-900" />
      </div>
    </div>
  );
}
