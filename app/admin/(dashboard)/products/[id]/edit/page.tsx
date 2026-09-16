import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { AdminFormShell } from "@/components/admin/admin-ui";
import { serializeAdminProduct } from "@/services/products";
import { notFound } from "next/navigation";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        variants: true,
        brand: true,
      },
    }),
    prisma.category.findMany({
      where: { parentId: { not: null } },
      include: { parent: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) notFound();

  return (
    <AdminFormShell
      title="Edit product"
      description={product.name}
      backHref="/admin/products"
      backLabel="Products"
    >
      <ProductForm
        initialData={serializeAdminProduct(product)}
        categories={categories}
      />
    </AdminFormShell>
  );
}
