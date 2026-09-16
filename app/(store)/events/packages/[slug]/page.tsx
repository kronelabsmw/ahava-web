import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getActiveEventPackages, getEventPackageBySlug } from "@/services/event-packages";
import { getStorefrontConfig } from "@/services/storefront";
import { buildPageMetadata } from "@/lib/seo";
import { whatsappEventPackageInquiry } from "@/lib/whatsapp";
import { EventPackageCard } from "@/components/store/event-package-card";
import { EventPackageDetail } from "@/components/store/events/event-package-detail";
import { PageBreadcrumb } from "@/components/store/section-heading";
import { StoreContainer } from "@/components/store/store-container";

interface PackagePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PackagePageProps): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getEventPackageBySlug(slug);
  if (!pkg) return { title: "Event Package" };

  return buildPageMetadata({
    title: pkg.name,
    description: pkg.description.slice(0, 160),
    path: `/events/packages/${pkg.slug}`,
    images: pkg.image ? [pkg.image] : undefined,
  });
}

export default async function EventPackageDetailPage({ params }: PackagePageProps) {
  const { slug } = await params;
  const [pkg, allPackages, config] = await Promise.all([
    getEventPackageBySlug(slug),
    getActiveEventPackages(),
    getStorefrontConfig(),
  ]);
  if (!pkg) notFound();

  const relatedPackages = allPackages.filter((p) => p.slug !== slug).slice(0, 2);
  const featuredSlug = allPackages.find((p) => p.name.toLowerCase().includes("gold"))?.slug;

  const inquiryUrl = whatsappEventPackageInquiry(
    {
      packageName: pkg.name,
      guestCount: pkg.guestCount || undefined,
    },
    config.whatsappDigits
  );

  return (
    <StoreContainer className="py-8 md:py-12">
      <PageBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: "Packages", href: "/events/packages" },
          { label: pkg.name },
        ]}
      />

      <EventPackageDetail
        pkg={pkg}
        inquiryUrl={inquiryUrl}
        eventPackageId={pkg.id}
        whatsappDigits={config.whatsappDigits}
      />

      {relatedPackages.length > 0 && (
        <section className="mt-10 border-t border-border pt-8 md:mt-12 md:pt-10">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">
                Explore more
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                Other packages
              </h2>
            </div>
            <Link
              href="/events/packages"
              className="text-xs font-medium text-primary hover:underline"
            >
              View all packages
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {relatedPackages.map((related) => (
              <EventPackageCard
                key={related.id}
                pkg={related}
                featured={related.slug === featuredSlug}
                showServices={false}
              />
            ))}
          </div>
        </section>
      )}
    </StoreContainer>
  );
}
