"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarHeart,
  ClipboardList,
  Layers,
  Mail,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { BackgroundMedia } from "@/components/store/background-media";
import { EventPackageCard, type EventPackageCardData } from "@/components/store/event-package-card";
import { EventServicesList, EventPlanningSteps } from "@/components/store/events/event-ui";
import { InquiryForm } from "@/components/store/inquiry-form";
import { SectionHeader } from "@/components/store/section-header";
import { StoreContainer } from "@/components/store/store-container";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  storeHeadingLgClass,
  storeHeadingMdClass,
  storeHeadingSmClass,
  storePagePaddingClass,
  storePanelClass,
  storeSectionClass,
} from "@/components/store/store-ui";
import { cn } from "@/lib/utils";
import { EMAILS } from "@/lib/constants";

const TABS = [
  { id: "services", label: "Services", icon: Sparkles },
  { id: "process", label: "Process", icon: ClipboardList },
  { id: "packages", label: "Packages", icon: Layers },
] as const;

type TabId = (typeof TABS)[number]["id"];

type ProcessStep = {
  step: string;
  title: string;
  description: string;
};

type EventsPageContentProps = {
  services: string[];
  processSteps: ProcessStep[];
  processImageUrl: string;
  heroVideoUrl?: string | null;
  heroImageUrl?: string | null;
  packages: EventPackageCardData[];
  featuredSlug?: string;
  whatsappUrl: string;
  whatsappDigits: string;
};

export function EventsPageContent({
  services,
  processSteps,
  processImageUrl,
  heroVideoUrl,
  heroImageUrl,
  packages,
  featuredSlug,
  whatsappUrl,
  whatsappDigits,
}: EventsPageContentProps) {
  const [activeTab, setActiveTab] = useState<TabId>("services");
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "services" || hash === "process" || hash === "packages") {
      setActiveTab(hash);
      requestAnimationFrame(() => {
        tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  function goToTab(tab: TabId) {
    setActiveTab(tab);
    window.history.replaceState(null, "", `#${tab}`);
    tabsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <section className="relative flex min-h-[380px] items-end overflow-hidden md:min-h-[440px]">
        <BackgroundMedia
          videoUrl={heroVideoUrl}
          imageUrl={heroImageUrl}
          alt="AHAVA Events planning"
          overlayClassName="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/40"
        />

        <StoreContainer className="relative z-10 pb-12 pt-28 md:pb-16 md:pt-36">
          <div className="max-w-4xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              AHAVA Events
            </p>
            <h1 className={storeHeadingLgClass}>Event Planning</h1>
            <p className="mt-5 max-w-xl leading-relaxed text-foreground/80 md:text-lg">
              From intimate ceremonies to grand celebrations, we coordinate every detail so you
              can enjoy your special day stress-free.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              <Button
                size="lg"
                className="h-auto min-h-11 whitespace-normal px-2 text-center text-xs leading-tight sm:px-4 sm:text-sm"
                onClick={() => goToTab("packages")}
              >
                View packages
                <ArrowRight className="ml-1.5 hidden size-4 shrink-0 sm:inline" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-auto min-h-11 whitespace-normal px-2 text-center text-xs leading-tight sm:px-4 sm:text-sm"
                onClick={() => setInquiryOpen(true)}
              >
                <ClipboardList className="mr-1.5 hidden size-4 shrink-0 sm:inline" />
                Request a custom quote
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-auto min-h-11 whitespace-normal px-2 text-center text-xs leading-tight sm:px-4 sm:text-sm"
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-1.5 hidden size-4 shrink-0 sm:inline" />
                  WhatsApp us
                </a>
              </Button>
            </div>
          </div>
        </StoreContainer>
      </section>

      <div ref={tabsRef} className="scroll-mt-20 border-b border-border/80 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 sticky top-16 z-30">
        <StoreContainer>
          <div
            role="tablist"
            aria-label="Event planning sections"
            className="flex gap-1 overflow-x-auto py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`events-panel-${tab.id}`}
                  id={`events-tab-${tab.id}`}
                  onClick={() => goToTab(tab.id)}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
                    selected
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </StoreContainer>
      </div>

      <StoreContainer className={storePagePaddingClass}>
        <div className="min-h-[420px]">
          {activeTab === "services" && (
            <section
              id="events-panel-services"
              role="tabpanel"
              aria-labelledby="events-tab-services"
              className={storeSectionClass}
            >
              <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-10">
                <SectionHeader
                  eyebrow="What we do"
                  title="Comprehensive event services"
                  description="Our experienced team handles logistics, vendor coordination, and on-the-day management while you focus on making memories."
                  showAccent={false}
                />
                <EventServicesList services={services} />
              </div>
            </section>
          )}

          {activeTab === "process" && (
            <section
              id="events-panel-process"
              role="tabpanel"
              aria-labelledby="events-tab-process"
              className={storeSectionClass}
            >
              <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-10">
                <div className="order-2 aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_1px_3px_rgba(44,36,32,0.07),0_8px_24px_rgba(44,36,32,0.05)] lg:order-1">
                  <img
                    src={processImageUrl}
                    alt="Elegant wedding reception setup"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="order-1 lg:order-2">
                  <SectionHeader
                    eyebrow="How it works"
                    title="From first call to final toast"
                    description="A clear, collaborative process designed to keep planning simple and stress-free."
                    showAccent={false}
                    className="mb-10"
                  />
                  <EventPlanningSteps steps={processSteps} />
                </div>
              </div>
            </section>
          )}

          {activeTab === "packages" && (
            <section
              id="events-panel-packages"
              role="tabpanel"
              aria-labelledby="events-tab-packages"
              className={storeSectionClass}
            >
              <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <SectionHeader
                  eyebrow="Packages"
                  title="Curated for every celebration"
                  description="Silver, Gold, and Platinum tiers to match your style and guest count."
                  showAccent={false}
                />
                {packages.length > 0 && (
                  <Button asChild variant="ghost" className="w-fit shrink-0">
                    <Link href="/events/packages">
                      View all
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>

              {packages.length > 0 ? (
                <div className="grid items-stretch gap-5 md:grid-cols-3 md:gap-4">
                  {packages.slice(0, 3).map((pkg) => (
                    <EventPackageCard
                      key={pkg.id}
                      pkg={pkg}
                      featured={pkg.slug === featuredSlug}
                      showServices
                    />
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <CalendarHeart className="mx-auto mb-4 h-10 w-10 text-muted-foreground/30" />
                  <h3 className={cn("mb-2", storeHeadingSmClass)}>Packages coming soon</h3>
                  <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                    Request a custom quote with the services you need, or contact us directly.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button onClick={() => setInquiryOpen(true)}>
                      Request a custom quote
                    </Button>
                    <Button asChild variant="whatsapp">
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        WhatsApp us
                      </a>
                    </Button>
                    <Button asChild variant="outline">
                      <a href={`mailto:${EMAILS.events}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email us
                      </a>
                    </Button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        <section className={`bg-secondary/60 text-center ${storePanelClass}`}>
          <h2 className={cn("mb-4", storeHeadingMdClass)}>Ready to plan your celebration?</h2>
          <p className="mx-auto mb-8 max-w-lg text-foreground/75">
            Pick your services, share your wedding scope, and we&apos;ll help you build the right
            plan — or choose a ready-made package.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button variant="whatsapp" size="lg" onClick={() => setInquiryOpen(true)}>
              Request a custom quote
            </Button>
            <Button size="lg" onClick={() => goToTab("packages")}>
              Browse packages
            </Button>
          </div>
        </section>
      </StoreContainer>

      <Sheet open={inquiryOpen} onOpenChange={setInquiryOpen}>
        <SheetContent side="right" className="w-full max-w-lg overflow-y-auto sm:max-w-xl">
          <SheetHeader className="text-left">
            <SheetTitle>Request a custom quote</SheetTitle>
            <p className="text-sm text-muted-foreground">
              Select the services you need, share your wedding scope, then send your quote
              request here or directly on WhatsApp.
            </p>
          </SheetHeader>
          <InquiryForm
            showWeddingScope
            serviceOptions={services}
            whatsappDigits={whatsappDigits}
            submitLabel="Send quote request"
            onSuccess={() => setInquiryOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
