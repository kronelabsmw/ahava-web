import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { storeHeadingSmClass } from "@/components/store/store-ui";

type CategoryShowcaseTileProps = {
  href: string;
  name: string;
  description?: string | null;
  image?: string | null;
  meta?: string;
};

/** Parent categories — large editorial portrait tile */
export function CategoryShowcaseTile({
  href,
  name,
  description,
  image,
  meta,
}: CategoryShowcaseTileProps) {
  return (
    <Link href={href} className="group block h-full">
      <article className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl bg-[#3d342e] shadow-lg transition-transform duration-300 hover:-translate-y-1">
        {image ? (
          <img
            src={image}
            alt={name}
            className="absolute inset-0 size-full object-cover opacity-75 transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-[#2c2420]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2c2420] via-[#2c2420]/50 to-transparent" />

        <div className="relative mt-auto p-6 sm:p-8">
          {meta && (
            <span className="mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {meta}
            </span>
          )}
          <h2 className={cn(storeHeadingSmClass, "text-white text-balance sm:text-3xl")}>
            {name}
          </h2>
          {description && (
            <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/80 text-pretty">
              {description}
            </p>
          )}
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            View collection
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </article>
    </Link>
  );
}

type SubcategoryShopTileProps = {
  href: string;
  name: string;
  image?: string | null;
  productCount: number;
};

/** Subcategories — horizontal shop row, distinct from parent tiles */
export function SubcategoryShopTile({
  href,
  name,
  image,
  productCount,
}: SubcategoryShopTileProps) {
  return (
    <Link href={href} className="group block">
      <article className="flex items-center gap-4 rounded-xl border border-border bg-card p-3 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-md sm:gap-5 sm:p-4">
        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-secondary sm:size-24">
          {image ? (
            <img
              src={image}
              alt={name}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-2xl font-semibold text-primary/25">
              {name.charAt(0)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {name}
          </h2>
          <p className="mt-1 text-sm text-foreground/65">
            {productCount} dress{productCount !== 1 ? "es" : ""} available
          </p>
        </div>
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <ArrowRight className="size-4" />
        </div>
      </article>
    </Link>
  );
}
