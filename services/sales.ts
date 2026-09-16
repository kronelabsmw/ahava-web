import { prisma } from "@/lib/prisma";
import {
  bookingHireTotal,
  bookingPaidAmount,
  bookingPaymentStatus,
  bookingSaleTitle,
  bucketKey,
  bucketLabel,
  customOrderPaidAmount,
  customOrderPaymentStatus,
  customOrderSaleTitle,
  customOrderTotal,
  eventBookingPaidAmount,
  eventBookingPaymentStatus,
  eventBookingSaleTitle,
  eventBookingTotal,
  getRangeStart,
  initBuckets,
  inquiryPaymentStatus,
  inquirySaleAmount,
  inquirySaleTitle,
  isCountableRevenue,
  paymentStatusFromAmounts,
  type SalesPeriod,
} from "@/lib/sales";
import type {
  PaymentEntry,
  SalePaymentStatus,
  SaleRecord,
  SaleType,
} from "@prisma/client";
import type { SalesChartPoint } from "@/lib/sales";

async function sumPaymentsForSale(saleRecordId: string): Promise<number> {
  const result = await prisma.paymentEntry.aggregate({
    where: { saleRecordId },
    _sum: { amount: true },
  });
  return Number(result._sum.amount ?? 0);
}

async function finalizeSaleAmounts(
  saleRecordId: string,
  derived: {
    paidAmount: number;
    totalAmount: number;
    status: SalePaymentStatus;
  }
) {
  const paidFromPayments = await sumPaymentsForSale(saleRecordId);
  const cancelled = derived.status === "CANCELLED";
  const paidAmount =
    paidFromPayments > 0 ? paidFromPayments : derived.paidAmount;
  const status =
    paidFromPayments > 0
      ? paymentStatusFromAmounts(paidAmount, derived.totalAmount, cancelled)
      : derived.status;

  await prisma.saleRecord.update({
    where: { id: saleRecordId },
    data: { paidAmount, status },
  });
}

export async function recalculateSaleFromPayments(saleRecordId: string) {
  const sale = await prisma.saleRecord.findUnique({
    where: { id: saleRecordId },
  });
  if (!sale) return;

  await finalizeSaleAmounts(saleRecordId, {
    paidAmount: Number(sale.paidAmount),
    totalAmount: Number(sale.totalAmount),
    status: sale.status,
  });
}

export async function syncBookingSale(bookingId: string) {
  const booking = await prisma.dressBooking.findUnique({
    where: { id: bookingId },
    include: { product: true },
  });
  if (!booking) return;

  const totalAmount = bookingHireTotal(booking);
  const derived = {
    type: "DRESS_HIRE" as const,
    channel: "SYSTEM" as const,
    title: bookingSaleTitle(booking),
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    totalAmount,
    paidAmount: bookingPaidAmount(booking),
    lateFees: Number(booking.lateFeesAccrued),
    status: bookingPaymentStatus(booking),
    saleDate: booking.weddingDate,
    bookingId: booking.id,
  };

  const sale = await prisma.saleRecord.upsert({
    where: { bookingId: booking.id },
    update: derived,
    create: derived,
  });

  await finalizeSaleAmounts(sale.id, {
    paidAmount: derived.paidAmount,
    totalAmount,
    status: derived.status,
  });
}

export async function syncCustomOrderSale(customOrderId: string) {
  const order = await prisma.customOrder.findUnique({
    where: { id: customOrderId },
  });
  if (!order || !order.quoteAmount) return;

  const totalAmount = customOrderTotal(order);
  const derived = {
    type: "CUSTOM_ORDER" as const,
    channel: "SYSTEM" as const,
    title: customOrderSaleTitle(order),
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    totalAmount,
    paidAmount: customOrderPaidAmount(order),
    lateFees: 0,
    status: customOrderPaymentStatus(order),
    saleDate: order.eventDate ?? order.createdAt,
    customOrderId: order.id,
  };

  const sale = await prisma.saleRecord.upsert({
    where: { customOrderId: order.id },
    update: derived,
    create: derived,
  });

  await finalizeSaleAmounts(sale.id, {
    paidAmount: derived.paidAmount,
    totalAmount,
    status: derived.status,
  });
}

export async function syncInquirySale(inquiryId: string) {
  const inquiry = await prisma.inquiry.findUnique({
    where: { id: inquiryId },
    include: { product: true, eventPackage: true },
  });
  if (!inquiry?.totalAmount) return;

  const saleType: SaleType = inquiry.eventPackageId
    ? "EVENT_PACKAGE"
    : "DRESS_PURCHASE";

  const existing = await prisma.saleRecord.findFirst({
    where: { inquiryId: inquiry.id, channel: "SYSTEM" },
  });

  const totalAmount = inquirySaleAmount(inquiry);
  const derivedPaid =
    inquiry.status === "COMPLETED" ? totalAmount : 0;

  const data = {
    type: saleType,
    channel: "SYSTEM" as const,
    title: inquirySaleTitle(inquiry),
    customerName: inquiry.customerName,
    customerPhone: inquiry.customerPhone,
    totalAmount,
    paidAmount: derivedPaid,
    lateFees: 0,
    status: inquiryPaymentStatus(inquiry, derivedPaid),
    saleDate: inquiry.createdAt,
    inquiryId: inquiry.id,
  };

  const sale = existing
    ? await prisma.saleRecord.update({ where: { id: existing.id }, data })
    : await prisma.saleRecord.create({ data });

  await finalizeSaleAmounts(sale.id, {
    paidAmount: derivedPaid,
    totalAmount,
    status: data.status,
  });
}

export async function syncEventPackageBookingSale(bookingId: string) {
  const booking = await prisma.eventPackageBooking.findUnique({
    where: { id: bookingId },
    include: { eventPackage: true },
  });
  if (!booking) return;

  const totalAmount = eventBookingTotal(booking);
  const derived = {
    type: "EVENT_PACKAGE" as const,
    channel: "SYSTEM" as const,
    title: eventBookingSaleTitle(booking),
    customerName: booking.customerName,
    customerPhone: booking.customerPhone,
    totalAmount,
    paidAmount: eventBookingPaidAmount(booking),
    lateFees: 0,
    status: eventBookingPaymentStatus(booking),
    saleDate: booking.eventDate ?? booking.createdAt,
    eventPackageBookingId: booking.id,
  };

  const sale = await prisma.saleRecord.upsert({
    where: { eventPackageBookingId: booking.id },
    update: derived,
    create: derived,
  });

  await finalizeSaleAmounts(sale.id, {
    paidAmount: derived.paidAmount,
    totalAmount,
    status: derived.status,
  });
}

export async function syncAllSystemSales() {
  const [bookings, customOrders, inquiries, eventBookings] = await Promise.all([
    prisma.dressBooking.findMany({ select: { id: true } }),
    prisma.customOrder.findMany({
      where: { quoteAmount: { not: null } },
      select: { id: true },
    }),
    prisma.inquiry.findMany({
      where: { totalAmount: { not: null } },
      select: { id: true },
    }),
    prisma.eventPackageBooking.findMany({ select: { id: true } }),
  ]);

  await Promise.all([
    ...bookings.map((b) => syncBookingSale(b.id)),
    ...customOrders.map((o) => syncCustomOrderSale(o.id)),
    ...inquiries.map((i) => syncInquirySale(i.id)),
    ...eventBookings.map((b) => syncEventPackageBookingSale(b.id)),
  ]);
}

export type SalesSummary = {
  totalQuoted: number;
  totalCollected: number;
  totalOutstanding: number;
  offlineCollected: number;
  systemCollected: number;
  transactionCount: number;
};

export async function getSalesSummary(
  rangeStart?: Date
): Promise<SalesSummary> {
  await syncAllSystemSales();

  const where = rangeStart ? { saleDate: { gte: rangeStart } } : undefined;
  const sales = await prisma.saleRecord.findMany({ where });

  let totalQuoted = 0;
  let totalCollected = 0;
  let offlineCollected = 0;
  let systemCollected = 0;

  for (const sale of sales) {
    if (sale.status === "CANCELLED" || sale.status === "REFUNDED") continue;
    totalQuoted += Number(sale.totalAmount);
    const paid = Number(sale.paidAmount);
    totalCollected += paid;
    if (sale.channel === "OFFLINE") offlineCollected += paid;
    else systemCollected += paid;
  }

  return {
    totalQuoted,
    totalCollected,
    totalOutstanding: Math.max(0, totalQuoted - totalCollected),
    offlineCollected,
    systemCollected,
    transactionCount: sales.filter((s) => isCountableRevenue(s.status)).length,
  };
}

export async function getSalesChartData(
  period: SalesPeriod = "monthly"
): Promise<SalesChartPoint[]> {
  await syncAllSystemSales();

  const rangeStart = getRangeStart(period);
  const sales = await prisma.saleRecord.findMany({
    where: {
      saleDate: { gte: rangeStart },
      status: { notIn: ["CANCELLED", "REFUNDED"] },
    },
    orderBy: { saleDate: "asc" },
  });

  const buckets = initBuckets(period);

  for (const sale of sales) {
    const key = bucketKey(sale.saleDate, period);
    const bucket = buckets.get(key);
    if (!bucket) continue;
    bucket.revenue += Number(sale.paidAmount);
    if (Number(sale.paidAmount) > 0) bucket.count += 1;
  }

  return Array.from(buckets.entries()).map(([key, value]) => ({
    key,
    label: bucketLabel(key, period),
    revenue: value.revenue,
    count: value.count,
  }));
}

export type SalesByTypeRow = {
  type: SaleType;
  label: string;
  quoted: number;
  collected: number;
};

export async function getSalesByType(): Promise<SalesByTypeRow[]> {
  await syncAllSystemSales();

  const sales = await prisma.saleRecord.findMany({
    where: { status: { notIn: ["CANCELLED", "REFUNDED"] } },
  });

  const map = new Map<SaleType, { quoted: number; collected: number }>();

  for (const sale of sales) {
    const row = map.get(sale.type) ?? { quoted: 0, collected: 0 };
    row.quoted += Number(sale.totalAmount);
    row.collected += Number(sale.paidAmount);
    map.set(sale.type, row);
  }

  const labels: Record<SaleType, string> = {
    DRESS_HIRE: "Dress hire",
    DRESS_PURCHASE: "Dress purchase",
    CUSTOM_ORDER: "Custom orders",
    EVENT_PACKAGE: "Event packages",
    FITTING: "Fittings",
    OTHER: "Other",
  };

  return (Object.keys(labels) as SaleType[])
    .map((type) => ({
      type,
      label: labels[type],
      quoted: map.get(type)?.quoted ?? 0,
      collected: map.get(type)?.collected ?? 0,
    }))
    .filter((row) => row.quoted > 0 || row.collected > 0);
}

export type SaleWithPayments = SaleRecord & {
  payments: PaymentEntry[];
  _count: { payments: number };
};

export async function getSaleWithPayments(
  id: string
): Promise<SaleWithPayments | null> {
  await syncAllSystemSales();
  return prisma.saleRecord.findUnique({
    where: { id },
    include: {
      payments: { orderBy: { paidAt: "desc" } },
      _count: { select: { payments: true } },
    },
  });
}

export async function getRecentSales(limit = 10): Promise<SaleRecord[]> {
  await syncAllSystemSales();
  return prisma.saleRecord.findMany({
    orderBy: { saleDate: "desc" },
    take: limit,
  });
}

export async function getAllSales(): Promise<
  (SaleRecord & { _count: { payments: number } })[]
> {
  await syncAllSystemSales();
  return prisma.saleRecord.findMany({
    orderBy: { saleDate: "desc" },
    include: { _count: { select: { payments: true } } },
  });
}

export type SalesExportRow = {
  saleDate: string;
  title: string;
  type: string;
  channel: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  paidAmount: number;
  status: string;
  paymentMethods: string;
  notes: string;
};

export async function getSalesExportRows(): Promise<SalesExportRow[]> {
  await syncAllSystemSales();

  const sales = await prisma.saleRecord.findMany({
    orderBy: { saleDate: "desc" },
    include: {
      payments: { orderBy: { paidAt: "asc" } },
    },
  });

  return sales.map((sale) => ({
    saleDate: sale.saleDate.toISOString().slice(0, 10),
    title: sale.title,
    type: sale.type,
    channel: sale.channel,
    customerName: sale.customerName ?? "",
    customerPhone: sale.customerPhone ?? "",
    totalAmount: Number(sale.totalAmount),
    paidAmount: Number(sale.paidAmount),
    status: sale.status,
    paymentMethods: sale.payments
      .map((p) => `${p.method}:${Number(p.amount)}`)
      .join("; "),
    notes: sale.notes ?? "",
  }));
}
