# Agency app

The agency app owns its inquiry feature, while its tables and authentication
are shared with the directory through `@dayhome/db` and `@dayhome/auth`.

## Local setup

1. Copy `.env.example` to `.env` and configure PostgreSQL and SMTP.
2. Apply migrations with `pnpm db:migrate` from the repository root.
3. Create a tenant and its profile:

   ```sql
   WITH new_tenant AS (
     INSERT INTO tenant (slug)
     VALUES ('little-sprouts')
     RETURNING id
   )
   INSERT INTO tenant_profile (tenant_id, name, notification_email)
   SELECT id, 'Little Sprouts Childcare', 'provider@example.com'
   FROM new_tenant;
   ```

4. Set `AGENCY_TENANT_SLUG` to that tenant slug and run `pnpm dev`.

## Email previews

Run `pnpm email:dev` from this directory, then open
`http://localhost:3002`. The preview app includes editable sample props for the
parent confirmation and provider notification emails.

The hosted embeddable form is available at `/inquiry/:tenantSlug`. Sites can
embed it with an iframe:

```html
<iframe
  src="https://agency.example.com/inquiry/little-sprouts"
  title="Childcare inquiry"
  width="100%"
  height="760"
  style="border: 0"
></iframe>
```

`tenant_id` is written to every inquiry and used in every provider-side query.
The public endpoint resolves the tenant from the URL slug rather than accepting
a tenant ID from submitted form data.

In production, both apps must use the same `BETTER_AUTH_SECRET`, exact sibling
origins in `BETTER_AUTH_TRUSTED_ORIGINS`, and the shared parent domain in
`BETTER_AUTH_COOKIE_DOMAIN`.
