"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/actions/admin/categories";
import { useToast } from "@/hooks/use-toast";
import { Loader2, FolderTree, Image as ImageIcon } from "lucide-react";
import {
  AdminFormLayout,
  AdminFormCard,
  AdminFormRow,
  AdminFormActions,
  adminInputClass,
  adminTextareaClass,
  adminSelectTriggerClass,
  adminPrimaryButtonClass,
  adminOutlineButtonClass,
} from "@/components/admin/admin-form";
import { uploadImageFile } from "@/lib/upload-media";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional().nullable(),
  image: z.string().url().optional().or(z.literal("")),
  parentId: z.string().optional().nullable(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: any;
  parentCategories: any[];
}

export function CategoryForm({
  initialData,
  parentCategories,
}: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const defaultValues: Partial<CategoryFormValues> = initialData
    ? {
        ...initialData,
        parentId: initialData.parentId || "none",
      }
    : {
        name: "",
        slug: "",
        description: "",
        image: "",
        parentId: "none",
      };

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const url = await uploadImageFile(file);
      form.setValue("image", url);
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  async function onSubmit(data: CategoryFormValues) {
    setIsPending(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const result = initialData
        ? await updateCategory(initialData.id, formData)
        : await createCategory(formData);

      if (result.success) {
        toast({
          title: "Success",
          description: `Category ${initialData ? "updated" : "created"} successfully.`,
        });
        router.push("/admin/categories");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    if (
      !initialData ||
      !confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    )
      return;

    setIsDeleting(true);
    try {
      const result = await deleteCategory(initialData.id);
      if (result.success) {
        toast({ title: "Success", description: "Category deleted successfully." });
        router.push("/admin/categories");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete category",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdminFormLayout
          main={
            <AdminFormCard
              title="Category details"
              description="Name, URL slug, parent category, and description."
              icon={FolderTree}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className={adminInputClass}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!initialData) {
                            form.setValue("slug", generateSlug(e.target.value));
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
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parent category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || "none"}
                      >
                        <FormControl>
                          <SelectTrigger className={adminSelectTriggerClass}>
                            <SelectValue placeholder="Select a parent category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            None (top-level category)
                          </SelectItem>
                          {parentCategories
                            .filter((c) => c.id !== initialData?.id)
                            .map((cat) => (
                              <SelectItem key={cat.id} value={cat.id}>
                                {cat.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select &quot;None&quot; to create a top-level category
                      </FormDescription>
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
                        value={field.value || ""}
                        className={adminTextareaClass}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AdminFormCard>
          }
          sidebar={
            <AdminFormCard
              title="Category image"
              description="Optional banner or thumbnail for this category."
              icon={ImageIcon}
            >
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-3">
                      <div className="relative">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                          className={`${adminInputClass} cursor-pointer file:mr-3 file:rounded-lg file:border-0 file:bg-[#EEF2E8] file:px-3 file:py-1 file:text-xs file:font-medium file:text-[#6B7B52]`}
                        />
                        {isUploading && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            <Loader2 className="h-4 w-4 animate-spin text-[#8A9480]" />
                          </div>
                        )}
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ""}
                          placeholder="Or paste image URL…"
                          className={adminInputClass}
                        />
                      </FormControl>
                    </div>
                    {field.value && (
                      <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-xl border border-[#E8EBE4] bg-[#EEF2E8]">
                        <img
                          src={field.value}
                          alt="Preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AdminFormCard>
          }
        />

        <AdminFormActions
          leading={
            initialData ? (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting || isPending}
                className="rounded-xl"
              >
                {isDeleting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Delete category
              </Button>
            ) : undefined
          }
        >
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/categories")}
            className={adminOutlineButtonClass}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending || isDeleting}
            className={adminPrimaryButtonClass}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update category" : "Create category"}
          </Button>
        </AdminFormActions>
      </form>
    </Form>
  );
}
