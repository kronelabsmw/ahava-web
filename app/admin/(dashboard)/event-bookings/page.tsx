import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatAdminDateCompact } from "@/lib/utils";
import {
  AdminPageHeader,
  AdminPanel,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableElement,
  AdminTableEmpty,
  AdminTableHead,
  AdminTableHeadCell,
  AdminTableRow,
} from "@/components/admin/admin-ui";
import { EventBookingForm } from "@/components/admin/event-booking-form";
import { EventBookingStatusCell } from "@/components/admin/event-booking-status-cell";

export default async function AdminEventBookingsPage() {
  let packages: Awaited<ReturnType<typeof prisma.eventPackage.findMany>> = [];
  let bookings: Awaited<
    ReturnType<
      typeof prisma.eventPackageBooking.findMany<{
        include: { eventPackage: true };
      }>
    >
  > = [];

  try {
    [packages, bookings] = await Promise.all([
      prisma.eventPackage.findMany({
        where: { active: true },
        orderBy: { price: "asc" },
      }),
      prisma.eventPackageBooking.findMany({
        include: { eventPackage: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);
  } catch {}

  const packageOptions = packages.map((p) => ({
    id: p.id,
    name: p.name,
    price: Number(p.price),
  }));

  return (
    <div>
      <AdminPageHeader
        title="Event bookings"
        description="Track event package sales and sync them to the revenue ledger."
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <AdminPanel
          title="New event booking"
          description="Record a package sale from WhatsApp, email, or in-person consultation."
          className="xl:col-span-1"
        >
          <EventBookingForm packages={packageOptions} />
        </AdminPanel>

        <AdminPanel title="All event bookings" className="xl:col-span-2" noPadding>
          <div className="overflow-x-auto">
            <AdminTableElement>
              <AdminTableHead>
                <AdminTableHeadCell>Customer</AdminTableHeadCell>
                <AdminTableHeadCell>Package</AdminTableHeadCell>
                <AdminTableHeadCell>Quoted</AdminTableHeadCell>
                <AdminTableHeadCell>Deposit</AdminTableHeadCell>
                <AdminTableHeadCell>Event</AdminTableHeadCell>
                <AdminTableHeadCell>Status</AdminTableHeadCell>
              </AdminTableHead>
              <AdminTableBody>
                {bookings.map((b) => (
                  <AdminTableRow key={b.id}>
                    <AdminTableCell>
                      <p className="font-medium text-[#2D3328]">{b.customerName}</p>
                      <p className="text-xs text-[#8A9480]">{b.customerPhone}</p>
                    </AdminTableCell>
                    <AdminTableCell>{b.eventPackage.name}</AdminTableCell>
                    <AdminTableCell>{formatPrice(Number(b.quotedAmount))}</AdminTableCell>
                    <AdminTableCell>
                      {formatPrice(Number(b.depositPaid))}
                    </AdminTableCell>
                    <AdminTableCell>
                      {b.eventDate
                        ? formatAdminDateCompact(b.eventDate)
                        : "—"}
                    </AdminTableCell>
                    <AdminTableCell>
                      <EventBookingStatusCell id={b.id} status={b.status} />
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
                {bookings.length === 0 && (
                  <AdminTableEmpty
                    colSpan={6}
                    message="No event bookings yet."
                  />
                )}
              </AdminTableBody>
            </AdminTableElement>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
