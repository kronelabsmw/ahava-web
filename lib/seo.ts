import type { Metadata } from "next";
import {
  APP_DESCRIPTION,
  APP_NAME,
  EMAILS,
  LOGO_PATH,
  PHONES,
  SHOP_ADDRESS,
  SHOP_CITY,
  SOCIAL_LINKS,
  WHATSAPP_FULL,
} from "@/lib/constants";

/** Default share image for non-product pages (relative to site origin). */
export const DEFAULT_OG_IMAGE_PATH = "/images/bg-image.jpeg";

export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${production.replace(/\/$/, "")}`;

  const preview = process.env.VERCEL_URL?.trim();
  if (preview) return `https://${preview.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function toAbsoluteImage(src: string): string {
  if (src.startsWith("data:")) return absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return absoluteUrl(src);
}

type PageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  /** Absolute or site-relative image URLs */
  images?: string[];
  noIndex?: boolean;
};

/** Shared title/description/canonical/OG/Twitter metadata for store pages. */
export function buildPageMetadata({
  title,
  description,
  path,
  images,
  noIndex = false,
}: PageMetadataOptions): Metadata {
  const imageList = (images?.length ? images : [DEFAULT_OG_IMAGE_PATH]).map(
    toAbsoluteImage
  );

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName: APP_NAME,
      locale: "en_MW",
      images: imageList.map((url) => ({ url })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageList,
    },
    ...(noIndex
      ? { robots: { index: false, follow: false, nocache: true } }
      : {}),
  };
}

export function buildLocalBusinessJsonLd() {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "BridalShop",
    "@id": `${siteUrl}/#organization`,
    name: `${APP_NAME} Bridal Emporium`,
    alternateName: APP_NAME,
    description: APP_DESCRIPTION,
    url: siteUrl,
    logo: absoluteUrl(LOGO_PATH),
    image: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
    telephone: WHATSAPP_FULL,
    email: EMAILS.bridal,
    address: {
      "@type": "PostalAddress",
      streetAddress: SHOP_ADDRESS,
      addressLocality: "Blantyre",
      addressCountry: "MW",
    },
    areaServed: {
      "@type": "City",
      name: SHOP_CITY,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "09:00",
      closes: "15:30",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: PHONES[0],
        contactType: "customer service",
        areaServed: "MW",
        availableLanguage: ["English"],
      },
    ],
    sameAs: [
      SOCIAL_LINKS.instagramBridal,
      SOCIAL_LINKS.instagramEvents,
      SOCIAL_LINKS.tiktok,
      SOCIAL_LINKS.x,
    ],
  };
}

export type BreadcrumbJsonLdItem = {
  name: string;
  path?: string;
};

export function buildBreadcrumbJsonLd(items: BreadcrumbJsonLdItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path
        ? { item: absoluteUrl(item.path) }
        : {}),
    })),
  };
}

type ProductOfferInput = {
  name: string;
  description: string;
  slug: string;
  imageUrls: string[];
  brandName?: string | null;
  categoryName?: string | null;
  sku?: string | null;
  listingType: "HIRE" | "SALE" | "HIRE_AND_SALE";
  hirePrice: number;
  purchasePrice?: number | null;
  inStock: boolean;
};

export function buildProductJsonLd(product: ProductOfferInput) {
  const url = absoluteUrl(`/products/${product.slug}`);
  const availability = product.inStock
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";

  const offers: Record<string, unknown>[] = [];

  if (product.listingType === "HIRE" || product.listingType === "HIRE_AND_SALE") {
    offers.push({
      "@type": "Offer",
      name: "Dress hire",
      url,
      priceCurrency: "MWK",
      price: product.hirePrice,
      availability,
      itemCondition: "https://schema.org/UsedCondition",
    });
  }

  if (product.listingType === "SALE") {
    offers.push({
      "@type": "Offer",
      name: "Purchase",
      url,
      priceCurrency: "MWK",
      price: product.hirePrice,
      availability,
      itemCondition: "https://schema.org/NewCondition",
    });
  } else if (
    product.listingType === "HIRE_AND_SALE" &&
    product.purchasePrice != null &&
    product.purchasePrice > 0
  ) {
    offers.push({
      "@type": "Offer",
      name: "Purchase",
      url,
      priceCurrency: "MWK",
      price: product.purchasePrice,
      availability,
      itemCondition: "https://schema.org/NewCondition",
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url,
    image: product.imageUrls.length
      ? product.imageUrls.map(toAbsoluteImage)
      : [absoluteUrl(DEFAULT_OG_IMAGE_PATH)],
    ...(product.brandName
      ? { brand: { "@type": "Brand", name: product.brandName } }
      : {}),
    ...(product.categoryName ? { category: product.categoryName } : {}),
    ...(product.sku ? { sku: product.sku } : {}),
    offers: offers.length === 1 ? offers[0] : offers,
  };
}
