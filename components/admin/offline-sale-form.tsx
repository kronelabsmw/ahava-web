"use client";

import { useState } from "react";
import { createOfflineSale } from "@/actions/admin/sales";
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
import { Loader2 } from "lucide-react";
import { SALE_TYPE_LABELS } from "@/lib/sales";
import type { SaleType } from "@prisma/client";

const SALE_TYPES = Object.keys(SALE_TYPE_LABELS) as SaleType[];

const PAYMENT_STATUSES = [
  { value: "PAID", label: "Paid in full" },
  { value: "DEPOSIT_RECEIVED", label: "Deposit received" },
  { value: "PARTIALLY_PAID", label: "Partially paid" },
  { value: "QUOTED", label: "Quoted (not paid)" },
] as const;

export function OfflineSaleForm() {
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
    const result = await createOfflineSale(formData);

    if (result.success) {
      setMessage({ type: "success", text: "Offline sale recorded." });
      e.currentTarget.reset();
      const dateInput = e.currentTarget.querySelector(
        'input[name="saleDate"]'
      ) as HTMLInputElement | null;
      if (dateInput) {
        dateInput.value = new Date().toISOString().slice(0, 10);
      }
    } else {
      setMessage({
        type: "error",
        text: result.error || "Failed to record sale",
      });
    }
    setIsPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <AdminFormAlert variant={message.type === "success" ? "success" : "error"}>
          {message.text}
        </AdminFormAlert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Sale type</Label>
          <select
            id="type"
            name="type"
            required
            className={`${adminInputClass} w-full`}
            defaultValue="DRESS_HIRE"
          >
            {SALE_TYPES.map((type) => (
              <option key={type} value={type}>
                {SALE_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Payment status</Label>
          <select
            id="status"
            name="status"
            required
            className={`${adminInputClass} w-full`}
            defaultValue="PAID"
          >
            {PAYMENT_STATUSES.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Description</Label>
        <Input
          id="title"
          name="title"
          required
          placeholder="e.g. Walk-in dress hire — Grace M."
          className={adminInputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer name</Label>
          <Input id="customerName" name="customerName" className={adminInputClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerPhone">Phone</Label>
          <Input id="customerPhone" name="customerPhone" className={adminInputClass} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="totalAmount">Total (MK)</Label>
          <Input
            id="totalAmount"
            name="totalAmount"
            type="number"
            min="0"
            step="1"
            required
            className={adminInputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paidAmount">Collected (MK)</Label>
          <Input
            id="paidAmount"
            name="paidAmount"
            type="number"
            min="0"
            step="1"
            required
            className={adminInputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="saleDate">Sale date</Label>
          <Input
            id="saleDate"
            name="saleDate"
            type="date"
            required
            defaultValue={new Date().toISOString().slice(0, 10)}
            className={adminInputClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="WhatsApp booking, cash at counter, etc."
          className={adminTextareaClass}
        />
      </div>

      <Button type="submit" disabled={isPending} className={adminPrimaryButtonClass}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Record offline sale
      </Button>
    </form>
  );
}
