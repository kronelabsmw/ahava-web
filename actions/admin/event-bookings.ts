"use server";

import { revalidatePath } from "next/cache";
import { EventBookingStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { syncEventPackageBookingSale } from "@/services/sales";

const createSchema = z.object({
  eventPackageId: z.string().min(1),
  customerName: z.string().trim().min(2),
  customerPhone: z.string().trim().min(8),
  customerEmail: z.string().trim().email().optional().or(z.literal("")),
  eventDate: z.string().optional(),
  eventLocation: z.string().trim().optional(),
  guestCount: z.coerce.number().int().positive().optional(),
  quotedAmount: z.coerce.number().positive(),
  depositPaid: z.coerce.number().min(0).optional(),
  status: z.enum([
    "INQUIRY",
    "QUOTED",
    "DEPOSIT_PAID",
    "CONFIRMED",
    "COMPLETED",
    "CANCELLED",
  ]),
  notes: z.string().trim().optional(),
});

export async function createEventPackageBooking(formData: FormData) {
  try {
    const parsed = createSchema.parse({
      eventPackageId: formData.get("eventPackageId"),
      customerName: formData.get("customerName"),
      customerPhone: formData.get("customerPhone"),
      customerEmail: formData.get("customerEmail") || undefined,
      eventDate: formData.get("eventDate") || undefined,
      eventLocation: formData.get("eventLocation") || undefined,
      guestCount: formData.get("guestCount") || undefined,
      quotedAmount: formData.get("quotedAmount"),
      depositPaid: formData.get("depositPaid") || 0,
      status: formData.get("status"),
      notes: formData.get("notes") || undefined,
    });

    const pkg = await prisma.eventPackage.findUnique({
      where: { id: parsed.eventPackageId },
    });
    if (!pkg) return { success: false, error: "Package not found" };

    const booking = await prisma.eventPackageBooking.create({
      data: {
        eventPackageId: parsed.eventPackageId,
        customerName: parsed.customerName,
        customerPhone: parsed.customerPhone,
        customerEmail: parsed.customerEmail || null,
        eventDate: parsed.eventDate ? new Date(parsed.eventDate) : null,
        eventLocation: parsed.eventLocation ?? null,
        guestCount: parsed.guestCount ?? null,
        quotedAmount: parsed.quotedAmount,
        depositPaid: parsed.depositPaid ?? 0,
        status: parsed.status as EventBookingStatus,
        notes: parsed.notes ?? null,
      },
    });

    await syncEventPackageBookingSale(booking.id);
    revalidatePath("/admin/event-bookings");
    revalidatePath("/admin/sales");
    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0]?.message ?? "Invalid data" };
    }
    return { success: false, error: "Failed to create event booking" };
  }
}

export async function updateEventBookingStatus(
  id: string,
  status: EventBookingStatus
) {
  if (!Object.values(EventBookingStatus).includes(status)) {
    return { success: false, error: "Invalid status" };
  }

  try {
    await prisma.eventPackageBooking.update({
      where: { id },
      data: { status },
    });
    await syncEventPackageBookingSale(id);
    revalidatePath("/admin/event-bookings");
    revalidatePath("/admin/sales");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update status" };
  }
}

export async function updateEventBookingPayment(
  id: string,
  depositPaid: number
) {
  try {
    await prisma.eventPackageBooking.update({
      where: { id },
      data: { depositPaid },
    });
    await syncEventPackageBookingSale(id);
    revalidatePath("/admin/event-bookings");
    revalidatePath("/admin/sales");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update deposit" };
  }
}
