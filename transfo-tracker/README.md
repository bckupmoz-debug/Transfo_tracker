This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Keycloak local setup

This project uses Keycloak for OpenID Connect authentication. Add these env vars to your local environment when running the app:

```ini
AUTH_SECRET=your-random-secret
AUTH_KEYCLOAK_ID=evidence-app
AUTH_KEYCLOAK_SECRET=your-keycloak-client-secret
AUTH_KEYCLOAK_ISSUER=http://localhost:8080/realms/transformation
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret
AUTH_URL=http://localhost:3000
AUTH_TRUST_HOST=true
```

Start Keycloak with Docker:

```bash
docker run -d --name keycloak -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak start-dev
```

Or use Docker Compose for a reproducible local service:

```yaml
version: '3.9'
services:
  keycloak:
    image: quay.io/keycloak/keycloak:26.2.5
    command: start-dev
    ports:
      - '8080:8080'
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
```

Then create a realm named `transformation` and a confidential OpenID Connect client named `evidence-app`.

Use these redirect URIs for local development:

- `http://localhost:3000/api/auth/callback/keycloak`
- `http://127.0.0.1:3000/api/auth/callback/keycloak`

If you create a permanent admin user, keep those credentials in secure local docs or a secrets manager rather than source control.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

keycloak admin start
environment:
  KEYCLOAK_ADMIN: admin
  KEYCLOAK_ADMIN_PASSWORD: admin