import { getPageImages, getSettings } from "@/services/settings";
import { getSiteContent } from "@/services/site-content";
import { StoreContainer } from "@/components/store/store-container";
import { PageHeader } from "@/components/store/page-header";
import { SectionHeader } from "@/components/store/section-header";
import { Breadcrumb } from "@/components/store/breadcrumb";
import {
  storeCardHoverClass,
  storeIconWrapClass,
  storePanelClass,
  storePagePaddingClass,
  storeSectionClass,
  storeHeadingMdClass,
  storeHeadingXsClass,
  storeHeadingLabelClass,
} from "@/components/store/store-ui";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MapPin, Clock, Heart, Sparkles, Scissors, CalendarCheck } from "lucide-react";

import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About Us",
  description:
    "Meet AHAVAH Bridal Emporium — wedding dress hire, custom gowns, fittings, and event planning on Ufulu Road, Blantyre.",
  path: "/about",
});

export default async function AboutPage() {
  const [pageImages, settings, { siteContent }] = await Promise.all([
    getPageImages(),
    getSettings(),
    getSiteContent(),
  ]);
  const { shopName, tagline } = settings;
  const { contact } = siteContent;

  return (
    <StoreContainer className={storePagePaddingClass}>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "About" },
        ]}
      />

      {/* Page Header */}
      <PageHeader
        title={`About ${shopName}`}
        description={tagline}
        align="center"
        showAccent={false}
      />

      {/* Story Section */}
      <section className={storeSectionClass}>
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-border shadow-[0_8px_32px_rgba(44,36,32,0.1)]">
            <img
              src={pageImages.aboutHero}
              alt={`${shopName} boutique`}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-6 leading-relaxed text-foreground/75">
            <p className="text-lg">
              {shopName} is a premier bridal and events business based in
              Malawi. We believe every bride deserves a gown as unique as her
              love story.
            </p>
            <p className="text-lg">
              Whether you are browsing our curated in-stock collection, commissioning a
              custom design, or entrusting us with your entire wedding day, our dedicated
              team brings warmth, expertise, and meticulous attention to detail to every
              interaction.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="space-y-3">
                <div className={storeIconWrapClass}>
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className={storeHeadingLabelClass}>Passion</h3>
                <p className="text-sm text-foreground/70">
                  Dedicated to making your dream wedding a reality.
                </p>
              </div>
              <div className="space-y-3">
                <div className={storeIconWrapClass}>
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className={storeHeadingLabelClass}>Quality</h3>
                <p className="text-sm text-foreground/70">
                  Curated gowns and premium event services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={storeSectionClass}>
        <SectionHeader
          title="Our Services"
          align="center"
          showAccent={false}
        />

        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Bridal Gowns",
              desc: "Premium wedding dress hire and sales, along with bridesmaid and reception collections.",
            },
            {
              icon: Scissors,
              title: "Custom Designs",
              desc: "Bespoke dress design and production tailored perfectly to your measurements and vision.",
            },
            {
              icon: CalendarCheck,
              title: "Event Planning",
              desc: "Full wedding and event coordination to ensure your special day runs flawlessly.",
            },
          ].map((item) => (
            <Card key={item.title} className={storeCardHoverClass}>
              <CardContent className="space-y-4 p-8 text-center">
                <div className={`${storeIconWrapClass} mx-auto`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className={storeHeadingXsClass}>{item.title}</h3>
                <p className="text-sm leading-relaxed text-foreground/70">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Visit Section */}
      <section className={storePanelClass}>
        <h2 className={cn("mb-8 text-center", storeHeadingMdClass)}>
          Visit Our Emporium
        </h2>
        <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-2">
          <div className="flex items-start gap-4">
            <div className={storeIconWrapClass}>
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className={cn("mb-2", storeHeadingLabelClass)}>Location</h3>
              <p className="text-foreground/75">
                {contact.address}
                <br />
                {contact.city}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className={storeIconWrapClass}>
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className={cn("mb-2", storeHeadingLabelClass)}>Hours</h3>
              <ul className="space-y-1 text-sm text-foreground/75">
                {contact.openingHours.map((h, i) => (
                  <li key={i}>
                    <span className="font-medium">{h.days}:</span> {h.hours}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs font-semibold text-primary">
                APPOINTMENTS REQUIRED FOR FITTINGS
              </p>
            </div>
          </div>
        </div>
      </section>
    </StoreContainer>
  );
}
