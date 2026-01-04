"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Search, TrendingUp, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import ProductCard from "./productCard";
import FeaturedCardSkeleton from "../ui/fetured-card-skeleton";

type Product = {
  id: string;
  title: string;
  description: string;
  image: string;
  url: string;
  tags: string[];
  voteCount: number;
  slug: string;
};

type Props = {
  allProducts: Product[]; // initial 6 from server
  trendingProducts: Product[]; // fixed 6
  recentProducts: Product[]; // fixed 6
  fetchAllPage: (offset: number, limit: number) => Promise<Product[]>;
  pageSize?: number;
};

const ProductExplorer = ({
  allProducts,
  trendingProducts,
  recentProducts,
  fetchAllPage,
  pageSize = 6,
}: Props) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [search, setSearch] = useState("");
  const [activeView, setActiveView] = useState<"all" | "trending" | "recent">(
    "all"
  );

  const [loadedAll, setLoadedAll] = useState<Product[]>(() =>
    allProducts.slice(0, pageSize)
  );

  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreAll, setHasMoreAll] = useState(allProducts.length === pageSize);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const inflightRef = useRef(false);

  // reset when switching tabs
  useEffect(() => {
    switch (activeView) {
      case "trending":
        break;
      case "recent":
        break;
      default:
        setLoadedAll(allProducts.slice(0, pageSize));
        setHasMoreAll(allProducts.length === pageSize);
    }
    inflightRef.current = false;
  }, [activeView, allProducts, pageSize]);

  useEffect(() => {
    if (activeView === "all") {
      setLoadedAll((prev) => prev.slice(0, pageSize));
    }
  }, [search, pageSize, activeView]);

  const baseProducts = useMemo(() => {
    if (activeView === "trending") return trendingProducts;
    if (activeView === "recent") return recentProducts;
    return loadedAll;
  }, [activeView, trendingProducts, recentProducts, loadedAll]);

  const visibleProducts = useMemo(() => {
    if (!search.trim()) return baseProducts;
    const q = search.toLowerCase();
    return baseProducts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [search, baseProducts]);

  const fetchNextAll = async () => {
    if (isLoading || !hasMoreAll || inflightRef.current) return;
    inflightRef.current = true;
    setIsLoading(true);
    try {
      const offset = loadedAll.length;
      const items = await fetchAllPage(offset, pageSize);

      if (!items || items.length === 0) {
        setHasMoreAll(false);
      } else {
        setLoadedAll((prev) => [...prev, ...items]);
        if (items.length < pageSize) setHasMoreAll(false);
      }
    } catch (err) {
      console.error("fetchNextAll failed:", err);
    } finally {
      inflightRef.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && activeView === "all" && hasMoreAll) {
            fetchNextAll();
          }
        }
      },
      { rootMargin: "300px" }
    );

    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeView, hasMoreAll, loadedAll.length]);

  return (
    <div className="w-full">
      {/* Top controls */}
      <div className="flex items-center gap-3 mb-10 sm:mx-20 mx-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="pl-10 h-10 w-full rounded-full text-base sm:text-sm bg-transparent text-zinc-100 placeholder:text-zinc-600 tracking-tight shadow-[inset_2px_2px_6px_rgba(255,255,255,0.20)] focus:outline-none focus:ring-0 focus-visible:ring-0 border-0"
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveView("trending")}
          className={`h-10 rounded-full border-zinc-800 text-zinc-300 text-xs tracking-tighter shadow-[inset_2px_2px_6px_rgba(255,255,255,0.15)] transition-all duration-700 ease-in-out flex items-center ${
            isSearchFocused
              ? "justify-center px-3 gap-0"
              : "justify-start px-4 gap-1.5"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5 flex-shrink-0" />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-700 ease-in-out ${
              isSearchFocused
                ? "max-w-0 opacity-0"
                : "max-w-[100px] opacity-100"
            }`}
          >
            Trending
          </span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setActiveView("recent")}
          className={`h-10 rounded-full border-zinc-800 text-zinc-300 text-xs tracking-tighter shadow-[inset_2px_2px_6px_rgba(255,255,255,0.15)] transition-all duration-700 ease-in-out flex items-center ${
            isSearchFocused
              ? "justify-center px-3 gap-0"
              : "justify-start px-4 gap-1.5"
          }`}
        >
          <Clock className="h-3.5 w-3.5 flex-shrink-0" />
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-700 ease-in-out sm:inline ${
              isSearchFocused
                ? "max-w-0 opacity-0 ml-0"
                : "max-w-[100px] opacity-100"
            }`}
          >
            Recent
          </span>
        </Button>
      </div>

      {/* Cards */}
      <Suspense fallback={<FeaturedCardSkeleton header={false} />}>
        <ProductCard data={visibleProducts} />
      </Suspense>

      {/* sentinel for loading more */}
      <div ref={sentinelRef} className="" />

      {/* loader  */}
      {activeView === "all" && isLoading && (
        <FeaturedCardSkeleton header={false} />
      )}

      {activeView === "all" && !hasMoreAll && !isLoading && (
        <div className="text-center text-sm text-zinc-500 mt-7">
          No more products
        </div>
      )}
    </div>
  );
};

export default ProductExplorer;
