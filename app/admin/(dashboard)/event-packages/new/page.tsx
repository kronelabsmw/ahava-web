import { EventPackageForm } from "@/components/admin/event-package-form";
import { AdminFormShell } from "@/components/admin/admin-ui";

export default function NewEventPackagePage() {
  return (
    <AdminFormShell
      title="Add event package"
      description="Create a new event planning tier for the storefront."
      backHref="/admin/event-packages"
      backLabel="Event packages"
    >
      <EventPackageForm />
    </AdminFormShell>
  );
}
