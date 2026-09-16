"use client";

import { useState, useTransition } from "react";
import { updateInquiryAmount } from "@/actions/admin/inquiries";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Loader2, Check } from "lucide-react";

export function InquiryAmountCell({
  id,
  totalAmount,
}: {
  id: string;
  totalAmount: number | null;
}) {
  const [value, setValue] = useState(
    totalAmount != null ? String(totalAmount) : ""
  );
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function save() {
    startTransition(async () => {
      const trimmed = value.trim();
      const amount = trimmed === "" ? null : Number(trimmed);
      const result = await updateInquiryAmount(id, amount);
      if (result.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  }

  return (
    <div className="flex min-w-[140px] items-center gap-1.5">
      <Input
        type="number"
        min="0"
        step="1"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="MK amount"
        className="h-8 w-28 rounded-lg border-[#E8EBE4] bg-[#F7F9F5] px-2 text-xs"
      />
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-8 rounded-lg border-[#E8EBE4] px-2"
        disabled={pending}
        onClick={save}
        title="Save sale amount"
      >
        {pending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : saved ? (
          <Check className="h-3.5 w-3.5 text-[#6B7B52]" />
        ) : (
          "Save"
        )}
      </Button>
      {totalAmount != null && totalAmount > 0 && (
        <span className="hidden text-xs text-[#8A9480] lg:inline">
          {formatPrice(totalAmount)}
        </span>
      )}
    </div>
  );
}
