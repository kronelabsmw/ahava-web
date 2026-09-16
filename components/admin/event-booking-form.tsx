"use client";

import { useState } from "react";
import { createEventPackageBooking } from "@/actions/admin/event-bookings";
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
import { formatPrice } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type PackageOption = {
  id: string;
  name: string;
  price: number;
};

export function EventBookingForm({ packages }: { packages: PackageOption[] }) {
  const [isPending, setIsPending] = useState(false);
  const [packageId, setPackageId] = useState(packages[0]?.id ?? "");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const selected = packages.find((p) => p.id === packageId);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    formData.set("eventPackageId", packageId);
    const result = await createEventPackageBooking(formData);
    if (result.success) {
      setMessage({ type: "success", text: "Event booking recorded." });
      e.currentTarget.reset();
      if (selected) {
        const quoted = e.currentTarget.querySelector(
          'input[name="quotedAmount"]'
        ) as HTMLInputElement | null;
        if (quoted) quoted.value = String(selected.price);
      }
    } else {
      setMessage({ type: "error", text: result.error || "Failed to save" });
    }
    setIsPending(false);
  }

  if (packages.length === 0) {
    return (
      <p className="text-sm text-[#8A9480]">
        Add event packages first before recording bookings.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <AdminFormAlert variant={message.type === "success" ? "success" : "error"}>
          {message.text}
        </AdminFormAlert>
      )}

      <div className="space-y-2">
        <Label htmlFor="eventPackageId">Package</Label>
        <select
          id="eventPackageId"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
          className={`${adminInputClass} w-full`}
        >
          {packages.map((pkg) => (
            <option key={pkg.id} value={pkg.id}>
              {pkg.name} — {formatPrice(pkg.price)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer name</Label>
          <Input id="customerName" name="customerName" required className={adminInputClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerPhone">Phone</Label>
          <Input id="customerPhone" name="customerPhone" required className={adminInputClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quotedAmount">Quoted amount (MK)</Label>
          <Input
            id="quotedAmount"
            name="quotedAmount"
            type="number"
            min="1"
            required
            defaultValue={selected?.price}
            key={packageId}
            className={adminInputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="depositPaid">Deposit paid (MK)</Label>
          <Input
            id="depositPaid"
            name="depositPaid"
            type="number"
            min="0"
            defaultValue={0}
            className={adminInputClass}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventDate">Event date</Label>
          <Input id="eventDate" name="eventDate" type="date" className={adminInputClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guestCount">Guests</Label>
          <Input id="guestCount" name="guestCount" type="number" min="1" className={adminInputClass} />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="eventLocation">Location</Label>
          <Input id="eventLocation" name="eventLocation" className={adminInputClass} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select id="status" name="status" defaultValue="QUOTED" className={`${adminInputClass} w-full`}>
            <option value="INQUIRY">Inquiry</option>
            <option value="QUOTED">Quoted</option>
            <option value="DEPOSIT_PAID">Deposit paid</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerEmail">Email</Label>
          <Input id="customerEmail" name="customerEmail" type="email" className={adminInputClass} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" rows={2} className={adminTextareaClass} />
      </div>

      <Button type="submit" disabled={isPending} className={adminPrimaryButtonClass}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Record event booking
      </Button>
    </form>
  );
}
