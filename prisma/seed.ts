import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { APP_NAME } from "../lib/constants";

const prisma = new PrismaClient();

const parents = [
  {
    slug: "previous-custom-orders",
    name: "Previous Custom Orders",
    description:
      "Gowns we've crafted for past brides - browse for inspiration before your custom order.",
    image:
      "https://images.unsplash.com/photo-1546804784-896d0b1ea386?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "dresses-in-stock",
    name: "Dresses in Stock",
    description:
      "Ready-to-wear gowns available for hire or purchase, with fittings at our Blantyre emporium.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "inspo-custom-orders",
    name: "Inspo Custom Orders",
    description:
      "Curated looks and recommendations to brief your bespoke bridal design with our team.",
    image:
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
  },
];

const children = [
  {
    parent: "previous-custom-orders",
    slug: "previous-ballgowns",
    name: "Ballgowns",
  },
  {
    parent: "previous-custom-orders",
    slug: "previous-fitted-gowns",
    name: "Fitted Gowns",
  },
  {
    parent: "dresses-in-stock",
    slug: "satin-ballgowns",
    name: "Satin Ballgowns",
  },
  {
    parent: "dresses-in-stock",
    slug: "lace-beaded-ballgowns",
    name: "Lace Beaded Ballgowns",
  },
  {
    parent: "dresses-in-stock",
    slug: "satin-fitted",
    name: "Satin Fitted",
  },
  {
    parent: "dresses-in-stock",
    slug: "beaded-fitted",
    name: "Beaded Fitted",
  },
  {
    parent: "dresses-in-stock",
    slug: "a-line-gowns",
    name: "A-Line Gowns",
  },
  {
    parent: "inspo-custom-orders",
    slug: "already-made-gowns",
    name: "Already Made Gowns",
  },
  {
    parent: "inspo-custom-orders",
    slug: "recommendations",
    name: "Recommendations",
  },
];

const sampleDresses = [
  {
    name: "Elegant Lace A-Line Gown",
    slug: "elegant-lace-a-line-gown",
    category: "a-line-gowns",
    description:
      "Stunning A-line gown with delicate lace overlay, sweetheart neckline, and chapel train. Perfect for the romantic bride.",
    price: 350000,
    salePrice: 1200000,
    listingType: "HIRE_AND_SALE" as const,
    condition: "Excellent",
    stock: 1,
    featured: true,
    sizes: ["10", "12", "14"],
    colors: ["Ivory", "Champagne"],
  },
  {
    name: "Satin Ballgown Princess",
    slug: "satin-ballgown-princess",
    category: "satin-ballgowns",
    description:
      "Classic princess ballgown in luxurious satin with off-shoulder sleeves and full skirt.",
    price: 400000,
    listingType: "HIRE" as const,
    condition: "New",
    stock: 1,
    featured: true,
    sizes: ["8", "10", "12"],
    colors: ["Ivory"],
  },
  {
    name: "Beaded Fitted Mermaid",
    slug: "beaded-fitted-mermaid",
    category: "beaded-fitted",
    description:
      "Glamorous mermaid silhouette with hand-beaded bodice and figure-hugging skirt.",
    price: 450000,
    salePrice: 1500000,
    listingType: "HIRE_AND_SALE" as const,
    condition: "Excellent",
    stock: 1,
    featured: true,
    sizes: ["10", "12"],
    colors: ["Ivory", "Blush"],
  },
  {
    name: "Lace Beaded Cathedral Gown",
    slug: "lace-beaded-cathedral-gown",
    category: "lace-beaded-ballgowns",
    description:
      "Show-stopping lace and beaded ballgown with cathedral-length train.",
    price: 500000,
    listingType: "HIRE" as const,
    condition: "Good",
    stock: 1,
    sizes: ["12", "14", "16"],
    colors: ["Ivory"],
  },
  {
    name: "Custom Satin Fitted Gown",
    slug: "custom-satin-fitted-gown",
    category: "previous-fitted-gowns",
    description:
      "Previously crafted custom satin fitted gown - portfolio piece. Inquire for similar designs.",
    price: 0,
    listingType: "HIRE" as const,
    condition: "Excellent",
    stock: 0,
    sizes: ["10"],
    colors: ["Champagne"],
  },
  {
    name: "Inspiration Beaded Ballgown",
    slug: "inspiration-beaded-ballgown",
    category: "already-made-gowns",
    description:
      "Inspiration piece for custom orders. Request a similar design tailored to your measurements.",
    price: 0,
    listingType: "HIRE" as const,
    stock: 0,
    sizes: ["12"],
    colors: ["Ivory"],
  },
];

async function main() {
  console.log(`Seeding ${APP_NAME}...`);

  const password = await bcrypt.hash("ahava2024!", 10);

  await prisma.user.upsert({
    where: { email: "super@ahava.com" },
    update: {},
    create: {
      email: "super@ahava.com",
      name: "Super Admin",
      password,
      role: "SUPER_ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@ahava.com" },
    update: {},
    create: {
      email: "staff@ahava.com",
      name: "Staff Admin",
      password,
      role: "STAFF_ADMIN",
    },
  });

  const settings = [
    {
      key: "shopName",
      value: APP_NAME,
    },
    {
      key: "tagline",
      value:
        "Your dream gown, expertly fitted - plus full wedding planning under one roof in Malawi.",
    },
    {
      key: "whatsapp",
      value: "+265 98 051 2870",
    },
    {
      key: "heroImages",
      value: JSON.stringify([
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1920",
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=1920",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1920",
      ]),
    },
  ];

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }

  const parentMap: Record<string, string> = {};
  for (const p of parents) {
    const cat = await prisma.category.upsert({
      where: { slug: p.slug },
      update: { name: p.name, description: p.description, image: p.image },
      create: { slug: p.slug, name: p.name, description: p.description, image: p.image },
    });
    parentMap[p.slug] = cat.id;
  }

  const childMap: Record<string, string> = {};
  for (const c of children) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, parentId: parentMap[c.parent], image: "https://images.unsplash.com/photo-1546804784-896d0b1ea386?auto=format&fit=crop&q=80&w=800" },
      create: {
        slug: c.slug,
        name: c.name,
        parentId: parentMap[c.parent],
        image: "https://images.unsplash.com/photo-1546804784-896d0b1ea386?auto=format&fit=crop&q=80&w=800"
      },
    });
    childMap[c.slug] = cat.id;
  }

  for (const dress of sampleDresses) {
    const product = await prisma.product.upsert({
      where: { slug: dress.slug },
      update: {
        name: dress.name,
        description: dress.description,
        price: dress.price,
        salePrice: dress.salePrice,
        listingType: dress.listingType,
        condition: dress.condition,
        stock: dress.stock,
        featured: dress.featured ?? false,
        categoryId: childMap[dress.category],
        depositPercent: 45,
      },
      create: {
        name: dress.name,
        slug: dress.slug,
        description: dress.description,
        price: dress.price,
        salePrice: dress.salePrice,
        listingType: dress.listingType,
        condition: dress.condition,
        stock: dress.stock,
        featured: dress.featured ?? false,
        categoryId: childMap[dress.category],
        depositPercent: 45,
        tags: [],
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        alt: dress.name,
        order: 0,
      }
    });
    await prisma.productImage.create({
      data: {
        productId: product.id,
        url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
        alt: dress.name + " back",
        order: 1,
      }
    });

    await prisma.productVariant.deleteMany({ where: { productId: product.id } });
    for (const size of dress.sizes) {
      for (const color of dress.colors) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            size,
            color,
            stock: dress.stock > 0 ? 1 : 0,
          },
        });
      }
    }
  }

  await prisma.promotion.upsert({
    where: { slug: "bridal-season-special" },
    update: {},
    create: {
      title: "Bridal Season Special",
      slug: "bridal-season-special",
      description:
        "Book your dream dress hire this season and receive a complimentary consultation. Limited slots available.",
      discount: 10,
      active: true,
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800"
    },
  });

  await prisma.eventPackage.upsert({
    where: { slug: "silver-wedding-package" },
    update: {},
    create: {
      name: "Silver Wedding Package",
      slug: "silver-wedding-package",
      description:
        "Essential wedding coordination for intimate celebrations. Perfect for couples who want professional support without the full planning service.",
      price: 2500000,
      guestCount: 100,
      servicesIncluded: [
        "Event coordination",
        "Venue sourcing",
        "Decoration services",
        "Photography coordination",
      ],
      additionalCharges: "Additional guests: MK 15,000 per person over 100",
      active: true,
      image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800"
    },
  });

  await prisma.eventPackage.upsert({
    where: { slug: "gold-wedding-package" },
    update: {},
    create: {
      name: "Gold Wedding Package",
      slug: "gold-wedding-package",
      description:
        "Comprehensive wedding planning for your dream celebration. Our most popular package includes full coordination from engagement to reception.",
      price: 5000000,
      guestCount: 150,
      servicesIncluded: [
        "Wedding planning",
        "Event coordination",
        "Venue sourcing",
        "Decoration services",
        "Catering coordination",
        "Photography coordination",
        "Videography coordination",
        "Makeup artist coordination",
      ],
      additionalCharges: "Premium add-ons available on request",
      active: true,
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800"
    },
  });

  await prisma.eventPackage.upsert({
    where: { slug: "platinum-wedding-package" },
    update: {},
    create: {
      name: "Platinum Wedding Package",
      slug: "platinum-wedding-package",
      description:
        "The ultimate luxury wedding experience. Every detail managed by our expert team for an unforgettable celebration.",
      price: 8500000,
      guestCount: 250,
      servicesIncluded: [
        "Wedding planning",
        "Event coordination",
        "Venue sourcing",
        "Decoration services",
        "Catering coordination",
        "Photography coordination",
        "Videography coordination",
        "Makeup artist coordination",
        "Bridal team management",
        "Transportation coordination",
        "Master of Ceremony coordination",
        "Entertainment coordination",
      ],
      additionalCharges: "Custom requests accommodated",
      active: true,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800"
    },
  });

  const inStockProduct = await prisma.product.findFirst({
    where: { slug: "elegant-lace-a-line-gown" },
  });

  if (inStockProduct) {
    const weddingDate = new Date("2026-09-15");
    const pickupDate = new Date(weddingDate);
    pickupDate.setDate(pickupDate.getDate() - 4);
    const returnDeadline = new Date(weddingDate);
    returnDeadline.setDate(returnDeadline.getDate() + 4);

    await prisma.dressBooking.upsert({
      where: { id: "seed-booking-1" },
      update: {},
      create: {
        id: "seed-booking-1",
        productId: inStockProduct.id,
        customerName: "Grace Mwale",
        customerPhone: "+265 99 123 4567",
        customerEmail: "grace@example.com",
        weddingDate,
        eventLocation: "Blantyre",
        ukSize: "12",
        bookingDeposit: 157500,
        securityDeposit: 50000,
        balanceDue: 192500,
        pickupDate,
        returnDeadline,
        status: "CONFIRMED",
        variantInfo: "Size 12, Ivory",
      },
    });
  }

  await prisma.inquiry.upsert({
    where: { id: "seed-inquiry-1" },
    update: {},
    create: {
      id: "seed-inquiry-1",
      customerName: "Thandiwe Banda",
      customerPhone: "+265 88 765 4321",
      customerEmail: "thandiwe@example.com",
      message: "Interested in the beaded mermaid gown for December wedding",
      status: "PENDING",
      productId: inStockProduct?.id,
      variantInfo: "Size 10, Ivory",
    },
  });

  await prisma.customOrder.upsert({
    where: { id: "seed-custom-1" },
    update: {},
    create: {
      id: "seed-custom-1",
      customerName: "Mercy Phiri",
      customerPhone: "+265 99 555 1234",
      eventDate: new Date("2026-11-20"),
      status: "DEPOSIT_PAID",
      inspirationNotes: "Vintage lace ballgown with long sleeves",
      quoteAmount: 1800000,
      depositPaid: 540000,
    },
  });

  await prisma.saleRecord.upsert({
    where: { id: "seed-offline-sale-1" },
    update: {},
    create: {
      id: "seed-offline-sale-1",
      type: "DRESS_HIRE",
      channel: "OFFLINE",
      title: "Walk-in hire — Chisomo Banda",
      customerName: "Chisomo Banda",
      customerPhone: "+265 99 955 4414",
      totalAmount: 350000,
      paidAmount: 350000,
      status: "PAID",
      saleDate: new Date(),
      notes: "Cash payment at counter",
    },
  });

  const goldPackage = await prisma.eventPackage.findFirst({
    where: { name: { contains: "Gold", mode: "insensitive" } },
  });

  if (goldPackage) {
    await prisma.eventPackageBooking.upsert({
      where: { id: "seed-event-booking-1" },
      update: {},
      create: {
        id: "seed-event-booking-1",
        eventPackageId: goldPackage.id,
        customerName: "Thandiwe Banda",
        customerPhone: "+265 88 765 4321",
        eventDate: new Date("2026-12-10"),
        eventLocation: "Blantyre",
        guestCount: 150,
        quotedAmount: Number(goldPackage.price),
        depositPaid: Number(goldPackage.price) * 0.3,
        status: "DEPOSIT_PAID",
      },
    });
  }

  console.log("Seed completed successfully!");
  console.log("Admin login: super@ahava.com / ahava2024!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
