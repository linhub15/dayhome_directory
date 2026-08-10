ALTER TYPE "public"."inquiry_status" ADD VALUE 'contacted';--> statement-breakpoint
ALTER TYPE "public"."inquiry_status" ADD VALUE 'follow_up';--> statement-breakpoint
ALTER TYPE "public"."inquiry_status" ADD VALUE 'registered';--> statement-breakpoint
ALTER TYPE "public"."inquiry_status" ADD VALUE 'closed';--> statement-breakpoint
CREATE TABLE "inquiry_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"inquiry_id" uuid NOT NULL,
	"from_status" "inquiry_status",
	"to_status" "inquiry_status" NOT NULL,
	"changed_by_user_id" text,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "inquiry" ADD COLUMN "status_changed_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "inquiry_status_history" ADD CONSTRAINT "inquiry_status_history_inquiry_id_inquiry_id_fk" FOREIGN KEY ("inquiry_id") REFERENCES "public"."inquiry"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "inquiry_status_history" ADD CONSTRAINT "inquiry_status_history_changed_by_user_id_user_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "inquiry_status_history_inquiry_changed_at_idx" ON "inquiry_status_history" USING btree ("inquiry_id","changed_at");
--> statement-breakpoint
INSERT INTO "inquiry_status_history" (
	"inquiry_id",
	"from_status",
	"to_status",
	"changed_by_user_id",
	"changed_at"
)
SELECT
	"id",
	NULL,
	"status",
	NULL,
	"status_changed_at"
FROM "inquiry";
