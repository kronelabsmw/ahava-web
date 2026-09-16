"use client";

import { BookingStatus } from "@prisma/client";
import { updateBookingStatus } from "@/actions/admin/bookings";
import { AdminStatusSelect } from "@/components/admin/admin-status-select";

const BOOKING_STATUSES = Object.values(BookingStatus);

export function BookingStatusCell({
  id,
  status,
}: {
  id: string;
  status: BookingStatus;
}) {
  return (
    <AdminStatusSelect
      value={status}
      options={BOOKING_STATUSES}
      onUpdate={(next) => updateBookingStatus(id, next as BookingStatus)}
    />
  );
}
