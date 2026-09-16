import { cn } from "@/lib/utils";
import { storeHeadingXsClass } from "@/components/store/store-ui";
import { storeCardAccents } from "@/components/store/store-cards";
import type { LucideIcon } from "lucide-react";

type NoticeVariant = "default" | "warning" | "info";

const variantStyles: Record<
  NoticeVariant,
  { wrap: string; icon: string; title: string; body: string; bar: string }
> = {
  default: {
    wrap: storeCardAccents.cream,
    icon: "text-primary",
    title: "text-foreground",
    body: "text-foreground/75",
    bar: "bg-primary",
  },
  warning: {
    wrap: "border-destructive/30 bg-gradient-to-br from-destructive/8 via-card to-secondary/40",
    icon: "text-destructive",
    title: "text-foreground",
    body: "text-foreground/75",
    bar: "bg-destructive",
  },
  info: {
    wrap: storeCardAccents.blush,
    icon: "text-primary",
    title: "text-foreground",
    body: "text-foreground/75",
    bar: "bg-primary",
  },
};

type NoticePanelProps = {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  variant?: NoticeVariant;
  className?: string;
};

export function NoticePanel({
  icon: Icon,
  title,
  children,
  variant = "default",
  className,
}: NoticePanelProps) {
  const v = variantStyles[variant];

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border shadow-[0_4px_20px_rgba(44,36,32,0.08)]",
        v.wrap,
        className
      )}
    >
      <div
        className={cn("absolute left-0 top-0 h-full w-1.5", v.bar)}
        aria-hidden
      />
      <div className="p-6 pl-7 sm:p-8 sm:pl-9">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-card/70">
            <Icon className={cn("h-5 w-5 shrink-0", v.icon)} />
          </div>
          <h3 className={cn(storeHeadingXsClass, v.title, "text-balance")}>
            {title}
          </h3>
        </div>
        <div className={cn("text-sm leading-relaxed sm:text-base text-pretty", v.body)}>
          {children}
        </div>
      </div>
    </article>
  );
}
