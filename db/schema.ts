import {
  pgTable,
  uuid,
  text,
  varchar,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // core product info
    name: varchar("name", { length: 120 }).notNull(),
    slug: varchar("slug", { length: 140 }).notNull(),
    tagline: varchar("tagline", { length: 200 }).notNull(),
    description: text("description").notNull(),

    // link and media
    webURL: varchar("web_url", { length: 2048 }).notNull(),
    webImage: varchar("web_image", { length: 2048 }).notNull(),

    // PostgreSQL array
    tags: text("tags").array().notNull().default([]),

    // voting
    voteCount: integer("vote_count").notNull().default(0),

    // moderation metadata
    status: varchar("status", { length: 16 })
      .notNull()
      .default("pending"),

    submittedBy: varchar("submitted_by", { length: 120 }).notNull(),

    // clerk userId
    userId: varchar("user_id", { length: 255 }).notNull(),

    // clerk orgId (optional)
    organizationId: varchar("organization_id", { length: 255 }),

    // timestamps
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    approvedAt: timestamp("approved_at", { withTimezone: true }),
  },
  (table) => ({
    slugUniqueIdx: uniqueIndex("products_slug_unique").on(table.slug),
    statusIdx: index("products_status_idx").on(table.status),
    userIdx: index("products_user_idx").on(table.userId),
    trendingIdx: index("products_trending_idx").on(
      table.voteCount,
      table.createdAt
    ),
  })
);
