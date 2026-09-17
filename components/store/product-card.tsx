"use client";

import Link from "next/link";
import { ShoppingBag, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MediaImage } from "@/components/media-image";
import { useCartStore } from "@/stores/cart";
import { useToast } from "@/hooks/use-toast";
import { cn, formatPrice, getParentCategoryBadge } from "@/lib/utils";
import type { SerializableProduct } from "@/services/products";

interface ProductCardProps {
  product: SerializableProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { toast } = useToast();
  const addItem = useCartStore((s) => s.addItem);

  const primaryImage = product.images[0]?.url;
  const secondaryImage = product.images[1]?.url;
  const categoryBadge = getParentCategoryBadge(product.category.parent?.slug);

  const hirePrice = product.price;
  const purchasePrice = product.salePrice || product.discountPrice || 0;
  const compareAt =
    product.discountPrice && product.salePrice ? product.price : null;

  const isHire = product.listingType === "HIRE";
  const isSale = product.listingType === "SALE";
  const isBoth = product.listingType === "HIRE_AND_SALE";
  const outOfStock = product.stock <= 0;

  const listingChip = isBoth ? "Hire · Buy" : isHire ? "Hire" : "Sale";

  function handleAddToBag(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
             
    const cartPrice =
      isSale && !isBoth ? purchasePrice || hirePrice : hirePrice;

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: cartPrice,
      image: primaryImage,
      listingType: product.listingType,
    });

    toast({ title: "Added to bag" });
  }

  return (
    <article className="group">
      <div className="relative">
        <Link
          href={`/products/${product.slug}`}
          className="block overflow-hidden rounded-xl bg-secondary/30"
        >
          <div className="relative aspect-[3/4]">
            {primaryImage ? (
              <>
                <MediaImage
                  src={primaryImage}
                  alt={product.name}
                  fill
                  className={cn(
                    "object-cover object-top transition duration-500 group-hover:scale-[1.04]",
                    secondaryImage && "group-hover:opacity-0"
                  )}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {secondaryImage && (
                  <MediaImage
                    src={secondaryImage}
                    alt=""
                    fill
                    className="object-cover object-top opacity-0 transition duration-500 group-hover:scale-[1.04] group-hover:opacity-100"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                )}
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
                <Sparkles className="h-7 w-7 opacity-30" />
              </div>
            )}

            {outOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/55 backdrop-blur-[1px]">
                <span className="rounded-full bg-foreground px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-background">
                  Unavailable
                </span>
              </div>
            )}
          </div>
        </Link>

        <div className="pointer-events-none absolute left-2 top-2 flex flex-wrap gap-1">
          {product.featured && (
            <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
              Featured
            </span>
          )}
          {categoryBadge && (
            <span className="rounded-md bg-background/92 px-1.5 py-0.5 text-[10px] font-medium text-foreground shadow-sm backdrop-blur-sm">
              {categoryBadge.label}
            </span>
          )}
        </div>

        <span className="pointer-events-none absolute right-2 top-2 rounded-md bg-background/92 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-foreground/80 backdrop-blur-sm">
          {listingChip}
        </span>

        <Button
          type="button"
          size="icon"
          disabled={outOfStock}
          onClick={handleAddToBag}
          aria-label="Add to bag"
          className="absolute bottom-2 right-2 z-10 h-9 w-9 rounded-full bg-background/95 shadow-md backdrop-blur-sm transition-opacity hover:bg-background sm:opacity-0 sm:group-hover:opacity-100"
        >
          <ShoppingBag className="h-4 w-4" />
        </Button>
      </div>

      <Link
        href={`/products/${product.slug}`}
        className="mt-3 block space-y-1"
      >
        <p className="truncate text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.category.name}
        </p>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground transition-colors group-hover:text-primary">
          {product.name}
        </h3>

        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-0.5">
          {(isHire || isBoth) && (
            <span className="text-[15px] font-semibold tabular-nums tracking-tight text-foreground">
              {formatPrice(hirePrice)}
            </span>
          )}

          {isBoth && purchasePrice > 0 && (
            <span className="text-sm font-medium tabular-nums text-muted-foreground">
              {formatPrice(purchasePrice)}
            </span>
          )}

          {isSale && !isBoth && (
            <>
              <span className="text-[15px] font-semibold tabular-nums tracking-tight text-foreground">
                {formatPrice(purchasePrice || hirePrice)}
              </span>
              {compareAt != null && compareAt > (purchasePrice || hirePrice) && (
                <span className="text-xs tabular-nums text-muted-foreground line-through">
                  {formatPrice(compareAt)}
                </span>
              )}
            </>
          )}
        </div>
      </Link>
    </article>
  );
}
