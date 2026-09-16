"use client";

import { EventBookingStatus } from "@prisma/client";
import { updateEventBookingStatus } from "@/actions/admin/event-bookings";
import { AdminStatusSelect } from "@/components/admin/admin-status-select";

const STATUSES = Object.values(EventBookingStatus);

export function EventBookingStatusCell({
  id,
  status,
}: {
  id: string;
  status: EventBookingStatus;
}) {
  return (
    <AdminStatusSelect
      value={status}
      options={STATUSES}
      onUpdate={(next) =>
        updateEventBookingStatus(id, next as EventBookingStatus)
      }
    />
  );
}
