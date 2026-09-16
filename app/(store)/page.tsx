import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, Heart, MessageCircle, ShieldCheck } from "lucide-react";
import { HeroSlideshow } from "@/components/store/hero-slideshow";
import { ProductCard } from "@/components/store/product-card";
import { ProductGrid } from "@/components/store/product-grid";
import { StoreContainer } from "@/components/store/store-container";
import { Testimonials } from "@/components/store/testimonials";
import { SectionHeader } from "@/components/store/section-header";
import { Button } from "@/components/ui/button";
import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_TAGLINE,
  CATEGORY_PARENTS,
  TRUST_FEATURES,
} from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import { getParentCategories } from "@/services/categories";
import { getFeaturedProducts, getNewArrivals } from "@/services/products";
import type { SerializableProduct } from "@/services/products";
import { getHeroImages } from "@/services/settings";
import { getStorefrontConfig } from "@/services/storefront";
import {
  storePanelClass,
  storeSectionClass,
  storePagePaddingClass,
  storeHeadingMdClass,
  storeHeadingXsClass,
  storeHeadingLabelClass,
} from "@/components/store/store-ui";
import { whatsappGeneral } from "@/lib/whatsapp";

const TRUST_ICONS = [Heart, MessageCircle, ShieldCheck] as const;

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: `${APP_NAME} | Wedding Dress Hire & Event Planning in Blantyre`,
    description: APP_DESCRIPTION,
    path: "/",
  }),
  title: {
    absolute: `${APP_NAME} | Wedding Dress Hire & Event Planning in Blantyre`,
  },
};

export default async function HomePage() {
  const [config, heroImages, featured, newArrivals, categories]: [
    Awaited<ReturnType<typeof getStorefrontConfig>>,
    string[],
    SerializableProduct[],
    SerializableProduct[],
    Awaited<ReturnType<typeof getParentCategories>>,
  ] = await Promise.all([
      getStorefrontConfig(),
      getHeroImages(),
      getFeaturedProducts(8),
      getNewArrivals(4),
      getParentCategories(),
    ]);

  const tagline = config.tagline || APP_TAGLINE;

  return (
    <>
      <HeroSlideshow
        images={heroImages}
        tagline={tagline}
        videoUrl={config.siteVideos?.homeHero}
      />

      <StoreContainer>
        {/* Featured Section */}
        <section className={storeSectionClass}>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <SectionHeader
                eyebrow="Our Collection"
                title="Featured Dresses"
                description="Handpicked gowns for hire and purchase - each with professional fitting support."
              />
            </div>
            <Button
              asChild
              variant="outline"
              className="hidden w-fit rounded-full sm:flex"
            >
              <Link href="/shop">
                View all dresses <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {featured.length > 0 ? (
            <ProductGrid>
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          ) : (
            <EmptyHint />
          )}

          <div className="mt-8 sm:hidden">
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href="/shop">
                View all dresses <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Categories Section */}
        <section className={storeSectionClass}>
          <SectionHeader
            eyebrow="Shop by Style"
            title="Browse Collections"
            description="In-stock gowns ready to hire, past custom work for inspiration, and looks to brief your bespoke design."
          />

          <div className="grid gap-6 sm:grid-cols-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_1px_3px_rgba(44,36,32,0.07),0_8px_24px_rgba(44,36,32,0.05)] transition-all duration-300 hover:border-primary/40 hover:shadow-[0_4px_28px_rgba(201,168,154,0.16)]"
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Sparkles className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className={storeHeadingXsClass}>{cat.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-white/85">
                    {cat.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium">
                    Explore collection
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* New Arrivals Section */}
        {newArrivals.length > 0 && (
          <section className={storeSectionClass}>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <SectionHeader
                  eyebrow="Just In"
                  title="New Arrivals"
                  description="The latest additions to our bridal collection."
                />
              </div>
              <Button
                asChild
                variant="outline"
                className="hidden w-fit rounded-full sm:flex"
              >
                <Link href="/shop?sort=newest">
                  View all <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <ProductGrid columns="compact">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </ProductGrid>
          </section>
        )}
      </StoreContainer>

      {/* CTA Banner Section */}
      <StoreContainer className={storePagePaddingClass}>
        <div
          className={`relative overflow-hidden ${storePanelClass} bg-gradient-to-br from-primary/15 via-accent/25 to-muted/60 !shadow-[0_1px_3px_rgba(44,36,32,0.07),0_12px_32px_rgba(201,168,154,0.12)]`}
        >
          <div className="relative max-w-xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Get Started
            </p>
            <h2 className={storeHeadingMdClass}>
              Ready to find your dream dress?
            </h2>
            <p className="mt-4 leading-relaxed text-foreground/75">
              Book a private fitting at our Blantyre emporium or message us on WhatsApp.
              We&apos;ll guide you through hire, purchase, or a fully custom design.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                variant="whatsapp"
                size="lg"
                className="rounded-full"
              >
                <a
                  href={whatsappGeneral(
                    undefined,
                    config.whatsappDigits,
                    config.shopName
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full bg-background/80"
              >
                <Link href="/fittings">Book a Fitting</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="rounded-full"
              >
                <Link href={`/shop?category=${CATEGORY_PARENTS.IN_STOCK}`}>
                  Shop in-stock dresses
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </StoreContainer>

      {/* Trust Section */}
      <section className="border-y border-border bg-muted/40">
        <StoreContainer className={storePagePaddingClass}>
          <div className="mb-8">
            <SectionHeader
              title="Why Choose AHAVAH"
              align="center"
              showAccent={false}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {TRUST_FEATURES.map((item, index) => {
              const Icon = TRUST_ICONS[index];
              return (
                <div
                  key={item.title}
                  className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-[0_1px_3px_rgba(44,36,32,0.06)]"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className={storeHeadingLabelClass}>{item.title}</h3>
                  <p className="mt-2 text-sm text-foreground/70">{item.description}</p>
                </div>
              );
            })}
          </div>
        </StoreContainer>
      </section>

      {/* Testimonials Section */}
      <Testimonials siteContent={config.siteContent} />
    </>
  );
}

function EmptyHint() {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-muted/40 py-12 text-center">
      <p className="text-muted-foreground">
        Featured dresses coming soon.{" "}
        <Link href="/contact" className="font-medium text-primary hover:underline">
          Contact us
        </Link>{" "}
        to browse the full collection in store.
      </p>
    </div>
  );
}
