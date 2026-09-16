"use client";

import { useState } from "react";
import { addPaymentEntry } from "@/actions/admin/payments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AdminFormAlert,
  adminInputClass,
  adminPrimaryButtonClass,
  adminTextareaClass,
} from "@/components/admin/admin-form";
import { PAYMENT_METHOD_LABELS } from "@/lib/sales";
import { Loader2 } from "lucide-react";
import type { PaymentMethod } from "@prisma/client";

const METHODS = Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[];

export function PaymentEntryForm({ saleRecordId }: { saleRecordId: string }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    formData.set("saleRecordId", saleRecordId);
    const result = await addPaymentEntry(formData);
    if (result.success) {
      setMessage({ type: "success", text: "Payment logged." });
      e.currentTarget.reset();
      const dateInput = e.currentTarget.querySelector(
        'input[name="paidAt"]'
      ) as HTMLInputElement | null;
      if (dateInput) dateInput.value = new Date().toISOString().slice(0, 10);
    } else {
      setMessage({ type: "error", text: result.error || "Failed to log payment" });
    }
    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {message && (
        <AdminFormAlert variant={message.type === "success" ? "success" : "error"}>
          {message.text}
        </AdminFormAlert>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount (MK)</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min="1"
            step="1"
            required
            className={adminInputClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="method">Method</Label>
          <select id="method" name="method" required className={`${adminInputClass} w-full`}>
            {METHODS.map((method) => (
              <option key={method} value={method}>
                {PAYMENT_METHOD_LABELS[method]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="paidAt">Date received</Label>
          <Input
            id="paidAt"
            name="paidAt"
            type="date"
            defaultValue={new Date().toISOString().slice(0, 10)}
            className={adminInputClass}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="reference">Reference</Label>
          <Input
            id="reference"
            name="reference"
            placeholder="Txn ID, receipt #"
            className={adminInputClass}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={2} className={adminTextareaClass} />
      </div>
      <Button type="submit" disabled={isPending} size="sm" className={adminPrimaryButtonClass}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Log payment
      </Button>
    </form>
  );
}
