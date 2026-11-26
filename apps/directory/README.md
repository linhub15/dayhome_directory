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
- From the repository root, `pnpm dev:directory` starts the local dev server

### Test the public directory snapshot locally

From the repository root, run `pnpm directory data:snapshot` against a populated
local Postgres database, then run `pnpm directory dev:snapshot` and open
`http://localhost:3000/map`. The generator writes a map JSON file and one JSON
file per listing to the gitignored `apps/directory/public_snapshot` directory.

The exporter uses `DATABASE_URL` from the directory app's `.env` by default.
Set `DIRECTORY_SOURCE_DATABASE_URL` to export from a separate database while
Better Auth and claims continue to use `DATABASE_URL`.

Snapshot mode serves the public map and listing details from JSON. The admin
editor, claims, and auth still use their existing database. Regenerate the
snapshot to see listing or vacancy changes on the public map and profiles.
The normal dev and build commands use the existing public data source.

## Production Setup

- Setup the environment variables `.env.example`
- Ensure the postgres server has postgis extension: `CREATE EXTENSION postgis;`

## Deployment

Deploy from local using wrangler, secrets are managed on Cloudflare directly

- `pnpm run build && pnpm run deploy`

Wrangler automatically provisions the `DAYHOME_CACHE` KV namespace on the
first deployment. The public map uses it as a shared 24-hour cache, with KV
reads cached at the edge for 60 seconds. Listing and vacancy mutations
invalidate the cache.

### Services

- https://dash.cloudflare.com
- https://console.neon.tech
- https://console.mapbox.com
- https://us.posthog.com
- https://search.google.com/search-console
- https://console.cloud.google.com
