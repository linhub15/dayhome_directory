# Conventions

## Type safety

- Avoid TypeScript type casts and assertions. Do not use `as` to force a value into an expected type.
- Use end-to-end typed interfaces, such as TanStack Start server functions, for internal API calls.
- Validate untyped boundaries, including cached data and JSON responses, with a runtime schema and infer the TypeScript type from that schema.
- Fix or narrow the source type when TypeScript cannot prove a value's shape. Use `satisfies` when a compile-time compatibility check is needed without changing the inferred type.
