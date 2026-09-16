import Link from "next/link";
import {
  getAllSales,
  getSalesByType,
  getSalesChartData,
  getSalesSummary,
} from "@/services/sales";
import { formatPrice } from "@/lib/utils";
import type { SalesPeriod } from "@/lib/sales";
import { SALES_PERIODS } from "@/lib/sales";
import {
  AdminPageHeader,
  AdminPanel,
  AdminStageBadge,
  AdminStatCard,
  AdminTableBody,
  AdminTableCell,
  AdminTableElement,
  AdminTableEmpty,
  AdminTableHead,
  AdminTableHeadCell,
  AdminTableRow,
  adminOutlineButtonClass,
} from "@/components/admin/admin-ui";
import { SalesChartPanel } from "@/components/admin/sales-chart-panel";
import { OfflineSaleForm } from "@/components/admin/offline-sale-form";
import { DeleteOfflineSaleButton } from "@/components/admin/delete-offline-sale-button";
import { formatAdminDateCompact } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Banknote,
  Wallet,
  Store,
  Smartphone,
  TrendingUp,
  Download,
} from "lucide-react";

type Props = {
  searchParams: Promise<{ period?: string }>;
};

export default async function AdminSalesPage({ searchParams }: Props) {
  const params = await searchParams;
  const period = (
    SALES_PERIODS.includes(params.period as SalesPeriod)
      ? params.period
      : "monthly"
  ) as SalesPeriod;

  const [summary, chartData, byType, sales] = await Promise.all([
    getSalesSummary(),
    getSalesChartData(period),
    getSalesByType(),
    getAllSales(),
  ]);

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const monthSummary = await getSalesSummary(monthStart);

  return (
    <div>
      <AdminPageHeader
        title="Sales & revenue"
        description="All money in one place — dress hires, custom orders, event packages, and offline sales."
        action={
          <Button asChild className={adminOutlineButtonClass}>
            <a href="/api/admin/sales/export">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </a>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Collected (all time)"
          value={formatPrice(summary.totalCollected)}
          icon={Banknote}
        />
        <AdminStatCard
          label="Collected this month"
          value={formatPrice(monthSummary.totalCollected)}
          icon={TrendingUp}
        />
        <AdminStatCard
          label="Outstanding"
          value={formatPrice(summary.totalOutstanding)}
          icon={Wallet}
        />
        <AdminStatCard
          label="Offline collected"
          value={formatPrice(summary.offlineCollected)}
          icon={Store}
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChartPanel data={chartData} period={period} />
        </div>

        <AdminPanel title="By category">
          {byType.length > 0 ? (
            <div className="space-y-3">
              {byType.map((row) => (
                <div
                  key={row.type}
                  className="rounded-xl border border-[#E8EBE4] bg-[#F7F9F5] px-4 py-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-[#2D3328]">{row.label}</p>
                    <p className="text-sm font-semibold tabular-nums text-[#6B7B52]">
                      {formatPrice(row.collected)}
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-[#8A9480]">
                    Quoted {formatPrice(row.quoted)}
                  </p>
                </div>
              ))}
              <p className="text-xs text-[#8A9480]">
                <Smartphone className="mr-1 inline h-3.5 w-3.5" />
                System: {formatPrice(summary.systemCollected)} · Offline:{" "}
                {formatPrice(summary.offlineCollected)}
              </p>
            </div>
          ) : (
            <p className="text-sm text-[#8A9480]">
              No sales recorded yet. Bookings and custom orders sync automatically;
              use the form below for walk-in or WhatsApp sales.
            </p>
          )}
        </AdminPanel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <AdminPanel
          title="Record offline sale"
          description="Walk-ins, WhatsApp payments, or cash sales not created in the system."
          className="xl:col-span-1"
        >
          <OfflineSaleForm />
        </AdminPanel>

        <AdminPanel title="All sales ledger" className="xl:col-span-2" noPadding>
          <div className="overflow-x-auto">
            <AdminTableElement>
              <AdminTableHead>
                <AdminTableHeadCell>Date</AdminTableHeadCell>
                <AdminTableHeadCell>Sale</AdminTableHeadCell>
                <AdminTableHeadCell>Source</AdminTableHeadCell>
                <AdminTableHeadCell>Total</AdminTableHeadCell>
                <AdminTableHeadCell>Collected</AdminTableHeadCell>
                <AdminTableHeadCell>Payments</AdminTableHeadCell>
                <AdminTableHeadCell>Status</AdminTableHeadCell>
                <AdminTableHeadCell className="text-right"> </AdminTableHeadCell>
              </AdminTableHead>
              <AdminTableBody>
                {sales.map((sale) => (
                  <AdminTableRow key={sale.id}>
                    <AdminTableCell>
                      {formatAdminDateCompact(sale.saleDate)}
                    </AdminTableCell>
                    <AdminTableCell>
                      <Link
                        href={`/admin/sales/${sale.id}`}
                        className="font-medium text-[#2D3328] hover:text-[#6B7B52]"
                      >
                        {sale.title}
                      </Link>
                      {sale.customerName && (
                        <p className="text-xs text-[#8A9480]">{sale.customerName}</p>
                      )}
                    </AdminTableCell>
                    <AdminTableCell>
                      <span
                        className={
                          sale.channel === "OFFLINE"
                            ? "rounded-md bg-[#FDF4E3] px-2 py-0.5 text-xs font-medium text-[#8B6914]"
                            : "rounded-md bg-[#EEF2E8] px-2 py-0.5 text-xs font-medium text-[#6B7B52]"
                        }
                      >
                        {sale.channel === "OFFLINE" ? "Offline" : "System"}
                      </span>
                    </AdminTableCell>
                    <AdminTableCell>{formatPrice(Number(sale.totalAmount))}</AdminTableCell>
                    <AdminTableCell className="font-medium text-[#2D3328]">
                      {formatPrice(Number(sale.paidAmount))}
                    </AdminTableCell>
                    <AdminTableCell>
                      <Link
                        href={`/admin/sales/${sale.id}`}
                        className="text-xs font-medium text-[#6B7B52] hover:underline"
                      >
                        {sale._count.payments} logged
                      </Link>
                    </AdminTableCell>
                    <AdminTableCell>
                      <AdminStageBadge status={sale.status} />
                    </AdminTableCell>
                    <AdminTableCell className="text-right">
                      {sale.channel === "OFFLINE" && (
                        <DeleteOfflineSaleButton saleId={sale.id} />
                      )}
                    </AdminTableCell>
                  </AdminTableRow>
                ))}
                {sales.length === 0 && (
                  <AdminTableEmpty
                    colSpan={8}
                    message="No sales yet. Update booking statuses or record an offline sale."
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
