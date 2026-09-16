import { storePanelClass, storeHeadingSmClass } from "@/components/store/store-ui";
import { Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PackageComparisonTableProps {
  packages: Array<{
    id: string;
    name: string;
    slug: string;
    price: number | string | { toString(): string };
    guestCount?: number | null;
    servicesIncluded: string[];
  }>;
}

export function PackageComparisonTable({ packages }: PackageComparisonTableProps) {
  if (packages.length < 2) return null;

  const allServices = Array.from(
    new Set(packages.flatMap((pkg) => pkg.servicesIncluded))
  ).sort();

  return (
    <div className="mt-12">
      <div className="mb-8">
        <h3 className={storeHeadingSmClass}>Compare packages</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          What is included in each tier
        </p>
      </div>
      <div className={`overflow-x-auto ${storePanelClass}`}>
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-4 text-left font-normal text-muted-foreground w-1/3">
                Service
              </th>
              {packages.map((pkg) => (
                <th key={pkg.id} className="pb-4 text-center text-base font-semibold text-foreground">
                  <div>{pkg.name.replace(" Wedding Package", "").replace(" Package", "")}</div>
                  <div className="mt-1 text-sm font-normal text-muted-foreground">
                    {formatPrice(Number(pkg.price))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allServices.map((service) => (
              <tr key={service} className="border-b border-border/70 last:border-0">
                <td className="py-3 pr-4 font-normal text-foreground">{service}</td>
                {packages.map((pkg) => {
                  const included = pkg.servicesIncluded.includes(service);
                  return (
                    <td key={pkg.id} className="py-3 text-center">
                      {included ? (
                        <Check className="mx-auto h-4 w-4 text-foreground/70" aria-label="Included" />
                      ) : (
                        <span className="text-muted-foreground/25" aria-label="Not included">
                          ·
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
