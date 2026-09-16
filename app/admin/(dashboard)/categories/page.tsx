import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  AdminCategoryChild,
  AdminCategoryGroup,
  AdminEmptyState,
  AdminPageHeader,
  adminPrimaryButtonClass,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: { parent: true; _count: { select: { products: true } } };
}>;

export default async function AdminCategoriesPage() {
  let categories: CategoryWithRelations[] = [];
  try {
    categories = await prisma.category.findMany({
      include: { parent: true, _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });
  } catch {}

  const parents = categories.filter((c) => !c.parentId);
  const children = categories.filter((c) => c.parentId);

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Organize products into parent and sub-categories."
        action={
          <Button asChild className={adminPrimaryButtonClass}>
            <Link href="/admin/categories/new">
              <Plus className="mr-2 h-4 w-4" />
              Add category
            </Link>
          </Button>
        }
      />

      <div className="space-y-4">
        {parents.map((parent) => (
          <AdminCategoryGroup
            key={parent.id}
            title={parent.name}
            description={parent.description}
            image={parent.image}
            editHref={`/admin/categories/${parent.id}/edit`}
          >
            <div className="space-y-0.5">
              {children
                .filter((c) => c.parentId === parent.id)
                .map((child) => (
                  <AdminCategoryChild
                    key={child.id}
                    name={child.name}
                    image={child.image}
                    productCount={child._count.products}
                    editHref={`/admin/categories/${child.id}/edit`}
                  />
                ))}
              {children.filter((c) => c.parentId === parent.id).length === 0 && (
                <p className="px-3 py-2 text-sm text-[#A8B09E]">No sub-categories</p>
              )}
            </div>
          </AdminCategoryGroup>
        ))}

        {parents.length === 0 && (
          <AdminEmptyState
            message="No categories yet. Run the seed script to populate."
            action={
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/admin/categories/new">Create first category</Link>
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
