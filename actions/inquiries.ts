"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const inquirySchema = z.object({
  customerName: z.string().trim().min(2, "Name is required"),
  customerPhone: z.string().trim().min(8, "A valid phone number is required"),
  customerEmail: z
    .string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
  productId: z.string().optional(),
  eventPackageId: z.string().optional(),
  variantInfo: z.string().optional(),
});

export async function submitInquiry(formData: FormData) {
  try {
    const parsed = inquirySchema.parse({
      customerName: formData.get("customerName"),
      customerPhone: formData.get("customerPhone"),
      customerEmail: formData.get("customerEmail") || undefined,
      message: formData.get("message"),
      productId: formData.get("productId") || undefined,
      eventPackageId: formData.get("eventPackageId") || undefined,
      variantInfo: formData.get("variantInfo") || undefined,
    });

    if (parsed.productId) {
      const product = await prisma.product.findUnique({
        where: { id: parsed.productId },
        select: { id: true },
      });
      if (!product) {
        return { success: false, error: "Product not found" };
      }
    }

    if (parsed.eventPackageId) {
      const eventPackage = await prisma.eventPackage.findUnique({
        where: { id: parsed.eventPackageId },
        select: { id: true },
      });
      if (!eventPackage) {
        return { success: false, error: "Event package not found" };
      }
    }

    await prisma.inquiry.create({
      data: {
        customerName: parsed.customerName,
        customerPhone: parsed.customerPhone,
        customerEmail: parsed.customerEmail || null,
        message: parsed.message,
        productId: parsed.productId ?? null,
        eventPackageId: parsed.eventPackageId ?? null,
        variantInfo: parsed.variantInfo ?? null,
        status: "PENDING",
      },
    });

    revalidatePath("/admin/inquiries");
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message ?? "Invalid form data",
      };
    }
    console.error("Submit inquiry error:", error);
    return { success: false, error: "Failed to submit inquiry. Please try again." };
  }
}
