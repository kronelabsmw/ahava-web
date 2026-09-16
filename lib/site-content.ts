import {
  APP_DESCRIPTION,
  EMAILS,
  OPENING_HOURS,
  PHONES,
  SHOP_ADDRESS,
  SHOP_CITY,
  SOCIAL_LINKS,
  STORE_ANNOUNCEMENT,
} from "@/lib/constants";

export type Testimonial = {
  name: string;
  location: string;
  text: string;
  rating: number;
};

export type OpeningHoursEntry = {
  days: string;
  hours: string;
  notes?: string;
};

export type SiteContact = {
  address: string;
  city: string;
  phones: string[];
  emails: {
    bridal: string;
    events: string;
  };
  social: {
    tiktok: string;
    instagramBridal: string;
    instagramEvents: string;
    x: string;
  };
  openingHours: OpeningHoursEntry[];
};

export type SiteContent = {
  announcement: string;
  footerDescription: string;
  testimonialsTitle: string;
  testimonialsSubtitle: string;
  testimonials: Testimonial[];
  contact: SiteContact;
};

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: "Grace M.",
    location: "Blantyre",
    text: "AHAVAH made my wedding day absolutely magical. The dress fit perfectly after two fittings, and the team was professional and caring throughout.",
    rating: 5,
  },
  {
    name: "Chisomo B.",
    location: "Limbe",
    text: "I hired my dream gown and the process was seamless - clear pricing, WhatsApp updates, and beautiful dresses. Highly recommend.",
    rating: 5,
  },
  {
    name: "Thandiwe K.",
    location: "Blantyre",
    text: "From custom design to event coordination, AHAVA exceeded every expectation. Our wedding ran smoothly from start to finish.",
    rating: 5,
  },
  {
    name: "Mercy N.",
    location: "Zomba",
    text: "The fitting experience was wonderful. Patient, knowledgeable staff who helped me find the perfect dress for my shape and style.",
    rating: 5,
  },
];

export const DEFAULT_SITE_CONTENT: SiteContent = {
  announcement: STORE_ANNOUNCEMENT,
  footerDescription: APP_DESCRIPTION,
  testimonialsTitle: "What Our Brides Say",
  testimonialsSubtitle:
    "Real stories from brides across Malawi who trusted AHAVAH for their special day",
  testimonials: DEFAULT_TESTIMONIALS,
  contact: {
    address: SHOP_ADDRESS,
    city: SHOP_CITY,
    phones: [...PHONES],
    emails: { ...EMAILS },
    social: { ...SOCIAL_LINKS },
    openingHours: [...OPENING_HOURS],
  },
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseTestimonials(raw: unknown): Testimonial[] {
  if (!Array.isArray(raw)) return DEFAULT_SITE_CONTENT.testimonials;

  const items = raw
    .filter(isRecord)
    .map((item) => ({
      name: String(item.name ?? "").trim(),
      location: String(item.location ?? "").trim(),
      text: String(item.text ?? "").trim(),
      rating: Math.min(5, Math.max(1, Number(item.rating) || 5)),
    }))
    .filter((item) => item.name && item.text);

  return items.length > 0 ? items : DEFAULT_SITE_CONTENT.testimonials;
}

function parseOpeningHours(raw: unknown): OpeningHoursEntry[] {
  if (!Array.isArray(raw)) return DEFAULT_SITE_CONTENT.contact.openingHours;

  const items = raw
    .filter(isRecord)
    .map((item) => ({
      days: String(item.days ?? "").trim(),
      hours: String(item.hours ?? "").trim(),
      notes: item.notes ? String(item.notes).trim() : undefined,
    }))
    .filter((item) => item.days && item.hours);

  return items.length > 0 ? items : DEFAULT_SITE_CONTENT.contact.openingHours;
}

function parseContact(raw: unknown): SiteContact {
  const base = DEFAULT_SITE_CONTENT.contact;
  if (!isRecord(raw)) return base;

  const emails = isRecord(raw.emails) ? raw.emails : {};
  const social = isRecord(raw.social) ? raw.social : {};

  const phones = Array.isArray(raw.phones)
    ? raw.phones.map((p) => String(p).trim()).filter(Boolean)
    : base.phones;

  return {
    address: String(raw.address ?? base.address).trim() || base.address,
    city: String(raw.city ?? base.city).trim() || base.city,
    phones: phones.length > 0 ? phones : base.phones,
    emails: {
      bridal:
        String(emails.bridal ?? base.emails.bridal).trim() || base.emails.bridal,
      events:
        String(emails.events ?? base.emails.events).trim() || base.emails.events,
    },
    social: {
      tiktok: String(social.tiktok ?? base.social.tiktok).trim() || base.social.tiktok,
      instagramBridal:
        String(social.instagramBridal ?? base.social.instagramBridal).trim() ||
        base.social.instagramBridal,
      instagramEvents:
        String(social.instagramEvents ?? base.social.instagramEvents).trim() ||
        base.social.instagramEvents,
      x: String(social.x ?? base.social.x).trim() || base.social.x,
    },
    openingHours: parseOpeningHours(raw.openingHours),
  };
}

export function parseSiteContent(raw: unknown): SiteContent {
  if (typeof raw === "string") {
    try {
      return parseSiteContent(JSON.parse(raw));
    } catch {
      return DEFAULT_SITE_CONTENT;
    }
  }

  if (!isRecord(raw)) return DEFAULT_SITE_CONTENT;

  return {
    announcement:
      String(raw.announcement ?? DEFAULT_SITE_CONTENT.announcement).trim() ||
      DEFAULT_SITE_CONTENT.announcement,
    footerDescription:
      String(raw.footerDescription ?? DEFAULT_SITE_CONTENT.footerDescription).trim() ||
      DEFAULT_SITE_CONTENT.footerDescription,
    testimonialsTitle:
      String(raw.testimonialsTitle ?? DEFAULT_SITE_CONTENT.testimonialsTitle).trim() ||
      DEFAULT_SITE_CONTENT.testimonialsTitle,
    testimonialsSubtitle:
      String(raw.testimonialsSubtitle ?? DEFAULT_SITE_CONTENT.testimonialsSubtitle).trim() ||
      DEFAULT_SITE_CONTENT.testimonialsSubtitle,
    testimonials: parseTestimonials(raw.testimonials),
    contact: parseContact(raw.contact),
  };
}
