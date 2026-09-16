"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteOfflineSale } from "@/actions/admin/sales";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteOfflineSaleButton({ saleId }: { saleId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 text-[#9B3A3A] hover:bg-[#FCEAEA]"
      disabled={pending}
      onClick={() => {
        if (!confirm("Delete this offline sale record?")) return;
        startTransition(async () => {
          await deleteOfflineSale(saleId);
          router.refresh();
        });
      }}
    >
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}
