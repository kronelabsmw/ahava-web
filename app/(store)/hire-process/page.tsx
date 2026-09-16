import Link from "next/link";
import { getPageImages } from "@/services/settings";
import { HIRE_POLICIES } from "@/lib/constants";
import { formatPrice, cn } from "@/lib/utils";
import { BackgroundMedia } from "@/components/store/background-media";
import { Breadcrumb } from "@/components/store/breadcrumb";
import {
  HireFlowSteps,
  HireDepositCards,
  HireLocationCompare,
} from "@/components/store/hire-process/hire-ui";
import { NoticePanel } from "@/components/store/notice-panel";
import { PageHeader } from "@/components/store/page-header";
import { SectionHeader } from "@/components/store/section-header";
import { StoreContainer } from "@/components/store/store-container";
import { storePagePaddingClass, storeSectionClass, storeHeadingSmClass, storePageFooterClass } from "@/components/store/store-ui";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock } from "lucide-react";

import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Dress Hire Process",
  description:
    "How wedding dress hire works at AHAVAH — deposits, fittings, pickup and return timelines for Blantyre and beyond.",
  path: "/hire-process",
});

export default async function HireProcessPage() {
  const pageImages = await getPageImages();

  const steps = [
    {
      step: "01",
      title: "Select & Fit",
      description:
        "Choose your dress and confirm sizing or any alterations needed before you book.",
    },
    {
      step: "02",
      title: "Secure Booking",
      description: `Pay a ${HIRE_POLICIES.bookingDepositPercent} deposit to reserve your gown for your wedding date.`,
    },
    {
      step: "03",
      title: "Final Payment",
      description:
        "Settle the remaining balance in full when you collect the dress before your wedding.",
    },
    {
      step: "04",
      title: "Return",
      description:
        "Bring the dress back within the agreed window after your celebration.",
    },
  ];

  return (
    <>
      <div className="relative h-[260px] overflow-hidden border-b border-border sm:h-[320px]">
        <BackgroundMedia
          imageUrl={pageImages.hireProcessHero}
          alt="Wedding dress hire"
          overlayClassName="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/30"
        />
      </div>

      <StoreContainer className={storePagePaddingClass}>
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Hire Process" }]} />

        <PageHeader
          eyebrow="Hire with confidence"
          title="Dress Hire Process"
          description="Clear steps, transparent deposits, and timelines tailored to where you celebrate."
          align="center"
          showAccent={false}
        />

        <section className={storeSectionClass}>
          <SectionHeader
            eyebrow="The journey"
            title="How it works"
            description="From first fitting to final return - every stage explained."
            className="mb-8"
          />
          <HireFlowSteps steps={steps} />
        </section>

        <section className={storeSectionClass}>
          <SectionHeader
            eyebrow="Before you book"
            title="Deposits & reservation"
            description="What we require to secure your dress and protect both parties."
            className="mb-8"
          />
          <HireDepositCards
            bookingDepositPercent={HIRE_POLICIES.bookingDepositPercent}
            securityDeposit={HIRE_POLICIES.securityDeposit}
          />
        </section>

        <section className={storeSectionClass}>
          <SectionHeader
            eyebrow="Logistics"
            title="Pickup & return"
            description="Timelines depend on where you celebrate. Plan ahead so your dress arrives with time to spare."
            className="mb-8"
          />
          <HireLocationCompare
            local={{
              location: "Blantyre",
              subtitle: "Weddings in and around Blantyre",
              pickupDays: HIRE_POLICIES.pickupDaysBlantyre,
              returnDays: HIRE_POLICIES.returnDaysBlantyre,
            }}
            remote={{
              location: "Outside Blantyre",
              subtitle: "Destination or out-of-town celebrations",
              pickupDays: HIRE_POLICIES.pickupDaysOutside,
              returnDays: HIRE_POLICIES.returnDaysOutside,
            }}
          />
        </section>

        <section className={`${storeSectionClass} pb-4`}>
          <SectionHeader
            eyebrow="Important"
            title="Policies"
            description="Please read carefully before confirming your hire."
            className="mb-8"
          />
          <div className="grid gap-6 md:grid-cols-2">
            <NoticePanel icon={AlertTriangle} title="Cancellation policy" variant="warning">
              Bookings are{" "}
              <strong className="font-semibold text-foreground">
                non-cancellable and non-refundable
              </strong>
              . Any payments made prior to cancellation will not be refunded under any
              circumstances.
            </NoticePanel>
            <NoticePanel icon={Clock} title="Late return penalties" variant="info">
              A fee of{" "}
              <strong className="font-semibold text-foreground">
                {formatPrice(HIRE_POLICIES.lateFeePerDay)} per day
              </strong>{" "}
              applies after the agreed return deadline until the dress is returned to us.
            </NoticePanel>
          </div>
        </section>

        <div className={storePageFooterClass}>
          <p className={cn("mb-6 text-foreground", storeHeadingSmClass)}>
            Ready to find your gown?
          </p>
          <Button asChild size="lg" className="h-12 rounded-full px-10">
            <Link href="/shop">Browse available dresses</Link>
          </Button>
        </div>
      </StoreContainer>
    </>
  );
}
