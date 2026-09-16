"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitInquiry } from "@/actions/inquiries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WeddingScopeFields } from "@/components/store/wedding-scope-fields";
import { Loader2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buildEventInquiryMessage } from "@/lib/event-inquiry";
import { whatsappEventQuote } from "@/lib/whatsapp";
import {
  emptyWeddingScope,
  validateWeddingScope,
  type WeddingScopeData,
} from "@/lib/wedding-scope";

const schema = z.object({
  customerName: z.string().trim().min(2, "Name is required"),
  customerPhone: z.string().trim().min(8, "A valid phone number is required"),
  customerEmail: z
    .string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  message: z.string(),
});

type FormData = z.infer<typeof schema>;

type InquiryFormProps = {
  productId?: string;
  eventPackageId?: string;
  eventPackageName?: string;
  showWeddingScope?: boolean;
  serviceOptions?: string[];
  variantInfo?: string;
  defaultMessage?: string;
  submitLabel?: string;
  whatsappDigits?: string;
  className?: string;
  onSuccess?: () => void;
};

export function InquiryForm({
  productId,
  eventPackageId,
  eventPackageName,
  showWeddingScope = false,
  serviceOptions,
  variantInfo,
  defaultMessage = "",
  submitLabel = "Send inquiry",
  whatsappDigits,
  className,
  onSuccess,
}: InquiryFormProps) {
  const isEventInquiry = !!eventPackageId || showWeddingScope;
  const showWhatsApp = isEventInquiry && !!whatsappDigits;
  const isServiceChecklistInquiry =
    isEventInquiry && (serviceOptions?.length ?? 0) > 0;
  const [status, setStatus] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [weddingScope, setWeddingScope] = useState<WeddingScopeData>(emptyWeddingScope);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    clearErrors,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      message: isEventInquiry ? "" : defaultMessage,
    },
  });

  function validateEventInquiry(data: FormData): { text: string; field?: "message" } | null {
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const first = parsed.error.errors[0];
      const field = first?.path[0];
      return {
        text: first?.message ?? "Please check your details.",
        field: field === "message" ? "message" : undefined,
      };
    }

    if (isEventInquiry) {
      const scopeError = validateWeddingScope(weddingScope);
      if (scopeError) return { text: scopeError };

      if (isServiceChecklistInquiry && selectedServices.length === 0) {
        return {
          text: "Select at least one service so we can price exactly what you need.",
        };
      }
    } else if (data.message.trim().length < 10) {
      return { text: "Message must be at least 10 characters", field: "message" };
    }

    return null;
  }

  function handleWhatsAppSend() {
    setStatus(null);
    clearErrors("message");

    const data = getValues();
    const validationError = validateEventInquiry(data);
    if (validationError) {
      if (validationError.field === "message") {
        setError("message", { type: "manual", message: validationError.text });
      } else {
        setStatus({ type: "error", text: validationError.text });
      }
      return;
    }

    const body = buildEventInquiryMessage({
      eventPackageName,
      weddingScope,
      selectedServices,
      extraDetails: data.message,
    });

    const url = whatsappEventQuote(
      {
        name: data.customerName,
        phone: data.customerPhone,
        email: data.customerEmail,
        body,
      },
      whatsappDigits
    );

    window.open(url, "_blank", "noopener,noreferrer");
  }

  async function onSubmit(data: FormData) {
    setStatus(null);
    clearErrors("message");

    const validationError = validateEventInquiry(data);
    if (validationError) {
      if (validationError.field === "message") {
        setError("message", { type: "manual", message: validationError.text });
      } else {
        setStatus({ type: "error", text: validationError.text });
      }
      return;
    }

    const message = isEventInquiry
      ? buildEventInquiryMessage({
          eventPackageName,
          weddingScope,
          selectedServices,
          extraDetails: data.message,
        })
      : data.message;

    const formData = new FormData();
    formData.append("customerName", data.customerName);
    formData.append("customerPhone", data.customerPhone);
    if (data.customerEmail) formData.append("customerEmail", data.customerEmail);
    formData.append("message", message);
    if (productId) formData.append("productId", productId);
    if (eventPackageId) formData.append("eventPackageId", eventPackageId);
    if (variantInfo) formData.append("variantInfo", variantInfo);

    const result = await submitInquiry(formData);
    if (result.success) {
      setStatus({
        type: "success",
        text: "Thank you! We've received your inquiry and will be in touch soon.",
      });
      reset({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        message: isEventInquiry ? "" : defaultMessage,
      });
      setSelectedServices([]);
      setWeddingScope(emptyWeddingScope());
      onSuccess?.();
    } else {
      setStatus({
        type: "error",
        text: result.error || "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn("space-y-4", className)}>
      {status && (
        <div
          className={cn(
            "rounded-xl border px-4 py-3 text-sm",
            status.type === "success"
              ? "border-primary/30 bg-primary/5 text-foreground"
              : "border-destructive/30 bg-destructive/5 text-destructive"
          )}
        >
          {status.text}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="customerName">Name</Label>
        <Input id="customerName" {...register("customerName")} />
        {errors.customerName && (
          <p className="text-xs text-destructive">{errors.customerName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerPhone">Phone / WhatsApp</Label>
        <Input id="customerPhone" type="tel" {...register("customerPhone")} />
        {errors.customerPhone && (
          <p className="text-xs text-destructive">{errors.customerPhone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="customerEmail">
          Email <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input id="customerEmail" type="email" {...register("customerEmail")} />
        {errors.customerEmail && (
          <p className="text-xs text-destructive">{errors.customerEmail.message}</p>
        )}
      </div>

      {isEventInquiry ? (
        <WeddingScopeFields value={weddingScope} onChange={setWeddingScope} />
      ) : null}

      {isServiceChecklistInquiry && serviceOptions ? (
        <div className="space-y-4 rounded-2xl border border-border/70 bg-muted/20 p-4">
          <div className="space-y-1">
            <Label>Select the services you want priced</Label>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Tick only what you need and we&apos;ll prepare a quote for those services.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {serviceOptions.map((service) => {
              const checked = selectedServices.includes(service);
              return (
                <label
                  key={service}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm transition-colors",
                    checked
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/70 bg-background hover:border-primary/25"
                  )}
                >
                  <Input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => {
                      setSelectedServices((current) =>
                        event.target.checked
                          ? [...current, service]
                          : current.filter((item) => item !== service)
                      );
                    }}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-input px-0 py-0"
                  />
                  <span className="leading-relaxed text-foreground/85">{service}</span>
                </label>
              );
            })}
          </div>
          {selectedServices.length > 0 && (
            <div className="rounded-xl bg-background px-3 py-3 text-sm text-foreground/80">
              <p className="font-medium text-foreground">Your request will say:</p>
              <p className="mt-1 leading-relaxed">
                How much will it cost for these services only?
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {selectedServices.map((service) => (
                  <li key={service}>- {service}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : !isEventInquiry ? (
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" rows={5} {...register("message")} />
          {errors.message && (
            <p className="text-xs text-destructive">{errors.message.message}</p>
          )}
        </div>
      ) : null}

      {isEventInquiry ? (
        <div className="space-y-2">
          <Label htmlFor="message">
            Extra details <span className="text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="message"
            rows={4}
            placeholder="Wedding date, theme, or any other notes"
            {...register("message")}
          />
        </div>
      ) : null}

      {showWhatsApp ? (
        <div className="grid gap-3">
          <Button type="submit" size="lg" disabled={isSubmitting} className="w-full rounded-full">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Sending..." : submitLabel}
          </Button>
          <Button
            type="button"
            variant="whatsapp"
            size="lg"
            className="w-full rounded-full"
            onClick={handleWhatsAppSend}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Send on WhatsApp
          </Button>
        </div>
      ) : (
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full rounded-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Sending..." : submitLabel}
        </Button>
      )}
    </form>
  );
}
