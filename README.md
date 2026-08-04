# Dayhome products

This pnpm monorepo contains products serving Alberta dayhome families and agencies.

## Apps

- [`@dayhome/directory`](./apps/directory) — the public dayhome discovery product
- [`@dayhome/agency`](./apps/agency) — the agency inquiry pipeline

## Shared packages

- [`@dayhome/core`](./packages/core) — framework-independent business schemas, types, and logic
- [`@dayhome/auth`](./packages/auth) — shared Better Auth server and client factories
- [`@dayhome/ui`](./packages/ui) — reusable React components and styling utilities

Apps should import public package exports (for example,
`@dayhome/core/inquiry`) rather than reaching into another app. Database schemas,
environment access, and route middleware remain owned by the app that runs them.

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

The existing directory database and data commands remain available from the repository root, including `pnpm db:up`, `pnpm drizzle push`, and `pnpm db:seed`.
