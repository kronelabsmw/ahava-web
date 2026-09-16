"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteBooking } from "@/actions/admin/bookings";
import { Button } from "@/components/ui/button";

export function DeleteBookingButton({
  bookingId,
  customerName,
}: {
  bookingId: string;
  customerName: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteBooking(bookingId);
      if (result.success) {
        setConfirming(false);
        router.refresh();
      } else {
        setError(result.error || "Failed to delete booking");
      }
    });
  }

  if (confirming) {
    return (
      <div className="flex items-center justify-end gap-1.5">
        {error && (
          <span className="max-w-[140px] truncate text-xs text-[#9B3A3A]" title={error}>
            {error}
          </span>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-lg border-[#E8EBE4] px-2.5 text-xs"
          disabled={pending}
          onClick={() => {
            setConfirming(false);
            setError(null);
          }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="h-8 rounded-lg px-2.5 text-xs"
          disabled={pending}
          onClick={handleDelete}
        >
          {pending ? "Deleting..." : "Confirm"}
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 rounded-lg text-[#9B3A3A] hover:bg-[#FCEAEA] hover:text-[#7A2E2E]"
      onClick={() => setConfirming(true)}
      title={`Delete booking for ${customerName}`}
    >
      <Trash2 className="h-3.5 w-3.5" />
      <span className="sr-only">Delete booking for {customerName}</span>
    </Button>
  );
}
