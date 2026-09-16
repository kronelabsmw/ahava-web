import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
  AdminEmptyState,
  AdminPageHeader,
  AdminResourceCard,
  AdminStageBadge,
  adminPrimaryButtonClass,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { Plus, Users, CheckCircle2 } from "lucide-react";

export default async function AdminEventPackagesPage() {
  let packages: Awaited<ReturnType<typeof prisma.eventPackage.findMany>> = [];
  try {
    packages = await prisma.eventPackage.findMany({
      orderBy: { price: "asc" },
    });
  } catch {}

  return (
    <div>
      <AdminPageHeader
        title="Event packages"
        description="Manage Silver, Gold, and Platinum event planning tiers."
        action={
          <Button asChild className={adminPrimaryButtonClass}>
            <Link href="/admin/event-packages/new">
              <Plus className="mr-2 h-4 w-4" />
              Add package
            </Link>
          </Button>
        }
      />

      {packages.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((pkg) => (
            <AdminResourceCard
              key={pkg.id}
              image={pkg.image}
              imageFallback={
                <div className="flex aspect-[16/10] items-center justify-center bg-[#EEF2E8] text-sm text-[#8A9480]">
                  No image
                </div>
              }
              title={pkg.name}
              badge={
                <AdminStageBadge status={pkg.active ? "ACTIVE" : "INACTIVE"} />
              }
              meta={
                <div className="space-y-3">
                  <p className="text-2xl font-bold text-[#6B7B52]">
                    {formatPrice(Number(pkg.price))}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-[#8A9480]">
                    <Users className="h-4 w-4" />
                    Up to {pkg.guestCount || "any"} guests
                  </div>
                  {pkg.servicesIncluded.length > 0 && (
                    <ul className="space-y-1.5">
                      {pkg.servicesIncluded.slice(0, 4).map((service, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-[#8A9480]"
                        >
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#6B7B52]" />
                          {service}
                        </li>
                      ))}
                      {pkg.servicesIncluded.length > 4 && (
                        <li className="pl-5 text-sm italic text-[#A8B09E]">
                          + {pkg.servicesIncluded.length - 4} more services
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              }
              footer={
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="rounded-xl border-[#E8EBE4]"
                  >
                    <Link href={`/admin/event-packages/${pkg.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                  <Link
                    href={`/events/packages/${pkg.slug}`}
                    className="text-sm font-medium text-[#6B7B52] hover:underline"
                    target="_blank"
                  >
                    View on site →
                  </Link>
                </>
              }
            />
          ))}
        </div>
      ) : (
        <AdminEmptyState
          message="No event packages yet"
          action={
            <Button asChild className={adminPrimaryButtonClass}>
              <Link href="/admin/event-packages/new">
                Create your first package
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
