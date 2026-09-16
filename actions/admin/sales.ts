"use server";

import { revalidatePath } from "next/cache";
import { SalePaymentStatus, SaleType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  syncBookingSale,
  syncCustomOrderSale,
  syncInquirySale,
  recalculateSaleFromPayments,
  syncEventPackageBookingSale,
} from "@/services/sales";

const offlineSaleSchema = z.object({
  type: z.enum([
    "DRESS_HIRE",
    "DRESS_PURCHASE",
    "CUSTOM_ORDER",
    "EVENT_PACKAGE",
    "FITTING",
    "OTHER",
  ]),
  title: z.string().trim().min(2, "Title is required"),
  customerName: z.string().trim().optional(),
  customerPhone: z.string().trim().optional(),
  totalAmount: z.coerce.number().positive("Total must be greater than zero"),
  paidAmount: z.coerce.number().min(0, "Paid amount cannot be negative"),
  status: z.enum([
    "QUOTED",
    "DEPOSIT_RECEIVED",
    "PARTIALLY_PAID",
    "PAID",
    "REFUNDED",
    "CANCELLED",
  ]),
  saleDate: z.string().min(1, "Sale date is required"),
  notes: z.string().trim().optional(),
});

function revalidateSalesPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/sales");
}

export async function createOfflineSale(formData: FormData) {
  try {
    const parsed = offlineSaleSchema.parse({
      type: formData.get("type"),
      title: formData.get("title"),
      customerName: formData.get("customerName") || undefined,
      customerPhone: formData.get("customerPhone") || undefined,
      totalAmount: formData.get("totalAmount"),
      paidAmount: formData.get("paidAmount"),
      status: formData.get("status"),
      saleDate: formData.get("saleDate"),
      notes: formData.get("notes") || undefined,
    });

    if (parsed.paidAmount > parsed.totalAmount) {
      return { success: false, error: "Paid amount cannot exceed total" };
    }

    const sale = await prisma.saleRecord.create({
      data: {
        type: parsed.type as SaleType,
        channel: "OFFLINE",
        title: parsed.title,
        customerName: parsed.customerName ?? null,
        customerPhone: parsed.customerPhone ?? null,
        totalAmount: parsed.totalAmount,
        paidAmount: parsed.paidAmount,
        status: parsed.status as SalePaymentStatus,
        saleDate: new Date(parsed.saleDate),
        notes: parsed.notes ?? null,
      },
    });

    if (parsed.paidAmount > 0) {
      await prisma.paymentEntry.create({
        data: {
          saleRecordId: sale.id,
          amount: parsed.paidAmount,
          method: "CASH",
          paidAt: new Date(parsed.saleDate),
          notes: "Recorded with offline sale",
        },
      });
      await recalculateSaleFromPayments(sale.id);
    }

    revalidateSalesPaths();
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message ?? "Invalid data" };
    }
    return { success: false, error: "Failed to record sale" };
  }
}

export async function deleteOfflineSale(id: string) {
  try {
    const sale = await prisma.saleRecord.findUnique({ where: { id } });
    if (!sale || sale.channel !== "OFFLINE") {
      return { success: false, error: "Only offline sales can be deleted here" };
    }

    await prisma.saleRecord.delete({ where: { id } });
    revalidateSalesPaths();
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete sale" };
  }
}

export async function syncSystemSales() {
  try {
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

    revalidateSalesPaths();
    return { success: true };
  } catch {
    return { success: false, error: "Failed to sync system sales" };
  }
}
