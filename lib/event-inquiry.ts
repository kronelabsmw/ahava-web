import { formatWeddingScope, type WeddingScopeData } from "@/lib/wedding-scope";

export function buildEventInquiryMessage({
  eventPackageName,
  weddingScope,
  selectedServices,
  extraDetails,
}: {
  eventPackageName?: string;
  weddingScope: WeddingScopeData;
  selectedServices: string[];
  extraDetails: string;
}) {
  const sections = [
    eventPackageName
      ? `I'm interested in the ${eventPackageName}.`
      : "I'm interested in a custom event plan with selected services.",
    formatWeddingScope(weddingScope),
  ];

  if (selectedServices.length > 0) {
    sections.push(
      "Selected services for quotation:",
      selectedServices.map((service) => `- ${service}`).join("\n"),
      extraDetails.trim()
        ? `Additional details:\n${extraDetails.trim()}`
        : "Please let me know how much it will cost for these services only."
    );
  } else if (extraDetails.trim()) {
    sections.push(`Additional details:\n${extraDetails.trim()}`);
  } else {
    sections.push("Please provide a quotation based on the details above.");
  }

  return sections.join("\n\n");
}
