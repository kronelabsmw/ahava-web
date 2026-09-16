import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, serializeProduct } from "@/services/products";
import { ProductGallery } from "@/components/store/product-gallery";
import { ProductDetailClient } from "@/components/store/product-detail-client";
import { StoreContainer } from "@/components/store/store-container";
import { JsonLd } from "@/components/seo/json-ld";
import {
  storeBadgeClass,
  storeBadgeMutedClass,
  storeDividerClass,
  storeInsetClass,
  storePanelClass,
  storeHeadingSmClass,
  storeHeadingXsClass,
  storeStatValueClass,
} from "@/components/store/store-ui";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildPageMetadata,
  buildProductJsonLd,
} from "@/lib/seo";
import { formatPrice, cn } from "@/lib/utils";
import { ChevronRight, Sparkles } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  const description = product.description.slice(0, 160);
  const image = product.images[0]?.url;

  return buildPageMetadata({
    title: product.name,
    description,
    path: `/products/${product.slug}`,
    images: image ? [image] : undefined,
  });
}

function ListingBadge({ type }: { type: string }) {
  const labels: Record<string, string> = {
    HIRE: "For hire",
    SALE: "For sale",
    HIRE_AND_SALE: "Hire & purchase",
  };
  return <span className={storeBadgeClass}>{labels[type] ?? type}</span>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const productUrl = absoluteUrl(`/products/${product.slug}`);

  const isHire = product.listingType === "HIRE";
  const isSale = product.listingType === "SALE";
  const isBoth = product.listingType === "HIRE_AND_SALE";
  const hirePrice = Number(product.price);
  const purchasePrice = Number(product.salePrice || product.discountPrice || 0);
  const showHire = isHire || isBoth;
  const showPurchase = isSale || (isBoth && purchasePrice > 0);
  const variantSkus = product.variants
    .map((v) => v.sku)
    .filter(Boolean) as string[];

  const productJsonLd = buildProductJsonLd({
    name: product.name,
    description: product.description,
    slug: product.slug,
    imageUrls: product.images.map((img) => img.url),
    brandName: product.brand?.name,
    categoryName: product.category.name,
    sku: variantSkus[0] ?? null,
    listingType: product.listingType,
    hirePrice,
    purchasePrice: purchasePrice > 0 ? purchasePrice : null,
    inStock: product.stock > 0 || product.variants.some((v) => v.stock > 0),
  });

  const categoryHref = product.category.parent
    ? `/shop?category=${product.category.slug}`
    : `/categories/${product.category.slug}`;

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    {
      name: product.category.name,
      path: categoryHref,
    },
    { name: product.name, path: `/products/${product.slug}` },
  ]);

  return (
    <StoreContainer size="wide" className="py-8 sm:py-10 lg:py-12">
      <JsonLd data={[productJsonLd, breadcrumbJsonLd]} />
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mb-8 flex flex-wrap items-center gap-1 text-sm text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <Link href="/shop" className="transition-colors hover:text-foreground">
          Shop
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <Link
          href={categoryHref}
          className="transition-colors hover:text-foreground"
        >
          {product.category.name}
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start lg:gap-14 xl:gap-16">
        {/* Gallery - sticky on desktop for easy browsing while reading details */}
        <div className="lg:sticky lg:top-24">
          <ProductGallery
            images={product.images}
            productName={product.name}
            videoUrl={product.videoUrl}
          />
        </div>

        {/* Product info */}
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <ListingBadge type={product.listingType} />
            {product.featured && (
              <span className={storeBadgeMutedClass}>
                <Sparkles className="mr-1 inline h-3 w-3" />
                Featured
              </span>
            )}
            {product.condition && (
              <span className="text-xs capitalize text-muted-foreground">
                {product.condition.toLowerCase().replace("_", " ")}
              </span>
            )}
          </div>

          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {product.category.name}
            {product.brand && ` · ${product.brand.name}`}
          </p>

          <h1
            className={cn(
              "mt-2 sm:text-3xl lg:text-[2rem]",
              storeHeadingSmClass
            )}
          >
            {product.name}
          </h1>

          {product.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <span key={tag} className={storeBadgeMutedClass}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Pricing */}
          <div className={`mt-6 ${storePanelClass} !p-5 sm:!p-6`}>
            <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
              {showHire && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Hire from
                  </p>
                  <p className={cn("mt-0.5 text-primary", storeStatValueClass)}>
                    {formatPrice(hirePrice)}
                  </p>
                </div>
              )}
              {showPurchase && (
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Purchase
                  </p>
                  <p
                    className={cn(
                      "mt-0.5",
                      storeStatValueClass,
                      showHire ? "text-foreground" : "text-primary"
                    )}
                  >
                    {formatPrice(isBoth ? purchasePrice : hirePrice)}
                  </p>
                </div>
              )}
            </div>
            {variantSkus.length > 0 && (
              <p
                className={`mt-3 pt-3 text-xs text-muted-foreground ${storeDividerClass}`}
              >
                Ref: {variantSkus.join(", ")}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6">
            <ProductDetailClient
              product={serializeProduct(product)}
              productUrl={productUrl}
            />
          </div>

          {/* Short description preview */}
          {product.description && (
            <p className="mt-8 text-sm leading-relaxed text-foreground/75 line-clamp-4 sm:text-base">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Full details below the fold */}
      <div
        className={`mt-14 grid gap-10 pt-12 lg:grid-cols-2 lg:gap-12 ${storeDividerClass}`}
      >
        <section>
          <h2 className={storeHeadingXsClass}>About this dress</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
            {product.description}
          </p>
        </section>

        {(product.stock > 0 ||
          (product.depositPercent && product.listingType !== "SALE") ||
          product.specialNotes) && (
          <section className="space-y-6">
            {(product.stock > 0 ||
              (product.depositPercent && product.listingType !== "SALE")) && (
              <div className={storeInsetClass}>
                <h2 className={storeHeadingXsClass}>Availability</h2>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {product.stock > 0 && (
                    <li>
                      {product.stock} unit{product.stock !== 1 ? "s" : ""}{" "}
                      currently available
                    </li>
                  )}
                  {product.depositPercent &&
                    product.listingType !== "SALE" && (
                      <li>
                        Hire deposit: {product.depositPercent}% of hire fee
                      </li>
                    )}
                </ul>
              </div>
            )}

            {product.specialNotes && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 sm:p-6">
                <h2 className={storeHeadingXsClass}>Please note</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {product.specialNotes}
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </StoreContainer>
  );
}
