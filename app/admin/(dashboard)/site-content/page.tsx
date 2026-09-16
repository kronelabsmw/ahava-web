import { getSiteContent } from "@/services/site-content";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { SiteContentForm } from "./site-content-form";

export default async function AdminSiteContentPage() {
  const { siteContent } = await getSiteContent();

  return (
    <div>
      <AdminPageHeader
        title="Site content"
        description="Manage the announcement bar, testimonials, and contact details shown on the storefront."
      />
      <SiteContentForm initialContent={siteContent} />
    </div>
  );
}
