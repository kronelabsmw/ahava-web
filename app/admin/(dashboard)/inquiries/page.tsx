import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  AdminPageHeader,
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableElement,
  AdminTableEmpty,
  AdminTableHead,
  AdminTableHeadCell,
  AdminTableRow,
} from "@/components/admin/admin-ui";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { InquiryStatusCell } from "@/components/admin/inquiry-status-cell";
import { InquiryAmountCell } from "@/components/admin/inquiry-amount-cell";

type InquiryWithRelations = Prisma.InquiryGetPayload<{
  include: { product: true; eventPackage: true };
}>;

export default async function AdminInquiriesPage() {
  let inquiries: InquiryWithRelations[] = [];
  try {
    inquiries = await prisma.inquiry.findMany({
      include: { product: true, eventPackage: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {}

  return (
    <div>
      <AdminPageHeader
        title="Inquiries"
        description="Set a sale amount when closing a deal, then mark completed to add it to revenue."
      />

      <AdminTable
        toolbar={
          <>
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A8B09E]" />
              <Input
                placeholder="Search inquiries..."
                className="h-10 rounded-xl border-[#E8EBE4] bg-[#F7F9F5] pl-9"
                readOnly
              />
            </div>
            <p className="text-sm text-[#8A9480]">
              {inquiries.length} inquir{inquiries.length !== 1 ? "ies" : "y"}
            </p>
          </>
        }
      >
        <AdminTableElement>
          <AdminTableHead>
            <AdminTableHeadCell>Customer</AdminTableHeadCell>
            <AdminTableHeadCell>Contact</AdminTableHeadCell>
            <AdminTableHeadCell>Subject</AdminTableHeadCell>
            <AdminTableHeadCell>Sale amount</AdminTableHeadCell>
            <AdminTableHeadCell>Status</AdminTableHeadCell>
            <AdminTableHeadCell>Date</AdminTableHeadCell>
          </AdminTableHead>
          <AdminTableBody>
            {inquiries.map((inq) => (
              <AdminTableRow key={inq.id}>
                <AdminTableCell>
                  <span className="font-medium text-[#2D3328]">
                    {inq.customerName}
                  </span>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex flex-col">
                    <span>{inq.customerPhone}</span>
                    {inq.customerEmail && (
                      <span className="text-xs text-[#A8B09E]">
                        {inq.customerEmail}
                      </span>
                    )}
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-[#3D4538]">
                      {inq.eventPackage?.name ||
                        inq.product?.name ||
                        "General inquiry"}
                    </span>
                    {inq.variantInfo && (
                      <span className="text-xs text-[#A8B09E]">
                        {inq.variantInfo}
                      </span>
                    )}
                  </div>
                </AdminTableCell>
                <AdminTableCell>
                  <InquiryAmountCell
                    id={inq.id}
                    totalAmount={
                      inq.totalAmount != null ? Number(inq.totalAmount) : null
                    }
                  />
                </AdminTableCell>
                <AdminTableCell>
                  <InquiryStatusCell id={inq.id} status={inq.status} />
                </AdminTableCell>
                <AdminTableCell>
                  {new Date(inq.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </AdminTableCell>
              </AdminTableRow>
            ))}
            {inquiries.length === 0 && (
              <AdminTableEmpty colSpan={6} message="No inquiries yet" />
            )}
          </AdminTableBody>
        </AdminTableElement>
      </AdminTable>
    </div>
  );
}
