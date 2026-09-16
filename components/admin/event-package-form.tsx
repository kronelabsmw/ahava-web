"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageField } from "@/components/admin/image-field";
import {
  createEventPackage,
  deleteEventPackage,
  updateEventPackage,
} from "@/actions/admin/event-packages";
import { slugify } from "@/lib/utils";
import {
  Loader2,
  PartyPopper,
  Image as ImageIcon,
  Eye,
  ListChecks,
} from "lucide-react";
import {
  AdminFormLayout,
  AdminFormCard,
  AdminFormRow,
  AdminFormAlert,
  AdminFormActions,
  AdminToggleRow,
  adminInputClass,
  adminTextareaClass,
  adminPrimaryButtonClass,
  adminOutlineButtonClass,
} from "@/components/admin/admin-form";

type EventPackageFormProps = {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number | string;
    guestCount?: number | null;
    servicesIncluded: string[];
    additionalCharges?: string | null;
    image?: string | null;
    active: boolean;
  };
};

export function EventPackageForm({ initialData }: EventPackageFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [price, setPrice] = useState(String(initialData?.price ?? ""));
  const [guestCount, setGuestCount] = useState(
    initialData?.guestCount != null ? String(initialData.guestCount) : ""
  );
  const [servicesIncluded, setServicesIncluded] = useState(
    initialData?.servicesIncluded.join("\n") || ""
  );
  const [additionalCharges, setAdditionalCharges] = useState(
    initialData?.additionalCharges || ""
  );
  const [image, setImage] = useState(initialData?.image || "");
  const [active, setActive] = useState(initialData?.active ?? true);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug || slugify(name));
    formData.append("description", description);
    formData.append("price", price);
    if (guestCount) formData.append("guestCount", guestCount);
    formData.append("servicesIncluded", servicesIncluded);
    formData.append("additionalCharges", additionalCharges);
    formData.append("image", image);
    if (active) formData.append("active", "true");

    const result = isEdit
      ? await updateEventPackage(initialData!.id, formData)
      : await createEventPackage(formData);

    if (result.success) {
      router.push("/admin/event-packages");
      router.refresh();
    } else {
      setError(result.error || "Something went wrong");
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (!initialData || !confirm("Delete this event package?")) return;
    setIsPending(true);
    const result = await deleteEventPackage(initialData.id);
    if (result.success) {
      router.push("/admin/event-packages");
      router.refresh();
    } else {
      setError(result.error || "Failed to delete");
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <AdminFormAlert className="mb-6">{error}</AdminFormAlert>}

      <AdminFormLayout
        main={
          <>
            <AdminFormCard
              title="Package details"
              description="Name, pricing, and overview shown on the events page."
              icon={PartyPopper}
            >
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#2D3328]">
                  Package name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!isEdit && !slug) setSlug(slugify(e.target.value));
                  }}
                  required
                  className={adminInputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-[#2D3328]">
                  Slug
                </Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className={adminInputClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-[#2D3328]">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                  className={adminTextareaClass}
                />
              </div>
              <AdminFormRow>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-[#2D3328]">
                    Price (MK)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className={adminInputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guestCount" className="text-[#2D3328]">
                    Guest count
                  </Label>
                  <Input
                    id="guestCount"
                    type="number"
                    min={0}
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className={adminInputClass}
                  />
                </div>
              </AdminFormRow>
            </AdminFormCard>

            <AdminFormCard
              title="Services & charges"
              description="What's included and any additional cost notes."
              icon={ListChecks}
            >
              <div className="space-y-2">
                <Label htmlFor="services" className="text-[#2D3328]">
                  Services included (one per line)
                </Label>
                <Textarea
                  id="services"
                  value={servicesIncluded}
                  onChange={(e) => setServicesIncluded(e.target.value)}
                  rows={6}
                  required
                  className={adminTextareaClass}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="charges" className="text-[#2D3328]">
                  Additional charges note
                </Label>
                <Textarea
                  id="charges"
                  value={additionalCharges}
                  onChange={(e) => setAdditionalCharges(e.target.value)}
                  rows={2}
                  className={adminTextareaClass}
                />
              </div>
            </AdminFormCard>

            <AdminFormCard
              title="Package image"
              description="Shown on events pages and package cards."
              icon={ImageIcon}
            >
              <ImageField
                label="Cover image"
                value={image}
                onChange={setImage}
              />
            </AdminFormCard>
          </>
        }
        sidebar={
          <AdminFormCard
            title="Visibility"
            description="Control whether this package is live on the storefront."
            icon={Eye}
          >
            <AdminToggleRow
              id="package-active"
              label="Active on storefront"
              description="Inactive packages are hidden from customers"
              checked={active}
              onCheckedChange={setActive}
            />
          </AdminFormCard>
        }
      />

      <AdminFormActions
        leading={
          isEdit ? (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-xl"
            >
              Delete
            </Button>
          ) : undefined
        }
      >
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className={adminOutlineButtonClass}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className={adminPrimaryButtonClass}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Save changes" : "Create package"}
        </Button>
      </AdminFormActions>
    </form>
  );
}
