import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { storePagePaddingClass } from "@/components/store/store-ui";
import { getCategoryBySlug } from "@/services/categories";
import { StoreContainer } from "@/components/store/store-container";
import { PageHeader } from "@/components/store/page-header";
import { Breadcrumb } from "@/components/store/breadcrumb";
import { SubcategoryShopTile } from "@/components/store/categories/category-tiles";
import { buildPageMetadata } from "@/lib/seo";

interface CategoryPageProps {
  params: Promise<{ parentSlug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { parentSlug } = await params;
  const category = await getCategoryBySlug(parentSlug);
  if (!category || category.parentId) return { title: "Category" };

  return buildPageMetadata({
    title: category.name,
    description:
      category.description?.slice(0, 160) ||
      `Browse ${category.name} wedding dresses and bridal looks at AHAVAH in Blantyre.`,
    path: `/categories/${category.slug}`,
    images: category.image ? [category.image] : undefined,
  });
}

export default async function ParentCategoryPage({ params }: CategoryPageProps) {
  const { parentSlug } = await params;
  const category = await getCategoryBySlug(parentSlug);
  if (!category) notFound();

  // Subcategory slugs used to 404 here — send shoppers to the filtered shop view
  if (category.parentId) {
    redirect(`/shop?category=${category.slug}`);
  }

  return (
    <StoreContainer className={storePagePaddingClass}>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
      />

      <PageHeader
        title={category.name}
        description={category.description ?? undefined}
        align="center"
        showAccent={false}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        {category.children.map((child: (typeof category.children)[number]) => (
          <SubcategoryShopTile
            key={child.id}
            href={`/shop?category=${child.slug}`}
            name={child.name}
            image={child.image}
            productCount={child._count.products}
          />
        ))}
      </div>
    </StoreContainer>
  );
}
