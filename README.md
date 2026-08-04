# Dayhome products

This pnpm monorepo contains products serving Alberta dayhome families and agencies.

## Apps

- [`@dayhome/directory`](./apps/directory) — the public dayhome discovery product
- [`@dayhome/agency`](./apps/agency) — the agency inquiry pipeline

## Shared packages

- [`@dayhome/core`](./packages/core) — framework-independent business schemas, types, and logic
- [`@dayhome/db`](./packages/db) — canonical Drizzle schema, database client, and migrations
- [`@dayhome/auth`](./packages/auth) — shared Better Auth server and client factories
- [`@dayhome/ui`](./packages/ui) — reusable React components and styling utilities

Apps should import public package exports (for example,
`@dayhome/core/inquiry` and `@dayhome/db/schema`) rather than reaching into
another app. Runtime environment access and route middleware remain owned by
the app that runs them.

## Development

Install all workspace dependencies:

```sh
pnpm install
```

Run the public directory on port 3000:

```sh
pnpm dev:directory
```

The previous `pnpm dev`, `pnpm tsc`, and `pnpm check` commands remain available as
compatibility aliases for the directory app and repository checks.

Run the agency app on port 3001:

```sh
pnpm dev:agency
```

Build or check every workspace package with `pnpm build` and `pnpm check`.

For the existing Cloudflare directory deployment, use `apps/directory` as the
application root. Its production build can also be run from the repository root
with `pnpm build:directory`.

## Database

Copy the root `.env.example` to `.env`, then run all schema and migration
commands from the repository root:

```sh
pnpm db:up
pnpm db:status
pnpm db:generate
pnpm db:migrate
pnpm db:push
pnpm db:studio
pnpm db:down
```

These commands target `@dayhome/db`. `pnpm db:seed` remains a directory data
command, but it uses the shared schema.

Use `db:generate` and commit the generated migration for production changes.
`db:push` is intended for local prototyping.
