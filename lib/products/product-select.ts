import { db } from "@/db";
import { products } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getFeturedProducts() {
    "use cache"
  return db
    .select({
      id: products.id,
      name: products.name,
      tagline: products.tagline,
      webURL: products.webURL,
      webImage: products.webImage,
      tags: products.tags,
    })
    .from(products)
    .where(eq(products.status, "approved"))
    .orderBy(desc(products.voteCount))
    .limit(6);
}
