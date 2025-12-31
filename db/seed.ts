import "dotenv/config";

import { db } from "./index";
import { products } from "./schema";
import { allProducts } from "./data";

async function seed() {
  console.log("🌱 Seeding database...");

//   await db.delete(products);
  await db.insert(products).values(allProducts);

  console.log("✅ Seeding completed");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
