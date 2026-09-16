import Link from "next/link";
import { getPageImages } from "@/services/settings";
import { formatPrice, cn } from "@/lib/utils";
import { whatsappFittingRequest } from "@/lib/whatsapp";
import { HIRE_POLICIES } from "@/lib/constants";
import { BackgroundMedia } from "@/components/store/background-media";
import { Breadcrumb } from "@/components/store/breadcrumb";
import { FittingBookingFlow, FittingChecklist } from "@/components/store/fittings/fitting-ui";
import { FittingAvailabilitySidebar } from "@/components/store/fittings/fitting-sidebar";
import { NoticePanel } from "@/components/store/notice-panel";
import { PageHeader } from "@/components/store/page-header";
import { SectionHeader } from "@/components/store/section-header";
import { StoreContainer } from "@/components/store/store-container";
import { storePagePaddingClass, storeSectionClass, storeHeadingSmClass, storePageFooterClass } from "@/components/store/store-ui";
import { Button } from "@/components/ui/button";
import { AlertCircle, Sparkles } from "lucide-react";

import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Book a Fitting",
  description:
    "Book a private bridal fitting at AHAVAH in Blantyre — up to 4 guests and 2 hours by WhatsApp appointment.",
  path: "/fittings",
});

export default async function FittingsPage() {
  const pageImages = await getPageImages();

  const bookingUrl = whatsappFittingRequest({
    name: "[Your Name]",
    phone: "[Your Phone]",
    preferredDate: "[Preferred Date]",
    preferredTime: "[Preferred Time]",
    guests: 1,
  });

  const steps = [
    {
      step: "01",
      title: "Browse",
      description: "Explore our collection and note the dresses you would like to try on.",
    },
    {
      step: "02",
      title: "Contact",
      description: "Message us on WhatsApp with your preferred date, time, and guest count.",
    },
    {
      step: "03",
      title: "Confirm",
      description: "Pay the fitting fee to secure your private appointment slot.",
    },
    {
      step: "04",
      title: "Arrive",
      description: "Come on time with comfortable undergarments and wedding-day heels.",
    },
  ];

  const bringItems = [
    "Comfortable undergarments",
    "Strapless bra (recommended)",
    "Heels similar to wedding day",
    "Hair tie for updos",
    "Inspiration photos",
    "An open mind!",
  ];

  return (
    <>
      <div className="relative h-[260px] overflow-hidden border-b border-border sm:h-[320px]">
        <BackgroundMedia
          imageUrl={pageImages.fittingsHero}
          alt="Bridal fitting room"
          overlayClassName="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/30"
        />
      </div>

      <StoreContainer className={storePagePaddingClass}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Fittings" }]} />

        <PageHeader
          eyebrow="Private appointments"
          title="Fitting Appointments"
          description="Try on dresses and find your perfect fit with our expert bridal consultants in a relaxed, private setting."
          align="center"
          showAccent={false}
        />

        <section className={storeSectionClass}>
          <SectionHeader
            eyebrow="Simple process"
            title="How to book"
            description="Four steps from browsing to your first fitting."
            className="mb-8"
          />
          <FittingBookingFlow steps={steps} />
        </section>

        <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="space-y-10 lg:col-span-3">
            <section>
              <SectionHeader
                eyebrow="Prepare"
                title="What to bring"
                description="A few essentials help us give you the most accurate fit."
                className="mb-8"
              />
              <FittingChecklist items={bringItems} />
            </section>
          </div>

          <aside className="space-y-6 lg:col-span-2">
            <FittingAvailabilitySidebar />

            <NoticePanel icon={AlertCircle} title="Appointment policies" variant="info">
              <ul className="space-y-2">
                <li>
                  Rescheduling fee:{" "}
                  <strong className="font-semibold text-foreground">
                    {formatPrice(HIRE_POLICIES.rescheduleFee)}
                  </strong>
                </li>
                <li>
                  Cancellation:{" "}
                  <strong className="font-semibold text-foreground">non-refundable</strong>
                </li>
                <li className="pt-1 italic">
                  The fitting fee is required to confirm your booking.
                </li>
              </ul>
            </NoticePanel>

            <Button
              asChild
              variant="whatsapp"
              size="lg"
              className="h-14 w-full rounded-full text-lg"
            >
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                Book via WhatsApp
              </a>
            </Button>
          </aside>
        </div>

        <div className={storePageFooterClass}>
          <Sparkles className="mx-auto mb-4 h-8 w-8 text-primary/60" />
          <p className={cn("mb-6 text-foreground", storeHeadingSmClass)}>
            Your dream dress is waiting
          </p>
          <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-10">
            <Link href="/shop">Browse the collection</Link>
          </Button>
        </div>
      </StoreContainer>
    </>
  );
}
