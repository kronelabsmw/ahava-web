"use server";

import { revalidatePath } from "next/cache";
import { InquiryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { syncInquirySale } from "@/services/sales";

export async function updateInquiryStatus(id: string, status: InquiryStatus) {

  if (!Object.values(InquiryStatus).includes(status)) {
    return { success: false, error: "Invalid status" };
  }

  try {
    await prisma.inquiry.update({
      where: { id },
      data: { status },
    });
    await syncInquirySale(id);
    revalidatePath("/admin/inquiries");
    revalidatePath("/admin/sales");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update inquiry status" };
  }
}

export async function updateInquiryAmount(id: string, totalAmount: number | null) {
  try {
    if (totalAmount !== null && (Number.isNaN(totalAmount) || totalAmount < 0)) {
      return { success: false, error: "Invalid amount" };
    }

    await prisma.inquiry.update({
      where: { id },
      data: { totalAmount },
    });
    await syncInquirySale(id);
    revalidatePath("/admin/inquiries");
    revalidatePath("/admin/sales");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update inquiry amount" };
  }
}
