"use server";

import { revalidatePath } from "next/cache";
import { BookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { syncBookingSale } from "@/services/sales";

export async function updateBookingStatus(id: string, status: BookingStatus) {

  if (!Object.values(BookingStatus).includes(status)) {
    return { success: false, error: "Invalid status" };
  }

  try {
    await prisma.dressBooking.update({
      where: { id },
      data: { status },
    });
    await syncBookingSale(id);
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/sales");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update booking status" };
  }
}

export async function deleteBooking(id: string) {
  try {
    const booking = await prisma.dressBooking.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!booking) {
      return { success: false, error: "Booking not found" };
    }

    // SaleRecord (and its payments) cascade via schema onDelete
    await prisma.dressBooking.delete({ where: { id } });

    revalidatePath("/admin/bookings");
    revalidatePath("/admin/sales");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete booking" };
  }
}
