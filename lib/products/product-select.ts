import { db } from "@/db";
import { products } from "@/db/schema";
import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";

type PaginationParams = {
  limit?: number;
  offset?: number;
};

export type ProductStatus = "pending" | "approved" | "rejected";

export type AdminProductFilters = {
  status?: ProductStatus;
  search?: string;
  tags?: string[];
  limit?: number;
  offset?: number;
};

export async function getFeturedProducts() {
  "use cache";
  return db
    .select({
      id: products.id,
      name: products.name,
      tagline: products.tagline,
      webURL: products.webURL,
      webImage: products.webImage,
      tags: products.tags,
      vote: products.voteCount,
      slug: products.slug,
    })
    .from(products)
    .where(eq(products.status, "approved"))
    .orderBy(desc(products.voteCount))
    .limit(6);
}

export async function getProductBySlug(slug: string) {
  "use cache";
  const result = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      tagline: products.tagline,
      description: products.description,
      webURL: products.webURL,
      webImage: products.webImage,
      tags: products.tags,
      voteCount: products.voteCount,
      submittedBy: products.submittedBy,
      userId: products.userId,
      organizationId: products.organizationId,
      createdAt: products.createdAt,
    })
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  return result[0] || null;
}

export async function getAllProducts({
  limit = 20,
  offset = 0,
}: PaginationParams) {
  "use cache";

  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      tagline: products.tagline,
      webURL: products.webURL,
      webImage: products.webImage,
      tags: products.tags,
      voteCount: products.voteCount,
      createdAt: products.createdAt,
    })
    .from(products)
    .where(eq(products.status, "approved"))
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getTrendingProducts({
  limit = 10,
  offset = 0,
}: PaginationParams) {
  "use cache";

  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      tagline: products.tagline,
      webURL: products.webURL,
      webImage: products.webImage,
      tags: products.tags,
      voteCount: products.voteCount,
      createdAt: products.createdAt,
    })
    .from(products)
    .where(eq(products.status, "approved"))
    .orderBy(desc(products.voteCount), desc(products.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getRecentProducts({
  limit = 10,
  offset = 0,
}: PaginationParams) {
  "use cache";

  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      tagline: products.tagline,
      webURL: products.webURL,
      webImage: products.webImage,
      tags: products.tags,
      voteCount: products.voteCount,
      createdAt: products.createdAt,
    })
    .from(products)
    .where(eq(products.status, "approved"))
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getAdminStats() {
  "use cache";

  const stats = await db
    .select({
      status: products.status,
      count: count(),
    })
    .from(products)
    .groupBy(products.status);

  const statsMap = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  stats.forEach((stat) => {
    statsMap[stat.status as keyof typeof statsMap] = stat.count;
    statsMap.total += stat.count;
  });

  return statsMap;
}

export async function getAdminProducts({
  status,
  search,
  tags,
  limit = 20,
  offset = 0,
}: AdminProductFilters = {}) {
  "use cache";

  const conditions = [];

  if (status) {
    conditions.push(eq(products.status, status));
  }

  if (search) {
    conditions.push(
      or(
        ilike(products.name, `%${search}%`),
        ilike(products.tagline, `%${search}%`),
        ilike(products.description, `%${search}%`)
      )!
    );
  }

  if (tags && tags.length > 0) {
    conditions.push(
      sql`${products.tags} && ARRAY[${sql.join(
        tags.map((tag) => sql`${tag}`),
        sql`, `
      )}]::text[]`
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      tagline: products.tagline,
      description: products.description,
      webURL: products.webURL,
      webImage: products.webImage,
      tags: products.tags,
      voteCount: products.voteCount,
      status: products.status,
      submittedBy: products.submittedBy,
      userId: products.userId,
      organizationId: products.organizationId,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
      approvedAt: products.approvedAt,
    })
    .from(products)
    .where(whereClause)
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset(offset);

  return result;
}

export async function getPendingCount() {
  "use cache";

  const result = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.status, "pending"));

  return result[0]?.count || 0;
}

export async function getAllTags() {
  "use cache";

  const result = await db.select({ tags: products.tags }).from(products);

  const tagSet = new Set<string>();
  result.forEach((row) => {
    row.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}