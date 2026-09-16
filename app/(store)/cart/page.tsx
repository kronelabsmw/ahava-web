import type { Metadata } from "next";
import { CartPageClient } from "@/components/store/cart-page-client";
import { StoreContainer } from "@/components/store/store-container";
import { storeHeadingMdClass } from "@/components/store/store-ui";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Inquiry Cart",
  description:
    "Review selected dresses and send your hire or purchase inquiry to AHAVAH via WhatsApp.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <StoreContainer size="narrow" className="py-8 md:py-12">
      <h1 className={storeHeadingMdClass}>Inquiry Cart</h1>
      <p className="mt-1 text-muted-foreground">
        Review your selected dresses and send an inquiry via WhatsApp
      </p>
      <CartPageClient />
    </StoreContainer>
  );
}
