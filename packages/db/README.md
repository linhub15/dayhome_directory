# Shared database

This package is the single source of truth for the PostgreSQL schema used by
the directory and agency apps.

- `src/schema/auth.ts` contains Better Auth tables.
- `src/schema/tenancy.ts` contains tenants, profiles, and memberships.
- `src/schema/directory.ts` contains childcare locations and directory data.
- `src/schema/inquiries.ts` contains tenant-scoped inquiry data.
- `drizzle/` contains the only migration history for the shared database.

Run database commands from the repository root. Application code should import
tables from `@dayhome/db/schema` and create a runtime-specific connection with
`@dayhome/db/client`.
