CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" varchar(140) NOT NULL,
	"tagline" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"web_url" varchar(2048) NOT NULL,
	"web_image" varchar(2048) NOT NULL,
	"tags" text[] DEFAULT '{}' NOT NULL,
	"vote_count" integer DEFAULT 0 NOT NULL,
	"status" varchar(16) DEFAULT 'pending' NOT NULL,
	"submitted_by" varchar(120) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"organization_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"approved_at" timestamp with time zone
);
--> statement-breakpoint
CREATE UNIQUE INDEX "products_slug_unique" ON "products" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "products_status_idx" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX "products_user_idx" ON "products" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "products_trending_idx" ON "products" USING btree ("vote_count","created_at");