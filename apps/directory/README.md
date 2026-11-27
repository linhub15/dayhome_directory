# Discover Care

Production - https://discovercare.ca

1. helping parents find childcare providers faster
2. helping childcare providers promote their vacancies and provide them an online presence

## Developer Onboarding

This is a React application built with the [Tanstack Start](https://tanstack.com/start/latest/docs/framework/react/overview).
Uses Tailwind CSS for styling, and PostgreSQL as database.

### Install dependencies

- Node.js v24.20.0+
- pnpm
- docker

### Setup developer environment

- `pnpm install`
- From the repository root, copy `.env.example` to `.env` for database commands,
  and copy `apps/directory/.env.example` to `apps/directory/.env` for the app
- `pnpm db:up` starts the docker postgresql on port `5432`. If you have postgres running on `:5432` you will get auth errors
- `pnpm db:migrate` applies committed database migrations
- `pnpm db:seed` deletes all data and seeds with new random data
- From the repository root, `pnpm directory dev` starts the local dev server

## Production Setup

- Setup the environment variables `.env.example`
- Ensure the postgres server has postgis extension: `CREATE EXTENSION postgis;`

## Deployment

From the repository root, run `pnpm --filter @dayhome/directory run deploy`.
Cloudflare manages the production secrets.

The map loads the committed `public/map.json` asset. Cloudflare serves it directly
and the normal build includes the file. To refresh the snapshot, run
`pnpm directory data:export-map` from the repository root with `DATABASE_URL`
set to the directory catalog to export, then commit the updated file. For local
testing with different listing IDs, generate the map from the same database as
the listing pages.

To publish a vacancy, add the listing ID and the last available date to
`src/features/show_vacancy/vacancies.ts` and deploy. Vacancy badges and the map
filter use those dates directly. Provider accounts support sign-in and viewing
the account profile.

### Remove the retired tables in production

Deploy the updated Worker and verify the map, a listing, and provider sign-in.
Apply the cleanup after the versions that still use the retired tables are out
of the rollback window. The migration deletes historical claim and vacancy rows.

The existing production directory database has no Drizzle migration journal.
Apply migration `0004` on its own to avoid replaying the older shared schema
migrations. From the repository root, set `DATABASE_URL` to the direct connection
URL for the production directory database and run:

```sh
psql "$DATABASE_URL" -X --set=ON_ERROR_STOP=1 --single-transaction \
  --file=packages/db/drizzle/0004_retire_listing_claims_and_vacancies.sql
```

For databases already managed by the shared Drizzle migration chain, apply
the migration with `pnpm db:migrate`.

### Services

- https://dash.cloudflare.com
- https://console.neon.tech
- https://console.mapbox.com
- https://us.posthog.com
- https://search.google.com/search-console
- https://console.cloud.google.com
