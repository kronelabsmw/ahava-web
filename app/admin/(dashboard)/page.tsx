import Link from "next/link";
import {
  getDashboardStats,
  getRecentInquiries,
  getUpcomingBookings,
  getRecentCustomOrders,
  getInquiryPipeline,
  getOperationsSnapshot,
} from "@/services/admin";
import {
  getSalesSummary,
  getSalesChartData,
  getRecentSales,
} from "@/services/sales";
import { formatAdminDateCompact, formatPrice } from "@/lib/utils";
import {
  AdminEmptyState,
  AdminListRow,
  AdminPageHeader,
  AdminPanel,
  AdminStageBadge,
  AdminStatCard,
} from "@/components/admin/admin-ui";
import { Button } from "@/components/ui/button";
import { SalesChartPanel } from "@/components/admin/sales-chart-panel";
import {
  ShoppingBag,
  MessageSquare,
  CalendarCheck,
  AlertCircle,
  Scissors,
  PartyPopper,
  ArrowRight,
  Tags,
  Gift,
  Star,
  Archive,
  Banknote,
  Wallet,
  TrendingUp,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [
    stats,
    inquiries,
    bookings,
    customOrders,
    pipeline,
    ops,
    salesSummary,
    monthSales,
    salesChart,
    recentSales,
  ] = await Promise.all([
    getDashboardStats(),
    getRecentInquiries(),
    getUpcomingBookings(),
    getRecentCustomOrders(),
    getInquiryPipeline(),
    getOperationsSnapshot(),
    getSalesSummary(),
    getSalesSummary(monthStart),
    getSalesChartData("monthly"),
    getRecentSales(5),
  ]);

  const statCards = [
    {
      label: "Active products",
      value: stats.productCount,
      href: "/admin/products",
      icon: ShoppingBag,
    },
    {
      label: "Pending inquiries",
      value: stats.pendingInquiries,
      href: "/admin/inquiries",
      icon: MessageSquare,
    },
    {
      label: "Dress bookings",
      value: stats.bookingCount,
      href: "/admin/bookings",
      icon: CalendarCheck,
    },
    {
      label: "Overdue returns",
      value: stats.overdueBookings,
      href: "/admin/bookings",
      icon: AlertCircle,
    },
    {
      label: "Custom orders",
      value: stats.activeCustomOrders,
      href: "/admin/custom-orders",
      icon: Scissors,
    },
    {
      label: "Event packages",
      value: stats.eventPackageCount,
      href: "/admin/event-packages",
      icon: PartyPopper,
    },
    {
      label: "Categories",
      value: stats.categoryCount,
      href: "/admin/categories",
      icon: Tags,
    },
    {
      label: "Active promotions",
      value: stats.promotionCount,
      href: "/admin/promotions",
      icon: Gift,
    },
    {
      label: "Featured dresses",
      value: stats.featuredProductCount,
      href: "/admin/products",
      icon: Star,
    },
    {
      label: "Inactive products",
      value: stats.inactiveProductCount,
      href: "/admin/products",
      icon: Archive,
    },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Operations, revenue, inquiries, bookings, and catalogue health."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Collected (all time)"
          value={formatPrice(salesSummary.totalCollected)}
          href="/admin/sales"
          icon={Banknote}
        />
        <AdminStatCard
          label="Collected this month"
          value={formatPrice(monthSales.totalCollected)}
          href="/admin/sales"
          icon={TrendingUp}
        />
        <AdminStatCard
          label="Outstanding"
          value={formatPrice(salesSummary.totalOutstanding)}
          href="/admin/sales"
          icon={Wallet}
        />
        <AdminStatCard
          label="Offline sales"
          value={formatPrice(salesSummary.offlineCollected)}
          href="/admin/sales"
          icon={Banknote}
        />
      </div>

      <div className="mb-4 grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChartPanel data={salesChart} period="monthly" basePath="/admin" />
        </div>
        <AdminPanel
          title="Recent sales"
          action={
            <Button asChild variant="ghost" size="sm" className="text-[#6B7B52]">
              <Link href="/admin/sales">
                View all
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          }
        >
          {recentSales.length > 0 ? (
            <div>
              {recentSales.map((sale) => (
                <AdminListRow
                  key={sale.id}
                  primary={sale.title}
                  secondary={`${sale.channel === "OFFLINE" ? "Offline" : "System"} · ${formatAdminDateCompact(sale.saleDate)}`}
                  trailing={
                    <span className="text-sm font-semibold tabular-nums text-[#2D3328]">
                      {formatPrice(Number(sale.paidAmount))}
                    </span>
                  }
                />
              ))}
            </div>
          ) : (
            <AdminEmptyState message="No sales recorded yet" />
          )}
        </AdminPanel>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {statCards.map((stat) => (
          <AdminStatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            href={stat.href}
          />
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <AdminPanel title="Inquiry pipeline" className="xl:col-span-1">
          {pipeline.length > 0 ? (
            <div className="space-y-3">
              {pipeline.map((item) => (
                <div
                  key={item.status}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#E8EBE4] bg-[#F7F9F5] px-4 py-3"
                >
                  <AdminStageBadge status={item.status} />
                  <span className="text-lg font-semibold tabular-nums text-[#2D3328]">
                    {item.count}
                  </span>
                </div>
              ))}
              <p className="text-xs text-[#8A9480]">
                {stats.inquiryCount} total inquiries · {stats.contactedInquiries}{" "}
                contacted · {stats.confirmedInquiries} confirmed
              </p>
            </div>
          ) : (
            <AdminEmptyState message="No inquiries yet" />
          )}
        </AdminPanel>

        <AdminPanel title="Catalogue snapshot" className="xl:col-span-1">
          <div className="space-y-3 text-sm text-[#5A6352]">
            <div className="flex items-center justify-between rounded-xl border border-[#E8EBE4] px-4 py-3">
              <span>Parent categories</span>
              <span className="font-semibold tabular-nums text-[#2D3328]">
                {ops.parentCategories}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#E8EBE4] px-4 py-3">
              <span>Subcategories</span>
              <span className="font-semibold tabular-nums text-[#2D3328]">
                {ops.subcategories}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#E8EBE4] px-4 py-3">
              <span>Confirmed bookings</span>
              <span className="font-semibold tabular-nums text-[#2D3328]">
                {stats.confirmedBookings}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[#E8EBE4] px-4 py-3">
              <span>Inactive event packages</span>
              <span className="font-semibold tabular-nums text-[#2D3328]">
                {ops.inactivePackages}
              </span>
            </div>
          </div>
        </AdminPanel>

        <AdminPanel
          title="Recent custom orders"
          action={
            <Button asChild variant="ghost" size="sm" className="text-[#6B7B52]">
              <Link href="/admin/custom-orders">
                View all
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          }
          className="xl:col-span-1"
        >
          {customOrders.length > 0 ? (
            <div>
              {customOrders.map((order) => (
                <AdminListRow
                  key={order.id}
                  primary={order.customerName}
                  secondary={order.eventDate ? formatAdminDateCompact(order.eventDate) : "No event date"}
                  trailing={<AdminStageBadge status={order.status} />}
                />
              ))}
            </div>
          ) : (
            <AdminEmptyState message="No custom orders yet" />
          )}
        </AdminPanel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-5">
        <AdminPanel
          title="Recent inquiries"
          action={
            <Button asChild variant="ghost" size="sm" className="text-[#6B7B52]">
              <Link href="/admin/inquiries">
                View all
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          }
          className="xl:col-span-2"
        >
          {inquiries.length > 0 ? (
            <div>
              {inquiries.map((inq) => (
                <AdminListRow
                  key={inq.id}
                  primary={inq.customerName}
                  secondary={inq.product?.name || "General inquiry"}
                  trailing={<AdminStageBadge status={inq.status} />}
                />
              ))}
            </div>
          ) : (
            <AdminEmptyState message="No recent inquiries" />
          )}
        </AdminPanel>

        <AdminPanel
          title="Upcoming pickups"
          action={
            <Button asChild variant="ghost" size="sm" className="text-[#6B7B52]">
              <Link href="/admin/bookings">
                View all
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          }
          className="xl:col-span-3"
        >
          {bookings.length > 0 ? (
            <div>
              {bookings.map((b) => (
                <AdminListRow
                  key={b.id}
                  primary={b.customerName}
                  secondary={b.product.name}
                  trailing={
                    <div className="text-right">
                      <p className="text-sm font-medium tabular-nums text-[#2D3328]">
                        {formatAdminDateCompact(b.pickupDate)}
                      </p>
                      <AdminStageBadge status={b.status} />
                    </div>
                  }
                />
              ))}
            </div>
          ) : (
            <AdminEmptyState message="No upcoming pickups" />
          )}
        </AdminPanel>
      </div>
    </div>
  );
}
