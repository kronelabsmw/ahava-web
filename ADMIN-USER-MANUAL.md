# AHAVA Admin — User Manual

A simple guide for managing the AHAVA bridal shop website. No technical knowledge required.

---

## Table of contents

1. [Getting started](#1-getting-started)
2. [Finding your way around](#2-finding-your-way-around)
3. [Dashboard — your home screen](#3-dashboard--your-home-screen)
4. [Products — dresses in the shop](#4-products--dresses-in-the-shop)
5. [Categories — organising the shop](#5-categories--organising-the-shop)
6. [Inquiries — customer messages](#6-inquiries--customer-messages)
7. [Bookings — dress hire reservations](#7-bookings--dress-hire-reservations)
8. [Sales — money and payments](#8-sales--money-and-payments)
9. [Promotions — special offers](#9-promotions--special-offers)
10. [Event packages — wedding & event services](#10-event-packages--wedding--event-services)
11. [Event bookings — event package sales](#11-event-bookings--event-package-sales)
12. [Custom orders — bespoke dresses](#12-custom-orders--bespoke-dresses)
13. [Site content — text on the website](#13-site-content--text-on-the-website)
14. [Settings — shop details and images](#14-settings--shop-details-and-images)
15. [Uploading photos and videos](#15-uploading-photos-and-videos)
16. [Common tasks — quick recipes](#16-common-tasks--quick-recipes)
17. [Tips and troubleshooting](#17-tips-and-troubleshooting)
18. [Glossary](#18-glossary)

---

## 1. Getting started

### How to open the admin panel

1. Open your web browser (Chrome, Safari, Edge, or Firefox).
2. Go to your shop’s admin address. This is usually:
   - **Live site:** `https://your-website.com/admin`
   - **During setup:** `http://localhost:3000/admin`
3. You will see the **Sign in** page.

### How to sign in

1. Enter your **Email** address.
2. Enter your **Password**.
3. Click **Sign in**.

If the details are wrong, you will see a red message: *“Invalid email or password.”* Check your spelling and try again. If you still cannot sign in, ask whoever set up the website to reset your password.

### How to sign out

At the bottom of the left menu, click **Sign out**. Always sign out when you finish, especially on a shared computer.

### Viewing the live website

At the bottom of the left menu, click **View storefront**. This opens the customer-facing website in a new tab so you can check how changes look.

---

## 2. Finding your way around

After you sign in, you see the **admin panel** with a menu on the left and your page content on the right.

### The menu (left sidebar)

| Menu item | What it is for |
|-----------|----------------|
| **Dashboard** | Overview of the whole shop — sales, inquiries, bookings |
| **Products** | Add and edit dresses in the shop |
| **Inquiries** | Messages and requests from customers |
| **Bookings** | Dress hire reservations (pickup, return, payment) |
| **Sales** | All money collected — online and in-person |
| **Categories** | How dresses are grouped in the shop |
| **Promotions** | Special offers and discounts |
| **Event Packages** | Wedding and event planning packages |
| **Event Bookings** | Sales of event packages |
| **Custom Orders** | Bespoke dress commissions |
| **Site Content** | Text on the website (contact info, testimonials, etc.) |
| **Settings** | Shop name, hero images, page banners |

### On mobile or tablet

Tap the **☰ menu** icon at the top left to open the same menu.

### Important buttons you will see often

- **Add product / Add category / Create promotion** — starts a new item
- **Edit** — opens a form to change an existing item
- **Save / Create / Update** — saves your changes
- **Cancel** — goes back without saving
- **Delete** — permanently removes an item (you will be asked to confirm)

> **Remember:** Always click **Save** when you finish editing a form. Closing the browser without saving will lose your changes.

---

## 3. Dashboard — your home screen

The **Dashboard** is the first page you see after signing in. It gives you a quick snapshot of how the shop is doing.

### Revenue summary (top row)

Four cards show money collected:

- **Collected (all time)** — total money received since the shop started
- **Collected this month** — money received this calendar month
- **Outstanding** — money still owed by customers
- **Offline sales** — sales recorded manually (walk-ins, WhatsApp, cash)

Click any card to go to the **Sales** page for more detail.

### Revenue chart

A graph shows how much money has been collected over time. Use the buttons to switch between **Weekly**, **Monthly**, and **Yearly** views.

### Quick stats

Smaller cards show counts such as:

- Active products
- Pending inquiries
- Dress bookings
- Overdue returns
- Custom orders
- Categories and promotions

Click a card to jump straight to that section.

### Recent activity

Scroll down to see:

- **Recent sales** — latest payments
- **Inquiry pipeline** — how many inquiries are at each stage
- **Recent inquiries** — newest customer messages
- **Upcoming pickups** — dress hire pickups coming soon
- **Recent custom orders** — bespoke dress progress

Use the Dashboard each morning as your starting point to see what needs attention.

---

## 4. Products — dresses in the shop

Products are the dresses and items customers browse on the website.

### Viewing all products

Go to **Products** in the menu. You see a table with:

- Dress name and photo
- Category
- Hire price
- Stock (how many available)
- Status — **Active** (visible on website) or **Inactive** (hidden)

### Adding a new dress

1. Click **Add product**.
2. Fill in the form (see fields below).
3. Make sure **Active** is turned on if you want it on the website.
4. Click **Create product**.

You return to the product list. Click **View on storefront** on the row to check how it looks to customers.

### Editing a dress

1. Go to **Products**.
2. Click **Edit** on the row.
3. Change what you need.
4. Click **Update product**.

### Deleting a dress

1. Open the dress for editing.
2. Click **Delete product** at the bottom.
3. Confirm when asked.

> **Note:** You cannot delete a dress that has active bookings. Mark it **Inactive** instead to hide it from the shop.

---

### Product form — field guide

#### Basic information

| Field | What to enter |
|-------|---------------|
| **Product name** | The dress name customers will see |
| **Slug (URL)** | The web address for this dress — usually filled in automatically from the name |
| **Category** | Choose a subcategory (e.g. “A-Line” under “Wedding Dresses”) |
| **Description** | Full description of the dress — fabric, style, details |
| **Brand** | Designer or brand name (optional) |
| **Tags** | Extra search words, separated by commas (optional) |

#### Pricing & inventory

| Field | What to enter |
|-------|---------------|
| **Listing type** | Hire only, Sale only, or Hire & sale |
| **Stock quantity** | How many of this dress you have |
| **Base price** | Hire or sale price in **MK** (Malawian Kwacha) |
| **Purchase price** | What you paid for the dress, if you bought it to sell |
| **Promotional price** | A reduced price, if running a special |
| **Deposit percentage** | How much deposit customers pay upfront (default is 45%) |
| **Condition** | e.g. New, Excellent, Good |
| **Special notes** | Extra info shown on the product page |

#### Sizes & colours

For each size/colour combination, enter:

- **Size** — e.g. UK 10, UK 12
- **Colour** — e.g. Ivory, White
- **Variant stock** — how many in that size/colour
- **SKU** — your internal stock code (optional)

Click **Add size / colour** to add more combinations.

#### Gallery images (right side)

- Upload up to **8 photos** of the dress.
- The first image is the main photo customers see.
- See [Section 15](#15-uploading-photos-and-videos) for upload tips.

#### Product video (right side)

- Optional short video of the dress (max 50 MB).

#### Visibility (right side)

| Toggle | Effect |
|--------|--------|
| **Active** | Dress appears on the website |
| **Featured** | Dress appears on the homepage |

---

## 5. Categories — organising the shop

Categories group dresses on the website (e.g. Wedding Dresses → A-Line, Ball Gown).

### How categories work

- **Parent categories** are the main groups (e.g. “Wedding Dresses”).
- **Subcategories** sit under a parent (e.g. “A-Line” under “Wedding Dresses”).
- When adding a product, you must choose a **subcategory** — not a parent category.

### Adding a category

1. Go to **Categories**.
2. Click **Add category**.
3. Enter the **Category name**.
4. For a subcategory, choose a **Parent category**. Leave as “None” for a top-level category.
5. Add an optional **Description** and **Category image**.
6. Click **Create category**.

### Editing or deleting a category

Click **Edit** on any category. You can update details or click **Delete category**.

> **Note:** You cannot delete a category that has products or subcategories inside it. Move or delete those first.

---

## 6. Inquiries — customer messages

When a customer enquires about a dress, event package, or contacts you through the website, it appears here.

### Viewing inquiries

Go to **Inquiries**. Each row shows:

- Customer name
- Phone and email
- What they enquired about
- Sale amount (if set)
- Status
- Date

### Inquiry statuses — what they mean

| Status | Meaning |
|--------|---------|
| **Pending** | New inquiry — not yet contacted |
| **Contacted** | You have reached out to the customer |
| **Confirmed** | Customer has agreed to proceed |
| **Completed** | Deal is done — appears in Sales |
| **Cancelled** | Inquiry closed without a sale |

### How to process an inquiry

1. A new inquiry arrives as **Pending**.
2. Contact the customer (phone, WhatsApp, email).
3. Change the **Status** dropdown to **Contacted**, then **Confirmed** when they agree.
4. Enter the agreed **Sale amount** in MK and click **Save**.
5. When the sale is complete, set status to **Completed**.

The sale automatically appears in **Sales**.

---

## 7. Bookings — dress hire reservations

Bookings track dress hire from reservation through pickup and return.

### Viewing bookings

Go to **Bookings**. Each row shows:

- Customer details (name, phone, email, size)
- Dress and size/colour
- Wedding date, pickup date, return date, location
- Payment details (deposit, balance, security deposit, late fees)
- Status

### Booking statuses — what they mean

| Status | Meaning |
|--------|---------|
| **Pending** | Booking requested, not yet confirmed |
| **Confirmed** | Booking confirmed — deposit counted |
| **Picked up** | Customer collected the dress |
| **Returned** | Dress returned — balance due counted |
| **Completed** | Hire fully finished |
| **Overdue** | Return date passed — late fees may apply |
| **Cancelled** | Booking cancelled |

### Updating a booking

Use the **Status** dropdown on each row to move the booking through the process. Revenue updates automatically in **Sales** as the status changes.

> **Note:** Booking details (dates, customer info) are set when the booking is created. From admin you can update the **status** to track progress. Contact your website administrator if you need to change booking details.

---

## 8. Sales — money and payments

**Sales** is your money ledger. It combines sales from inquiries, bookings, event bookings, custom orders, and anything you record manually.

### Summary cards

At the top you see:

- **Collected (all time)**
- **Collected this month**
- **Outstanding**
- **Offline collected**

### Revenue chart

Same as the Dashboard — switch between Weekly, Monthly, and Yearly.

### Sales by category

A breakdown showing how much came from dress hire, dress purchase, custom orders, event packages, fittings, and other.

### Recording a walk-in or cash sale

Use this when a customer pays in person, via WhatsApp, or by bank transfer — anything not automatically tracked.

1. Go to **Sales**.
2. Find the **Record offline sale** form.
3. Fill in:

| Field | What to enter |
|-------|---------------|
| **Sale type** | Dress hire, Dress purchase, Custom order, Event package, Fitting fee, or Other |
| **Payment status** | Paid in full, Deposit received, Partially paid, or Quoted (not paid) |
| **Description** | Short title, e.g. “Ivory A-line hire — Jane M.” |
| **Customer name** | Optional |
| **Phone** | Optional |
| **Total (MK)** | Full agreed amount |
| **Collected (MK)** | Amount received now |
| **Sale date** | Date of the sale |
| **Notes** | Optional extra details |

4. Click **Record offline sale**.

### Viewing all sales

The **Sales ledger** table lists every sale with date, description, source (System or Offline), total, collected amount, and status.

- Click a sale name to open its **detail page**.
- **System** sales come from inquiries, bookings, etc.
- **Offline** sales can be deleted if recorded by mistake.

### Logging additional payments

When a customer pays more later (e.g. balance on return):

1. Go to **Sales** and click the sale name.
2. On the sale detail page, use **Log payment**.
3. Enter:
   - **Amount (MK)**
   - **Method** — Cash, WhatsApp, Bank transfer, Mobile money, Card, or Other
   - **Date received**
   - **Reference** — receipt or transaction number (optional)
   - **Notes** (optional)
4. Click to save.

Payment history appears below. You can delete a payment entry if it was added by mistake.

### Exporting sales to a spreadsheet

Click **Export CSV** on the Sales page to download all sales data. Open the file in Excel or Google Sheets.

---

## 9. Promotions — special offers

Promotions are discount offers shown on the website.

### Viewing promotions

Go to **Promotions**. Each card shows the title, discount, dates, and whether it is active.

### Creating a promotion

1. Click **Create promotion**.
2. Fill in:

| Field | What to enter |
|-------|---------------|
| **Title** | Name of the offer, e.g. “Summer Sale 20% Off” |
| **Slug** | Web address — usually auto-filled |
| **Description** | Details of the offer |
| **Discount %** | Percentage off (0–100), optional |
| **Start date / End date** | When the offer runs (optional) |
| **Banner image** | Promotional image |
| **Active on storefront** | Turn on to show on the website |

3. Click **Create promotion**.

### Editing or deleting

Click **Edit** on a promotion card. Update fields and click **Save**, or click **Delete promotion** to remove it.

---

## 10. Event packages — wedding & event services

Event packages are the bundled services you offer (e.g. full wedding planning, décor packages).

### Viewing packages

Go to **Event Packages**. Each card shows the name, price, guest count, and services included.

### Creating a package

1. Click **Create event package** (or **Add package**).
2. Fill in:

| Field | What to enter |
|-------|---------------|
| **Package name** | e.g. “Gold Wedding Package” |
| **Slug** | Web address |
| **Description** | Full description |
| **Price (MK)** | Package price |
| **Guest count** | Number of guests covered |
| **Services included** | One service per line |
| **Additional charges note** | Extra costs customers should know about |
| **Cover image** | Main package photo |
| **Active on storefront** | Turn on to show on the website |

3. Click **Create package**.

Click **View on site** on a card to see how it looks to customers.

---

## 11. Event bookings — event package sales

When you sell an event package to a customer, record it here.

### Creating an event booking

1. Go to **Event Bookings**.
2. Fill in the **New event booking** form:

| Field | Required? | What to enter |
|-------|-----------|---------------|
| **Package** | Yes | Choose from active packages — price fills in automatically |
| **Customer name** | Yes | |
| **Phone** | Yes | |
| **Quoted amount (MK)** | Yes | Total agreed price |
| **Deposit paid (MK)** | No | Amount received so far |
| **Event date** | No | Date of the event |
| **Guests** | No | Expected guest count |
| **Location** | No | Venue or area |
| **Status** | Yes | See statuses below |
| **Email** | No | |
| **Notes** | No | Internal notes |

3. Submit the form.

### Event booking statuses

| Status | Meaning |
|--------|---------|
| **Inquiry** | Initial interest |
| **Quoted** | Price sent to customer |
| **Deposit paid** | Deposit received |
| **Confirmed** | Booking confirmed |
| **Completed** | Event done — full amount counted |
| **Cancelled** | Booking cancelled |

Update the **Status** dropdown on each row as the booking progresses. Revenue syncs to **Sales** automatically.

---

## 12. Custom orders — bespoke dresses

Custom orders track made-to-order dresses from first enquiry through to delivery.

### Viewing custom orders

Go to **Custom Orders**. Each row shows customer details, event date, quote amount, deposit paid, and status.

### Custom order statuses — the pipeline

Move each order through these stages using the **Status** dropdown:

| Status | Meaning |
|--------|---------|
| **Inquiry** | Customer has expressed interest |
| **Quoted** | Price sent to customer |
| **Deposit paid** | Deposit received — work can begin |
| **Design approved** | Customer approved the design |
| **In production** | Dress is being made |
| **Final approval** | Customer approved the finished dress |
| **Shipped** | Dress sent to customer |
| **Delivered** | Customer received the dress — full amount counted |

Revenue updates in **Sales** as the order moves through stages.

---

## 13. Site content — text on the website

**Site Content** controls words and contact information that appear across the website — not dress listings or images (those are in Products and Settings).

Go to **Site Content** and edit the sections below. Click **Save site content** when finished.

### Announcement bar

- **Announcement text** — a short message shown in a bar at the top of every page (e.g. “Book your fitting today — slots filling fast!”)
- **Footer description** — short text in the website footer

### Testimonials

- **Section title** and **Subtitle** — headings for the testimonials section on the homepage
- Each testimonial block has:
  - **Name** — customer name
  - **Location** — e.g. “Lilongwe”
  - **Quote** — what they said
- Click **Add testimonial** for more. Click the trash icon to remove one.

### Contact & visit

| Field | What to enter |
|-------|---------------|
| **Address** | Shop street address |
| **City** | City name |
| **Phone numbers** | One number per line |
| **Bridal email** | Email for bridal enquiries |
| **Events email** | Email for event enquiries |
| **Opening hours** | One line per entry: `days \| hours \| notes` (e.g. `Mon–Fri \| 9am–5pm \| By appointment`) |
| **Instagram (Bridal)** | Bridal Instagram handle or URL |
| **Instagram (Events)** | Events Instagram handle or URL |
| **TikTok** | TikTok handle or URL |
| **X** | X (Twitter) handle or URL |

After saving, click **View storefront** to check the contact page and homepage.

---

## 14. Settings — shop details and images

**Settings** controls your shop’s branding, homepage visuals, and page banners.

Go to **Settings**, make your changes, and click **Save settings**.

### General information

| Field | Where it appears |
|-------|------------------|
| **Shop name** | Across the website |
| **Tagline** | Homepage and About page |
| **WhatsApp number** | Contact links and enquiry buttons |

### Homepage hero slideshow

Upload up to **12 images** that rotate on the homepage banner. See [Section 15](#15-uploading-photos-and-videos) for upload tips.

If you also set a **Homepage hero video**, the video plays instead of the slideshow.

### Homepage & events videos

| Setting | Page |
|---------|------|
| **Homepage hero video** | Homepage (replaces slideshow when set) |
| **Events page hero video** | Events page |

### Page images

Upload a banner image for each page:

| Setting | Page |
|---------|------|
| About page | `/about` |
| Events hero | `/events` (used if no events video) |
| Events process | `/events` |
| Fittings page | `/fittings` |
| Custom orders | `/custom-orders` |
| Hire process | `/hire-process` |

---

## 15. Uploading photos and videos

Many forms let you upload images directly — you do not need to use another website.

### How to upload an image

1. Find the image field on the form (e.g. “Gallery images” or “Cover image”).
2. Click **Upload** or drag a file onto the upload area.
3. Wait for the upload to finish — a preview appears.
4. Save the form.

### Image requirements

- **Formats:** JPEG, PNG, WebP, or GIF
- **Maximum size:** 10 MB per image
- **Product gallery:** up to 8 images
- **Hero slideshow:** up to 12 images

### Video requirements

- **Formats:** MP4, WebM, or MOV
- **Maximum size:** 50 MB

### Using a web link instead

If you already have an image hosted online, paste the **URL** (web address) into the URL field instead of uploading.

### Tips for good photos

- Use well-lit photos on a plain or neutral background.
- Show the full dress from the front; add detail shots of lace, back, and train.
- Keep file sizes reasonable — very large photos may take longer to upload.
- For homepage hero images, use wide, landscape-orientation photos.

---

## 16. Common tasks — quick recipes

### Add a new dress to the shop

1. **Categories** → make sure a subcategory exists (e.g. “Ball Gown” under “Wedding Dresses”).
2. **Products** → **Add product**.
3. Fill in name, category, price, description, sizes, and photos.
4. Turn **Active** on (and **Featured** if you want it on the homepage).
5. **Create product** → **View on storefront** to check.

### Handle a customer inquiry from start to finish

1. **Inquiries** → find the new **Pending** inquiry.
2. Contact the customer.
3. Change status to **Contacted**, then **Confirmed**.
4. Enter the **Sale amount** and click **Save**.
5. Set status to **Completed**.
6. Check **Sales** to confirm it appears.

### Record a cash or WhatsApp payment

1. **Sales** → **Record offline sale**.
2. Choose the sale type and payment status.
3. Enter description, total, and amount collected.
4. **Record offline sale**.

### Run a promotion

1. **Promotions** → **Create promotion**.
2. Add title, discount, dates, and banner image.
3. Turn **Active on storefront** on.
4. **Create promotion** → check the website.

### Sell an event package

1. **Event Packages** → confirm the package exists and is **Active**.
2. **Event Bookings** → fill in the new booking form.
3. Update status as deposit and confirmation come in.
4. Check **Sales** for revenue.

### Update contact details on the website

1. **Site Content** → edit phone numbers, emails, address, opening hours, social links.
2. **Save site content**.
3. **View storefront** → check the Contact page.

### Change the homepage banner

1. **Settings** → upload new **Homepage hero slideshow** images (or a **Homepage hero video**).
2. **Save settings**.
3. **View storefront** → refresh the homepage.

---

## 17. Tips and troubleshooting

### General tips

- **Save often.** Click Save after every section you edit.
- **Preview changes.** Use **View storefront** to see how the website looks to customers.
- **Use statuses consistently.** Moving inquiries, bookings, and orders through the correct statuses keeps your sales figures accurate.
- **Record offline sales promptly.** Walk-in and WhatsApp payments will not appear in Sales unless you record them.

### Common problems

| Problem | What to try |
|---------|-------------|
| Cannot sign in | Check email and password. Ask your administrator to reset your password. |
| Changes not showing on website | Did you click Save? Refresh the storefront page (Ctrl+F5 or Cmd+Shift+R). |
| Cannot delete a product | It may have bookings. Mark it **Inactive** instead. |
| Cannot delete a category | It may have products or subcategories. Move or remove those first. |
| Image upload fails | Check the file is under 10 MB and is JPEG, PNG, WebP, or GIF. Try a smaller file. |
| Video upload fails | Check the file is under 50 MB and is MP4, WebM, or MOV. |
| Sale amount not updating | Make sure you clicked **Save** after entering the amount on an inquiry. |
| Wrong sale recorded | Offline sales can be deleted from the Sales ledger. System sales — contact your administrator. |

### Getting help

If something is not working and the tips above do not help, note:

- What page you were on
- What you clicked
- Any error message you saw

Share this with whoever manages your website.

---

## 18. Glossary

| Term | Meaning |
|------|---------|
| **Active** | Item is visible on the customer website |
| **Admin / Admin panel** | The back-office website you use to manage the shop |
| **Dashboard** | The home overview page after you sign in |
| **Deposit** | Upfront payment before the full balance is due |
| **Featured** | Shown prominently on the homepage |
| **Inactive** | Hidden from the customer website |
| **Inquiry** | A customer message or request from the website |
| **MK** | Malawian Kwacha — the currency used for prices |
| **Offline sale** | A sale recorded manually (not from the website automatically) |
| **Slug** | The part of the web address for a page, e.g. `ivory-a-line-gown` |
| **Status** | Where an inquiry, booking, or order is in its workflow |
| **Storefront** | The customer-facing website |
| **Subcategory** | A category nested under a parent (products must use subcategories) |
| **Variant** | A specific size/colour combination of a product |

---

*AHAVA Admin User Manual — for shop staff and managers. For technical setup and deployment, see `README.md`.*
