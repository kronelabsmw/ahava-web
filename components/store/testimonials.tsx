import { Star } from "lucide-react";
import {
  storeSectionClass,
  storeCardHoverClass,
  storeHeadingMdClass,
  storeTextMutedClass,
} from "@/components/store/store-ui";
import { Card, CardContent } from "@/components/ui/card";
import { StoreContainer } from "@/components/store/store-container";
import { cn } from "@/lib/utils";
import type { SiteContent } from "@/lib/site-content";

type TestimonialsProps = {
  siteContent: SiteContent;
};

export function Testimonials({ siteContent }: TestimonialsProps) {
  const { testimonials, testimonialsTitle, testimonialsSubtitle } = siteContent;

  return (
    <section className={storeSectionClass}>
      <StoreContainer>
        <div className="mb-12 text-center">
          <h2 className={storeHeadingMdClass}>{testimonialsTitle}</h2>
          <p
            className={cn(
              "mx-auto mt-3 max-w-2xl text-sm md:text-base",
              storeTextMutedClass
            )}
          >
            {testimonialsSubtitle}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <Card key={`${t.name}-${t.location}`} className={storeCardHoverClass}>
              <CardContent className="p-6 sm:p-7">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className={cn("mt-3 text-sm leading-relaxed", storeTextMutedClass)}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <p className="mt-4 text-sm font-semibold text-foreground">{t.name}</p>
                <p className={cn("text-xs", storeTextMutedClass)}>{t.location} bride</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </StoreContainer>
    </section>
  );
}
