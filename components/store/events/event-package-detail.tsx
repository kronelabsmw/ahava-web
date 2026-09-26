import Link from "next/link";
import type { EventPackage } from "@prisma/client";
import {
  Check,
  Users,
  Info,
  ArrowLeft,
  MessageCircle,
  Mail,
  Sparkles,
  LayoutGrid,
  Wand2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getPackageTierKey,
  isCustomPackage,
  packageTierLabels,
  storeTierStyles,
} from "@/components/store/store-cards";
import {
  PackageImageCollage,
  resolvePackageImages,
} from "@/components/store/events/package-image-collage";
import { cn, formatPrice } from "@/lib/utils";
import { EMAILS } from "@/lib/constants";
import { InquiryForm } from "@/components/store/inquiry-form";

type EventPackageDetailProps = {
  pkg: EventPackage;
  inquiryUrl: string;
  eventPackageId: string;
  whatsappDigits: string;
};

export function EventPackageDetail({
  pkg,
  inquiryUrl,
  eventPackageId,
  whatsappDigits,
}: EventPackageDetailProps) {
  const tierKey = getPackageTierKey(pkg.name);
  const tier = storeTierStyles[tierKey];
  const isGold = tierKey === "gold";
  const isCustom = isCustomPackage(pkg.name) || isCustomPackage(pkg.slug);
  const photos = resolvePackageImages(pkg.images, pkg.image);
  const priceNum = Number(pkg.price);

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-5 lg:gap-10">
      <div className="space-y-8 lg:col-span-3">
        <PackageDetailHero
          name={pkg.name}
          images={photos}
          tierKey={tierKey}
          tier={tier}
          isGold={isGold}
          isCustom={isCustom}
        />

        <header className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {isCustom ? "Option 4 · Fully flexible" : `${packageTierLabels[tierKey]} tier`}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance sm:text-3xl">
            {pkg.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            {pkg.guestCount != null && pkg.guestCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background px-2.5 py-1 text-xs text-muted-foreground">
                <Users className="size-3.5 shrink-0" />
                Up to {pkg.guestCount} guests
              </span>
            )}
            <span
              className={cn(
                "inline-flex items-baseline gap-1 rounded-md px-2.5 py-1 text-sm font-semibold tabular-nums lg:hidden",
                tier.inset,
                tier.accent
              )}
            >
              {isCustom || priceNum <= 0 ? (
                "Quote on request"
              ) : (
                <>
                  {formatPrice(priceNum)}
                  <span className="text-[11px] font-normal text-muted-foreground">from</span>
                </>
              )}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/75 text-pretty sm:text-base">
            {pkg.description}
          </p>
        </header>

        {pkg.servicesIncluded.length > 0 && (
          <section className={cn("rounded-2xl border p-5 sm:p-6", tier.border, tier.inset)}>
            <h2 className="text-sm font-semibold text-foreground">
              {isCustom ? "Available to include" : "What's included"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {isCustom
                ? "Mix and match any of these — or ask for something else"
                : `${pkg.servicesIncluded.length} services in this package`}
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {pkg.servicesIncluded.map((service) => (
                <li
                  key={service}
                  className="flex items-start gap-2.5 rounded-lg bg-card/80 px-3 py-2.5 text-sm text-foreground/85"
                >
                  <Check className={cn("mt-0.5 size-3.5 shrink-0", tier.accent)} />
                  <span className="text-pretty">{service}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {pkg.additionalCharges && (
          <aside className="flex gap-3 rounded-xl border border-border bg-secondary/40 p-4 sm:p-5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card">
              <Info className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Good to know</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/70 text-pretty">
                {pkg.additionalCharges}
              </p>
            </div>
          </aside>
        )}

        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <Link href="/events/packages">
            <ArrowLeft className="mr-1.5 size-4" />
            All packages
          </Link>
        </Button>
      </div>

      <aside className="lg:col-span-2">
        <div className="sticky top-24">
          <PackageBookingCard
            pkg={pkg}
            inquiryUrl={inquiryUrl}
            eventPackageId={eventPackageId}
            whatsappDigits={whatsappDigits}
            tierKey={tierKey}
            tier={tier}
            isGold={isGold}
            isCustom={isCustom}
          />
        </div>
      </aside>
    </div>
  );
}

type TierStyle = (typeof storeTierStyles)[keyof typeof storeTierStyles];

function PackageDetailHero({
  name,
  images,
  tierKey,
  tier,
  isGold,
  isCustom,
}: {
  name: string;
  images: string[];
  tierKey: keyof typeof storeTierStyles;
  tier: TierStyle;
  isGold: boolean;
  isCustom: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-card shadow-[0_2px_14px_rgba(44,36,32,0.07)]",
        tier.border
      )}
    >
      <div className={cn("h-1 w-full", tier.bar)} aria-hidden />
      {isGold && (
        <div className="flex items-center justify-center gap-1.5 border-b border-primary/15 bg-primary/8 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
          <Sparkles className="size-3" />
          Most popular package
        </div>
      )}
      {isCustom && (
        <div className="flex items-center justify-center gap-1.5 border-b border-primary/15 bg-primary/8 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
          <Wand2 className="size-3" />
          Built around your vision
        </div>
      )}
      <div className="relative p-3">
        <PackageImageCollage
          images={images}
          name={name}
          fallbackClassName={tier.header}
          size="detail"
        />
        <div className="pointer-events-none absolute inset-x-3 bottom-3 h-1/3 rounded-b-xl bg-gradient-to-t from-[#2c2420]/45 to-transparent" />
        <span
          className={cn(
            "absolute left-6 top-6 rounded-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
            tier.badge
          )}
        >
          {packageTierLabels[tierKey]}
        </span>
      </div>
    </div>
  );
}

function PackageBookingCard({
  pkg,
  inquiryUrl,
  eventPackageId,
  whatsappDigits,
  tierKey,
  tier,
  isGold,
  isCustom,
}: {
  pkg: EventPackage;
  inquiryUrl: string;
  eventPackageId: string;
  whatsappDigits: string;
  tierKey: keyof typeof storeTierStyles;
  tier: TierStyle;
  isGold: boolean;
  isCustom: boolean;
}) {
  const priceNum = Number(pkg.price);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border bg-card shadow-[0_4px_20px_rgba(44,36,32,0.08)]",
        tier.border
      )}
    >
      <div className={cn("h-1 w-full", tier.bar)} aria-hidden />

      <div className="p-5 sm:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {isCustom
            ? "Custom · Priced for your plan"
            : `${packageTierLabels[tierKey]} · Starting from`}
        </p>
        <p className={cn("mt-1 text-2xl font-semibold tabular-nums", tier.accent)}>
          {isCustom || priceNum <= 0 ? "Quote on request" : formatPrice(priceNum)}
        </p>

        {pkg.guestCount != null && pkg.guestCount > 0 && (
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5 shrink-0" />
            Accommodates up to {pkg.guestCount} guests
          </p>
        )}

        {isGold && (
          <p className="mt-3 rounded-lg bg-primary/8 px-3 py-2 text-xs leading-relaxed text-foreground/80">
            Our most booked tier — ideal for full-service wedding coordination.
          </p>
        )}

        {isCustom && (
          <p className="mt-3 rounded-lg bg-primary/8 px-3 py-2 text-xs leading-relaxed text-foreground/80">
            Not limited to Silver, Gold, or Platinum — tell us what you need and we&apos;ll build
            it.
          </p>
        )}

        <Button asChild variant="whatsapp" size="lg" className="mt-5 h-11 w-full">
          <a href={inquiryUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 size-4" />
            {isCustom ? "Discuss on WhatsApp" : "Inquire on WhatsApp"}
          </a>
        </Button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          No commitment required
        </p>

        <div className="mt-5 border-t border-border/70 pt-5">
          <p className="mb-3 text-xs font-semibold text-foreground">
            {isCustom ? "Or send your custom brief" : "Or request a custom quote"}
          </p>
          <InquiryForm
            eventPackageId={eventPackageId}
            eventPackageName={pkg.name}
            serviceOptions={pkg.servicesIncluded}
            whatsappDigits={whatsappDigits}
            defaultMessage={
              isCustom
                ? "I'd like a custom event package tailored to my needs."
                : `I'm interested in the ${pkg.name} event package.`
            }
            submitLabel={isCustom ? "Send custom request" : "Send package inquiry"}
          />
        </div>

        <div className="mt-5 space-y-2 border-t border-border/70 pt-5">
          <a
            href={`mailto:${EMAILS.events}`}
            className="flex items-center gap-2 text-xs text-foreground/75 transition-colors hover:text-primary"
          >
            <Mail className="size-3.5 shrink-0" />
            {EMAILS.events}
          </a>
          <Link
            href="/events/packages"
            className="flex items-center gap-2 text-xs text-foreground/75 transition-colors hover:text-primary"
          >
            <LayoutGrid className="size-3.5 shrink-0" />
            Compare all packages
          </Link>
        </div>
      </div>
    </div>
  );
}
