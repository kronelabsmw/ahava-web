"use client";

import { useTransition } from "react";
import { deletePaymentEntry } from "@/actions/admin/payments";
import { formatPrice, formatAdminDateCompact } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS } from "@/lib/sales";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { PaymentEntry } from "@prisma/client";

export function PaymentEntriesList({
  payments,
}: {
  payments: PaymentEntry[];
}) {
  const [pending, startTransition] = useTransition();

  if (payments.length === 0) {
    return (
      <p className="text-sm text-[#8A9480]">
        No individual payments logged yet. Amounts may still be estimated from booking status.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-[#EEF2E8]">
      {payments.map((payment) => (
        <li
          key={payment.id}
          className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
        >
          <div className="min-w-0">
            <p className="font-medium tabular-nums text-[#2D3328]">
              {formatPrice(Number(payment.amount))}
            </p>
            <p className="text-xs text-[#8A9480]">
              {PAYMENT_METHOD_LABELS[payment.method]} ·{" "}
              {formatAdminDateCompact(payment.paidAt)}
              {payment.reference && ` · ${payment.reference}`}
            </p>
            {payment.notes && (
              <p className="mt-0.5 text-xs text-[#A8B09E]">{payment.notes}</p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-[#9B3A3A] hover:bg-[#FCEAEA]"
            disabled={pending}
            onClick={() => {
              if (!confirm("Remove this payment entry?")) return;
              startTransition(async () => {
                await deletePaymentEntry(payment.id);
              });
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </li>
      ))}
    </ul>
  );
}
