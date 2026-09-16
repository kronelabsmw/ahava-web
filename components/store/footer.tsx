import Link from "next/link";
import { StoreContainer } from "@/components/store/store-container";
import { BrandLogo } from "@/components/store/brand-logo";
import { Instagram, Send, MapPin, Phone, Mail, Clock } from "lucide-react";
import type { SiteContent } from "@/lib/site-content";
import { whatsappGeneral } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";

const SHOP_LINKS = [
  { href: "/shop", label: "All Dresses" },
  { href: "/categories", label: "Collections" },
  { href: "/promotions", label: "Deals & Offers" },
  { href: "/events", label: "Event Planning" },
];

const SUPPORT_LINKS = [
  { href: "/hire-process", label: "Hire Process" },
  { href: "/fittings", label: "Book a Fitting" },
  { href: "/custom-orders", label: "Custom Orders" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h4 className="border-l-2 border-primary pl-3 text-xs font-semibold uppercase tracking-wider text-primary">
        {title}
      </h4>
      {children}
    </div>
  );
}

type StoreFooterProps = {
  shopName: string;
  whatsappDigits: string;
  siteContent: SiteContent;
};

export function StoreFooter({
  shopName,
  whatsappDigits,
  siteContent,
}: StoreFooterProps) {
  const { contact, footerDescription } = siteContent;

  return (
    <footer className="mt-auto bg-[#2c2420] text-background">
      <div className="h-1 w-full bg-primary" aria-hidden />

      <StoreContainer className="py-10 md:py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-5 lg:col-span-4">
            <BrandLogo
              variant="compact"
              onDark
              showWordmark
              href="/"
              className="items-start"
              imageClassName="h-14 w-auto md:h-16"
              wordmarkClassName="mt-2 text-base text-background md:text-lg"
            />
            <p className="max-w-sm text-sm leading-relaxed text-background/70 text-pretty">
              {footerDescription}
            </p>
            <Button
              asChild
              variant="whatsapp"
              size="sm"
              className="h-10 rounded-full px-5"
            >
              <a
                href={whatsappGeneral(
                  `Hello ${shopName}! I'd like to enquire about dresses or events.`,
                  whatsappDigits,
                  shopName
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send className="mr-2 size-4" />
                WhatsApp us
              </a>
            </Button>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:pl-4">
            <FooterColumn title="Shop">
              <ul className="space-y-2 text-sm text-background/70">
                {SHOP_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-background"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterColumn>

            <FooterColumn title="Help">
              <ul className="space-y-2 text-sm text-background/70">
                {SUPPORT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-background"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>

          <div className="lg:col-span-3">
            <FooterColumn title="Visit us">
              <ul className="space-y-3 text-sm text-background/70">
                <li className="flex gap-2.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                  <span>
                    {contact.address}
                    <br />
                    {contact.city}
                  </span>
                </li>
                {contact.openingHours.map((h) => (
                  <li key={h.days} className="flex gap-2.5">
                    <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>
                      <span className="text-background/85">{h.days}</span>
                      {": "}
                      {h.hours}
                      {h.notes && (
                        <span className="text-background/55"> ({h.notes})</span>
                      )}
                    </span>
                  </li>
                ))}
                {contact.phones.map((phone) => (
                  <li key={phone} className="flex gap-2.5">
                    <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-background"
                    >
                      {phone}
                    </a>
                  </li>
                ))}
                <li className="flex gap-2.5">
                  <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="space-y-1">
                    <a
                      href={`mailto:${contact.emails.bridal}`}
                      className="block transition-colors hover:text-background"
                    >
                      {contact.emails.bridal}
                    </a>
                    <a
                      href={`mailto:${contact.emails.events}`}
                      className="block transition-colors hover:text-background"
                    >
                      {contact.emails.events}
                    </a>
                  </div>
                </li>
              </ul>

              <div className="flex gap-2 pt-2">
                <a
                  href={contact.social.instagramBridal}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Bridal"
                  className="flex size-9 items-center justify-center rounded-full border border-background/20 text-background/75 transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  <Instagram className="size-4" />
                </a>
                <a
                  href={contact.social.instagramEvents}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram Events"
                  className="flex size-9 items-center justify-center rounded-full border border-background/20 text-background/75 transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  <Instagram className="size-4" />
                </a>
                <a
                  href={contact.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex size-9 items-center justify-center rounded-full border border-background/20 text-background/75 transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.75a8.18 8.18 0 0 0 4.77 1.52V6.88a4.85 4.85 0 0 1-1.1-.19z" />
                  </svg>
                </a>
              </div>
            </FooterColumn>
          </div>
        </div>
      </StoreContainer>

      <div className="border-t border-background/10 py-5">
        <StoreContainer className="flex flex-col items-center justify-between gap-2 text-center text-xs text-background/50 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} {shopName}. All rights reserved.</p>
          <p className="text-background/40">{contact.city}</p>
        </StoreContainer>
      </div>
    </footer>
  );
}
