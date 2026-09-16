import { prisma } from "@/lib/prisma";
import type { CustomOrder, Inquiry, DressBooking, Product } from "@prisma/client";

export async function getDashboardStats() {
  try {
    const [
      productCount,
      inactiveProductCount,
      categoryCount,
      promotionCount,
      inquiryCount,
      pendingInquiries,
      contactedInquiries,
      confirmedInquiries,
      bookingCount,
      confirmedBookings,
      overdueBookings,
      customOrderCount,
      activeCustomOrders,
      eventPackageCount,
      featuredProductCount,
    ] = await Promise.all([
      prisma.product.count({ where: { active: true } }),
      prisma.product.count({ where: { active: false } }),
      prisma.category.count(),
      prisma.promotion.count({ where: { active: true } }),
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: "PENDING" } }),
      prisma.inquiry.count({ where: { status: "CONTACTED" } }),
      prisma.inquiry.count({ where: { status: "CONFIRMED" } }),
      prisma.dressBooking.count(),
      prisma.dressBooking.count({ where: { status: "CONFIRMED" } }),
      prisma.dressBooking.count({ where: { status: "OVERDUE" } }),
      prisma.customOrder.count(),
      prisma.customOrder.count({
        where: {
          status: { not: "DELIVERED" },
        },
      }),
      prisma.eventPackage.count({ where: { active: true } }),
      prisma.product.count({ where: { featured: true, active: true } }),
    ]);

    return {
      productCount,
      inactiveProductCount,
      categoryCount,
      promotionCount,
      inquiryCount,
      pendingInquiries,
      contactedInquiries,
      confirmedInquiries,
      bookingCount,
      confirmedBookings,
      overdueBookings,
      customOrderCount,
      activeCustomOrders,
      eventPackageCount,
      featuredProductCount,
    };
  } catch {
    return {
      productCount: 0,
      inactiveProductCount: 0,
      categoryCount: 0,
      promotionCount: 0,
      inquiryCount: 0,
      pendingInquiries: 0,
      contactedInquiries: 0,
      confirmedInquiries: 0,
      bookingCount: 0,
      confirmedBookings: 0,
      overdueBookings: 0,
      customOrderCount: 0,
      activeCustomOrders: 0,
      eventPackageCount: 0,
      featuredProductCount: 0,
    };
  }
}

export async function getRecentInquiries(limit = 5): Promise<
  (Inquiry & { product: Product | null })[]
> {
  try {
    return await prisma.inquiry.findMany({
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getUpcomingBookings(limit = 5): Promise<
  (DressBooking & { product: Product })[]
> {
  try {
    return await prisma.dressBooking.findMany({
      include: { product: true },
      where: {
        status: { in: ["CONFIRMED", "PICKED_UP"] },
        pickupDate: { gte: new Date() },
      },
      orderBy: { pickupDate: "asc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getRecentCustomOrders(
  limit = 5
): Promise<CustomOrder[]> {
  try {
    return await prisma.customOrder.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getInquiryPipeline() {
  try {
    const rows = await prisma.inquiry.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
    return rows.map((row) => ({
      status: row.status,
      count: row._count._all,
    }));
  } catch {
    return [];
  }
}

export async function getOperationsSnapshot() {
  try {
    const [parentCategories, subcategories, inactivePackages] =
      await Promise.all([
        prisma.category.count({ where: { parentId: null } }),
        prisma.category.count({ where: { parentId: { not: null } } }),
        prisma.eventPackage.count({ where: { active: false } }),
      ]);

    return { parentCategories, subcategories, inactivePackages };
  } catch {
    return { parentCategories: 0, subcategories: 0, inactivePackages: 0 };
  }
}
