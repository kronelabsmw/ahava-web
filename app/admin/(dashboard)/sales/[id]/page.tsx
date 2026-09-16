import Link from "next/link";
import { notFound } from "next/navigation";
import { getSaleWithPayments } from "@/services/sales";
import { formatPrice, formatAdminDateCompact } from "@/lib/utils";
import {
  AdminPageHeader,
  AdminPanel,
  AdminStageBadge,
  adminOutlineButtonClass,
} from "@/components/admin/admin-ui";
import { PaymentEntryForm } from "@/components/admin/payment-entry-form";
import { PaymentEntriesList } from "@/components/admin/payment-entries-list";
import { Button } from "@/components/ui/button";
import { SALE_TYPE_LABELS } from "@/lib/sales";
import { ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ id: string }> };

export default async function AdminSaleDetailPage({ params }: Props) {
  const { id } = await params;
  const sale = await getSaleWithPayments(id);
  if (!sale) notFound();

  return (
    <div>
      <AdminPageHeader
        title={sale.title}
        description={`${SALE_TYPE_LABELS[sale.type]} · ${sale.channel === "OFFLINE" ? "Offline" : "System"} sale`}
        action={
          <Button asChild variant="outline" className={adminOutlineButtonClass}>
            <Link href="/admin/sales">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sales
            </Link>
          </Button>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#E8EBE4] bg-white p-4">
          <p className="text-xs text-[#8A9480]">Total quoted</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-[#2D3328]">
            {formatPrice(Number(sale.totalAmount))}
          </p>
        </div>
        <div className="rounded-xl border border-[#E8EBE4] bg-white p-4">
          <p className="text-xs text-[#8A9480]">Collected</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-[#6B7B52]">
            {formatPrice(Number(sale.paidAmount))}
          </p>
        </div>
        <div className="rounded-xl border border-[#E8EBE4] bg-white p-4">
          <p className="text-xs text-[#8A9480]">Outstanding</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-[#2D3328]">
            {formatPrice(
              Math.max(0, Number(sale.totalAmount) - Number(sale.paidAmount))
            )}
          </p>
        </div>
        <div className="rounded-xl border border-[#E8EBE4] bg-white p-4">
          <p className="text-xs text-[#8A9480]">Sale date</p>
          <p className="mt-1 text-sm font-semibold text-[#2D3328]">
            {formatAdminDateCompact(sale.saleDate)}
          </p>
          <div className="mt-2">
            <AdminStageBadge status={sale.status} />
          </div>
        </div>
      </div>

      {(sale.customerName || sale.customerPhone) && (
        <p className="mb-4 text-sm text-[#6B7565]">
          Customer: {sale.customerName}
          {sale.customerPhone && ` · ${sale.customerPhone}`}
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminPanel title="Payment entries" description="Log each cash, WhatsApp, or bank payment. Collected total updates automatically.">
          <PaymentEntryForm saleRecordId={sale.id} />
        </AdminPanel>

        <AdminPanel title="Payment history">
          <PaymentEntriesList payments={sale.payments} />
        </AdminPanel>
      </div>

      {sale.notes && (
        <AdminPanel title="Notes" className="mt-4">
          <p className="text-sm text-[#5A6352]">{sale.notes}</p>
        </AdminPanel>
      )}
    </div>
  );
}
