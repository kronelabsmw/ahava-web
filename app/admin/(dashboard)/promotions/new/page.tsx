import { PromotionForm } from "@/components/admin/promotion-form";
import { AdminFormShell } from "@/components/admin/admin-ui";

export default function NewPromotionPage() {
  return (
    <AdminFormShell
      title="Create promotion"
      description="Set up a new discount or seasonal offer."
      backHref="/admin/promotions"
      backLabel="Promotions"
    >
      <PromotionForm />
    </AdminFormShell>
  );
}
