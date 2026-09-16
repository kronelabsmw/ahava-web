"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageField } from "@/components/admin/image-field";
import {
  createPromotion,
  deletePromotion,
  updatePromotion,
} from "@/actions/admin/promotions";
import { slugify } from "@/lib/utils";
import { Loader2, Megaphone, Image as ImageIcon, Eye } from "lucide-react";
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

type PromotionFormProps = {
  initialData?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    image?: string | null;
    discount?: number | null;
    startDate?: Date | string | null;
    endDate?: Date | string | null;
    active: boolean;
  };
};

function toDateInput(value?: Date | string | null) {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function PromotionForm({ initialData }: PromotionFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initialData);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [image, setImage] = useState(initialData?.image || "");
  const [discount, setDiscount] = useState(
    initialData?.discount != null ? String(initialData.discount) : ""
  );
  const [startDate, setStartDate] = useState(
    toDateInput(initialData?.startDate)
  );
  const [endDate, setEndDate] = useState(toDateInput(initialData?.endDate));
  const [active, setActive] = useState(initialData?.active ?? true);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug || slugify(title));
    formData.append("description", description);
    formData.append("image", image);
    if (discount) formData.append("discount", discount);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    if (active) formData.append("active", "true");

    const result = isEdit
      ? await updatePromotion(initialData!.id, formData)
      : await createPromotion(formData);

    if (result.success) {
      router.push("/admin/promotions");
      router.refresh();
    } else {
      setError(result.error || "Something went wrong");
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (!initialData || !confirm("Delete this promotion?")) return;
    setIsPending(true);
    const result = await deletePromotion(initialData.id);
    if (result.success) {
      router.push("/admin/promotions");
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
              title="Promotion details"
              description="Title, description, discount, and schedule."
              icon={Megaphone}
            >
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[#2D3328]">
                  Title
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
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
              <AdminFormRow cols={3}>
                <div className="space-y-2">
                  <Label htmlFor="discount" className="text-[#2D3328]">
                    Discount %
                  </Label>
                  <Input
                    id="discount"
                    type="number"
                    min={0}
                    max={100}
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className={adminInputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-[#2D3328]">
                    Start date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={adminInputClass}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-[#2D3328]">
                    End date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={adminInputClass}
                  />
                </div>
              </AdminFormRow>
            </AdminFormCard>

            <AdminFormCard
              title="Promotion image"
              description="Banner image on the promotions page."
              icon={ImageIcon}
            >
              <ImageField
                label="Banner image"
                value={image}
                onChange={setImage}
              />
            </AdminFormCard>
          </>
        }
        sidebar={
          <AdminFormCard
            title="Visibility"
            description="Control whether this promotion is live on the storefront."
            icon={Eye}
          >
            <AdminToggleRow
              id="promotion-active"
              label="Active on storefront"
              description="Inactive promotions are hidden from customers"
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
          {isEdit ? "Save changes" : "Create promotion"}
        </Button>
      </AdminFormActions>
    </form>
  );
}
