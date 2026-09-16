/** Strip to digits for wa.me links (Malawi +265…). */
export function normalizeWhatsAppDigits(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "265980512870";
  if (digits.startsWith("265")) return digits;
  if (digits.startsWith("0")) return `265${digits.slice(1)}`;
  return digits;
}

export function buildWhatsAppUrl(message: string, phoneDigits: string): string {
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`;
}
