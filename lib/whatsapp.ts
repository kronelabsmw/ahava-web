import { APP_NAME } from "./constants";
import { buildWhatsAppUrl, normalizeWhatsAppDigits } from "./whatsapp-utils";

const FALLBACK_DIGITS =
  normalizeWhatsAppDigits(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "265980512870"
  );

function resolveDigits(phoneDigits?: string) {
  return phoneDigits || FALLBACK_DIGITS;
}

function buildUrl(message: string, phoneDigits?: string) {
  return buildWhatsAppUrl(message, resolveDigits(phoneDigits));
}

export function whatsappProductInquiry(
  params: {
    productName: string;
    size?: string;
    color?: string;
    rentalPrice?: string;
    salePrice?: string;
    productUrl: string;
    shopName?: string;
  },
  phoneDigits?: string
) {
  const shopName = params.shopName || APP_NAME;
  const lines = [
    `Hello ${shopName}!`,
    "",
    "I would like to inquire about a dress:",
    `*${params.productName}*`,
  ];
  if (params.size) lines.push(`Size: ${params.size}`);
  if (params.color) lines.push(`Color: ${params.color}`);
  if (params.rentalPrice) lines.push(`Rental: ${params.rentalPrice}`);
  if (params.salePrice) lines.push(`Sale: ${params.salePrice}`);
  lines.push("", `Link: ${params.productUrl}`);
  return buildUrl(lines.join("\n"), phoneDigits);
}

export function whatsappCartInquiry(
  items: Array<{
    name: string;
    size?: string;
    color?: string;
    price: number;
    quantity: number;
  }>,
  total: number,
  phoneDigits?: string,
  shopName?: string
) {
  const lines = [
    `Hello ${shopName || APP_NAME}!`,
    "",
    "I would like to inquire about the following dresses:",
    "",
  ];
  items.forEach((item, i) => {
    lines.push(
      `${i + 1}. *${item.name}*`,
      `   Size: ${item.size || "Any"} | Color: ${item.color || "Any"}`,
      `   Qty: ${item.quantity} | MK ${item.price.toLocaleString()}`,
      ""
    );
  });
  lines.push(`*Estimated Total: MK ${total.toLocaleString()}*`);
  return buildUrl(lines.join("\n"), phoneDigits);
}

export function whatsappFittingRequest(
  params: {
    name: string;
    phone: string;
    email?: string;
    preferredDate: string;
    preferredTime: string;
    guests: number;
    dressInterest?: string;
    shopName?: string;
  },
  phoneDigits?: string
) {
  const lines = [
    `Hello ${params.shopName || APP_NAME}!`,
    "",
    "I would like to book a fitting appointment:",
    `Name: ${params.name}`,
    `Phone: ${params.phone}`,
  ];
  if (params.email) lines.push(`Email: ${params.email}`);
  lines.push(
    `Preferred Date: ${params.preferredDate}`,
    `Preferred Time: ${params.preferredTime}`,
    `Number of Guests: ${params.guests}`
  );
  if (params.dressInterest)
    lines.push(`Dress Interest: ${params.dressInterest}`);
  return buildUrl(lines.join("\n"), phoneDigits);
}

export function whatsappCustomOrderRequest(
  params: {
    name: string;
    phone: string;
    email?: string;
    eventDate?: string;
    inspiration?: string;
    shopName?: string;
  },
  phoneDigits?: string
) {
  const lines = [
    `Hello ${params.shopName || APP_NAME}!`,
    "",
    "I would like a quote for a custom dress order:",
    `Name: ${params.name}`,
    `Phone: ${params.phone}`,
  ];
  if (params.email) lines.push(`Email: ${params.email}`);
  if (params.eventDate) lines.push(`Event Date: ${params.eventDate}`);
  if (params.inspiration)
    lines.push("", `Inspiration/Notes: ${params.inspiration}`);
  return buildUrl(lines.join("\n"), phoneDigits);
}

export function whatsappEventPackageInquiry(
  params: {
    packageName: string;
    guestCount?: number;
    eventDate?: string;
    location?: string;
    name?: string;
    phone?: string;
  },
  phoneDigits?: string
) {
  const lines = [
    "Hello AHAVA Events!",
    "",
    `I am interested in the *${params.packageName}* package.`,
  ];
  if (params.guestCount) lines.push(`Guest Count: ${params.guestCount}`);
  if (params.eventDate) lines.push(`Event Date: ${params.eventDate}`);
  if (params.location) lines.push(`Location: ${params.location}`);
  if (params.name) lines.push(`Name: ${params.name}`);
  if (params.phone) lines.push(`Phone: ${params.phone}`);
  return buildUrl(lines.join("\n"), phoneDigits);
}

export function whatsappEventQuote(
  params: {
    name: string;
    phone: string;
    email?: string;
    body: string;
  },
  phoneDigits?: string
) {
  const lines = [
    "Hello AHAVA Events!",
    "",
    "I would like to request a custom quote:",
    `Name: ${params.name}`,
    `Phone: ${params.phone}`,
  ];
  if (params.email?.trim()) lines.push(`Email: ${params.email.trim()}`);
  lines.push("", params.body);
  return buildUrl(lines.join("\n"), phoneDigits);
}

export function whatsappGeneral(
  message?: string,
  phoneDigits?: string,
  shopName?: string
) {
  return buildUrl(
    message || `Hello ${shopName || APP_NAME}! I would like to get in touch.`,
    phoneDigits
  );
}
