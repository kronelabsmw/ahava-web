import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { EventPackageForm } from "@/components/admin/event-package-form";
import { AdminFormShell } from "@/components/admin/admin-ui";

type Props = { params: Promise<{ id: string }> };

export default async function EditEventPackagePage({ params }: Props) {
  const { id } = await params;
  const pkg = await prisma.eventPackage.findUnique({ where: { id } });
  if (!pkg) notFound();

  return (
    <AdminFormShell
      title="Edit event package"
      description={pkg.name}
      backHref="/admin/event-packages"
      backLabel="Event packages"
    >
      <EventPackageForm
        initialData={{
          ...pkg,
          price: Number(pkg.price),
        }}
      />
    </AdminFormShell>
  );
}
