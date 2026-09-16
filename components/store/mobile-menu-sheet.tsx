"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { CalendarHeart, Search, Send } from "lucide-react";
import { BrandLogo } from "@/components/store/brand-logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { whatsappGeneral } from "@/lib/whatsapp";
import {
  NAV_GROUPS,
  isNavLinkActive,
} from "@/components/store/store-nav-links";
import { useStoreNav } from "@/components/store/store-nav-context";

type MobileMenuSheetProps = {
  shopName: string;
  whatsappDigits: string;
};

export function MobileMenuSheet({
  shopName,
  whatsappDigits,
}: MobileMenuSheetProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { menuOpen, setMenuOpen, searchInputRef } = useStoreNav();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setMenuOpen(false);
    router.push(q ? `/shop?search=${encodeURIComponent(q)}` : "/shop");
  }

  const fittingUrl = whatsappGeneral(
    `Hello ${shopName}! I'd like to book a fitting.`,
    whatsappDigits,
    shopName
  );

  const whatsappUrl = whatsappGeneral(
    `Hello ${shopName}! I'd like to enquire about dresses or events.`,
    whatsappDigits,
    shopName
  );

  return (
    <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
      <SheetContent
        side="left"
        className="flex w-[min(100vw-2rem,320px)] flex-col gap-0 p-0"
      >
        <SheetHeader className="shrink-0 space-y-0 border-b border-border px-6 py-5 text-left">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <BrandLogo
            variant="compact"
            href="/"
            onClick={() => setMenuOpen(false)}
          />
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 space-y-3 border-b border-border px-6 py-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dresses..."
                className="h-10 w-full rounded-md bg-secondary pl-3 pr-9 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                aria-label="Search products"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>

            <div className="grid grid-cols-2 gap-2">
              <Button asChild size="sm" className="h-10">
                <Link href="/fittings" onClick={() => setMenuOpen(false)}>
                  <CalendarHeart className="mr-1.5 h-4 w-4" />
                  Book fitting
                </Link>
              </Button>
              <Button asChild variant="whatsapp" size="sm" className="h-10">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                >
                  <Send className="mr-1.5 h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <nav
            className="flex-1 overflow-y-auto overscroll-contain px-4 py-4"
            aria-label="Site navigation"
          >
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="mb-5 last:mb-0">
                <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {group.title}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {group.links.map((link) => {
                    const active = isNavLinkActive(pathname, link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          className={cn(
                            "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            active
                              ? "bg-accent text-primary"
                              : "hover:bg-secondary"
                          )}
                        >
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

            <div className="mt-2 border-t border-border pt-4">
              <a
                href={fittingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                Book via WhatsApp
              </a>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
