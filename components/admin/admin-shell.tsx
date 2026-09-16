"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Calendar,
  Tags,
  Settings,
  Gift,
  Sparkles,
  FileText,
  LogOut,
  Menu,
  ExternalLink,
  Search,
  Bell,
  ChevronDown,
  Layout,
  Banknote,
  PartyPopper,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { BrandLogo } from "@/components/store/brand-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/bookings", label: "Bookings", icon: Calendar },
  { href: "/admin/sales", label: "Sales", icon: Banknote },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/promotions", label: "Promotions", icon: Gift },
  { href: "/admin/event-packages", label: "Event Packages", icon: Sparkles },
  { href: "/admin/event-bookings", label: "Event Bookings", icon: PartyPopper },
  { href: "/admin/custom-orders", label: "Custom Orders", icon: FileText },
  { href: "/admin/site-content", label: "Site Content", icon: Layout },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function NavLink({
  item,
  onNavigate,
}: {
  item: (typeof navItems)[0];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all",
        active
          ? "bg-gradient-to-r from-[#6B7B52] to-[#556347] text-white shadow-[0_4px_14px_rgba(91,107,79,0.35)]"
          : "text-[#5A6352] hover:bg-[#EEF2E8] hover:text-[#3D4538]"
      )}
    >
      <Icon className={cn("h-[18px] w-[18px] shrink-0", active ? "text-white" : "opacity-70")} />
      {item.label}
    </Link>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 px-3 py-3">
        <BrandLogo
          variant="compact"
          href="/admin"
          onClick={onNavigate}
          className="[&_img]:max-w-[120px]"
        />
        <p className="mt-1.5 pl-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#8A9480]">
          Admin
        </p>
      </div>

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2.5 pb-3">
        <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A8B09E]">
          Menu
        </p>
        {navItems.map((item) => (
          <NavLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      <div className="shrink-0 space-y-2 border-t border-[#E8EBE4] p-3">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E8EBE4] bg-[#F7F9F5] px-3 py-2 text-xs font-medium text-[#6B7B52] transition-colors hover:bg-[#EEF2E8]"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View storefront
        </Link>

        <Button
          variant="ghost"
          size="sm"
          className="h-9 w-full justify-start gap-2.5 text-[#6B7565] hover:bg-[#EEF2E8] hover:text-[#3D4538]"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  );
}

function AdminTopbar({ className }: { className?: string }) {
  return (
    <header
      className={cn(
        "z-20 flex h-12 shrink-0 items-center gap-3 border-b border-[#E8EBE4] bg-white/95 px-4 backdrop-blur-md md:px-5",
        className
      )}
    >
      <div className="hidden flex-1 md:block">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8B09E]" />
          <Input
            placeholder="Search admin..."
            className="h-9 rounded-xl border-[#E8EBE4] bg-[#F7F9F5] pl-9 text-sm placeholder:text-[#A8B09E] focus-visible:ring-[#6B7B52]/30"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-xl text-[#6B7565] hover:bg-[#EEF2E8]"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#6B7B52]" />
          <span className="sr-only">Notifications</span>
        </Button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-xl border border-[#E8EBE4] bg-[#F7F9F5] py-1.5 pl-1.5 pr-3 transition-colors hover:bg-[#EEF2E8]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#6B7B52] to-[#556347] text-xs font-semibold text-white">
            AD
          </div>
          <span className="hidden text-sm font-medium text-[#3D4538] sm:inline">Admin</span>
          <ChevronDown className="hidden h-4 w-4 text-[#A8B09E] sm:block" />
        </button>
      </div>
    </header>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#F3F5F0]">
      <aside className="hidden h-full w-[248px] shrink-0 flex-col overflow-hidden border-r border-[#E8EBE4] bg-white md:flex">
        <SidebarContent />
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#E8EBE4] bg-white px-3 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] border-[#E8EBE4] bg-white p-0">
              <div className="flex h-full flex-col">
                <SidebarContent />
              </div>
            </SheetContent>
          </Sheet>
          <BrandLogo variant="compact" href="/admin" className="[&_img]:h-9" />
          <Link href="/" className="text-sm font-medium text-[#6B7B52]">
            Store
          </Link>
        </div>

        <AdminTopbar className="hidden md:flex" />

        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain px-3 py-4 md:px-5 md:py-5">
          <div className="mx-auto w-full max-w-[1400px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
