import Link from "next/link";
import { getPageImages } from "@/services/settings";
import { whatsappCustomOrderRequest } from "@/lib/whatsapp";
import { BackgroundMedia } from "@/components/store/background-media";
import { Breadcrumb } from "@/components/store/breadcrumb";
import {
  CustomOrderJourney,
  CustomOrderSidebar,
} from "@/components/store/custom-orders/custom-order-ui";
import { PageHeader } from "@/components/store/page-header";
import { SectionHeader } from "@/components/store/section-header";
import { StoreContainer } from "@/components/store/store-container";
import { storePagePaddingClass, storeHeadingSmClass, storePageFooterClass } from "@/components/store/store-ui";
import { Button } from "@/components/ui/button";
import {
  Camera,
  CheckCircle,
  MessageSquare,
  Ruler,
  Scissors,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Custom Dress Orders",
  description:
    "Commission a custom bridal gown with AHAVAH — share inspiration, secure your order, and refine the fit before your wedding.",
  path: "/custom-orders",
});

const steps = [
  {
    step: "01",
    title: "Inspiration & quote",
    description: "Share dress inspiration photos so AHAVA understands your vision.",
    icon: Sparkles,
  },
  {
    step: "02",
    title: "Secure your order",
    description: "Place your order 2–3 months in advance and make your deposit.",
    icon: Scissors,
  },
  {
    step: "03",
    title: "Design details",
    description: "Detailed quote sent; 70% payment secures your custom pattern.",
    icon: MessageSquare,
  },
  {
    step: "04",
    title: "Pattern confirmation",
    description: "Design sent to designer; sketch shared for approval if needed.",
    icon: Ruler,
  },
  {
    step: "05",
    title: "Production begins",
    description: "Dress making commences after your approval.",
    icon: Scissors,
  },
  {
    step: "06",
    title: "Progress updates",
    description: "Photos shared at different stages for your approval.",
    icon: Camera,
  },
  {
    step: "07",
    title: "Final approval",
    description: "Final photos and videos sent and 30% balance paid before shipping.",
    icon: CheckCircle,
  },
];

export default async function CustomOrdersPage() {
  const pageImages = await getPageImages();

  const quoteUrl = whatsappCustomOrderRequest({
    name: "[Your Name]",
    phone: "[Your Phone]",
    eventDate: "[Event Date]",
    inspiration: "[Describe your dream dress or share inspiration]",
  });

  const requirements = [
    "Inspiration photos and reference images",
    "Event or wedding date",
    "Design consultation preferences",
    "Required measurements (we'll guide you based on the design)",
  ];

  return (
    <>
      <div className="relative h-[260px] overflow-hidden border-b border-border sm:h-[320px]">
        <BackgroundMedia
          imageUrl={pageImages.customOrdersHero}
          alt="Custom bridal dress design"
          overlayClassName="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/30"
        />
      </div>

      <StoreContainer className={storePagePaddingClass}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Custom Orders" }]} />

        <PageHeader
          eyebrow="Bespoke design"
          title="Custom Dress Orders"
          description="Have a unique vision? We will bring your dream gown to life with our bespoke design and production service."
          align="center"
          showAccent={false}
        />

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <section className="lg:col-span-7">
            <SectionHeader
              eyebrow="The journey"
              title="Seven stages to your gown"
              description="A collaborative process from first sketch to final stitch."
              className="mb-8"
            />

            <div className="overflow-hidden rounded-2xl border border-border">
              <CustomOrderJourney steps={steps} />
            </div>
          </section>

          <div className="lg:col-span-5">
            <CustomOrderSidebar requirements={requirements}>
              <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6 text-center sm:p-8">
                <p className="mb-6 text-sm italic text-foreground/70 text-pretty">
                  Custom orders require a 2–3 month lead time. Start early for the best
                  experience.
                </p>
                <Button
                  asChild
                  variant="whatsapp"
                  size="lg"
                  className="h-14 w-full rounded-full text-lg"
                >
                  <a href={quoteUrl} target="_blank" rel="noopener noreferrer">
                    Request custom quote
                  </a>
                </Button>
              </div>
            </CustomOrderSidebar>
          </div>
        </div>

        <div className={storePageFooterClass}>
          <p className={cn("mb-6 text-foreground", storeHeadingSmClass)}>
            Prefer something ready to wear?
          </p>
          <Button asChild size="lg" className="h-12 rounded-full px-10">
            <Link href="/shop">Shop available dresses</Link>
          </Button>
        </div>
      </StoreContainer>
    </>
  );
}
