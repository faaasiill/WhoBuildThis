import {
  getAllProducts,
  getRecentProducts,
  getTrendingProducts,
} from "@/lib/products/product-select";
import ProductExplorer from "./product-explorer";

type Row = any;

const normalizeProduct = (p: Row) => ({
  id: p.id,
  title: p.name,
  description: p.tagline,
  image: p.webImage,
  url: p.webURL ?? `/products/${p.slug}`,
  tags: p.tags ?? [],
  voteCount: p.voteCount ?? 0,
  slug: p.slug,
});

export default async function ProductSection() {
  const pageSize = 6;

  const [products, trending, recent] = await Promise.all([
    getAllProducts({ limit: pageSize, offset: 0 }),
    getTrendingProducts({ limit: pageSize, offset: 0 }),
    getRecentProducts({ limit: pageSize, offset: 0 }),
  ]);

  async function fetchAllPage(offset: number, limit: number) {
    "use server";
    const rows = await getAllProducts({ limit, offset });
    return rows.map((p: Row) => ({
      id: p.id,
      title: p.name,
      description: p.tagline,
      image: p.webImage,
      url: p.webURL ?? `/products/${p.slug}`,
      tags: p.tags ?? [],
      voteCount: p.voteCount ?? 0,
      slug: p.slug,
    }));
  }

  return (
    <div className="mt-8 flex justify-center">
      <ProductExplorer
        allProducts={products.map(normalizeProduct)}
        trendingProducts={trending.map(normalizeProduct)}
        recentProducts={recent.map(normalizeProduct)}
        fetchAllPage={fetchAllPage}
        pageSize={pageSize}
      />
    </div>
  );
}
