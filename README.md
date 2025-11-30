# Discover Care

Production - https://discovercare.ca

1. helping parents find childcare providers faster
2. helping childcare providers promote their vacancies and provide them an online presence

## Developer Onboarding

This is a React application built with the [Tanstack Start](https://tanstack.com/start/latest/docs/framework/react/overview).
Uses Tailwind CSS for styling, and PostgreSQL as database.

### Install dependencies
- Node.js v24.20.0+ (Tip: use `nvm` or `fnm` to manage your node version)
- pnpm v10.18.0+ (Tip: use `brew` or `winget` instead of installing it with npm)
- docker

### Setup developer environment

- `pnpm install`
- `cp .env.example .env` fill your secrets in `.env`
- `pnpm db:up` starts the docker postgresql on port `5432`. If you have postgres running on `:5432` you will get auth errors
- `pnpm drizzle push` applies the database schema
- `pnpm db:seed` deletes all data and seeds with new random data
- `pnpm dev` start the local dev server

## Production Setup

- Setup the environment variables `.env.example`
- Ensure the postgres server has postgis extension: `CREATE EXTENSION postgis;`

### Services

- https://dash.cloudflare.com
- https://console.neon.tech
- https://console.mapbox.com
- https://us.posthog.com
- https://search.google.com/search-console
- https://console.cloud.google.com