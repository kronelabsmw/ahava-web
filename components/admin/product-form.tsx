"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  type FieldErrors,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProduct, updateProduct, deleteProduct } from "@/actions/admin/products";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Plus,
  X,
  FileText,
  CircleDollarSign,
  Image as ImageIcon,
  Eye,
  Shirt,
} from "lucide-react";
import { VideoField } from "@/components/admin/video-field";
import { adminProductSchema } from "@/lib/product-schema";
import {
  AdminFormLayout,
  AdminFormCard,
  AdminFormRow,
  AdminFormActions,
  AdminToggleRow,
  adminInputClass,
  adminTextareaClass,
  adminSelectTriggerClass,
  adminPrimaryButtonClass,
  adminOutlineButtonClass,
} from "@/components/admin/admin-form";
import { cn } from "@/lib/utils";
import { uploadImageFile } from "@/lib/upload-media";

const productSchema = adminProductSchema;

type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number | null;
  discountPrice?: number | null;
  listingType: "HIRE" | "SALE" | "HIRE_AND_SALE";
  condition?: string | null;
  depositPercent?: number | null;
  specialNotes?: string | null;
  stock: number;
  featured: boolean;
  active: boolean;
  categoryId: string;
  brandName?: string | null;
  tags: string[];
  videoUrl: string;
  images: string[];
  variants: Array<{
    size: string;
    color: string;
    stock: number;
    sku?: string | null;
  }>;
};
type ProductSubmitValues = ProductFormValues;

interface ProductFormProps {
  initialData?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    salePrice?: number | null;
    discountPrice?: number | null;
    listingType: "HIRE" | "SALE" | "HIRE_AND_SALE";
    condition?: string | null;
    depositPercent?: number | null;
    specialNotes?: string | null;
    stock: number;
    featured: boolean;
    active: boolean;
    categoryId: string;
    videoUrl?: string | null;
    tags?: string[];
    images?: { url: string }[];
    variants?: {
      size: string;
      color: string;
      stock: number;
      sku?: string | null;
    }[];
    brand?: { name: string } | null;
  };
  categories: { id: string; name: string; parent?: { name: string } | null }[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");

  const defaultValues: Partial<ProductFormValues> = initialData
    ? {
        name: initialData.name,
        slug: initialData.slug,
        description: initialData.description,
        price: Number(initialData.price),
        salePrice: initialData.salePrice != null ? Number(initialData.salePrice) : null,
        discountPrice:
          initialData.discountPrice != null
            ? Number(initialData.discountPrice)
            : null,
        listingType: initialData.listingType,
        condition: initialData.condition ?? null,
        depositPercent: initialData.depositPercent ?? 45,
        specialNotes: initialData.specialNotes ?? null,
        stock: initialData.stock,
        featured: initialData.featured,
        active: initialData.active,
        categoryId: initialData.categoryId,
        brandName: initialData.brand?.name ?? null,
        tags: initialData.tags ?? [],
        videoUrl: initialData.videoUrl ?? "",
        images: initialData.images?.map((img) => img.url) || [],
        variants:
          initialData.variants?.map((variant) => ({
            size: variant.size,
            color: variant.color,
            stock: variant.stock,
            sku: variant.sku ?? null,
          })) ?? [],
      }
    : {
        name: "",
        slug: "",
        description: "",
        price: 0,
        listingType: "HIRE",
        stock: 1,
        depositPercent: 45,
        featured: false,
        active: true,
        brandName: null,
        tags: [],
        images: [],
        variants: [],
        videoUrl: "",
      };

  const form = useForm<ProductFormValues, unknown, ProductSubmitValues>({
    resolver: zodResolver(productSchema) as Resolver<
      ProductFormValues,
      unknown,
      ProductSubmitValues
    >,
    defaultValues,
  });

  const { fields: variantFields, append: appendVariant, remove: removeVariant } =
    useFieldArray({
      control: form.control,
      name: "variants",
    });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  async function onSubmit(data: ProductSubmitValues) {
    setIsPending(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "images" || key === "tags" || key === "variants") {
          formData.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const result = initialData
        ? await updateProduct(initialData.id, formData)
        : await createProduct(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: `Product ${initialData ? "updated" : "created"} successfully.`,
        });
        router.push("/admin/products");
      } else {
        throw new Error(result.error || "Something went wrong");
      }
    } catch (error) {
      toast({
        title: "Could not save product",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (!initialData) return;
    if (
      !confirm(
        `Delete "${initialData.name}" permanently? This cannot be undone.`
      )
    ) {
      return;
    }

    setIsPending(true);
    try {
      const result = await deleteProduct(initialData.id);
      if (result.success) {
        toast({ title: "Product deleted" });
        router.push("/admin/products");
        router.refresh();
      } else {
        throw new Error(result.error || "Failed to delete product");
      }
    } catch (error) {
      toast({
        title: "Could not delete product",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  }

  function getFirstErrorMessage(
    errors: FieldErrors<ProductFormValues>
  ): string | undefined {
    for (const value of Object.values(errors)) {
      if (!value) continue;
      if (typeof value === "object" && "message" in value && value.message) {
        return String(value.message);
      }
      if (typeof value === "object") {
        const nested = getFirstErrorMessage(
          value as FieldErrors<ProductFormValues>
        );
        if (nested) return nested;
      }
    }
    return undefined;
  }

  function onInvalid(errors: FieldErrors<ProductFormValues>) {
    const message =
      getFirstErrorMessage(errors) ||
      "Please fix the highlighted fields before saving.";
    toast({
      title: "Check the form",
      description: message,
      variant: "destructive",
    });
  }

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageFile(file);

      const currentImages = form.getValues("images");
      if (currentImages.length >= 8) {
        toast({
          title: "Limit reached",
          description: "Maximum 8 images allowed",
          variant: "destructive",
        });
        return;
      }
      form.setValue("images", [...currentImages, url]);
    } catch (error) {
      toast({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const addImage = () => {
    if (!newImageUrl) return;
    try {
      new URL(newImageUrl);
      const currentImages = form.getValues("images");
      if (currentImages.length >= 8) {
        toast({
          title: "Limit reached",
          description: "Maximum 8 images allowed",
          variant: "destructive",
        });
        return;
      }
      form.setValue("images", [...currentImages, newImageUrl]);
      setNewImageUrl("");
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid image URL",
        variant: "destructive",
      });
    }
  };

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images");
    form.setValue(
      "images",
      currentImages.filter((_, i) => i !== index)
    );
  };

  type CategoryOption = {
    id: string;
    name: string;
    parent?: { name: string } | null;
  };
  const groupedCategories = categories.reduce<Record<string, CategoryOption[]>>(
    (acc, cat) => {
      const parentName = cat.parent?.name || "Other";
      if (!acc[parentName]) acc[parentName] = [];
      acc[parentName].push(cat);
      return acc;
    },
    {}
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
        <AdminFormLayout
          main={
            <>
              <AdminFormCard
                title="Basic information"
                description="Name, category, and product description shown on the storefront."
                icon={FileText}
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className={adminInputClass}
                          onChange={(e) => {
                            field.onChange(e);
                            if (!initialData) {
                              form.setValue(
                                "slug",
                                generateSlug(e.target.value)
                              );
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AdminFormRow>
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug (URL)</FormLabel>
                        <FormControl>
                          <Input {...field} className={adminInputClass} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={adminSelectTriggerClass}>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(groupedCategories).map(
                              ([parentName, cats]) => (
                                <div key={parentName}>
                                  <div className="bg-muted/50 px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                    {parentName}
                                  </div>
                                  {cats.map((cat) => (
                                    <SelectItem
                                      key={cat.id}
                                      value={cat.id}
                                      className="pl-6"
                                    >
                                      {cat.name}
                                    </SelectItem>
                                  ))}
                                </div>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AdminFormRow>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className={adminTextareaClass}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <AdminFormRow>
                  <FormField
                    control={form.control}
                    name="brandName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand (optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value ?? ""}
                            placeholder="e.g. Ahava"
                            className={adminInputClass}
                          />
                        </FormControl>
                        <FormDescription>
                          Shown next to the category on the product page.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tags (optional)</FormLabel>
                        <FormControl>
                          <Input
                            value={(field.value ?? []).join(", ")}
                            onChange={(e) => {
                              const tags = e.target.value
                                .split(",")
                                .map((tag) => tag.trim())
                                .filter(Boolean);
                              field.onChange(tags);
                            }}
                            placeholder="Lace, off shoulder, champagne"
                            className={adminInputClass}
                          />
                        </FormControl>
                        <FormDescription>
                          Comma-separated labels shown on the storefront.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AdminFormRow>
              </AdminFormCard>

              <AdminFormCard
                title="Pricing & inventory"
                description="Hire/sale pricing, stock levels, and internal notes."
                icon={CircleDollarSign}
              >
                <AdminFormRow>
                  <FormField
                    control={form.control}
                    name="listingType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Listing type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={adminSelectTriggerClass}>
                              <SelectValue placeholder="Select listing type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="HIRE">Hire only</SelectItem>
                            <SelectItem value="SALE">Sale only</SelectItem>
                            <SelectItem value="HIRE_AND_SALE">
                              Hire & sale
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className={adminInputClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AdminFormRow>

                <AdminFormRow>
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base price (hire/sale)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            className={adminInputClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purchase price (if applicable)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                            className={adminInputClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AdminFormRow>

                <AdminFormRow>
                  <FormField
                    control={form.control}
                    name="discountPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Promotional price (optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value ?? ""}
                            className={adminInputClass}
                          />
                        </FormControl>
                        <FormDescription>
                          Used on the storefront if no purchase price is set.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AdminFormRow>

                <AdminFormRow>
                  <FormField
                    control={form.control}
                    name="depositPercent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Deposit percentage (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            value={field.value || ""}
                            className={adminInputClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="e.g. New, Excellent"
                            className={adminInputClass}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </AdminFormRow>

                <FormField
                  control={form.control}
                  name="specialNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special notes (shown on product page)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          className={adminTextareaClass}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </AdminFormCard>

              <AdminFormCard
                title="Sizes & colours"
                description="Size and colour options shown as selectors on the product page."
                icon={Shirt}
              >
                {variantFields.length === 0 ? (
                  <p className="text-sm text-[#8A9480]">
                    No variants yet. Add at least one size and colour if
                    customers should choose options on the storefront.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {variantFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="space-y-4 rounded-xl border border-[#EEF2E8] bg-[#FAFBF9] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-[#2D3328]">
                            Option {index + 1}
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariant(index)}
                            className="h-8 text-[#9B3A3A] hover:bg-[#FCEAEA] hover:text-[#9B3A3A]"
                          >
                            <X className="mr-1 h-3.5 w-3.5" />
                            Remove
                          </Button>
                        </div>
                        <AdminFormRow>
                          <FormField
                            control={form.control}
                            name={`variants.${index}.size`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Size</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="e.g. UK 12"
                                    className={adminInputClass}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`variants.${index}.color`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Colour</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    placeholder="e.g. Champagne"
                                    className={adminInputClass}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </AdminFormRow>
                        <AdminFormRow>
                          <FormField
                            control={form.control}
                            name={`variants.${index}.stock`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Variant stock</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    {...field}
                                    className={adminInputClass}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`variants.${index}.sku`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>SKU / style ref (optional)</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    value={field.value ?? ""}
                                    placeholder="e.g. A.H001"
                                    className={adminInputClass}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </AdminFormRow>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendVariant({
                      size: "",
                      color: "",
                      stock: 1,
                      sku: null,
                    })
                  }
                  className={adminOutlineButtonClass}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add size / colour
                </Button>
              </AdminFormCard>
            </>
          }
          sidebar={
            <>
              <AdminFormCard
                title="Media"
                description="Up to 8 gallery images plus an optional product video."
                icon={ImageIcon}
              >
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-[#2D3328]">
                    Gallery images
                  </Label>

                  <div className="grid grid-cols-2 gap-2">
                    {form.watch("images").map((url, index) => (
                      <div
                        key={index}
                        className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-[#E8EBE4] bg-[#EEF2E8]"
                      >
                        <img
                          src={url}
                          alt={`Image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1 opacity-0 shadow transition-opacity group-hover:opacity-100 hover:bg-[#FCEAEA] hover:text-[#9B3A3A]"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {form.watch("images").length < 8 && (
                    <div className="space-y-3 rounded-xl border border-[#EEF2E8] bg-[#FAFBF9] p-3">
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className={cn(
                            adminInputClass,
                            "cursor-pointer file:mr-3 file:rounded-lg file:border-0 file:bg-[#EEF2E8] file:px-3 file:py-1 file:text-xs file:font-medium file:text-[#6B7B52]"
                          )}
                        />
                        {isUploading && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="h-4 w-4 animate-spin text-[#8A9480]" />
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Paste image URL"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addImage();
                            }
                          }}
                          className={adminInputClass}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addImage}
                          size="icon"
                          disabled={!newImageUrl}
                          className={adminOutlineButtonClass}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  {form.formState.errors.images?.message && (
                    <p className="text-sm font-medium text-[#9B3A3A]">
                      {form.formState.errors.images.message}
                    </p>
                  )}
                </div>

                <div className="border-t border-[#EEF2E8] pt-5">
                  <VideoField
                    label="Product video (optional)"
                    description="Leave blank if you only have photos. Short clip shown in the gallery."
                    value={form.watch("videoUrl") || ""}
                    onChange={(url) =>
                      form.setValue("videoUrl", url || "", {
                        shouldValidate: true,
                      })
                    }
                    posterUrl={form.watch("images")?.[0]}
                    maxSizeMb={50}
                  />
                  {form.formState.errors.videoUrl && (
                    <p className="mt-2 text-sm text-[#9B3A3A]">
                      {form.formState.errors.videoUrl.message}
                    </p>
                  )}
                </div>
              </AdminFormCard>

              <AdminFormCard
                title="Visibility"
                description="Control where this product appears on the site."
                icon={Eye}
              >
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem>
                      <AdminToggleRow
                        id="product-active"
                        label="Active"
                        description="Show this product in the store"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem>
                      <AdminToggleRow
                        id="product-featured"
                        label="Featured"
                        description="Show on the homepage"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormItem>
                  )}
                />
              </AdminFormCard>
            </>
          }
        />

        <AdminFormActions
          leading={
            initialData ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-xl"
              >
                Delete product
              </Button>
            ) : undefined
          }
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
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
            {initialData ? "Update product" : "Create product"}
          </Button>
        </AdminFormActions>
      </form>
    </Form>
  );
}
