import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

type PaginationParams = {
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
