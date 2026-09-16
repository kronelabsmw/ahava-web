"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateSiteContent } from "@/actions/admin/site-content";
import {
  AdminFormSection,
  AdminFormAlert,
  AdminFormActions,
  adminInputClass,
  adminTextareaClass,
  adminPrimaryButtonClass,
} from "@/components/admin/admin-form";
import type { SiteContent, Testimonial } from "@/lib/site-content";
import { Loader2, Megaphone, MessageSquareQuote, MapPin, Plus, Trash2 } from "lucide-react";

type SiteContentFormProps = {
  initialContent: SiteContent;
};

function emptyTestimonial(): Testimonial {
  return { name: "", location: "", text: "", rating: 5 };
}

export function SiteContentForm({ initialContent }: SiteContentFormProps) {
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  function updateContact<K extends keyof SiteContent["contact"]>(
    key: K,
    value: SiteContent["contact"][K]
  ) {
    setContent((prev) => ({
      ...prev,
      contact: { ...prev.contact, [key]: value },
    }));
  }

  function updateTestimonial(index: number, patch: Partial<Testimonial>) {
    setContent((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((item, i) =>
        i === index ? { ...item, ...patch } : item
      ),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.append("siteContent", JSON.stringify(content));
      const result = await updateSiteContent(formData);
      if (result.success) {
        setMessage({ type: "success", text: "Site content saved successfully." });
      } else {
        throw new Error(result.error || "Failed to save");
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Something went wrong",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {message && (
        <AdminFormAlert
          variant={message.type === "success" ? "success" : "error"}
          className="mb-6"
        >
          {message.text}
        </AdminFormAlert>
      )}

      <div className="space-y-4">
        <AdminFormSection
          title="Announcement bar"
          description="Shown at the top of every storefront page."
          icon={Megaphone}
        >
          <div className="space-y-2">
            <Label htmlFor="announcement">Announcement text</Label>
            <Input
              id="announcement"
              value={content.announcement}
              onChange={(e) =>
                setContent((prev) => ({ ...prev, announcement: e.target.value }))
              }
              className={adminInputClass}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="footerDescription">Footer description</Label>
            <Textarea
              id="footerDescription"
              value={content.footerDescription}
              onChange={(e) =>
                setContent((prev) => ({
                  ...prev,
                  footerDescription: e.target.value,
                }))
              }
              className={adminTextareaClass}
            />
          </div>
        </AdminFormSection>

        <AdminFormSection
          title="Testimonials"
          description="Customer quotes shown on the homepage."
          icon={MessageSquareQuote}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="testimonialsTitle">Section title</Label>
              <Input
                id="testimonialsTitle"
                value={content.testimonialsTitle}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    testimonialsTitle: e.target.value,
                  }))
                }
                className={adminInputClass}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="testimonialsSubtitle">Section subtitle</Label>
              <Textarea
                id="testimonialsSubtitle"
                value={content.testimonialsSubtitle}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    testimonialsSubtitle: e.target.value,
                  }))
                }
                className={adminTextareaClass}
              />
            </div>
          </div>

          <div className="space-y-4">
            {content.testimonials.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-[#E8EBE4] bg-[#F7F9F5] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-medium text-[#3D4538]">
                    Testimonial {index + 1}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-[#9B3A3A] hover:bg-[#FCEAEA]"
                    onClick={() =>
                      setContent((prev) => ({
                        ...prev,
                        testimonials: prev.testimonials.filter((_, i) => i !== index),
                      }))
                    }
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    placeholder="Name"
                    value={item.name}
                    onChange={(e) => updateTestimonial(index, { name: e.target.value })}
                    className={adminInputClass}
                  />
                  <Input
                    placeholder="Location"
                    value={item.location}
                    onChange={(e) =>
                      updateTestimonial(index, { location: e.target.value })
                    }
                    className={adminInputClass}
                  />
                  <Textarea
                    placeholder="Quote"
                    value={item.text}
                    onChange={(e) => updateTestimonial(index, { text: e.target.value })}
                    className={`${adminTextareaClass} md:col-span-2`}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl border-[#E8EBE4]"
            onClick={() =>
              setContent((prev) => ({
                ...prev,
                testimonials: [...prev.testimonials, emptyTestimonial()],
              }))
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add testimonial
          </Button>
        </AdminFormSection>

        <AdminFormSection
          title="Contact & visit"
          description="Address, phones, emails, and hours shown in the footer and contact page."
          icon={MapPin}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Address</Label>
              <Input
                value={content.contact.address}
                onChange={(e) => updateContact("address", e.target.value)}
                className={adminInputClass}
              />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input
                value={content.contact.city}
                onChange={(e) => updateContact("city", e.target.value)}
                className={adminInputClass}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Phone numbers (one per line)</Label>
              <Textarea
                value={content.contact.phones.join("\n")}
                onChange={(e) =>
                  updateContact(
                    "phones",
                    e.target.value.split("\n").map((p) => p.trim()).filter(Boolean)
                  )
                }
                className={adminTextareaClass}
              />
            </div>
            <div className="space-y-2">
              <Label>Bridal email</Label>
              <Input
                value={content.contact.emails.bridal}
                onChange={(e) =>
                  updateContact("emails", {
                    ...content.contact.emails,
                    bridal: e.target.value,
                  })
                }
                className={adminInputClass}
              />
            </div>
            <div className="space-y-2">
              <Label>Events email</Label>
              <Input
                value={content.contact.emails.events}
                onChange={(e) =>
                  updateContact("emails", {
                    ...content.contact.emails,
                    events: e.target.value,
                  })
                }
                className={adminInputClass}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Opening hours (days | hours | notes)</Label>
              <Textarea
                value={content.contact.openingHours
                  .map((h) => `${h.days} | ${h.hours}${h.notes ? ` | ${h.notes}` : ""}`)
                  .join("\n")}
                onChange={(e) =>
                  updateContact(
                    "openingHours",
                    e.target.value
                      .split("\n")
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [days, hours, notes] = line.split("|").map((s) => s.trim());
                        return { days: days || "", hours: hours || "", notes: notes || undefined };
                      })
                      .filter((h) => h.days && h.hours)
                  )
                }
                className={adminTextareaClass}
                placeholder="Monday – Saturday | 9:00 AM – 3:30 PM | By appointment"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Instagram (Bridal)</Label>
              <Input
                value={content.contact.social.instagramBridal}
                onChange={(e) =>
                  updateContact("social", {
                    ...content.contact.social,
                    instagramBridal: e.target.value,
                  })
                }
                className={adminInputClass}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Instagram (Events)</Label>
              <Input
                value={content.contact.social.instagramEvents}
                onChange={(e) =>
                  updateContact("social", {
                    ...content.contact.social,
                    instagramEvents: e.target.value,
                  })
                }
                className={adminInputClass}
              />
            </div>
            <div className="space-y-2">
              <Label>TikTok</Label>
              <Input
                value={content.contact.social.tiktok}
                onChange={(e) =>
                  updateContact("social", {
                    ...content.contact.social,
                    tiktok: e.target.value,
                  })
                }
                className={adminInputClass}
              />
            </div>
            <div className="space-y-2">
              <Label>X (Twitter)</Label>
              <Input
                value={content.contact.social.x}
                onChange={(e) =>
                  updateContact("social", {
                    ...content.contact.social,
                    x: e.target.value,
                  })
                }
                className={adminInputClass}
              />
            </div>
          </div>
        </AdminFormSection>
      </div>

      <AdminFormActions>
        <Button
          type="submit"
          disabled={isPending}
          className={adminPrimaryButtonClass}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save site content
        </Button>
      </AdminFormActions>
    </form>
  );
}
