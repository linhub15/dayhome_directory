# Discover Care Repository

This is a React application built with the Tanstack Start framework.

## Developer Onboarding

### Install dependencies
- Node.js v22.20.0+
- pnpm v10.18.0+
- docker

### Setup local development environment

- `pnpm install`
- `cp .env.example .env`
- `pnpm deps:up && pnpm drizzle push`


## 3rd Party Services

- https://dash.cloudflare.com
- https://console.neon.tech
- https://console.mapbox.com
- https://us.posthog.com

## Production Setup

- Setup the environment variables
- Install postgis: `CREATE EXTENSION postgis;`