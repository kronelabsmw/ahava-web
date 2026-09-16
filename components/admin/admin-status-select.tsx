"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

function formatStatusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type AdminStatusSelectProps = {
  value: string;
  options: readonly string[];
  onUpdate: (status: string) => Promise<{ success: boolean; error?: string }>;
  className?: string;
};

export function AdminStatusSelect({
  value,
  options,
  onUpdate,
  className,
}: AdminStatusSelectProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Select
      value={value}
      disabled={pending}
      onValueChange={(next) => {
        if (!next || next === value) return;
        startTransition(async () => {
          const result = await onUpdate(next);
          if (result.success) {
            router.refresh();
          }
        });
      }}
    >
      <SelectTrigger
        className={cn(
          "h-9 min-w-[9.5rem] rounded-lg border-[#E8EBE4] bg-white text-xs font-medium",
          pending && "opacity-60",
          className
        )}
      >
        <SelectValue>{formatStatusLabel(value)}</SelectValue>
      </SelectTrigger>
      <SelectContent align="start">
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {formatStatusLabel(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
