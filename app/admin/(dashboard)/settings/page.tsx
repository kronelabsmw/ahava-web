import { getSettings } from "@/services/settings";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <AdminPageHeader
        title="Settings"
        description="Manage shop details, homepage hero media, background videos, and page banners."
      />
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
