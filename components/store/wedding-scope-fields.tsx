"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  DAY_FUNCTIONS,
  GUEST_COUNT_RANGES,
  LOCATION_ACCESSIBILITY_OPTIONS,
  VENUE_SETTINGS,
  type DayFunction,
  type WeddingScopeData,
} from "@/lib/wedding-scope";

type WeddingScopeFieldsProps = {
  value: WeddingScopeData;
  onChange: (next: WeddingScopeData) => void;
  className?: string;
};

function CheckboxOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors",
        checked
          ? "border-primary/40 bg-primary/5"
          : "border-border/70 bg-background hover:border-primary/25"
      )}
    >
      <Input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 shrink-0 rounded border-input px-0 py-0"
      />
      <span className="leading-relaxed text-foreground/85">{label}</span>
    </label>
  );
}

function RadioOption({
  name,
  label,
  checked,
  onSelect,
}: {
  name: string;
  label: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-colors",
        checked
          ? "border-primary/40 bg-primary/5"
          : "border-border/70 bg-background hover:border-primary/25"
      )}
    >
      <Input
        type="radio"
        name={name}
        checked={checked}
        onChange={onSelect}
        className="h-4 w-4 shrink-0 border-input px-0 py-0"
      />
      <span className="leading-relaxed text-foreground/85">{label}</span>
    </label>
  );
}

export function WeddingScopeFields({ value, onChange, className }: WeddingScopeFieldsProps) {
  function update(patch: Partial<WeddingScopeData>) {
    onChange({ ...value, ...patch });
  }

  return (
    <div className={cn("space-y-5 rounded-2xl border border-border/70 bg-muted/20 p-4", className)}>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">Wedding scope</p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Help us recommend the right package and prepare an accurate quotation.
        </p>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">Estimated number of guests</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {GUEST_COUNT_RANGES.map((range) => (
            <RadioOption
              key={range}
              name="guestCountRange"
              label={range}
              checked={value.guestCountRange === range}
              onSelect={() =>
                update({
                  guestCountRange: range,
                  guestCountSpecify: range === "More than 500" ? value.guestCountSpecify : "",
                })
              }
            />
          ))}
        </div>
        {value.guestCountRange === "More than 500" && (
          <div className="space-y-1.5 pt-1">
            <Label htmlFor="guestCountSpecify">Please specify</Label>
            <Input
              id="guestCountSpecify"
              placeholder="e.g. 600 guests"
              value={value.guestCountSpecify}
              onChange={(event) => update({ guestCountSpecify: event.target.value })}
            />
          </div>
        )}
      </fieldset>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="townCity">Town / City</Label>
          <Input
            id="townCity"
            placeholder="e.g. Lilongwe"
            value={value.townCity}
            onChange={(event) => update({ townCity: event.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="venue">
            Venue <span className="text-muted-foreground">(if confirmed)</span>
          </Label>
          <Input
            id="venue"
            placeholder="Venue name"
            value={value.venue}
            onChange={(event) => update({ venue: event.target.value })}
          />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">Venue setting</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {VENUE_SETTINGS.map((setting) => (
            <RadioOption
              key={setting}
              name="venueSetting"
              label={setting}
              checked={value.venueSetting === setting}
              onSelect={() => update({ venueSetting: setting })}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">
          Types of functions happening on the day
        </legend>
        <p className="text-xs text-muted-foreground">
          Tick all that apply — you can select more than one.
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          {DAY_FUNCTIONS.map((dayFunction) => (
            <CheckboxOption
              key={dayFunction}
              label={dayFunction}
              checked={value.dayFunctions.includes(dayFunction)}
              onChange={(checked) => {
                const next = checked
                  ? [...value.dayFunctions, dayFunction]
                  : value.dayFunctions.filter((item) => item !== dayFunction);
                update({ dayFunctions: next as DayFunction[] });
              }}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium text-foreground">Location accessibility</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {LOCATION_ACCESSIBILITY_OPTIONS.map((option) => (
            <RadioOption
              key={option}
              name="locationAccessibility"
              label={option}
              checked={value.locationAccessibility === option}
              onSelect={() =>
                update({
                  locationAccessibility: option,
                  outsideLocationSpecify:
                    option === "Outside Town/City" ? value.outsideLocationSpecify : "",
                })
              }
            />
          ))}
        </div>
        {value.locationAccessibility === "Outside Town/City" && (
          <div className="space-y-1.5 pt-1">
            <Label htmlFor="outsideLocationSpecify">Distance or location</Label>
            <Input
              id="outsideLocationSpecify"
              placeholder="e.g. 45 km from Lilongwe"
              value={value.outsideLocationSpecify}
              onChange={(event) => update({ outsideLocationSpecify: event.target.value })}
            />
          </div>
        )}
      </fieldset>
    </div>
  );
}
