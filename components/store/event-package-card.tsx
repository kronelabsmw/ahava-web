import Link from "next/link";
import { Check, Users, ArrowRight, Sparkles } from "lucide-react";
import { getPackageTierKey, packageTierLabels, storeTierStyles } from "@/components/store/store-cards";
import { cn, formatPrice } from "@/lib/utils";

export interface EventPackageCardData {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number | string | { toString(): string };
  guestCount?: number | null;
  image?: string | null;
  servicesIncluded?: string[];
}


interface EventPackageCardProps {
  pkg: EventPackageCardData;
  featured?: boolean;
  showServices?: boolean;
}

export function EventPackageCard({
  pkg,
  featured = false,
  showServices = true,
}: EventPackageCardProps) {
  const tierKey = getPackageTierKey(pkg.name);
  const tier = storeTierStyles[tierKey];
  const services = pkg.servicesIncluded ?? [];
  const isFeatured = featured || tierKey === "gold";

  return (
    <Link href={`/events/packages/${pkg.slug}`} className="group block h-full">
      <article
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-[0_2px_14px_rgba(44,36,32,0.07)] transition-all duration-300",
          tier.border,
          isFeatured
            ? "shadow-[0_10px_32px_rgba(184,149,134,0.2)]"
            : "hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_8px_24px_rgba(184,149,134,0.14)]"
        )}
      >
        <div className={cn("h-1 w-full shrink-0", tier.bar)} aria-hidden />

        {isFeatured && (
          <div className="flex items-center justify-center gap-1.5 border-b border-primary/15 bg-primary/8 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="size-3" />
            Most popular
          </div>
        )}

        <div className="p-3 pb-0">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
            {pkg.image ? (
              <img
                src={pkg.image}
                alt={pkg.name}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div
                className={cn(
                  "flex size-full items-center justify-center bg-gradient-to-br",
                  tier.header
                )}
              >
                <span className={cn("text-2xl font-semibold opacity-30", tier.accent)}>
                  {pkg.name.charAt(0)}
                </span>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#2c2420]/50 to-transparent" />

            <span
              className={cn(
                "absolute left-2 top-2 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                tier.badge
              )}
            >
              {packageTierLabels[tierKey]}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {packageTierLabels[tierKey]} tier
          </p>
          <h3 className="mt-0.5 text-base font-semibold leading-snug text-foreground text-balance transition-colors group-hover:text-primary">
            {pkg.name}
          </h3>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "inline-flex items-baseline gap-1 rounded-md px-2 py-1 text-sm font-semibold tabular-nums",
                tier.inset,
                tier.accent
              )}
            >
              {formatPrice(Number(pkg.price))}
              <span className="text-[11px] font-normal text-muted-foreground">from</span>
            </span>
            {pkg.guestCount != null && pkg.guestCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md border border-border/80 bg-background px-2 py-1 text-[11px] text-muted-foreground">
                <Users className="size-3 shrink-0" />
                Up to {pkg.guestCount}
              </span>
            )}
          </div>

          <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-foreground/70 text-pretty">
            {pkg.description}
          </p>

          {showServices && services.length > 0 && (
            <div className={cn("mt-3 rounded-xl p-2.5", tier.inset)}>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Includes
              </p>
              <ul className="space-y-1.5">
                {services.slice(0, 3).map((service) => (
                  <li
                    key={service}
                    className="flex items-start gap-2 text-xs leading-relaxed text-foreground/85"
                  >
                    <Check className={cn("mt-0.5 size-3 shrink-0", tier.accent)} />
                    <span className="line-clamp-1 text-pretty">{service}</span>
                  </li>
                ))}
                {services.length > 3 && (
                  <li className="pl-5 text-[11px] font-medium text-muted-foreground">
                    +{services.length - 3} more included
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="mt-auto flex items-center justify-between gap-2 border-t border-border/70 pt-3 text-xs font-medium text-primary">
            <span>View package</span>
            <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
