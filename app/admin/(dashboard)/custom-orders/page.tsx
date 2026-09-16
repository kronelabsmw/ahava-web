import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
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
} from "@/components/admin/admin-ui";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CustomOrderStatusCell } from "@/components/admin/custom-order-status-cell";

export default async function AdminCustomOrdersPage() {
  let orders: Awaited<ReturnType<typeof prisma.customOrder.findMany>> = [];
  try {
    orders = await prisma.customOrder.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {}

  return (
    <div>
      <AdminPageHeader
        title="Custom orders"
        description="Bespoke commissions — update pipeline status from each row."
      />

      <AdminTable
        toolbar={
          <>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8B09E]" />
              <Input
                placeholder="Search orders..."
                className="h-10 rounded-xl border-[#E8EBE4] bg-[#F7F9F5] pl-9"
                readOnly
              />
            </div>
            <p className="text-sm text-[#8A9480]">
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </p>
          </>
        }
      >
        <AdminTableElement>
          <AdminTableHead>
            <AdminTableHeadCell>Customer</AdminTableHeadCell>
            <AdminTableHeadCell>Contact</AdminTableHeadCell>
            <AdminTableHeadCell>Event date</AdminTableHeadCell>
            <AdminTableHeadCell>Financials</AdminTableHeadCell>
            <AdminTableHeadCell>Status</AdminTableHeadCell>
          </AdminTableHead>
          <AdminTableBody>
            {orders.map((o) => (
              <AdminTableRow key={o.id}>
                <AdminTableCell>
                  <span className="font-medium text-[#2D3328]">
                    {o.customerName}
                  </span>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex flex-col">
                    <span>{o.customerPhone}</span>
                    {o.customerEmail && (
                      <span className="text-xs text-[#A8B09E]">
                        {o.customerEmail}
                      </span>
                    )}
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  {o.eventDate
                    ? new Date(o.eventDate).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "-"}
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex flex-col gap-1 text-xs">
                    {o.quoteAmount && (
                      <div className="flex justify-between gap-4">
                        <span className="text-[#A8B09E]">Quote</span>
                        <span className="font-medium text-[#2D3328]">
                          {formatPrice(Number(o.quoteAmount))}
                        </span>
                      </div>
                    )}
                    {o.depositPaid && (
                      <div className="flex justify-between gap-4">
                        <span className="text-[#A8B09E]">Paid</span>
                        <span className="font-medium text-[#3D6B3D]">
                          {formatPrice(Number(o.depositPaid))}
                        </span>
                      </div>
                    )}
                    {!o.quoteAmount && !o.depositPaid && "-"}
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <CustomOrderStatusCell id={o.id} status={o.status} />
                </AdminTableCell>
              </AdminTableRow>
            ))}
            {orders.length === 0 && (
              <AdminTableEmpty colSpan={5} message="No custom orders yet" />
            )}
          </AdminTableBody>
        </AdminTableElement>
      </AdminTable>
    </div>
  );
}
