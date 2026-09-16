"use client";

import { CustomOrderStatus } from "@prisma/client";
import { updateCustomOrderStatus } from "@/actions/admin/custom-orders";
import { AdminStatusSelect } from "@/components/admin/admin-status-select";

const CUSTOM_ORDER_STATUSES = Object.values(CustomOrderStatus);

export function CustomOrderStatusCell({
  id,
  status,
}: {
  id: string;
  status: CustomOrderStatus;
}) {
  return (
    <AdminStatusSelect
      value={status}
      options={CUSTOM_ORDER_STATUSES}
      onUpdate={(next) => updateCustomOrderStatus(id, next as CustomOrderStatus)}
    />
  );
}
