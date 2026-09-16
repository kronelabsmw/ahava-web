import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminResourceCard,
  AdminStageBadge,
  adminPrimaryButtonClass,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Tag } from "lucide-react";

export default async function AdminPromotionsPage() {
  let promotions: Awaited<ReturnType<typeof prisma.promotion.findMany>> = [];
  try {
    promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {}

  return (
    <div>
      <AdminPageHeader
        title="Promotions"
        description="Create and manage sales, discounts, and seasonal offers."
        action={
          <Button asChild className={adminPrimaryButtonClass}>
            <Link href="/admin/promotions/new">
              <Plus className="mr-2 h-4 w-4" />
              Create promotion
            </Link>
          </Button>
        }
      />

      {promotions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {promotions.map((p) => (
            <AdminResourceCard
              key={p.id}
              image={p.image}
              imageFallback={
                <div className="flex aspect-[16/10] items-center justify-center bg-[#EEF2E8]">
                  <Tag className="h-12 w-12 text-[#6B7B52]/40" />
                </div>
              }
              title={p.title}
              badge={
                <AdminStageBadge status={p.active ? "ACTIVE" : "INACTIVE"} />
              }
              meta={
                p.discount ? (
                  <span className="inline-flex rounded-lg bg-[#EEF2E8] px-2.5 py-1 text-sm font-semibold text-[#6B7B52]">
                    {p.discount}% off
                  </span>
                ) : undefined
              }
              description={p.description || undefined}
              footer={
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-xl border-[#E8EBE4]"
                  >
                    <Link href={`/admin/promotions/${p.id}/edit`}>Edit</Link>
                  </Button>
                  {(p.startDate || p.endDate) && (
                    <div className="flex items-center gap-1.5 text-xs text-[#8A9480]">
                      <Calendar className="h-3.5 w-3.5" />
                      {p.startDate
                        ? new Date(p.startDate).toLocaleDateString()
                        : "Now"}
                      {" – "}
                      {p.endDate
                        ? new Date(p.endDate).toLocaleDateString()
                        : "Ongoing"}
                    </div>
                  )}
                </>
              }
            />
          ))}
        </div>
      ) : (
        <AdminEmptyState
          message="No promotions yet"
          action={
            <Button asChild className={adminPrimaryButtonClass}>
              <Link href="/admin/promotions/new">Create your first promotion</Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
