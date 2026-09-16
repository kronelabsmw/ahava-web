import { StoreHeader } from "@/components/store/header";
import { StoreFooter } from "@/components/store/footer";
import { BottomNav } from "@/components/store/bottom-nav";
import { StoreNavProvider } from "@/components/store/store-nav-context";
import { JsonLd } from "@/components/seo/json-ld";
import { buildLocalBusinessJsonLd } from "@/lib/seo";
import { getStorefrontConfig } from "@/services/storefront";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const config = await getStorefrontConfig();

  return (
    <StoreNavProvider>
      <JsonLd data={buildLocalBusinessJsonLd()} />
      <StoreHeader
        announcement={config.siteContent.announcement}
        shopName={config.shopName}
        whatsappDigits={config.whatsappDigits}
      />
      <main className="min-h-[calc(100vh-4rem)] pb-20 lg:pb-0">{children}</main>
      <StoreFooter
        shopName={config.shopName}
        whatsappDigits={config.whatsappDigits}
        siteContent={config.siteContent}
      />
      <BottomNav />
    </StoreNavProvider>
  );
}
