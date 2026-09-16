import { getStorefrontConfig } from "@/services/storefront";
import { whatsappGeneral } from "@/lib/whatsapp";
import {
  storeCardHoverClass,
  storeDividerClass,
  storePanelClass,
  storePagePaddingClass,
  storeIconWrapClass,
  storeHeadingXsClass,
  storeHeadingSmClass,
} from "@/components/store/store-ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/store/page-header";
import { Breadcrumb } from "@/components/store/breadcrumb";
import { InquiryForm } from "@/components/store/inquiry-form";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  Instagram,
  Twitter,
  Video,
} from "lucide-react";
import { StoreContainer } from "@/components/store/store-container";

import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact",
  description:
    "Contact AHAVAH for dress hire, fittings, custom orders, or event planning in Blantyre. WhatsApp, phone, email, and walk-in appointments.",
  path: "/contact",
});

export default async function ContactPage() {
  const config = await getStorefrontConfig();
  const { shopName, whatsappDigits, siteContent } = config;
  const { contact } = siteContent;

  return (
    <StoreContainer className={storePagePaddingClass}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />

      <PageHeader
        title="Contact Us"
        description="We'd love to hear from you. Send an inquiry below or reach us directly for dress enquiries, fittings, custom orders, or event planning."
        align="center"
        showAccent={false}
      />

      <div className="mb-16 grid gap-8 lg:grid-cols-5">
        <Card className={cn(storeCardHoverClass, "lg:col-span-2")}>
          <CardContent className="p-8">
            <h2 className={cn("mb-2", storeHeadingXsClass)}>Send an inquiry</h2>
            <p className="mb-6 text-sm text-foreground/70">
              Your message is saved to our system so our team can follow up. You can
              also chat with us on WhatsApp anytime.
            </p>
            <InquiryForm />
          </CardContent>
        </Card>

        <div className="grid gap-8 md:grid-cols-2 lg:col-span-3">
          <Card className={storeCardHoverClass}>
            <CardContent className="space-y-8 p-8">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className={storeIconWrapClass}>
                    <MapPin className="h-5 w-5" />
                  </div>
                  <h2 className={storeHeadingXsClass}>Location</h2>
                </div>
                <p className="ml-14 leading-relaxed text-foreground/75">
                  {contact.address}
                  <br />
                  {contact.city}
                </p>
              </div>

              <div className={storeDividerClass} />

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className={storeIconWrapClass}>
                    <Clock className="h-5 w-5" />
                  </div>
                  <h2 className={storeHeadingXsClass}>Opening Hours</h2>
                </div>
                <div className="ml-14 space-y-2">
                  {contact.openingHours.map((h) => (
                    <div key={h.days}>
                      <p className="text-sm font-medium">{h.days}</p>
                      <p className="text-sm text-foreground/70">
                        {h.hours}
                        {h.notes && (
                          <span className="ml-2 text-primary">({h.notes})</span>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={storeCardHoverClass}>
            <CardContent className="space-y-8 p-8">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className={storeIconWrapClass}>
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <h2 className={storeHeadingXsClass}>Phone</h2>
                </div>

                <div className="ml-14 space-y-1">
                  {contact.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="block text-sm text-foreground/75 transition-colors hover:text-primary"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>

              <div className={storeDividerClass} />

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className={storeIconWrapClass}>
                    <Mail className="h-5 w-5" />
                  </div>
                  <h2 className={storeHeadingXsClass}>Email</h2>
                </div>
                <div className="ml-14 space-y-1 text-sm">
                  <a
                    href={`mailto:${contact.emails.bridal}`}
                    className="block text-foreground/75 transition-colors hover:text-primary"
                  >
                    <span className="font-medium text-foreground">Bridal: </span>
                    {contact.emails.bridal}
                  </a>
                  <a
                    href={`mailto:${contact.emails.events}`}
                    className="block text-foreground/75 transition-colors hover:text-primary"
                  >
                    <span className="font-medium text-foreground">Events: </span>
                    {contact.emails.events}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className={storePanelClass}>
        <h2 className={cn("mb-4 text-center", storeHeadingSmClass)}>
          Connect With Us
        </h2>
        <p className="mb-8 text-center text-sm text-foreground/70">
          Follow us on social media for inspiration, updates, and behind-the-scenes moments
        </p>

        <div className="mb-12 flex flex-wrap justify-center gap-6">
          {[
            { href: contact.social.instagramBridal, icon: Instagram, label: "Bridal" },
            { href: contact.social.instagramEvents, icon: Instagram, label: "Events" },
            { href: contact.social.tiktok, icon: Video, label: "TikTok" },
            { href: contact.social.x, icon: Twitter, label: "X" },
          ].map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-foreground transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                <social.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">{social.label}</span>
            </a>
          ))}
        </div>

        <div className={`space-y-4 border-t border-border pt-8 text-center ${storeDividerClass}`}>
          <Button
            asChild
            variant="whatsapp"
            size="lg"
            className="h-12 rounded-full px-8 text-base"
          >
            <a
              href={whatsappGeneral(undefined, whatsappDigits, shopName)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat on WhatsApp
            </a>
          </Button>
          <p className="text-xs text-foreground/60">
            We typically reply within a few hours during business hours
          </p>
        </div>
      </div>
    </StoreContainer>
  );
}
