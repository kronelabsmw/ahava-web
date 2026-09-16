import { prisma } from "@/lib/prisma";
import { CategoryForm } from "@/components/admin/category-form";
import { AdminFormShell } from "@/components/admin/admin-ui";
import { notFound } from "next/navigation";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params;

  const [category, parentCategories] = await Promise.all([
    prisma.category.findUnique({ where: { id } }),
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!category) notFound();

  return (
    <AdminFormShell
      title="Edit category"
      description={category.name}
      backHref="/admin/categories"
      backLabel="Categories"
    >
      <CategoryForm initialData={category} parentCategories={parentCategories} />
    </AdminFormShell>
  );
}
