import { EVENT_SERVICES } from "@/lib/constants";
import { getActiveEventPackages } from "@/services/event-packages";
import { getPageImages, getSiteVideos } from "@/services/settings";
import { getStorefrontConfig } from "@/services/storefront";
import { whatsappGeneral } from "@/lib/whatsapp";
import { EventsPageContent } from "@/components/store/events/events-page-content";
import type { EventPackageCardData } from "@/components/store/event-package-card";

import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Event Planning",
  description:
    "Full wedding and event planning with AHAVAH — venue, décor, vendors, and day-of coordination in Blantyre, Malawi.",
  path: "/events",
});

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Consultation",
    description:
      "Share your vision, guest count, and budget so we can recommend the right approach.",
  },
  {
    step: "02",
    title: "Planning",
    description:
      "We coordinate vendors, timelines, and logistics tailored to your celebration.",
  },
  {
    step: "03",
    title: "Coordination",
    description:
      "On the day, our team manages details so you stay present with loved ones.",
  },
  {
    step: "04",
    title: "Celebration",
    description:
      "Enjoy a seamless event while we handle the behind-the-scenes execution.",
  },
];

function serializePackages(
  packages: Awaited<ReturnType<typeof getActiveEventPackages>>
): EventPackageCardData[] {
  return packages.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    slug: pkg.slug,
    description: pkg.description,
    price: Number(pkg.price),
    guestCount: pkg.guestCount,
    image: pkg.image,
    servicesIncluded: pkg.servicesIncluded,
  }));
}

export default async function EventsPage() {
  const [packages, pageImages, siteVideos, config] = await Promise.all([
    getActiveEventPackages(),
    getPageImages(),
    getSiteVideos(),
    getStorefrontConfig(),
  ]);
  const featuredSlug = packages.find((p) => p.name.toLowerCase().includes("gold"))?.slug;

  return (
    <EventsPageContent
      services={EVENT_SERVICES}
      processSteps={PROCESS_STEPS}
      processImageUrl={pageImages.eventsProcess}
      heroVideoUrl={siteVideos.eventsHero}
      heroImageUrl={pageImages.eventsHero}
      packages={serializePackages(packages)}
      featuredSlug={featuredSlug}
      whatsappUrl={whatsappGeneral(
        "Hello AHAVA Events! I would like to discuss event planning.",
        config.whatsappDigits,
        config.shopName
      )}
      whatsappDigits={config.whatsappDigits}
    />
  );
}
