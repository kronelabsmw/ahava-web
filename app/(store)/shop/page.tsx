import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";
import { ProductGrid } from "@/components/store/product-grid";
import { StoreContainer } from "@/components/store/store-container";
import { ShopFiltersSidebar } from "@/components/store/shop-filters-sidebar";
import { Breadcrumb } from "@/components/store/breadcrumb";
import { PageHeader } from "@/components/store/page-header";
import { Button } from "@/components/ui/button";
import { buildPageMetadata } from "@/lib/seo";
import { getAllCategories } from "@/services/categories";
import { getProducts } from "@/services/products";
import { storePagePaddingClass, storeHeadingSmClass } from "@/components/store/store-ui";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    parent?: string;
    search?: string;
    sort?: string;
    page?: string;
  }>;
}

export const metadata: Metadata = buildPageMetadata({
  title: "Shop Dresses",
  description:
    "Browse wedding dress hire and purchase options at AHAVAH Bridal Emporium in Blantyre, Malawi.",
  path: "/shop",
});

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const { products, total, pages } = await getProducts({
    category: params.category,
    parentCategory: params.parent,
    search: params.search,
    sort: params.sort,
    page,
    limit: 12,
  });
  const categories = await getAllCategories();
  const subcategories = categories.filter((c) => c.parentId);

  return (
    <StoreContainer size="wide" className={storePagePaddingClass}>
      {/* Breadcrumb Navigation */}
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop" },
        ]}
      />

      {/* Page Header */}
      <PageHeader
        title="Shop Dresses"
        description="Browse our collection of wedding gowns available for hire and purchase"
      />

      {/* Stats Bar */}
      <div className="mb-8 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm font-medium text-foreground">
        Showing <span className="font-semibold">{products.length}</span> of{" "}
        <span className="font-semibold">{total}</span> dresses
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <ShopFiltersSidebar categories={subcategories} />

        <main className="flex-1">
          {products.length > 0 ? (
            <>
              <ProductGrid columns="compact">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ProductGrid>
              {pages > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                    <Button
                      key={p}
                      asChild
                      variant={p === page ? "default" : "outline"}
                      size="sm"
                      className={p === page ? "pointer-events-none" : ""}
                    >
                      <Link
                        href={`/shop?${new URLSearchParams({
                          ...(params.category && { category: params.category }),
                          ...(params.search && { search: params.search }),
                          ...(params.sort && { sort: params.sort }),
                          page: String(p),
                        }).toString()}`}
                      >
                        {p}
                      </Link>
                    </Button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/40 py-20 text-center">
              <h3 className={storeHeadingSmClass}>No dresses found</h3>
              <p className="mx-auto mb-6 mt-2 max-w-md text-muted-foreground">
                We couldn&apos;t find any dresses matching your current filters. Try
                adjusting your search or category.
              </p>
              <Button asChild variant="outline">
                <Link href="/shop">Clear all filters</Link>
              </Button>
            </div>
          )}
        </main>
      </div>
    </StoreContainer>
  );
}
