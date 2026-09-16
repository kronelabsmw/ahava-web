"use server";

import { revalidatePath } from "next/cache";
import { PaymentMethod } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { recalculateSaleFromPayments } from "@/services/sales";

const paymentSchema = z.object({
  saleRecordId: z.string().min(1),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  method: z.enum([
    "CASH",
    "WHATSAPP",
    "BANK_TRANSFER",
    "MOBILE_MONEY",
    "CARD",
    "OTHER",
  ]),
  reference: z.string().trim().optional(),
  paidAt: z.string().optional(),
  notes: z.string().trim().optional(),
});

function revalidateSalesPaths() {
  revalidatePath("/admin");
  revalidatePath("/admin/sales");
}

export async function addPaymentEntry(formData: FormData) {
  try {
    const parsed = paymentSchema.parse({
      saleRecordId: formData.get("saleRecordId"),
      amount: formData.get("amount"),
      method: formData.get("method"),
      reference: formData.get("reference") || undefined,
      paidAt: formData.get("paidAt") || undefined,
      notes: formData.get("notes") || undefined,
    });

    const sale = await prisma.saleRecord.findUnique({
      where: { id: parsed.saleRecordId },
    });
    if (!sale) return { success: false, error: "Sale not found" };

    await prisma.paymentEntry.create({
      data: {
        saleRecordId: parsed.saleRecordId,
        amount: parsed.amount,
        method: parsed.method as PaymentMethod,
        reference: parsed.reference ?? null,
        paidAt: parsed.paidAt ? new Date(parsed.paidAt) : new Date(),
        notes: parsed.notes ?? null,
      },
    });

    await recalculateSaleFromPayments(parsed.saleRecordId);
    revalidateSalesPaths();
    revalidatePath(`/admin/sales/${parsed.saleRecordId}`);
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message ?? "Invalid data" };
    }
    return { success: false, error: "Failed to add payment" };
  }
}

export async function deletePaymentEntry(id: string) {
  try {
    const payment = await prisma.paymentEntry.findUnique({ where: { id } });
    if (!payment) return { success: false, error: "Payment not found" };

    await prisma.paymentEntry.delete({ where: { id } });
    await recalculateSaleFromPayments(payment.saleRecordId);
    revalidateSalesPaths();
    revalidatePath(`/admin/sales/${payment.saleRecordId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete payment" };
  }
}
