import Link from "next/link";
import { storePanelClass, storeHeadingLgClass, storeHeadingSmClass } from "@/components/store/store-ui";
import { getActiveEventPackages } from "@/services/event-packages";
import { whatsappGeneral } from "@/lib/whatsapp";
import { EMAILS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { EventPackageCard } from "@/components/store/event-package-card";
import { PackageComparisonTable } from "@/components/store/package-comparison-table";
import { PageBreadcrumb } from "@/components/store/section-heading";
import { StoreContainer } from "@/components/store/store-container";
import { cn } from "@/lib/utils";
import { CalendarHeart, MessageCircle, Mail } from "lucide-react";

import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Event Packages",
  description:
    "Compare AHAVAH wedding and event packages — Silver, Gold, Platinum, and Custom plans sized for your celebration.",
  path: "/events/packages",
});

export default async function EventPackagesPage() {
  const packages = await getActiveEventPackages();
  const featuredSlug = packages.find((p) => p.name.toLowerCase().includes("gold"))?.slug;

  return (
    <StoreContainer className="py-8 md:py-12">
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: "Packages" },
        ]}
      />

      <div className="mb-8 max-w-2xl">
        <h1 className={storeHeadingLgClass}>
          Event Packages
        </h1>
        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
          Four options: Silver, Gold, Platinum, and Custom. Choose a curated tier or tell us
          exactly what you need — you are never limited to the three standard packages.
        </p>
      </div>

      {packages.length > 0 ? (
        <>
          <div className="grid items-stretch gap-5 sm:grid-cols-2 xl:grid-cols-4 md:gap-4">
            {packages.map((pkg) => (
              <EventPackageCard
                key={pkg.id}
                pkg={{
                  id: pkg.id,
                  name: pkg.name,
                  slug: pkg.slug,
                  description: pkg.description,
                  price: Number(pkg.price),
                  guestCount: pkg.guestCount,
                  image: pkg.image,
                  images: pkg.images,
                  servicesIncluded: pkg.servicesIncluded,
                }}
                featured={pkg.slug === featuredSlug}
                showServices
              />
            ))}
          </div>

          <PackageComparisonTable packages={packages} />

          <section className={`mt-12 text-center ${storePanelClass} bg-secondary/50`}>
            <h2 className={cn(storeHeadingSmClass, "mb-3 md:text-3xl")}>
              Start with Custom
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto mb-6">
              Already know you need a mix of services, a different guest count, or something
              entirely unique? Open the Custom package or message us directly.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild variant="whatsapp">
                <a
                  href={whatsappGeneral("Hello AHAVA Events! I would like a custom event package quote.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Request custom quote
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href={`mailto:${EMAILS.events}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  {EMAILS.events}
                </a>
              </Button>
            </div>
          </section>
        </>
      ) : (
        <div className="py-20 text-center">
          <CalendarHeart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-5" />
          <h2 className={cn(storeHeadingSmClass, "mb-3 md:text-3xl")}>Packages coming soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            Our event packages are being updated. Reach out now for a personalised quote.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="whatsapp">
              <a
                href={whatsappGeneral("Hello AHAVA Events! I would like a custom event quote.")}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp us
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/events">Back to Events</Link>
            </Button>
          </div>
        </div>
      )}
    </StoreContainer>
  );
}
