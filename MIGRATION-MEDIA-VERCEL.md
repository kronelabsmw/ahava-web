# Media & Vercel account migration

Images are stored as compressed **base64 data URIs in Postgres**. **Videos** still use **Vercel Blob**.

## Current status (this machine)

| Step | Status |
|------|--------|
| App code: images upload → base64 in DB; videos → Blob | Done |
| Schema `@db.Text` for image columns | Synced (`prisma db push`) |
| DB JSON backup | Done → `backups/2026-09-16T08-59-28-962Z/db-export.json` |
| Download blob images / inline to DB | **Blocked** — Blob returns **HTTP 403** on file bytes (list works, download fails) |

Until Blob downloads work (or you provide a folder of the original image files), we cannot convert existing product photos to base64.

### Fix Blob 403, then continue

1. In the **Vercel account that owns** store `hjnv8pichjrsmlky`, open Storage → Blob and confirm the store is active (not suspended / unpaid).
2. Refresh `BLOB_READ_WRITE_TOKEN` into `.env.local` (`npx vercel env pull .env.local`).
3. Confirm a product image URL opens in a normal browser tab.
4. Re-run:

```bash
npx tsx scripts/download-blob-images.ts
npm run backup:media
npm run migrate:inline-images
```

**Alternative:** If you still have the original photos on disk, put them in a folder and we can add a script to match filenames → DB rows and inline them without Blob.

## 1. Backup current DB + blob images

```bash
npm run backup:media
```

Creates `backups/<timestamp>/`:
- `db-export.json` — full DB dump (includes password hashes — keep private)
- `images/` — downloaded remote image files
- `manifest.json` — download success/failure log

Also useful when public URLs 403 but the store token works:

```bash
npx tsx scripts/download-blob-images.ts
```

## 2. Convert existing image URLs → base64 in DB

```bash
npx tsx scripts/inline-images-to-db.ts --dry-run
npm run migrate:inline-images
```

Updates `ProductImage`, `Category.image`, `Promotion.image`, `EventPackage.image`, and Settings `heroImages` / `pageImages`.  
Videos stay on Blob.

## 3. Apply schema (if needed)

```bash
npx prisma db push
```

## 4. Move to a new Vercel account

1. Import this repo into the new Vercel team/account.
2. Create new **Postgres** → set `DATABASE_URL` + `DIRECT_URL`.
3. Create new **Blob** (videos only) → set `BLOB_READ_WRITE_TOKEN`.
4. Set `AUTH_SECRET`, `AUTH_URL` / `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`, WhatsApp, etc.
5. Against the **new** DB:

```bash
npx prisma db push
npm run restore:db -- backups/<timestamp>/db-export.json
```

Prefer restoring a backup taken **after** `migrate:inline-images` so images are already base64.

6. Deploy and verify image upload (no Blob) and video upload (Blob).

## Notes

- New image uploads are compressed with Sharp (~1600px max edge) before storage.
- Social OG tags cannot use data URIs; share cards fall back to `/images/bg-image.jpeg`.
- `backups/` is gitignored.
