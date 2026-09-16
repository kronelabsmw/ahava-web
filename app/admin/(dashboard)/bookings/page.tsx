import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  AdminPageHeader,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableElement,
  AdminTableEmpty,
  AdminTableHead,
  AdminTableHeadCell,
  AdminTableRow,
  AdminBookingSchedule,
  AdminBookingPayment,
} from "@/components/admin/admin-ui";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { BookingStatusCell } from "@/components/admin/booking-status-cell";
import { DeleteBookingButton } from "@/components/admin/delete-booking-button";

type BookingWithProduct = Prisma.DressBookingGetPayload<{
  include: { product: true };
}>;

export default async function AdminBookingsPage() {
  let bookings: BookingWithProduct[] = [];
  try {
    bookings = await prisma.dressBooking.findMany({
      include: { product: true },
      orderBy: { weddingDate: "asc" },
    });
  } catch {}

  return (
    <div>
      <AdminPageHeader
        title="Dress bookings"
        description="Hire reservations from the storefront (linked to dresses in the database). Update status from the dropdown, or delete a booking permanently."
      />

      <AdminTable
        toolbar={
          <>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8B09E]" />
              <Input
                placeholder="Search bookings..."
                className="h-10 rounded-xl border-[#E8EBE4] bg-[#F7F9F5] pl-9"
                readOnly
              />
            </div>
            <p className="text-sm text-[#8A9480]">
              {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
            </p>
          </>
        }
      >
        <AdminTableElement>
          <AdminTableHead>
            <AdminTableHeadCell>Customer</AdminTableHeadCell>
            <AdminTableHeadCell>Dress</AdminTableHeadCell>
            <AdminTableHeadCell>Schedule</AdminTableHeadCell>
            <AdminTableHeadCell>Payment</AdminTableHeadCell>
            <AdminTableHeadCell>Status</AdminTableHeadCell>
            <AdminTableHeadCell className="w-[1%] text-right">Actions</AdminTableHeadCell>
          </AdminTableHead>
          <AdminTableBody>
            {bookings.map((b) => (
              <AdminTableRow key={b.id}>
                <AdminTableCell>
                  <div className="min-w-[160px]">
                    <p className="font-medium text-[#2D3328]">{b.customerName}</p>
                    <p className="mt-0.5 text-sm tabular-nums text-[#5A6352]">
                      {b.customerPhone}
                    </p>
                    {b.customerEmail && (
                      <p className="mt-0.5 truncate text-xs text-[#A8B09E]">
                        {b.customerEmail}
                      </p>
                    )}
                    {b.ukSize && (
                      <p className="mt-2 inline-flex rounded-md bg-[#EEF2E8] px-2 py-0.5 text-[11px] font-medium text-[#6B7B52]">
                        UK {b.ukSize}
                      </p>
                    )}
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="min-w-[140px] max-w-[220px]">
                    <p className="font-medium text-[#3D4538]">{b.product.name}</p>
                    {b.variantInfo && (
                      <p className="mt-0.5 text-xs text-[#8A9480]">
                        {b.variantInfo}
                      </p>
                    )}
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <AdminBookingSchedule
                    weddingDate={b.weddingDate}
                    pickupDate={b.pickupDate}
                    returnDeadline={b.returnDeadline}
                    eventLocation={b.eventLocation}
                    status={b.status}
                  />
                </AdminTableCell>
                <AdminTableCell>
                  <AdminBookingPayment
                    bookingDeposit={b.bookingDeposit}
                    balanceDue={b.balanceDue}
                    securityDeposit={b.securityDeposit}
                    lateFeesAccrued={b.lateFeesAccrued}
                  />
                </AdminTableCell>
                <AdminTableCell>
                  <BookingStatusCell id={b.id} status={b.status} />
                </AdminTableCell>
                <AdminTableCell className="text-right">
                  <DeleteBookingButton
                    bookingId={b.id}
                    customerName={b.customerName}
                  />
                </AdminTableCell>
              </AdminTableRow>
            ))}
            {bookings.length === 0 && (
              <AdminTableEmpty colSpan={6} message="No bookings yet" />
            )}
          </AdminTableBody>
        </AdminTableElement>
      </AdminTable>
    </div>
  );
}
