import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { storeHeadingMdClass, storeTextMutedClass } from "@/components/store/store-ui";
import { buildBreadcrumbJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function PageBreadcrumb({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd(
          items.map((item) => ({ name: item.label, path: item.href }))
        )}
      />
      <nav aria-label="Breadcrumb" className={`mb-4 ${className ?? ""}`}>
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />}
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "font-medium text-foreground" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-2xl" : "max-w-2xl"}>
      {eyebrow && (
        <div
          className={`mb-4 flex items-center gap-3 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          <span className="h-9 w-1.5 rounded-full bg-primary" aria-hidden />
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">{eyebrow}</span>
        </div>
      )}
      <h2 className={storeHeadingMdClass}>{title}</h2>
      {description && (
        <p className={cn("mt-3 leading-relaxed", storeTextMutedClass)}>
          {description}
        </p>
      )}
    </div>
  );
}

/**
 * Section label with blush accent bar - use above a heading row.
 */
export function SectionTag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <span className="h-9 w-1.5 rounded-full bg-primary" aria-hidden />
      <span className="text-sm font-semibold uppercase tracking-wider text-primary">{children}</span>
    </div>
  );
}
