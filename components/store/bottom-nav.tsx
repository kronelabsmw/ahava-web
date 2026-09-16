"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, CalendarHeart, Sparkles, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStoreNav } from "@/components/store/store-nav-context";

const tabs = [
  { type: "link" as const, href: "/", label: "Home", icon: Home },
  { type: "link" as const, href: "/shop", label: "Shop", icon: Grid3X3 },
  {
    type: "link" as const,
    href: "/fittings",
    label: "Fittings",
    icon: CalendarHeart,
  },
  { type: "link" as const, href: "/events", label: "Events", icon: Sparkles },
  { type: "menu" as const, label: "Menu", icon: Menu },
];

export function BottomNav() {
  const pathname = usePathname();
  const { menuOpen, openMenu } = useStoreNav();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur lg:hidden pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          if (tab.type === "menu") {
            return (
              <button
                key="menu"
                type="button"
                onClick={openMenu}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-2 py-1 text-[11px] transition-colors sm:px-3 sm:text-xs",
                  menuOpen
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          }

          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-[11px] transition-colors sm:px-3 sm:text-xs",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
