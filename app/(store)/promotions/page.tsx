import Link from "next/link";
import {
  storeCardHoverClass,
  storePagePaddingClass,
  storeHeadingSmClass,
} from "@/components/store/store-ui";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { getActivePromotions } from "@/services/promotions";
import { PageHeader } from "@/components/store/page-header";
import { Breadcrumb } from "@/components/store/breadcrumb";
import { Calendar, Tag } from "lucide-react";
import { StoreContainer } from "@/components/store/store-container";
import { cn } from "@/lib/utils";

import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Deals & Promotions",
  description:
    "Current bridal hire deals and promotions at AHAVAH Bridal Emporium in Blantyre, Malawi.",
  path: "/promotions",
});

export default async function PromotionsPage() {
  const promotions = await getActivePromotions();

  return (
    <StoreContainer className={storePagePaddingClass}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Promotions" },
        ]}
      />

      <PageHeader
        title="Deals & Promotions"
        description="Discover our seasonal offers, trunk shows, and special package deals to make your dream wedding more accessible."
        align="center"
        showAccent={false}
      />

      {promotions.length > 0 ? (
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {promotions.map((promo) => (
            <Card key={promo.id} className={`overflow-hidden group flex flex-col sm:flex-row ${storeCardHoverClass}`}>
              {promo.image ? (
                <div className="w-full sm:w-2/5 aspect-video sm:aspect-auto overflow-hidden bg-muted">
                  <img 
                    src={promo.image} 
                    alt={promo.title} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                </div>
              ) : (
                <div className="w-full sm:w-2/5 aspect-video sm:aspect-auto bg-primary/5 flex items-center justify-center">
                  <Tag className="h-12 w-12 text-primary/20" />
                </div>
              )}
              <CardContent className="p-6 sm:p-8 flex-1 flex flex-col justify-center">
                {promo.discount && (
                  <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wide w-fit">
                    {promo.discount}% OFF
                  </div>
                )}
                <h2 className={cn(storeHeadingSmClass, "mb-3 group-hover:text-primary transition-colors")}>
                  {promo.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                  {promo.description}
                </p>
                
                {(promo.startDate || promo.endDate) && (
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 p-3 rounded-lg w-fit">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>
                      {promo.startDate ? new Date(promo.startDate).toLocaleDateString() : 'Now'} 
                      {' - '} 
                      {promo.endDate ? new Date(promo.endDate).toLocaleDateString() : 'Ongoing'}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-muted/40 py-16 px-4 text-center">
          <Tag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className={cn(storeHeadingSmClass, "mb-2")}>No active promotions</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            We don't have any special offers at the moment. Follow us on{" "}
            <Link
              href="https://www.instagram.com/ahavahbridalmw"
              className="text-primary font-medium hover:underline"
              target="_blank"
            >
              Instagram
            </Link>{" "}
            to be the first to know when new deals drop!
          </p>
        </div>
      )}
    </StoreContainer>
  );
}
