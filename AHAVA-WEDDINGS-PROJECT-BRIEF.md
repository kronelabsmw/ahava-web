# AHAVAH Weddings - Project Brief & Build Specification

Use this document as the single source of truth when creating the **AHAVAH BRIDAL EMPORIUM** website. It is designed to replicate the architecture, UX patterns, and admin capabilities of the **Aura Shop** (`aurashop`) codebase while extending it for bridal dress hire, fittings, custom orders, and event planning services.

---

## 1. Project Goal

Build a **mobile-first, PWA-ready** wedding platform for AHAVA with two major customer-facing sections:

1. **Bridal Emporium** - wedding dress inventory, hire process, fittings, and custom dress orders
2. **Event Planning** - wedding and event coordination services, packages, and portfolio

The platform should feel as polished on mobile as on desktop, with WhatsApp as the primary conversion channel (inquiries, bookings, orders) - matching the Aura Shop model.

---

## 2. Reference Architecture (Aura Shop Template)

Fork or recreate the following stack and patterns from `aurashop`:

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 15 App Router, React 19, TypeScript | Turbopack for dev/build |
| Database | PostgreSQL + Prisma 6 | `schema.prisma` + seed script |
| Auth | NextAuth v5, JWT, Credentials | Admin-only (no customer accounts) |
| Styling | Tailwind CSS v4, Shadcn UI | Custom brand colors in `globals.css` |
| Fonts | Outfit (body) + Cormorant Garamond (headings) | Or swap to bridal-appropriate pair |
| State | Zustand + localStorage persist | Inquiry/reservation cart |
| Forms | React Hook Form + Zod | Contact, admin CRUD |
| Images | Vercel Blob + Sharp (HEIC conversion) | Gown photos from iPhone cameras |
| Deployment | Vercel + Postgres + Blob | Same env var pattern as Aura Shop |

### Architecture pattern to preserve

```
app/(store)/     → Public storefront pages
app/admin/       → Protected admin dashboard
services/        → Read layer (DB queries)
actions/admin/   → Server Actions (mutations)
components/store → Storefront UI (mobile nav, header, cards)
components/admin → Admin UI (sidebar, tables, forms)
lib/constants.ts → Business defaults (fallback when DB settings empty)
prisma/seed.ts   → Initial categories, sample dresses, admin users
```

### Commerce model (keep from Aura Shop)

- **No online payment gateway** - customers browse, add to inquiry cart, and contact via **WhatsApp**
- Admin manually tracks inquiries, bookings, deposits, and revenue in the dashboard
- Product variants map to **dress size** and **color**
- Inventory logs track stock, external sales, and dress returns

---

## 3. Business Information

### Identity

| Field | Value |
|-------|-------|
| **Business name** | AHAVAH BRIDAL EMPORIUM |
| **Tagline** | *(Write a 1–2 sentence bridal/events tagline for hero + about page)* |
| **Logo** | Place at `public/logo/ahava_logo.png` |
| **Brand color** | *(Choose - e.g. blush `#C9A89A`, ivory `#F5F0EB`, gold `#B8860B` - update `globals.css` `--primary`)* |
| **Currency** | Malawian Kwacha (MK) |

### About / Description

AHAVAH BRIDAL EMPORIUM is a bridal and events business in Blantyre, Malawi offering:

- Wedding dress hire and sales
- Bridesmaid, reception, and engagement dress collections
- Custom dress design and production
- Fitting and consultation appointments
- Full wedding and event planning coordination

*(Expand with the owner's preferred brand voice for the About page.)*

### Location

| Field | Value |
|-------|-------|
| **Address** | Ufulu Road #2, Blantyre New Naperi |
| **City** | Blantyre, Malawi |

### Contact

| Type | Value |
|------|-------|
| **Phone 1** | +265 98 051 2870 |
| **Phone 2** | +265 99 955 4414 |
| **Phone 3** | +265 99 363 2102 |
| **WhatsApp** | +265 98 051 2870 *(primary - set `NEXT_PUBLIC_WHATSAPP_NUMBER=265980512870`)* |
| **Email 1** | Ahavahbridal@gmail.com |
| **Email 2** | Ahavaheventsmw@gmail.com |

### Social Media

| Platform | URL |
|----------|-----|
| TikTok | https://www.tiktok.com/@ahavahbridal?_r=1&_t=ZS-972cUgzNOYW |
| Instagram (Bridal) | https://www.instagram.com/ahavahbridalmw?igsh=NGUyNXZ0d3BhaDd3 |
| Instagram (Events) | https://www.instagram.com/ahavahevents?igsh=MWk2OGtkMGZybDJwOQ%3D%3D&utm_source=qr |
| X (Twitter) | https://x.com/ahavahbridal?s=21 |

### Operating Hours

| Days | Hours | Notes |
|------|-------|-------|
| Monday – Saturday | 9:00 AM – 3:30 PM | By appointment |

Display on Contact page, footer, and About. Emphasize **appointments required** for fittings and consultations.

---

## 4. Storefront Pages & Mobile UX

Replicate Aura Shop routes and mobile patterns:

### Public routes

| Route | Purpose |
|-------|---------|
| `/` | Hero slideshow, featured dresses, categories, new arrivals, testimonials, WhatsApp CTA |
| `/shop` | Dress catalog - search, filters, sort, pagination |
| `/products/[slug]` | Dress gallery, size/color variants, hire + sale prices, add to inquiry cart, WhatsApp order |
| `/categories` | Dress category grid |
| `/promotions` | Seasonal offers, trunk shows, package deals |
| `/about` | Company story, team, location |
| `/contact` | Address, hours, phones, emails, social links, WhatsApp CTA |
| `/hire-process` | **New** - Dress hire rules, deposits, cancellation, return policy |
| `/fittings` | **New** - Fitting appointment info, fees, booking via WhatsApp |
| `/custom-orders` | **New** - Custom dress process, timeline, quote flow |
| `/events` | **New** - Event planning services overview |
| `/events/packages` | **New** - Event package listings |
| `/events/packages/[slug]` | **New** - Package detail with services included |

### Mobile-first UX (must match Aura Shop)

- **Bottom tab navigation** on screens `< md`: Home, Shop, Deals, Categories, Cart badge
- **Sticky header** with hamburger sheet menu on mobile
- **Cart sheet** - slide-over inquiry cart from right
- **Safe-area insets** on bottom nav (`pb-[env(safe-area-inset-bottom)]`)
- **Main content padding** `pb-20 md:pb-0` to clear bottom nav
- **Responsive product grid** - 2 columns mobile, 3–4 desktop
- **Dark/light theme toggle**
- **PWA manifest** - app name "AHAVAH Bridal", theme color = brand primary
- **Hydration-safe cart counts** via `useMounted()` hook

### WhatsApp integration

Pre-filled messages for:

- Single dress inquiry (name, size, color, rental/sale price, product URL)
- Multi-item cart inquiry (line items + estimated total)
- Fitting appointment request (name, phone, preferred date/time, dress interest)
- Custom order quote request (inspiration photos description, event date)
- Event package inquiry (package name, guest count, event date, location)

Use `lib/whatsapp.ts` pattern from Aura Shop with `NEXT_PUBLIC_WHATSAPP_NUMBER=265980512870`.

---

## 5. Wedding Dress Inventory

Each dress in the catalog should support:

| Field | Maps to (Aura Shop) | Notes |
|-------|---------------------|-------|
| Dress name | `Product.name` | e.g. "Elegant Lace A-Line Gown" |
| Category | `Category` (parent + child via `parentId`) | See **Dress Category Hierarchy** below - 3 top-level groups, 9 subcategories |
| Description | `Product.description` | Fabric, silhouette, embellishments |
| Rental price | `Product.price` | Primary hire fee |
| Sale price | `Product.discountPrice` or new `salePrice` field | If dress is also for sale |
| Available sizes | `ProductVariant.size` | UK sizes (see customer requirements) |
| Available colors | `ProductVariant.color` | Ivory, champagne, blush, etc. |
| Dress condition | `Product.tags` or new field | New, Excellent, Good |
| Quantity available | `Product.stock` + variant stock | Total units |
| Photos | `ProductImage[]` | High-quality, multiple angles |
| Deposit requirements | Display on product page + hire-process page | 40–50% + MK 50,000 security |
| Special notes | `Product.description` footer or `tags` | Alteration needs, pickup windows |

### Dress Category Hierarchy (required)

AHAVA organizes all gowns using this **three-level structure**. Use Aura Shop's existing `Category.parentId` field for parent → child relationships. Every dress (`Product`) must belong to exactly **one subcategory** (the leaf node).

```
1. Previous Custom Orders          ← portfolio of past custom work (not in-stock hire)
   ├── 1A. Ballgowns
   └── 1B. Fitted Gowns

2. Dresses in Stock                ← available hire/sale inventory
   ├── 2A. Satin Ballgowns
   ├── 2B. Lace Beaded Ballgowns
   ├── 2C. Satin Fitted
   ├── 2D. Beaded Fitted
   └── 2E. A-Line Gowns

3. Inspo Custom Orders             ← inspiration for future custom orders
   ├── 3A. Already Made Gowns
   └── 3B. Recommendations
```

#### What each top-level group means

| # | Category | Purpose on site | Typical listing |
|---|----------|-----------------|-----------------|
| **1** | Previous Custom Orders | Showcase past custom-made gowns AHAVA has produced | Portfolio / gallery - inquiry via WhatsApp, not direct hire |
| **2** | Dresses in Stock | Gowns currently available to hire or purchase | Full product detail: rental price, sizes, booking |
| **3** | Inspo Custom Orders | Inspiration images for clients considering a custom order | Gallery + "Request similar design" WhatsApp CTA |

#### Seed slugs (use in `prisma/seed.ts`)

| Parent slug | Subcategory slug | Display name |
|-------------|------------------|--------------|
| `previous-custom-orders` | `previous-ballgowns` | Ballgowns |
| `previous-custom-orders` | `previous-fitted-gowns` | Fitted Gowns |
| `dresses-in-stock` | `satin-ballgowns` | Satin Ballgowns |
| `dresses-in-stock` | `lace-beaded-ballgowns` | Lace Beaded Ballgowns |
| `dresses-in-stock` | `satin-fitted` | Satin Fitted |
| `dresses-in-stock` | `beaded-fitted` | Beaded Fitted |
| `dresses-in-stock` | `a-line-gowns` | A-Line Gowns |
| `inspo-custom-orders` | `already-made-gowns` | Already Made Gowns |
| `inspo-custom-orders` | `recommendations` | Recommendations |

#### Storefront category UX

- **`/categories`** - show 3 parent cards (Previous Custom Orders, Dresses in Stock, Inspo Custom Orders)
- **`/categories/[parentSlug]`** - show subcategory grid for that group
- **`/shop?category=satin-ballgowns`** - filter dresses by subcategory slug
- **Homepage** - featured section can highlight "Dresses in Stock" separately from portfolio/inspo galleries
- **Product badges** - show parent group on product cards (e.g. "In Stock" vs "Previous Custom" vs "Inspo")

#### Admin

- Category form: allow assigning `parentId` when creating subcategories
- Product form: category picker grouped by parent (1 → 1A/1B, 2 → 2A–2E, 3 → 3A/3B)
- Only **Dresses in Stock** subcategories require rental price, stock count, and booking availability

### Shop filters (extend Aura Shop)

- **Parent category** (1, 2, or 3)
- **Subcategory** (1A–3B)
- Dress type (hire / sale / both) - applies mainly to group 2
- Price range (rental)
- Size (UK)
- Color
- Availability (in stock) - group 2 only
- Condition
- Sort: newest, popular, price low–high, price high–low

---

## 6. Dress Hire Process & Policies

Display prominently on `/hire-process` and on each product detail page.

### Current hire process

1. Identify the dress you want and check if alterations or size adjustments are needed
2. Pay a deposit of **40–50%** of the total amount to secure your booking

### Reservation rules

- Dress choice is **final** once booked - selections cannot be changed
- Communicate all event details and specific requirements clearly at reservation time

### Deposit requirements

| Deposit | Amount |
|---------|--------|
| Booking deposit | 40–50% of total hire fee |
| Security deposit | MK 50,000 (damages/stains - fully refundable if dress returned intact) |

### Payment terms

1. Pay initial 40–50% deposit to secure the dress
2. Pay remaining balance in full when collecting the dress

### Cancellation policy

- Bookings are **non-cancellable and non-refundable**
- Any payments made prior to cancellation will **not** be refunded

### Return policy

| Wedding location | Return window |
|------------------|---------------|
| Within Blantyre | Within **4 days** after wedding |
| Outside Blantyre | Within **6 days** after wedding |

### Late return penalties

- **MK 20,000 per day** after the agreed return deadline until the dress is returned

### Security deposit

- MK 50,000 held for damages or irremovable stains
- Fully refundable upon return in original, intact condition

### Dress fitting requirements

- Fittings must be booked **at least 24 hours in advance**
- Specific date and time required for each fitting session

---

## 7. Dress Availability Management

### Booking rules

| Rule | Value |
|------|-------|
| Bookings per dress per weekend | **1** (one booking per dress per weekend) |
| Pickup - Blantyre weddings | **4 days** before wedding date |
| Pickup - outside Blantyre | **6 days** before wedding date |
| Return - Blantyre | Within 4 days after wedding |
| Return - outside Blantyre | Within 6 days after wedding |

### Pickup process

1. Customer fills pickup form
2. Pay final balance
3. Collect dress within pickup window

### Return process

1. Customer fills return form
2. Staff inspects dress and all accessories
3. Security deposit refunded if condition is acceptable

### Admin tracking (extend Aura Shop Inquiry model)

Track per booking:

- Customer name, phone, email
- Wedding date and event location (Blantyre / outside)
- Dress + variant (size, color)
- Booking deposit paid (amount, date)
- Security deposit paid (MK 50,000)
- Pickup date (calculated from wedding date)
- Return deadline (calculated from wedding date + location)
- Status: `PENDING` → `CONFIRMED` → `PICKED_UP` → `RETURNED` → `COMPLETED` / `OVERDUE` / `CANCELLED`
- Late fee accrual (MK 20,000/day)
- Notes (alterations, special requirements)

---

## 8. Fitting & Consultation Appointments

### Availability

| Field | Value |
|-------|-------|
| Days | Monday – Saturday |
| Hours | 9:00 AM – 3:30 PM |
| Max clients per appointment | **4** |
| Max duration | **2 hours** |

### Consultation process

Browse the store, find preferred dress styles, and try them on during the appointment.

### Booking requirements

- Fitting fee required *(amount TBD - add to constants/settings)*
- Book via WhatsApp or contact form with: full name, phone, email, preferred date/time, number of guests (max 4)

### Policies

| Policy | Detail |
|--------|--------|
| Rescheduling | MK 5,000 fee |
| Cancellation | No refund |

### Suggested page content (`/fittings`)

- Step-by-step: how to book → what to bring → what happens during fitting
- WhatsApp CTA: "Book a Fitting"
- Operating hours and capacity limits

---

## 9. Custom Dress Orders

### Process (display on `/custom-orders`)

| Step | Description |
|------|-------------|
| 1. Send inspiration for quote | Share dress inspiration photos so AHAVA understands your vision |
| 2. Receive quote & make payment | Place order **2–3 months in advance** |
| 3. Discuss design details | Detailed quote sent; payment secures custom pattern |
| 4. Pattern confirmation | Design sent to designer; sketch shared for approval if needed |
| 5. Dress making commences | Production begins after approval |
| 6. Progress updates | Photos shared at different stages for approval |
| 7. Final approval before shipping | Final photos/videos sent before delivery |

### Additional fields to collect (WhatsApp / inquiry form)

- Required measurements *(depends on dress design)*
- Event/wedding date
- Design consultation preferences
- Typical production timeline *(admin-defined per order)*
- Pricing structure *(quote-based)*
- Deposit requirements *(TBD per order)*
- Payment milestones
- Alteration policies
- Delivery process

### Admin: custom order tracking

Extend inquiries or add `CustomOrder` model with status pipeline:

`INQUIRY` → `QUOTED` → `DEPOSIT_PAID` → `DESIGN_APPROVED` → `IN_PRODUCTION` → `FINAL_APPROVAL` → `SHIPPED` → `DELIVERED`

---

## 10. Event Planning Services

### Services offered (list on `/events`)

- Wedding planning
- Event coordination
- Venue sourcing
- Decoration services
- Catering coordination
- Photography coordination
- Videography coordination
- Makeup artist coordination
- Bridal team management
- Transportation coordination
- Master of Ceremony coordination
- Entertainment coordination

### Event packages

Each package should have:

| Field | Description |
|-------|-------------|
| Package name | e.g. "Gold Wedding Package" |
| Description | What's included, ideal client profile |
| Price | Base package price (MK) |
| Services included | Checklist of coordinated services |
| Guest count covered | e.g. "Up to 150 guests" |
| Additional charges | Overage fees, optional add-ons |

**Implementation:** Add `EventPackage` model (or reuse `Promotion` with a `type` field). Admin CRUD at `/admin/event-packages`.

### Event contact

Route event inquiries to **Ahavaheventsmw@gmail.com** and WhatsApp, with pre-filled message template distinct from bridal dress inquiries.

---

## 11. Customer Information Requirements

Collect on inquiry, booking, pickup, and return forms:

| Field | Required |
|-------|----------|
| Full name | Yes |
| Phone number | Yes |
| Email address | Yes |
| Wedding date | Yes (dress hire) |
| Event date | Yes (event packages) |
| Event location | Yes (determines pickup/return windows) |
| UK size | Yes (dress hire) |
| Special requirements | Optional |

Pre-fill WhatsApp messages with these fields where possible.

---

## 12. Photos & Marketing Materials

### Homepage & marketing sections

- Professional dress photos (admin upload via product images)
- Event portfolio gallery *(new: `PortfolioImage` model or static section)*
- Promotional banners (reuse `Promotion` model)
- Testimonials from previous clients *(hardcoded initially like Aura Shop `testimonials.tsx`, later CMS)*
- Customer reviews

### Hero section

- Slideshow of bridal lookbook images (manageable in Admin → Settings, same as Aura Shop hero backgrounds)
- CTA: "Browse Dresses" + "Book a Fitting"

---

## 13. Admin Dashboard

Replicate Aura Shop admin with bridal extensions:

### Roles

| Role | Access |
|------|--------|
| SUPER_ADMIN | Full access including settings, categories, packages |
| STAFF_ADMIN | Products, inquiries, bookings, inventory |

### Routes

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard: revenue, bookings, overdue returns, upcoming pickups |
| `/admin/products` | Dress CRUD, images, variants, hire/sale prices |
| `/admin/inquiries` | Dress inquiries + booking status |
| `/admin/bookings` | **New** - Hire calendar, pickup/return dates, deposits |
| `/admin/inventory` | Stock adjustments, external sales log |
| `/admin/categories` | Dress categories |
| `/admin/brands` | Designers / labels (optional) |
| `/admin/promotions` | Deals and seasonal offers |
| `/admin/event-packages` | **New** - Event package CRUD |
| `/admin/custom-orders` | **New** - Custom dress pipeline |
| `/admin/appointments` | **New** - Fitting schedule (optional phase 2) |
| `/admin/settings` | Shop name, contact, hero images, WhatsApp, hours |
| `/admin/reports` | **New** - Inventory, booking, revenue, customer, event reports |

### Reports needed

| Report | Data |
|--------|------|
| Inventory | Dresses by category, size, condition, availability |
| Bookings | Upcoming pickups, returns due, overdue, deposits collected |
| Revenue | Hire fees, sale revenue, deposits, late fees, fitting fees |
| Customers | Contact list, booking history |
| Events | Package inquiries, confirmed events, revenue by package |

---

## 14. Data Model Extensions (beyond Aura Shop)

Add to `prisma/schema.prisma`:

```prisma
enum DressListingType {
  HIRE
  SALE
  HIRE_AND_SALE
}

enum BookingStatus {
  PENDING
  CONFIRMED
  PICKED_UP
  RETURNED
  COMPLETED
  OVERDUE
  CANCELLED
}

enum CustomOrderStatus {
  INQUIRY
  QUOTED
  DEPOSIT_PAID
  DESIGN_APPROVED
  IN_PRODUCTION
  FINAL_APPROVAL
  SHIPPED
  DELIVERED
}

// Extend Product
model Product {
  // ... existing fields
  listingType    DressListingType @default(HIRE)
  salePrice      Decimal?         @db.Decimal(10, 2)
  condition      String?          // New, Excellent, Good
  depositPercent Int?             @default(45)  // 40-50%
  specialNotes   String?          @db.Text
}

// Dress hire booking (separate from generic Inquiry)
model DressBooking {
  id                String        @id @default(cuid())
  inquiryId         String?
  productId         String
  variantInfo       String?       // size, color
  customerName      String
  customerPhone     String
  customerEmail     String?
  weddingDate       DateTime
  eventLocation     String        // Blantyre / outside
  ukSize            String?
  bookingDeposit    Decimal       @db.Decimal(10, 2)
  securityDeposit   Decimal       @default(50000) @db.Decimal(10, 2)
  balanceDue        Decimal       @db.Decimal(10, 2)
  pickupDate        DateTime
  returnDeadline    DateTime
  status            BookingStatus @default(PENDING)
  lateFeePerDay     Decimal       @default(20000) @db.Decimal(10, 2)
  lateFeesAccrued   Decimal       @default(0) @db.Decimal(10, 2)
  notes             String?
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
}

model EventPackage {
  id              String   @id @default(cuid())
  name            String
  slug            String   @unique
  description     String   @db.Text
  price           Decimal  @db.Decimal(10, 2)
  servicesIncluded String[] // array of service names
  guestCount      Int?
  additionalCharges String? @db.Text
  image           String?
  active          Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model CustomOrder {
  id            String            @id @default(cuid())
  customerName  String
  customerPhone String
  customerEmail String?
  eventDate     DateTime?
  status        CustomOrderStatus @default(INQUIRY)
  inspirationNotes String?        @db.Text
  quoteAmount   Decimal?          @db.Decimal(10, 2)
  depositPaid   Decimal?          @db.Decimal(10, 2)
  measurements  String?           @db.Text
  timelineNotes String?
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
}
```

*(Adjust field names to match project conventions when implementing.)*

---

## 15. Configuration Files to Customize

When forking Aura Shop, update these files first:

### `lib/constants.ts`

```typescript
export const APP_NAME = "AHAVAH BRIDAL EMPORIUM";
export const APP_DESCRIPTION = "..."; // bridal tagline
export const WHATSAPP_NUMBER = "980512870"; // displays as +265 98 051 2870
export const SHOP_ADDRESS = "Ufulu Road #2, Blantyre New Naperi";
export const LOGO_PATH = "/logo/ahava_logo.png";
export const BRAND_COLOR = "#C9A89A"; // choose final color
export const SOCIAL_LINKS = {
  tiktok: "https://www.tiktok.com/@ahavahbridal?...",
  instagramBridal: "https://www.instagram.com/ahavahbridalmw?...",
  instagramEvents: "https://www.instagram.com/ahavahevents?...",
  x: "https://x.com/ahavahbridal?s=21",
};
export const OPENING_HOURS = [
  { days: "Monday – Saturday", hours: "9:00 AM – 3:30 PM (Appointments)" },
];
export const DEFAULT_CURRENCY = "MK";
```

### `prisma/seed.ts`

- Admin users: `super@ahava.com`, `staff@ahava.com` (password: change in production)
- Settings: shopName, tagline, whatsapp, phones, emails, address
- Categories: **3 parent + 9 subcategories** (see section 5 hierarchy - seed with `parentId`)
- Sample dresses: assign each to a subcategory - e.g. 2–3 per "Dresses in Stock" subcategory, 1–2 per portfolio/inspo subcategory
- 2–3 event packages
- 2 sample inquiries/bookings
- 1–2 promotions

**Category seed pattern:**

```typescript
const parents = [
  { slug: "previous-custom-orders", name: "Previous Custom Orders", description: "Past custom-made gowns" },
  { slug: "dresses-in-stock", name: "Dresses in Stock", description: "Available to hire or purchase" },
  { slug: "inspo-custom-orders", name: "Inspo Custom Orders", description: "Inspiration for your custom gown" },
];

const children = [
  { parent: "previous-custom-orders", slug: "previous-ballgowns", name: "Ballgowns" },
  { parent: "previous-custom-orders", slug: "previous-fitted-gowns", name: "Fitted Gowns" },
  { parent: "dresses-in-stock", slug: "satin-ballgowns", name: "Satin Ballgowns" },
  { parent: "dresses-in-stock", slug: "lace-beaded-ballgowns", name: "Lace Beaded Ballgowns" },
  { parent: "dresses-in-stock", slug: "satin-fitted", name: "Satin Fitted" },
  { parent: "dresses-in-stock", slug: "beaded-fitted", name: "Beaded Fitted" },
  { parent: "dresses-in-stock", slug: "a-line-gowns", name: "A-Line Gowns" },
  { parent: "inspo-custom-orders", slug: "already-made-gowns", name: "Already Made Gowns" },
  { parent: "inspo-custom-orders", slug: "recommendations", name: "Recommendations" },
];
// Create parents first, then children with parentId
```

### `app/globals.css`

Update CSS variable `--primary` to AHAVA brand color.

### `app/manifest.ts`

```typescript
name: "AHAVAH Bridal Emporium"
short_name: "AHAVAH"
theme_color: "#C9A89A" // match brand
```

### `components/store/testimonials.tsx`

Replace with bridal client testimonials.

### Environment variables

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
NEXT_PUBLIC_APP_URL=https://ahava-bridal.vercel.app
NEXT_PUBLIC_WHATSAPP_NUMBER=265980512870
AUTH_SECRET=<random-secret>
NEXTAUTH_SECRET=<random-secret>
NEXTAUTH_URL=https://ahava-bridal.vercel.app
BLOB_READ_WRITE_TOKEN=<vercel-blob-token>
```

---

## 16. Implementation Phases

### Phase 1 - Core (match Aura Shop)

- [ ] Fork repo, rebrand constants, logo, colors, seed data
- [ ] Storefront: home, shop, product detail, categories, promotions, about, contact
- [ ] Mobile bottom nav, header sheet, cart sheet, WhatsApp CTAs
- [ ] Admin: products, inquiries, inventory, categories, settings
- [ ] Deploy to Vercel with Postgres + Blob

### Phase 2 - Bridal-specific pages

- [ ] `/hire-process` - all policies from section 6
- [ ] `/fittings` - appointment info + WhatsApp booking CTA
- [ ] `/custom-orders` - process timeline from section 9
- [ ] Product page: show rental price, sale price, deposit info, condition
- [ ] Extend product filters for dress-specific fields
- [ ] Nested category navigation (3 parents → 9 subcategories on `/categories`)

### Phase 3 - Bookings & events

- [ ] `DressBooking` model + admin booking calendar
- [ ] Pickup/return date auto-calculation from wedding date + location
- [ ] `/events` and `/events/packages` pages
- [ ] `EventPackage` admin CRUD
- [ ] Custom order pipeline admin

### Phase 4 - Reports & polish

- [ ] Admin reports (inventory, bookings, revenue, customers, events)
- [ ] Portfolio gallery
- [ ] Testimonials section
- [ ] Email contact form backend (optional)
- [ ] Online appointment booking with calendar (optional)

---

## 17. Copy-Paste AI Build Prompt

Use the following prompt when starting a new Cursor/AI session to build the project:

---

**PROMPT START**

Create a new Next.js 15 project called **ahava-weddings** by forking the architecture of the Aura Shop retail template. It must be mobile-first and PWA-ready.

**Business:** AHAVAH BRIDAL EMPORIUM - bridal dress hire/sales, custom orders, fittings, and wedding event planning in Blantyre, Malawi.

**Stack:** Next.js 15 App Router, TypeScript, Tailwind v4, Shadcn UI, Prisma + PostgreSQL, NextAuth v5 (admin only), Zustand cart, Vercel Blob images, Framer Motion, React Hook Form + Zod.

**Contact:**
- Address: Ufulu Road #2, Blantyre New Naperi
- WhatsApp: +265 98 051 2870
- Phones: +265 98 051 2870, +265 99 955 4414, +265 99 363 2102
- Emails: Ahavahbridal@gmail.com, Ahavaheventsmw@gmail.com
- Hours: Mon–Sat 9:00 AM – 3:30 PM (appointments)
- Social: TikTok @ahavahbridal, Instagram @ahavahbridalmw + @ahavahevents, X @ahavahbridal

**Storefront routes:** `/`, `/shop`, `/products/[slug]`, `/categories`, `/promotions`, `/about`, `/contact`, `/hire-process`, `/fittings`, `/custom-orders`, `/events`, `/events/packages/[slug]`

**Mobile UX:** Bottom tab nav (Home, Shop, Deals, Categories, Cart), sticky header with hamburger sheet, cart slide-over, safe-area insets, dark/light theme, PWA manifest.

**Commerce:** WhatsApp-first - no payment gateway. Zustand inquiry cart → pre-filled WhatsApp messages. Admin tracks inquiries and bookings manually.

**Dress catalog fields:** name, category (3 parent groups / 9 subcategories - see hierarchy), description, rental price, sale price, UK sizes, colors, condition, stock, photos, deposit (40–50% + MK 50,000 security), special notes.

**Dress categories (required hierarchy):**
1. Previous Custom Orders → 1A Ballgowns, 1B Fitted Gowns
2. Dresses in Stock → 2A Satin Ballgowns, 2B Lace Beaded Ballgowns, 2C Satin Fitted, 2D Beaded Fitted, 2E A-Line Gowns
3. Inspo Custom Orders → 3A Already Made Gowns, 3B Recommendations
Use Category.parentId for nesting. Group 2 = hire/sale inventory; Groups 1 & 3 = portfolio/inspo with WhatsApp inquiry CTA.

**Hire policies:** Non-refundable bookings. Pickup 4 days before wedding (Blantyre) or 6 days (outside). Return within 4 days (Blantyre) or 6 days (outside). Late fee MK 20,000/day. One booking per dress per weekend.

**Fittings:** Mon–Sat 9–3:30, max 4 clients, 2hr max, fitting fee required, MK 5,000 reschedule fee, no cancellation refund. Book 24hrs ahead.

**Custom orders:** 2–3 month lead time, inspiration → quote → deposit → design approval → production → progress photos → final approval → delivery.

**Event services:** Wedding planning, coordination, venue, decor, catering, photo, video, makeup, bridal team, transport, MC, entertainment. Event packages with name, price, services, guest count.

**Admin:** Dashboard, products, inquiries, bookings (with pickup/return dates), inventory, categories, promotions, event packages, custom orders, settings, reports.

**Customer data collected:** Full name, phone, email, wedding/event date, event location, UK size, special requirements.

Follow the Aura Shop patterns: `services/` for reads, `actions/admin/` for mutations, `lib/constants.ts` for defaults, `prisma/seed.ts` for initial data, admin roles SUPER_ADMIN and STAFF_ADMIN.

Reference the full spec in `AHAVA-WEDDINGS-PROJECT-BRIEF.md` for all business rules and data model extensions.

**PROMPT END**

---

## 18. Quick Reference - Aura Shop → AHAVA Mapping

| Aura Shop | AHAVA Weddings |
|-----------|----------------|
| Product | Wedding dress |
| Category | 3 parent groups + 9 subcategories (see section 5) |
| Parent category | Previous Custom Orders / Dresses in Stock / Inspo Custom Orders |
| Subcategory | Ballgowns, Fitted, Satin, Lace Beaded, A-Line, Already Made, Recommendations |
| Brand | Designer / label |
| ProductVariant (size/color) | UK size + color |
| price | Rental price |
| discountPrice | Sale price |
| Inquiry | Dress inquiry / booking request |
| Promotion | Seasonal deal or trunk show |
| Cart → WhatsApp | Inquiry cart → WhatsApp booking |
| Shop filters | Dress filters (size, color, hire/sale) |
| Admin inventory | Dress stock + availability per weekend |
| Settings hero images | Bridal lookbook slideshow |
| Testimonials | Bridal client reviews |
| About page | AHAVA company story |
| Contact page | Blantyre location + appointment hours |

---

*Document version: 1.0 - generated from Aura Shop codebase analysis and AHAVA business requirements.*
