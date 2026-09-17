import { z } from "zod";
import { isImageSrc } from "@/lib/media";

const emptyToNull = (val: unknown) =>
  val === "" || val === undefined ? null : val;

const emptyToUndefined = (val: unknown) =>
  val === "" || val === null || val === undefined ? undefined : val;

/** https URL or data:image base64 URI (images stored in Postgres). */
export const imageSrcSchema = z
  .string()
  .refine(isImageSrc, { message: "Each image must be a valid URL or uploaded image" });

export const optionalImageSrc = z
  .union([z.literal(""), imageSrcSchema])
  .optional()
  .nullable();

export const optionalVideoUrl = z.preprocess(
  (val) => (val == null ? "" : val),
  z.union([
    z.literal(""),
    z.string().url({ message: "Video must be a valid URL (https://…)" }),
  ])
);

export const optionalNullableString = z.preprocess(
  emptyToNull,
  z.string().nullable().optional()
);

export const optionalPrice = z.preprocess(
  emptyToNull,
  z.coerce
    .number({ invalid_type_error: "Enter a valid amount" })
    .min(0, "Amount must be zero or greater")
    .nullable()
    .optional()
);

export const productVariantSchema = z.object({
  size: z.string().min(1, "Size is required"),
  color: z.string().min(1, "Colour is required"),
  stock: z.coerce.number().min(0, "Stock must be zero or greater").default(0),
  sku: optionalNullableString,
});

export const adminProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "URL slug is required"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce
    .number({ invalid_type_error: "Enter a valid hire/sale price" })
    .min(0, "Price must be zero or greater"),
  salePrice: optionalPrice,
  discountPrice: optionalPrice,
  listingType: z.enum(["HIRE", "SALE", "HIRE_AND_SALE"], {
    errorMap: () => ({ message: "Select a listing type" }),
  }),
  condition: optionalNullableString,
  depositPercent: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number()
      .min(0, "Deposit must be between 0 and 100")
      .max(100, "Deposit must be between 0 and 100")
      .optional()
      .nullable()
  ),
  specialNotes: optionalNullableString,
  stock: z.coerce
    .number({ invalid_type_error: "Enter a valid stock quantity" })
    .min(0, "Stock must be zero or greater"),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  categoryId: z.string().min(1, "Category is required"),
  brandName: optionalNullableString,
  tags: z.array(z.string()).default([]),
  videoUrl: optionalVideoUrl,
  images: z
    .array(imageSrcSchema)
    .min(1, "Add at least one product image")
    .max(8, "Maximum 8 images allowed"),
  variants: z.array(productVariantSchema).default([]),
});

export type AdminProductInput = z.infer<typeof adminProductSchema>;

const fieldLabels: Record<string, string> = {
  name: "Product name",
  slug: "URL slug",
  description: "Description",
  price: "Price",
  salePrice: "Sale price",
  discountPrice: "Discount price",
  listingType: "Listing type",
  condition: "Condition",
  depositPercent: "Deposit percentage",
  specialNotes: "Special notes",
  stock: "Stock",
  categoryId: "Category",
  brandName: "Brand",
  videoUrl: "Product video",
  images: "Images",
  tags: "Tags",
  variants: "Sizes & colours",
};

function humanizePath(path: (string | number)[]) {
  if (path.length === 0) return "";
  if (path[0] === "variants" && typeof path[1] === "number") {
    const row = path[1] + 1;
    const field = path[2] ? String(path[2]) : "entry";
    const label = fieldLabels[field] ?? field;
    return `Variant ${row} - ${label}`;
  }
  const key = String(path[0]);
  return fieldLabels[key] ?? key;
}

export function formatProductValidationError(error: z.ZodError): string {
  const issue = error.errors[0];
  if (!issue) return "Please check the form and try again.";

  const label = humanizePath(issue.path);

  if (issue.message === "Expected string, received null") {
    return label
      ? `${label} cannot be empty.`
      : "A required field is missing.";
  }

  if (issue.code === "invalid_union") {
    return label
      ? `${label}: enter a valid value or leave it blank.`
      : "A field has an invalid value.";
  }

  return label ? `${label}: ${issue.message}` : issue.message;
}

export function parseAdminProductPayload(data: Record<string, unknown>) {
  const images =
    typeof data.images === "string"
      ? JSON.parse(data.images as string)
      : data.images;
  const tags =
    typeof data.tags === "string"
      ? JSON.parse(data.tags as string)
      : data.tags ?? [];
  const variants =
    typeof data.variants === "string"
      ? JSON.parse(data.variants as string)
      : data.variants ?? [];

  return adminProductSchema.parse({
    ...data,
    images,
    tags,
    variants,
    featured: data.featured === "true" || data.featured === true,
    active: data.active === "true" || data.active === true,
  });
}
