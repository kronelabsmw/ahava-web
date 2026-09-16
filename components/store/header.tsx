"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, ShoppingBag, Search, Heart } from "lucide-react";
import { BrandLogo } from "@/components/store/brand-logo";
import { whatsappGeneral } from "@/lib/whatsapp";
import { ThemeToggle } from "./theme-toggle";
import { CartSheet } from "./cart-sheet";
import { MobileMenuSheet } from "./mobile-menu-sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { storeShellClass } from "@/components/store/store-container";
import {
  DESKTOP_NAV,
  MORE_NAV_LINKS,
  isNavLinkActive,
} from "@/components/store/store-nav-links";
import { useStoreNav } from "@/components/store/store-nav-context";
import { useCartStore } from "@/stores/cart";
import { useMounted } from "@/hooks/use-mounted";

type StoreHeaderProps = {
  announcement: string;
  shopName: string;
  whatsappDigits: string;
};

export function StoreHeader({
  announcement,
  shopName,
  whatsappDigits,
}: StoreHeaderProps) {
  const pathname = usePathname();
  const mounted = useMounted();
  const itemCount = useCartStore((s) => s.totalItems());
  const cartCount = mounted ? itemCount : 0;
  const { openMenu, openMenuWithSearch, cartOpen, setCartOpen, openCart } =
    useStoreNav();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const moreActive = MORE_NAV_LINKS.some((link) =>
    isNavLinkActive(pathname, link.href)
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    }
    if (moreOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [moreOpen]);

  return (
    <>
      <div className="bg-foreground text-background">
        <div
          className={cn(
            storeShellClass,
            "flex h-10 items-center justify-center text-center text-xs sm:text-sm"
          )}
        >
          <p className="truncate">
            {announcement} -{" "}
            <a
              href={whatsappGeneral(
                `Hello ${shopName}! I'd like to book a fitting.`,
                whatsappDigits,
                shopName
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2 hover:text-primary"
            >
              Book a fitting
            </a>
          </p>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/95 shadow-[0_1px_0_rgba(44,36,32,0.04)] backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div
          className={cn(
            storeShellClass,
            "flex h-16 items-center justify-between gap-4"
          )}
        >
          <div className="flex items-center gap-2 lg:gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={openMenu}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <BrandLogo variant="compact" priority />
          </div>

          <nav
            className="hidden items-center gap-6 xl:gap-7 lg:flex"
            aria-label="Main navigation"
          >
            {DESKTOP_NAV.map((link) => {
              const active = isNavLinkActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors hover:text-foreground",
                    active
                      ? "text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div ref={moreRef} className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((open) => !open)}
                aria-expanded={moreOpen}
                aria-haspopup="true"
                className={cn(
                  "inline-flex items-center gap-1 text-sm font-medium transition-colors hover:text-foreground",
                  moreActive || moreOpen
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                More
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    moreOpen && "rotate-180"
                  )}
                />
              </button>
              {moreOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 min-w-[10rem] rounded-lg border border-border bg-background py-1 shadow-lg">
                  {MORE_NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "block px-4 py-2 text-sm transition-colors hover:bg-secondary",
                        isNavLinkActive(pathname, link.href)
                          ? "font-medium text-primary"
                          : "text-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={openMenuWithSearch}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex"
            >
              <Link href="/promotions" aria-label="Deals">
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart}
              aria-label="Open inquiry cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      <MobileMenuSheet shopName={shopName} whatsappDigits={whatsappDigits} />
      <CartSheet open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
