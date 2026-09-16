import type { Metadata } from "next";
import { getParentCategories } from "@/services/categories";
import { StoreContainer } from "@/components/store/store-container";
import { PageHeader } from "@/components/store/page-header";
import { Breadcrumb } from "@/components/store/breadcrumb";
import { CategoryShowcaseTile } from "@/components/store/categories/category-tiles";
import { storePagePaddingClass } from "@/components/store/store-ui";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Categories",
  description:
    "Explore AHAVAH bridal categories — dresses in stock, previous custom orders, and inspo looks for your wedding.",
  path: "/categories",
});

export default async function CategoriesPage() {
  const categories = await getParentCategories();

  return (
    <StoreContainer className={storePagePaddingClass}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Categories" },
        ]}
      />

      <PageHeader
        title="Dress Categories"
        description="Explore in-stock hire gowns, past custom work, and inspiration for your dream design."
        align="center"
        showAccent={false}
      />

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <CategoryShowcaseTile
            key={cat.id}
            href={`/categories/${cat.slug}`}
            name={cat.name}
            description={cat.description}
            image={cat.image}
            meta={`${cat.children.length} subcategories`}
          />
        ))}
      </div>
    </StoreContainer>
  );
}
