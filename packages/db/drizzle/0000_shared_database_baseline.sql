CREATE EXTENSION IF NOT EXISTS postgis;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."age_group" AS ENUM('infant', 'toddler', 'preschool', 'kindergarten', 'grade_school');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."care_type" AS ENUM('full_time', 'part_time', 'drop_in');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."inquiry_status" AS ENUM('new');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."tenant_role" AS ENUM('owner', 'admin', 'member');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token"),
	CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenant" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tenant_slug_unique" ON "tenant" USING btree ("slug");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenant_profile" (
	"tenant_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"notification_email" text NOT NULL,
	"is_inquiry_form_enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tenant_profile_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tenant_membership" (
	"tenant_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"role" "tenant_role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "tenant_membership_tenant_id_user_id_pk" PRIMARY KEY("tenant_id", "user_id"),
	CONSTRAINT "tenant_membership_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE cascade,
	CONSTRAINT "tenant_membership_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "license" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"postal_code" text NOT NULL,
	"phone_number" text,
	"type" text NOT NULL,
	"has_day_care" boolean DEFAULT false NOT NULL,
	"has_out_of_school_care" boolean DEFAULT false NOT NULL,
	"has_preschool" boolean DEFAULT false NOT NULL,
	"capacity" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dayhome" (
	"id" text PRIMARY KEY NOT NULL,
	"tenant_id" uuid,
	"name" text NOT NULL,
	"address" text NOT NULL,
	"location" geometry(point) NOT NULL,
	"phone" text,
	"email" text,
	"is_licensed" boolean DEFAULT false NOT NULL,
	"license_id" text,
	"agency_name" text,
	"age_groups" "age_group"[],
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "dayhome_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE set null,
	CONSTRAINT "dayhome_license_id_license_id_fk" FOREIGN KEY ("license_id") REFERENCES "public"."license"("id") ON UPDATE cascade
);
--> statement-breakpoint
ALTER TABLE "dayhome" ADD COLUMN IF NOT EXISTS "tenant_id" uuid;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "dayhome" ADD CONSTRAINT "dayhome_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE set null;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dayhome_open_hours" (
	"dayhome_id" text NOT NULL,
	"weekday" smallint NOT NULL,
	"open_at" time NOT NULL,
	"close_at" time NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "dayhome_open_hours_dayhome_id_weekday_pk" PRIMARY KEY("dayhome_id", "weekday"),
	CONSTRAINT "dayome_weekday_unique" UNIQUE("dayhome_id", "weekday"),
	CONSTRAINT "weekday_check" CHECK ("weekday" BETWEEN 1 AND 7),
	CONSTRAINT "dayhome_open_hours_dayhome_id_dayhome_id_fk" FOREIGN KEY ("dayhome_id") REFERENCES "public"."dayhome"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "dayhome_vacancy" (
	"dayhome_id" text NOT NULL,
	"start_on" date DEFAULT now() NOT NULL,
	"end_on" date NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "dayhome_vacancy_dayhome_id_start_on_pk" PRIMARY KEY("dayhome_id", "start_on"),
	CONSTRAINT "dayhome_vacancy_dayhome_id_dayhome_id_fk" FOREIGN KEY ("dayhome_id") REFERENCES "public"."dayhome"("id") ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "geocode_cache" (
	"query" text PRIMARY KEY NOT NULL,
	"geometry" geometry(point) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "listing_claim" (
	"dayhome_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"deleted_at" timestamp,
	CONSTRAINT "listing_claim_dayhome_id_dayhome_id_fk" FOREIGN KEY ("dayhome_id") REFERENCES "public"."dayhome"("id"),
	CONSTRAINT "listing_claim_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "inquiry" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tenant_id" uuid NOT NULL,
	"status" "inquiry_status" DEFAULT 'new' NOT NULL,
	"parent_first_name" text NOT NULL,
	"parent_last_name" text NOT NULL,
	"parent_email" text NOT NULL,
	"care_type" "care_type" NOT NULL,
	"child_birth_date" date NOT NULL,
	"preferred_start_date" date,
	"parent_confirmation_sent_at" timestamp with time zone,
	"provider_notification_sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "inquiry_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE cascade
);
--> statement-breakpoint
DO $$ BEGIN
 IF to_regclass('public.agency_tenant') IS NOT NULL THEN
  EXECUTE 'INSERT INTO tenant (id, slug, created_at, updated_at)
    SELECT id, slug, created_at, updated_at FROM agency_tenant
    ON CONFLICT (id) DO NOTHING';
  EXECUTE 'INSERT INTO tenant_profile (tenant_id, name, notification_email, is_inquiry_form_enabled, created_at, updated_at)
    SELECT id, name, notification_email, is_inquiry_form_enabled, created_at, updated_at FROM agency_tenant
    ON CONFLICT (tenant_id) DO NOTHING';
 END IF;
END $$;
--> statement-breakpoint
ALTER TABLE "inquiry" DROP CONSTRAINT IF EXISTS "inquiry_tenant_id_agency_tenant_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "inquiry" ADD CONSTRAINT "inquiry_tenant_id_tenant_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenant"("id") ON DELETE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inquiry_tenant_created_at_idx" ON "inquiry" USING btree ("tenant_id", "created_at");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "inquiry_tenant_status_idx" ON "inquiry" USING btree ("tenant_id", "status");
