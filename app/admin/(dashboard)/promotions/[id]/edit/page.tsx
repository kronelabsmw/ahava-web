import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PromotionForm } from "@/components/admin/promotion-form";
import { AdminFormShell } from "@/components/admin/admin-ui";

type Props = { params: Promise<{ id: string }> };

export default async function EditPromotionPage({ params }: Props) {
  const { id } = await params;
  const promotion = await prisma.promotion.findUnique({ where: { id } });
  if (!promotion) notFound();

  return (
    <AdminFormShell
      title="Edit promotion"
      description={promotion.title}
      backHref="/admin/promotions"
      backLabel="Promotions"
    >
      <PromotionForm initialData={promotion} />
    </AdminFormShell>
  );
}
