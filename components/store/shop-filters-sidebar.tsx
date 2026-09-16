"use client";

import { Suspense, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { ShopFilters } from "@/components/store/shop-filters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { storeHeadingLabelClass } from "@/components/store/store-ui";

type ShopFiltersSidebarProps = {
  categories: Array<{
    id: string;
    slug: string;
    name: string;
    parent: { name: string } | null;
  }>;
};

function FiltersPanel({
  categories,
  className,
}: ShopFiltersSidebarProps & { className?: string }) {
  return (
    <div className={className}>
      <div
        className={cn(
          "mb-6 flex items-center gap-2 border-b border-border pb-4",
          storeHeadingLabelClass
        )}
      >
        <SlidersHorizontal className="h-5 w-5" />
        Filters
      </div>
      <ShopFilters categories={categories} />
    </div>
  );
}

export function ShopFiltersSidebar({ categories }: ShopFiltersSidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-4 lg:hidden">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-center gap-2"
          onClick={() => setOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters & sort
        </Button>
      </div>

      <aside className="hidden shrink-0 lg:block lg:w-64">
        <div className="sticky top-24">
          <Suspense
            fallback={
              <div className="h-40 animate-pulse rounded-2xl border border-border bg-muted" />
            }
          >
            <FiltersPanel categories={categories} />
          </Suspense>
        </div>
      </aside>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-[min(100vw-2rem,360px)] overflow-y-auto">
          <SheetHeader className="text-left">
            <SheetTitle>Filters & sort</SheetTitle>
          </SheetHeader>
          <Suspense
            fallback={
              <div className="mt-4 h-40 animate-pulse rounded-2xl border border-border bg-muted" />
            }
          >
            <FiltersPanel categories={categories} className="mt-4" />
          </Suspense>
        </SheetContent>
      </Sheet>
    </>
  );
}
