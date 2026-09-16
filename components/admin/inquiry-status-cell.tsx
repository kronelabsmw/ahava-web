"use client";

import { InquiryStatus } from "@prisma/client";
import { updateInquiryStatus } from "@/actions/admin/inquiries";
import { AdminStatusSelect } from "@/components/admin/admin-status-select";

const INQUIRY_STATUSES = Object.values(InquiryStatus);

export function InquiryStatusCell({
  id,
  status,
}: {
  id: string;
  status: InquiryStatus;
}) {
  return (
    <AdminStatusSelect
      value={status}
      options={INQUIRY_STATUSES}
      onUpdate={(next) => updateInquiryStatus(id, next as InquiryStatus)}
    />
  );
}
