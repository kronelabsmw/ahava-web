import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { AdminFormShell } from "@/components/admin/admin-ui";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: { not: null } },
    include: { parent: true },
    orderBy: { name: "asc" },
  });

  return (
    <AdminFormShell
      title="Add new product"
      description="Create a new dress listing with images, pricing, and variants."
      backHref="/admin/products"
      backLabel="Products"
    >
      <ProductForm categories={categories} />
    </AdminFormShell>
  );
}
