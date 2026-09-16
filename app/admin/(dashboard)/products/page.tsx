import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
  AdminPageHeader,
  AdminStageBadge,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableElement,
  AdminTableEmpty,
  AdminTableHead,
  AdminTableHeadCell,
  AdminTableRow,
  adminPrimaryButtonClass,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { Plus, Search, Pencil, ExternalLink } from "lucide-react";

type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: { include: { parent: true } }; images: true };
}>;

export default async function AdminProductsPage() {
  let products: ProductWithCategory[] = [];
  try {
    products = await prisma.product.findMany({
      include: { category: { include: { parent: true } }, images: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // DB not connected
  }

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Manage your dress inventory, pricing, and availability."
        action={
          <Button asChild className={adminPrimaryButtonClass}>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add product
            </Link>
          </Button>
        }
      />

      <AdminTable
        toolbar={
          <>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8B09E]" />
              <Input
                placeholder="Search products..."
                className="h-10 rounded-xl border-[#E8EBE4] bg-[#F7F9F5] pl-9"
                readOnly
              />
            </div>
            <p className="text-sm text-[#8A9480]">
              {products.length} product{products.length !== 1 ? "s" : ""}
            </p>
          </>
        }
      >
        <AdminTableElement>
          <AdminTableHead>
            <AdminTableHeadCell>Product</AdminTableHeadCell>
            <AdminTableHeadCell>Category</AdminTableHeadCell>
            <AdminTableHeadCell>Hire price</AdminTableHeadCell>
            <AdminTableHeadCell>Stock</AdminTableHeadCell>
            <AdminTableHeadCell>Status</AdminTableHeadCell>
            <AdminTableHeadCell className="text-right">Actions</AdminTableHeadCell>
          </AdminTableHead>
          <AdminTableBody>
            {products.map((p) => (
              <AdminTableRow key={p.id}>
                <AdminTableCell>
                  <div className="flex items-center gap-3">
                    {p.images && p.images.length > 0 ? (
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#EEF2E8]">
                        <img
                          src={p.images[0].url}
                          alt={p.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EEF2E8] text-xs text-[#8A9480]">
                        -
                      </div>
                    )}
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="font-medium text-[#2D3328] transition-colors hover:text-[#6B7B52]"
                    >
                      {p.name}
                    </Link>
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex flex-col">
                    {p.category.parent && (
                      <span className="text-xs text-[#A8B09E]">
                        {p.category.parent.name}
                      </span>
                    )}
                    <span className="font-medium text-[#3D4538]">
                      {p.category.name}
                    </span>
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <span className="font-medium text-[#2D3328]">
                    {formatPrice(Number(p.price))}
                  </span>
                </AdminTableCell>
                <AdminTableCell>
                  <span
                    className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-medium ${
                      p.stock > 0
                        ? "bg-[#EEF2E8] text-[#6B7B52]"
                        : "bg-[#FCEAEA] text-[#9B3A3A]"
                    }`}
                  >
                    {p.stock}
                  </span>
                </AdminTableCell>
                <AdminTableCell>
                  <AdminStageBadge status={p.active ? "ACTIVE" : "INACTIVE"} />
                </AdminTableCell>
                <AdminTableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-lg border-[#E8EBE4]"
                    >
                      <Link href={`/admin/products/${p.id}/edit`}>
                        <Pencil className="mr-1.5 h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      size="sm"
                      className="text-[#6B7B52]"
                    >
                      <Link href={`/products/${p.slug}`} target="_blank">
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span className="sr-only">View on storefront</span>
                      </Link>
                    </Button>
                    <DeleteProductButton productId={p.id} productName={p.name} />
                  </div>
                </AdminTableCell>
              </AdminTableRow>
            ))}
            {products.length === 0 && (
              <AdminTableEmpty
                colSpan={6}
                message="No products yet. Run npm run db:seed after connecting your database."
              />
            )}
          </AdminTableBody>
        </AdminTableElement>
      </AdminTable>
    </div>
  );
}
