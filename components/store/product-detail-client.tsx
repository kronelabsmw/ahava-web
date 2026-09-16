"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart";
import { useStoreNav } from "@/components/store/store-nav-context";
import { whatsappProductInquiry } from "@/lib/whatsapp";
import { formatPrice, cn } from "@/lib/utils";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { storeInsetClass } from "@/components/store/store-ui";
import { InquiryForm } from "@/components/store/inquiry-form";
import type { SerializableProduct } from "@/services/products";

type Props = {
  product: SerializableProduct;
  productUrl: string;
};

function VariantPills({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  if (options.length === 0) return null;

  return (
    <div className="space-y-2.5">
      <p className="text-sm font-medium">
        {label}
        {value && (
          <span className="ml-2 font-normal text-muted-foreground">
            - {value}
          </span>
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "min-w-[2.75rem] rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              value === opt
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background hover:border-primary/50"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductActions({
  inquiryUrl,
  onAddToCart,
  className,
  size = "lg",
}: {
  inquiryUrl: string;
  onAddToCart: () => void;
  className?: string;
  size?: "default" | "sm" | "lg";
}) {
  return (
    <div className={cn("flex gap-2", className)}>
      <Button size={size} className="h-11 flex-1 gap-2 text-sm sm:text-base" asChild>
        <a href={inquiryUrl} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="truncate">WhatsApp</span>
        </a>
      </Button>
      <Button
        size={size}
        variant="outline"
        className="h-11 flex-1 gap-2 text-sm sm:text-base"
        onClick={onAddToCart}
      >
        <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="truncate">Add to list</span>
      </Button>
    </div>
  );
}

export function ProductDetailClient({ product, productUrl }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const { openCart } = useStoreNav();
  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];

  const [size, setSize] = useState(sizes[0] ?? "");
  const [color, setColor] = useState(colors[0] ?? "");

  const hirePrice = Number(product.price);
  const purchasePrice = Number(product.salePrice || product.discountPrice || 0);
  const isHire = product.listingType === "HIRE";
  const isSale = product.listingType === "SALE";
  const isBoth = product.listingType === "HIRE_AND_SALE";
  const cartPrice = isSale ? (purchasePrice || hirePrice) : hirePrice;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0]?.url,
      size: size || undefined,
      color: color || undefined,
      listingType: product.listingType,
      price: cartPrice,
    });
    openCart();
  };

  const inquiryUrl = whatsappProductInquiry({
    productName: product.name,
    size: size || undefined,
    color: color || undefined,
    rentalPrice: isHire || isBoth ? formatPrice(hirePrice) : undefined,
    salePrice:
      isSale || (isBoth && purchasePrice > 0)
        ? formatPrice(isBoth ? purchasePrice : hirePrice)
        : undefined,
    productUrl,
  });

  return (
    <>
      <div className="space-y-6 pb-24 lg:pb-0">
        {(sizes.length > 0 || colors.length > 0) && (
          <div className={`space-y-5 ${storeInsetClass}`}>
            <VariantPills
              label="Size"
              options={sizes as string[]}
              value={size}
              onChange={setSize}
            />
            <VariantPills
              label="Colour"
              options={colors as string[]}
              value={color}
              onChange={setColor}
            />
          </div>
        )}

        <ProductActions
          inquiryUrl={inquiryUrl}
          onAddToCart={handleAddToCart}
          className="hidden flex-row gap-3 lg:flex"
          size="lg"
        />

        <p className="hidden text-xs text-muted-foreground lg:block">
          No online checkout - we confirm availability and fitting by WhatsApp or
          in store.
        </p>

        <div className={`mt-6 space-y-4 ${storeInsetClass}`}>
          <h3 className="text-sm font-semibold text-foreground">Submit an inquiry</h3>
          <p className="text-xs text-muted-foreground">
            Prefer email? Send your details and we&apos;ll save your request to our system.
          </p>
          <InquiryForm
            productId={product.id}
            variantInfo={[size && `Size: ${size}`, color && `Colour: ${color}`]
              .filter(Boolean)
              .join(" · ")}
            defaultMessage={`I'm interested in ${product.name}.`}
            submitLabel="Send product inquiry"
          />
        </div>
      </div>

      <div className="fixed bottom-16 left-0 right-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden">
        <ProductActions
          inquiryUrl={inquiryUrl}
          onAddToCart={handleAddToCart}
          size="default"
        />
      </div>
    </>
  );
}
