CREATE TYPE "public"."tenant_type" AS ENUM('agency');--> statement-breakpoint
ALTER TABLE "tenant" ADD COLUMN "type" "tenant_type" DEFAULT 'agency' NOT NULL;