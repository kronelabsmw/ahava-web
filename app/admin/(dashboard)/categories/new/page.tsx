import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/category-form";
import { AdminFormShell } from "@/components/admin/admin-ui";

export default async function NewCategoryPage() {
  const parentCategories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
  });

  return (
    <AdminFormShell
      title="Add new category"
      description="Create a parent or sub-category for organizing products."
      backHref="/admin/categories"
      backLabel="Categories"
    >
      <CategoryForm parentCategories={parentCategories} />
    </AdminFormShell>
  );
}
