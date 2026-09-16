# AHAVAH BRIDAL EMPORIUM

Mobile-first wedding platform for bridal dress hire, custom orders, fittings, and event planning.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + custom bridal brand theme
- Prisma 6 + PostgreSQL
- NextAuth v5 (admin-only)
- Zustand inquiry cart
- WhatsApp-first commerce (no payment gateway)

## Getting Started

1. Link to Vercel and pull environment variables:

```bash
npx vercel link
npx vercel env pull .env.local --environment=production
```

Then append local overrides to `.env.local` (or copy from `.env.example`):

- `AUTH_URL` / `NEXTAUTH_URL` → `http://localhost:3000`
- `NEXT_PUBLIC_APP_URL` → `http://localhost:3000`
- `AUTH_SECRET` / `NEXTAUTH_SECRET` → generate with `openssl rand -base64 32`

Alternatively, copy `.env.example` to `.env` for a fully local setup without Vercel.

2. Install dependencies and set up the database:

```bash
npm install
npx prisma db push
npm run db:seed
```

3. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the storefront and [http://localhost:3000/admin](http://localhost:3000/admin) for the admin dashboard.

## Admin Login (after seeding)

- **Super Admin:** `super@ahava.com` / `ahava2024!`
- **Staff Admin:** `staff@ahava.com` / `ahava2024!`

Change passwords before production deployment.

## Storefront Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, featured dresses, categories |
| `/shop` | Dress catalog with filters |
| `/products/[slug]` | Product detail + inquiry cart |
| `/categories` | Parent category grid |
| `/hire-process` | Dress hire policies |
| `/fittings` | Fitting appointment info |
| `/custom-orders` | Custom dress process |
| `/events` | Event planning services |
| `/events/packages` | Event package listings |
| `/contact` | Contact information |

## Deployment

Deploy to Vercel with PostgreSQL and set environment variables from `.env.example`. Add your logo to `public/logo/ahava_logo.png` (or update `LOGO_PATH` in `lib/constants.ts`).
