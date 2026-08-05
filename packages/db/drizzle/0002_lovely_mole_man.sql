CREATE TYPE "public"."expected_start" AS ENUM('as_soon_as_possible', 'within_a_month', 'specific_date');--> statement-breakpoint
CREATE TABLE "inquiry_child" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inquiry_id" uuid NOT NULL,
	"care_type" "care_type" NOT NULL,
	"birth_date" date NOT NULL,
	"expected_start" "expected_start" DEFAULT 'as_soon_as_possible' NOT NULL,
	"expected_start_date" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inquiry_child" ADD CONSTRAINT "inquiry_child_inquiry_id_inquiry_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."inquiry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inquiry_child_inquiry_id_idx" ON "inquiry_child" USING btree ("inquiry_id");--> statement-breakpoint
INSERT INTO "inquiry_child" (
	"inquiry_id",
	"care_type",
	"birth_date",
	"expected_start",
	"expected_start_date",
	"created_at",
	"updated_at"
)
SELECT
	"id",
	"care_type",
	"child_birth_date",
	CASE
		WHEN "preferred_start_date" IS NULL THEN 'as_soon_as_possible'::"expected_start"
		ELSE 'specific_date'::"expected_start"
	END,
	"preferred_start_date",
	"created_at",
	"updated_at"
FROM "inquiry";--> statement-breakpoint
ALTER TABLE "inquiry" DROP COLUMN "care_type";--> statement-breakpoint
ALTER TABLE "inquiry" DROP COLUMN "child_birth_date";--> statement-breakpoint
ALTER TABLE "inquiry" DROP COLUMN "preferred_start_date";
