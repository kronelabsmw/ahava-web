"use server";

import { revalidatePath } from "next/cache";
import { CustomOrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { syncCustomOrderSale } from "@/services/sales";

export async function updateCustomOrderStatus(
  id: string,
  status: CustomOrderStatus
) {

  if (!Object.values(CustomOrderStatus).includes(status)) {
    return { success: false, error: "Invalid status" };
  }

  try {
    await prisma.customOrder.update({
      where: { id },
      data: { status },
    });
    await syncCustomOrderSale(id);
    revalidatePath("/admin/custom-orders");
    revalidatePath("/admin/sales");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update custom order status" };
  }
}
