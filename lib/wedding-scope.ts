export const GUEST_COUNT_RANGES = [
  "Less than 100",
  "100–150",
  "151–250",
  "251–350",
  "351–500",
  "More than 500",
] as const;

export const VENUE_SETTINGS = [
  "Indoor",
  "Outdoor",
  "Combination of Both",
] as const;

export const LOCATION_ACCESSIBILITY_OPTIONS = [
  "Within Town/City",
  "Outside Town/City",
] as const;

export const DAY_FUNCTIONS = [
  "Officiation",
  "Luncheon celebration",
  "Afternoon reception",
  "Evening reception",
] as const;

export type GuestCountRange = (typeof GUEST_COUNT_RANGES)[number];
export type VenueSetting = (typeof VENUE_SETTINGS)[number];
export type LocationAccessibility = (typeof LOCATION_ACCESSIBILITY_OPTIONS)[number];
export type DayFunction = (typeof DAY_FUNCTIONS)[number];

export type WeddingScopeData = {
  guestCountRange: GuestCountRange | "";
  guestCountSpecify: string;
  townCity: string;
  venue: string;
  venueSetting: VenueSetting | "";
  locationAccessibility: LocationAccessibility | "";
  outsideLocationSpecify: string;
  dayFunctions: DayFunction[];
};

export const emptyWeddingScope = (): WeddingScopeData => ({
  guestCountRange: "",
  guestCountSpecify: "",
  townCity: "",
  venue: "",
  venueSetting: "",
  locationAccessibility: "",
  outsideLocationSpecify: "",
  dayFunctions: [],
});

export function validateWeddingScope(scope: WeddingScopeData): string | null {
  if (!scope.guestCountRange) {
    return "Please select an estimated guest count.";
  }
  if (scope.guestCountRange === "More than 500" && !scope.guestCountSpecify.trim()) {
    return "Please specify the expected number of guests.";
  }
  if (!scope.townCity.trim()) {
    return "Please enter the wedding town or city.";
  }
  if (!scope.venueSetting) {
    return "Please select a venue setting.";
  }
  if (!scope.locationAccessibility) {
    return "Please select location accessibility.";
  }
  if (
    scope.locationAccessibility === "Outside Town/City" &&
    !scope.outsideLocationSpecify.trim()
  ) {
    return "Please specify the distance or location outside town/city.";
  }
  if (scope.dayFunctions.length === 0) {
    return "Please select at least one function happening on the day.";
  }
  return null;
}

export function formatWeddingScope(scope: WeddingScopeData): string {
  const guestLine =
    scope.guestCountRange === "More than 500"
      ? `Estimated guests: More than 500 (${scope.guestCountSpecify.trim()})`
      : `Estimated guests: ${scope.guestCountRange}`;

  const lines = [
    "WEDDING SCOPE",
    guestLine,
    `Town/City: ${scope.townCity.trim()}`,
    scope.venue.trim()
      ? `Venue: ${scope.venue.trim()}`
      : "Venue: Not confirmed yet",
    `Venue setting: ${scope.venueSetting}`,
    scope.locationAccessibility === "Outside Town/City"
      ? `Location accessibility: Outside Town/City (${scope.outsideLocationSpecify.trim()})`
      : `Location accessibility: ${scope.locationAccessibility}`,
    `Functions on the day: ${scope.dayFunctions.join(", ")}`,
  ];

  return lines.join("\n");
}
