# Store Components Audit Report

## Overview
This report provides a detailed analysis of 14 key store components against the available utilities in `store-ui.ts`.

**Available Utilities in store-ui.ts:**
- **Spacing:** `storePagePaddingClass`, `storeSectionSpacingClass`, `storeCompactSectionClass`, `storePageIntroClass`
- **Cards & Panels:** `storeCardClass`, `storeCardHoverClass`, `storeInteractiveCardClass`, `storePanelClass`, `storeInsetClass`
- **Dividers:** `storeDividerClass`, `storeHeaderDividerClass`
- **Typography:** `storeHeadingLgClass`, `storeHeadingMdClass`, `storeHeadingSmClass`, `storeTextMutedClass`
- **Accents & Badges:** `storeAccentBarClass`, `storeIconWrapClass`, `storeStepBadgeClass`, `storeBadgeClass`, `storeBadgeMutedClass`
- **Helper Functions:** `storeCard()`, `storePanel()`

---

## 1. product-card.tsx

### Current Styling Approach
**Mixed approach:** Inline Tailwind classes + minimal store-ui usage. Custom card shadow defined inline instead of using utilities.

### store-ui.ts Utilities Currently Used
- `storeBadgeMutedClass` ✓ (listing type badge)
- `storeCardHoverClass` ✓ (card hover effects)

### store-ui.ts Utilities NOT Used (But Should Be)
- `storeCardClass` – Not used; card has inline `rounded-2xl border border-border bg-card shadow-[...]` instead
- `storeInteractiveCardClass` – Should replace the entire custom card styling

### Spacing Inconsistencies
- **Inconsistent card padding:** Uses `p-5` directly instead of standardized `storePanelClass` (which has `p-6 sm:p-8`)
- **Badge spacing:** Uses `px-2 py-1` for featured/category badges, but `storeBadgeClass` uses `px-3 py-1` (should be consistent)

### Typography Issues
- **Product name heading:** Uses `font-serif text-base font-medium` – should use `storeHeadingSmClass` or a dedicated card title class
- **Category label:** Uses inline `text-[11px] font-semibold uppercase` – should standardize

### Specific Recommendations
1. **Replace inline card styling with `storeCard()` helper:**
   ```tsx
   // Before
   className={`flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[...] ${storeCardHoverClass}`}
   // After
   className={storeCard("h-full overflow-hidden")}
   ```

2. **Standardize padding:**
   Replace `p-5` with consistent spacing (use `storePanelClass` pattern `p-6 sm:p-8`)

3. **Create dedicated card badge classes** for featured/category badges in store-ui.ts

4. **Use muted text utility:**
   Replace `text-xs text-muted-foreground` with `storeTextMutedClass`

5. **Audit image spacing:**
   `gap-2.5` for badges, `gap-1.5` for prices – standardize

---

## 2. event-package-card.tsx

### Current Styling Approach
**Mixed with some store-ui usage:** Uses `storeCard()` but wraps it incorrectly; lots of custom card styling and spacing.

### store-ui.ts Utilities Currently Used
- `storeCard()` ✓ (but not used optimally – wrapped in custom div)

### store-ui.ts Utilities NOT Used (But Should Be)
- `storePanelClass` – Image container uses custom shadow instead
- `storeHeadingMdClass` – Heading uses `text-xl md:text-2xl` inline instead
- `storeTextMutedClass` – Description and guest count use inline muted classes

### Spacing Inconsistencies
- **Padding inconsistency:** Uses `px-1 pt-5 pb-2` instead of standardized `storePanelClass` padding
- **Title-to-price gap:** Uses `mt-2` then `mt-3` for different sections – should standardize to `space-y-*`
- **Image aspect ratio gap:** `aspect-[4/3]` is custom; `aspect-[3/4]` in product-card differs

### Typography Issues
- **Heading:** `font-serif text-xl md:text-2xl font-semibold` should use `storeHeadingSmClass`
- **Tier badge:** Custom styling `text-xs font-medium` – not standardized

### Specific Recommendations
1. **Use `storePanel()` for CardContent:**
   ```tsx
   // Instead of px-1 pt-5 pb-2, use storePanelClass pattern
   CardContent className={storePanel("flex flex-1 flex-col")}
   ```

2. **Replace inline heading with class:**
   Replace `font-serif text-xl md:text-2xl font-semibold` with `storeHeadingSmClass`

3. **Standardize spacing with space-y utilities:**
   Use `space-y-3` or `space-y-4` instead of mixed `mt-*` values

4. **Simplify card structure:**
   Don't wrap `storeCard()` in extra divs; use it directly on Card className

5. **Use `storeBadgeMutedClass` for tier:**
   Current tier badge needs standardization

---

## 3. product-gallery.tsx

### Current Styling Approach
**Mostly inline classes:** Limited store-ui integration; uses custom shadows and borders throughout.

### store-ui.ts Utilities Currently Used
- None ✗

### store-ui.ts Utilities NOT Used (But Should Be)
- `storePanelClass` – Thumbnail buttons should use standardized border/hover
- `storeCardClass` – Main viewer uses custom shadow instead
- `storeDividerClass` – Could use for separating gallery sections

### Spacing Inconsistencies
- **Gap inconsistencies:** `gap-4 lg:gap-5` (thumbnails), `gap-2` (images), `gap-1.5` (buttons) – not unified
- **Padding variations:** Thumbnails use `pb-1 lg:pb-0` but no horizontal padding consistency
- **Button spacing:** Controls use hardcoded `h-9 w-9` and `h-11 w-11` – should standardize

### Typography Issues
- **No typography issues** (component is mostly layout-focused)

### Specific Recommendations
1. **Apply `storeCardClass` to main viewer:**
   ```tsx
   // Before: custom shadow
   className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-[...]"
   // After: use store-ui
   className={cn(storeCardClass, "group relative aspect-[3/4] overflow-hidden")}
   ```

2. **Standardize thumbnail styling:**
   Use consistent `storeCardClass` pattern for thumbnail buttons

3. **Unify gap spacing:**
   Replace `gap-4 lg:gap-5` and `gap-2` with consistent `gap-3` or `gap-4`

4. **Create button size constants:**
   Extract hardcoded button sizes to store-ui (`storeControlButtonClass`?)

5. **Simplify borders:**
   Use `storeCardClass` instead of `border border-border`

---

## 4. product-grid.tsx

### Current Styling Approach
**Minimal, utility-focused:** Uses `cn()` for responsive grid. Very clean.

### store-ui.ts Utilities Currently Used
- None (but not needed – this is a layout primitive)

### store-ui.ts Utilities NOT Used (But Should Be)
- N/A – This component is appropriately minimal

### Spacing Inconsistencies
- **Gap is hardcoded:** `gap-x-6 gap-y-12` – should these be in store-ui as `storeGridGapClass`?
- **Column breakpoints:** `sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4` for default mode – consistent with design system?

### Typography Issues
- N/A (no typography)

### Specific Recommendations
1. **Consider standardizing grid gaps:**
   Create `storeGridGapDefault` and `storeGridGapCompact` classes in store-ui.ts for reuse

2. **Document column strategies:**
   Add comments explaining why "default" uses `md:` breakpoint while "compact" uses `sm:`

3. **Responsive refinement:**
   Consider adding `lg:gap-8` or adjusting gaps for larger screens

---

## 5. shop-filters.tsx

### Current Styling Approach
**Mixed inline + store-ui:** Uses `storePanelClass` but has lots of custom inline spacing and typography.

### store-ui.ts Utilities Currently Used
- `storePanelClass` ✓ (main container)

### store-ui.ts Utilities NOT Used (But Should Be)
- `storeHeadingSmClass` – Filter section headers use inline `text-sm font-medium`
- `storeTextMutedClass` – Uses inline `text-muted-foreground` throughout
- `storeBadgeMutedClass` – Could be used for category labels

### Spacing Inconsistencies
- **Section spacing:** `space-y-8` is fine, but internal spacing varies: `space-y-4`, `space-y-2`, `space-y-6`
- **Form input spacing:** Relative form has no consistent spacing context
- **Button spacing:** Clear button uses `w-full` but no padding standard

### Typography Issues
- **Filter headers:** Use `font-medium text-sm text-foreground uppercase tracking-wider` – should standardize
- **Labels:** Use `text-sm font-normal` – could use utility class
- **Muted text:** Uses raw `text-muted-foreground` instead of `storeTextMutedClass`

### Specific Recommendations
1. **Create filter header class:**
   Add `storeFilterHeaderClass` to store-ui for `text-sm font-semibold uppercase tracking-wider`

2. **Use muted text utility:**
   Replace all `text-muted-foreground` with `storeTextMutedClass`

3. **Standardize spacing:**
   Audit all `space-y-*` and `mt-*` values; consolidate to `space-y-4` pattern

4. **Create category group styling:**
   Extract `space-y-2` for category items to store-ui

5. **Improve button consistency:**
   Use `Button` component's `w-full` sizing

---

## 6. testimonials.tsx

### Current Styling Approach
**Store-ui aware:** Uses `storeSectionClass`, `storeCardHoverClass`, but has inconsistent spacing.

### store-ui.ts Utilities Currently Used
- `storeSectionClass` ✓
- `storeCardHoverClass` ✓
- `SectionTag` component ✓

### store-ui.ts Utilities NOT Used (But Should Be)
- `storeHeadingMdClass` – Heading uses inline `text-3xl md:text-4xl`
- `storeTextMutedClass` – Description uses inline `text-muted-foreground`
- `storeCardClass` – Card container missing full card styling

### Spacing Inconsistencies
- **Section spacing:** `mt-10` for grid instead of using `storeSectionSpacingClass` or `storePageIntroClass`
- **Intro section:** `text-center` block uses custom spacing instead of standardized pattern
- **Card gap:** `gap-6` is custom – should reference standard

### Typography Issues
- **Main heading:** `font-serif text-3xl font-semibold md:text-4xl` should use `storeHeadingMdClass`
- **Description:** `text-muted-foreground` should use `storeTextMutedClass`
- **Testimonial text:** Uses `text-sm` – should verify consistency

### Specific Recommendations
1. **Use `storeHeadingMdClass` for main heading:**
   ```tsx
   className={storeHeadingMdClass}
   ```

2. **Use `storeTextMutedClass` for description:**
   Replace inline `text-muted-foreground` with utility class

3. **Wrap Card with `storeCardClass`:**
   Ensure full card styling is applied

4. **Standardize intro spacing:**
   Use `storePageIntroClass` or document why custom spacing is needed

5. **Audit grid gap:**
   Change `gap-6` to `gap-5` or make it a variable

---

## 7. product-detail-client.tsx

### Current Styling Approach
**Minimal styling component:** Mostly functional UI; uses `storeInsetClass` for variants panel.

### store-ui.ts Utilities Currently Used
- `storeInsetClass` ✓ (variants container)

### store-ui.ts Utilities NOT Used (But Should Be)
- N/A – This is appropriately minimal

### Spacing Inconsistencies
- **Variant pills spacing:** `space-y-2.5` – should this be `space-y-3`?
- **Button group:** `gap-3` is fine, but uses `sm:flex-row` instead of responsive pattern

### Typography Issues
- **Variant label:** Uses `text-sm font-medium` – could standardize

### Specific Recommendations
1. **Consider creating VariantPill class:**
   If reused elsewhere, standardize the `min-w-[2.75rem]` sizing

2. **Verify spacing consistency:**
   `space-y-2.5` is non-standard; use `space-y-2` or `space-y-3`

3. **Button sizing review:**
   Ensure button sizing matches design system

---

## 8. cart-page-client.tsx

### Current Styling Approach
**Wrapper component:** Minimal styling (just manages state for CartSheet).

### Current Issues
- **No issues** – This is appropriately simple

---

## 9. hero-slideshow.tsx

### Current Styling Approach
**Mostly inline styling:** Custom shadows and positioning; limited store-ui usage.

### store-ui.ts Utilities Currently Used
- None ✗

### store-ui.ts Utilities NOT Used (But Should Be)
- None directly applicable (hero is custom layout)

### Spacing Inconsistencies
- **Overlay sections:** `px-4` for padding is inconsistent with `storeShellClass` pattern (`px-6 sm:px-10 lg:px-16`)
- **Button gap:** `gap-3` for buttons is fine
- **Text spacing:** `mt-4`, `mt-4` (repeated) – should standardize

### Typography Issues
- **Main heading:** Uses `font-serif text-4xl font-semibold md:text-6xl` – should use `storeHeadingLgClass`
- **Tagline:** Uses inline `text-lg text-white/90` – should standardize

### Specific Recommendations
1. **Use `storeHeadingLgClass` for main heading:**
   Adapt for white text color

2. **Create hero-specific spacing class:**
   Define `storeHeroTextPaddingClass` for consistent padding

3. **Standardize control spacing:**
   `mt-4` repeats; consider `space-y-4`

4. **Review overlay styling:**
   Consider `storeShellClass` pattern for horizontal padding

---

## 10. footer.tsx

### Current Styling Approach
**Well-structured with inline classes:** Good semantic organization; uses appropriate spacing but some inconsistencies.

### store-ui.ts Utilities Currently Used
- None ✗

### store-ui.ts Utilities NOT Used (But Should Be)
- `storeHeadingSmClass` – Footer headings use inline `text-sm font-semibold uppercase`
- `storeTextMutedClass` – Uses inline `text-background/70`

### Spacing Inconsistencies
- **Grid gap:** `gap-10` then `md:grid-cols-2 lg:grid-cols-4` – should standardize
- **Link list spacing:** `space-y-2.5` for links – should this be `space-y-3`?
- **Icon boxes:** Use hardcoded `h-9 w-9` – should be standardized

### Typography Issues
- **Heading:** `text-2xl font-semibold` uses inline classes instead of utility
- **Subheadings:** `text-sm font-semibold uppercase` – not standardized
- **Muted text:** Uses `text-background/70` instead of `storeTextMutedClass` pattern

### Specific Recommendations
1. **Create footer heading class:**
   Add `storeFooterHeadingClass` to store-ui for `text-sm font-semibold uppercase tracking-wider`

2. **Standardize muted text:**
   Use consistent opacity/color pattern for footer text

3. **Standardize icon size:**
   Use `storeIconWrapClass` pattern or create footer-specific version

4. **Audit grid spacing:**
   Change `gap-10` to `gap-8` or add to store-ui

5. **Standardize link spacing:**
   Change `space-y-2.5` to `space-y-3`

---

## 11. header.tsx

### Current Styling Approach
**Mixed with inline + store-ui:** Uses some utilities but lots of custom inline spacing and colors.

### store-ui.ts Utilities Currently Used
- `storeShellClass` ✓ (container)

### store-ui.ts Utilities NOT Used (But Should Be)
- None directly applicable (header is custom)

### Spacing Inconsistencies
- **Header height:** `h-16` is hardcoded – should be configurable
- **Gap patterns:** `gap-4` (items), `gap-3` (icons), `gap-1` (nav) – inconsistent
- **Logo container:** `h-9 w-9` is inconsistent with icon patterns
- **Mobile menu width:** `w-[300px]` is hardcoded

### Typography Issues
- **Logo text:** Uses `font-serif text-xl font-semibold` – should standardize
- **Nav links:** Use `text-sm font-medium` – could create nav class

### Specific Recommendations
1. **Create header constants in store-ui:**
   Add `storeHeaderHeightClass`, `storeHeaderPaddingClass`

2. **Standardize gap spacing:**
   Audit all `gap-*` values and consolidate

3. **Create nav link class:**
   Add `storeNavLinkClass` for consistent styling

4. **Standardize icon sizing:**
   Use consistent `h-5 w-5` pattern throughout

5. **Document mobile menu width:**
   Consider making `w-[300px]` configurable via store-ui

---

## 12. page-intro.tsx

### Current Styling Approach
**Well-structured, uses store-ui:** Uses `storeAccentBarClass` and margin classes; mostly good.

### store-ui.ts Utilities Currently Used
- `storeAccentBarClass` ✓
- `storePageIntroClass` ✓ (implicitly in manual margins)

### store-ui.ts Utilities NOT Used (But Should Be)
- `storeHeadingLgClass` – H1 heading uses inline `text-4xl md:text-5xl`

### Spacing Inconsistencies
- **Banner aspect ratio:** `aspect-[21/9]` with `min-h-[220px] sm:min-h-[280px]` – inconsistent
- **Description text:** `mt-4` is fine, but could verify consistency

### Typography Issues
- **Main heading:** `font-serif text-4xl font-semibold tracking-tight md:text-5xl` should use `storeHeadingLgClass`
- **Description:** `text-lg md:text-xl` is fine

### Specific Recommendations
1. **Use `storeHeadingLgClass` for H1:**
   Replace inline heading classes

2. **Standardize banner sizing:**
   Document aspect ratio choice (21/9 vs other ratios)

3. **Verify accent bar placement:**
   Currently shown on desktop; ensure mobile behavior is intentional

---

## 13. section-heading.tsx

### Current Styling Approach
**Mixed approach:** Uses store-ui concepts (accent bar) but doesn't import utilities; duplicates patterns.

### store-ui.ts Utilities Currently Used
- None (should be importing from store-ui)

### store-ui.ts Utilities NOT Used (But Should Be)
- **MAJOR ISSUE:** Component duplicates `storeAccentBarClass` pattern inline
- `storeHeadingMdClass` – Heading uses inline `text-3xl md:text-4xl font-bold`
- `storeTextMutedClass` – Description uses inline `text-foreground/75`

### Spacing Inconsistencies
- **Accent bar spacing:** Duplicates `h-9 w-1.5 rounded-full` – should import from store-ui
- **Section tag:** `flex items-center gap-3` – duplicated in SectionHeading

### Typography Issues
- **Heading:** `font-serif text-3xl md:text-4xl font-bold` should use `storeHeadingMdClass`
- **Description:** `mt-3 text-base md:text-lg text-foreground/75` – should standardize

### Specific Recommendations
1. **CRITICAL: Import `storeAccentBarClass`:**
   Don't duplicate; use the utility from store-ui

2. **Use `storeHeadingMdClass`:**
   Replace inline heading styling

3. **Import and use `storeTextMutedClass`:**
   Replace `text-foreground/75` pattern

4. **Extract SectionTag component:**
   Currently duplicates pattern; import from store-ui or consolidate

5. **Consolidate accent bar rendering:**
   Use consistent `storeAccentBarClass` everywhere

---

## 14. section-heading.tsx (SectionTag function)

### Current Issues
- **Duplicated utility:** Creates `h-9 w-1.5 rounded-full bg-primary` inline instead of using `storeAccentBarClass`
- **Already used in testimonials.tsx** ✓ but inconsistently across codebase

### Recommendations
- Import from store-ui; don't duplicate styling

---

## store-container.tsx

### Current Styling Approach
**Well-designed:** Uses size variants and standardized padding.

### Current Issues
- **None** – This component is well-structured

### Recommendations
- Possibly add size variants like `full` or `xl` for edge cases

---

## 🎯 PRIORITY FIXES (Highest Impact)

### High Priority (Do First)
1. **section-heading.tsx** – Stop duplicating `storeAccentBarClass`; import from store-ui
2. **product-card.tsx** – Replace inline card styling with `storeCard()` helper
3. **event-package-card.tsx** – Use `storePanel()` for CardContent instead of `px-1 pt-5`
4. **product-gallery.tsx** – Apply `storeCardClass` to main viewer

### Medium Priority
5. **shop-filters.tsx** – Use `storeTextMutedClass` and standardize section headers
6. **testimonials.tsx** – Use `storeHeadingMdClass` and `storeTextMutedClass`
7. **footer.tsx** – Create footer-specific heading class; standardize spacing
8. **hero-slideshow.tsx** – Use `storeHeadingLgClass` for main heading

### Low Priority (Polish)
9. **header.tsx** – Create header constants; standardize gaps
10. **page-intro.tsx** – Use `storeHeadingLgClass`
11. **Standardize grid gaps** – Consider `storeGridGapDefault` class

---

## 📊 Summary Table

| Component | Using store-ui | Primary Issue | Recommendation |
|-----------|-----------------|---------------|-----------------|
| product-card | 2/5 | Inline card styling | Use `storeCard()` |
| event-package-card | 1/5 | Custom padding | Use `storePanel()` |
| product-gallery | 0/5 | No utilities | Use `storeCardClass` |
| product-grid | 0/5 | Appropriate | Consider grid gap utility |
| shop-filters | 1/5 | Mixed spacing | Standardize with utilities |
| testimonials | 2/5 | Inline heading | Use `storeHeadingMdClass` |
| product-detail | 1/5 | Minimal needs | Verify spacing standards |
| cart-page | 0/5 | Wrapper only | N/A |
| hero-slideshow | 0/5 | Custom hero | Use heading class |
| footer | 0/5 | Custom spacing | Create footer class |
| header | 1/5 | Custom patterns | Create header class |
| page-intro | 1/5 | Inline heading | Use `storeHeadingLgClass` |
| section-heading | 0/5 | **Duplicates patterns** | **Import from store-ui** |
| store-container | 0/5 | Well-designed | N/A |

---

## 💡 Additional Recommendations

### Create These New Utility Classes
1. **`storeFilterHeaderClass`** – For filter section headers
2. **`storeFooterHeadingClass`** – For footer subheadings  
3. **`storeGridGapDefault`** / **`storeGridGapCompact`** – For product grid gaps
4. **`storeNavLinkClass`** – For header navigation links
5. **`storeHeroTextPaddingClass`** – For hero section text container

### Documentation Needs
1. Document when to use `storeCard()` vs `storeCardClass`
2. Create examples for responsive typography patterns
3. Document spacing strategy (when to use `space-y-*` vs individual margins)

### Testing Recommendations
1. Audit all font sizes for consistency with design system
2. Verify shadow layering across card types
3. Check border-radius consistency (2xl vs xl vs lg)
4. Audit responsive behavior across breakpoints
