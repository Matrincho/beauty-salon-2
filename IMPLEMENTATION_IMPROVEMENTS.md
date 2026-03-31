# IMPLEMENTATION_IMPROVEMENTS.md

Frontend-only improvement plan for the “Maison Élite” site.

## How to use this doc
1. Pick an improvement area and work through it in order.
2. For each section below, complete the checklist items.
3. When everything in a section is checked off, move to the next section.

---

## 1) Prevent “blank/white flash” during initial load (hydration/LanguageProvider)
### Goal
Ensure the UI renders immediately on first paint (using default locale), and only adjust locale metadata after mount.

### Where this likely applies
- `lib/i18n/LanguageContext.tsx` returns `null` until `isMounted === true`.

### Implementation checklist
- [ ] Verify the initial load behavior:
  - [ ] Refresh the browser (Ctrl+F5) on a slow connection (or with cache disabled).
  - [ ] Confirm whether the screen stays white/blank briefly.
- [ ] Modify `LanguageProvider` so it does NOT return `null` during hydration:
  - [ ] Render children immediately with `DEFAULT_LOCALE`.
  - [ ] On mount, read `localStorage` and update `document.documentElement.lang`.
  - [ ] Ensure no layout shift or flicker occurs.
- [ ] Confirm translation usage stays correct:
  - [ ] Switching locale still updates displayed strings.
- [ ] Accessibility/SEO check:
  - [ ] Validate `<html lang="...">` ends up correct after mount.
  - [ ] Confirm no hydration warnings in the console.
- [ ] QA pass:
  - [ ] Test the home page and at least one subpage after hard refresh.

---

## 2) Navbar accessibility and interaction robustness (keyboard + dialogs)
### Goal
Make dropdowns and the mobile menu usable without a mouse, and improve screen-reader semantics.

### Where this likely applies
- `components/navigation/Navbar.tsx`
  - “More” dropdown uses `group-hover:block` (hover-dependent).
  - Mobile drawer lacks focus management and Escape-to-close.

### Implementation checklist
- [ ] Keyboard navigation review:
  - [ ] Use only keyboard (Tab/Shift+Tab/Enter/Space) to open/close:
    - [ ] “More” dropdown
    - [ ] Mobile menu drawer
  - [ ] Ensure focus is visible on nav elements.
- [ ] Dropdown interaction improvements:
  - [ ] Provide a keyboard-activatable control for “More” (not only hover).
  - [ ] Ensure ARIA attributes reflect open/closed state:
    - [ ] `aria-expanded` on the trigger button
    - [ ] appropriate labeling for the menu
- [ ] Mobile drawer improvements:
  - [ ] Add Escape key support to close the menu.
  - [ ] Add focus trap inside the drawer while open.
  - [ ] Prevent scroll is already attempted; verify it works reliably on open/close.
  - [ ] When closing, restore focus to the menu toggle button.
  - [ ] Mark the drawer/backdrop with dialog semantics:
    - [ ] `role="dialog"` or `aria-modal="true"` where appropriate
    - [ ] ensure backdrop is `aria-hidden` appropriately
- [ ] Screen reader pass:
  - [ ] With a screen reader, confirm announcements for:
    - [ ] menu open/close state
    - [ ] navigation regions
- [ ] QA pass:
  - [ ] Mobile width (320–430px) check:
    - [ ] open menu
    - [ ] click links
    - [ ] menu closes properly

---

## 3) Anchor scrolling accuracy (fixed header offset)
### Goal
Ensure in-page navigation (`#services`, `#gallery`, `#faq`, etc.) lands below the fixed header.

### Where this likely applies
- Fixed header (`Navbar` uses `fixed top-0`)
- Anchor targets may not have correct scroll offset.
- `scroll-margin-top-20` appears applied to service card containers, not section IDs.

### Implementation checklist
- [ ] Identify all anchor targets:
  - [ ] `#services`
  - [ ] `#testimonials`
  - [ ] `#gallery`
  - [ ] `#faq`
- [ ] Apply the scroll offset to the correct elements:
  - [ ] Add `scroll-margin-top` (or Tailwind `scroll-mt-*`) to the actual section wrappers that own the IDs.
- [ ] Validate behavior:
  - [ ] Click each nav link and confirm content is not hidden under the header.
  - [ ] Test both on:
    - [ ] top of page
    - [ ] mid-page where scroll position already exists
- [ ] QA pass:
  - [ ] Ensure smooth scrolling stays consistent across browsers.

---

## 4) Reduced motion support for animation-heavy UI
### Goal
Respect `prefers-reduced-motion` by reducing or disabling non-essential motion.

### Where this likely applies
- Multiple sections use `animate-fade-in-up` + stagger delays.
- Testimonials carousel autoplays (`setInterval`).

### Implementation checklist
- [ ] Verify current motion behavior:
  - [ ] Enable system “Reduce Motion” (OS setting) and reload.
  - [ ] Confirm animations and carousel autoplay response.
- [ ] Update animations to respect reduced motion:
  - [ ] Add CSS rules to disable animation classes when `prefers-reduced-motion: reduce`.
  - [ ] Ensure reveal/stagger effects do not cause unexpected movement.
- [ ] Update carousel autoplay behavior:
  - [ ] When reduced motion is enabled, stop autoplay (or slow it drastically).
- [ ] QA pass:
  - [ ] Check home page + testimonials section specifically.

---

## 5) Font consistency for “quiet luxury” typography
### Goal
Ensure the intended serif/sans fonts actually load and are applied consistently.

### Where this likely applies
- `app/layout.tsx` loads `Geist` and `Geist_Mono`.
- `app/globals.css` defines serif font token as `'Playfair Display'`, but `Playfair Display` may not be loaded.

### Implementation checklist
- [ ] Audit font loading:
  - [ ] Confirm which fonts are actually loaded in the browser (DevTools > Network).
  - [ ] Confirm `font-serif` resolves to what you expect.
- [ ] Decide the strategy (frontend-only):
  - [ ] Option A: Load the intended serif (e.g., Playfair Display) via `next/font` (recommended if you want the exact look).
  - [ ] Option B: Adjust serif token to use a loaded font (e.g., Geist serif fallback).
- [ ] Confirm applied styles:
  - [ ] Review key headings (Hero, Services, About, Team, Contact).
  - [ ] Ensure italic/letter-spacing/uppercase styling still looks correct.
- [ ] QA pass:
  - [ ] Compare against design reference (if you have one).
  - [ ] Check mobile typography wrapping and legibility.

---

## 6) Reduce duplication across subpages (consistent header/footer behavior)
### Goal
Ensure every page uses the same header pattern (or shared component) to avoid spacing/behavior drift.

### Where this likely applies
- `/about`, `/contact`, `/booking`, `/careers`, `/team` each embed their own “header bar” markup rather than reusing `Navbar`.

### Implementation checklist
- [ ] Compare subpage headers:
  - [ ] Ensure consistent heights, spacing, CTA visibility, and typography.
  - [ ] Confirm “Home” back link style is consistent everywhere.
- [ ] Choose a frontend-only direction:
  - [ ] Option A: Reuse `Navbar` on subpages with props (e.g., “show secondary links only”).
  - [ ] Option B: Create a dedicated “SubpageHeader” component and reuse it.
- [ ] Ensure interactions remain consistent:
  - [ ] Locale toggle should behave identically.
  - [ ] CTA button should route to booking consistently.
- [ ] QA pass:
  - [ ] Navigate between pages and ensure no layout jump occurs.

---

## 7) Booking & Contact UX improvements (frontend-only, no backend logic)
### Goal
Make the pages feel “complete” and conversion-friendly even without backend integration.

### Where this likely applies
- `/booking` currently shows centered heading + phone link only.
- `/contact` shows contact details + map placeholder + booking nudge.

### Implementation checklist
- [ ] Define frontend UX goals (quick decisions):
  - [ ] Do you want a lightweight form with client-side validation?
  - [ ] Or prefer “tap-to-call / email” only with improved layout?
  - [ ] Do you want a confirmation toast/modal simulation on submit?
- [ ] Booking page improvements:
  - [ ] Add a clear “next step” CTA:
    - [ ] Primary: “Call” and/or “Email”
    - [ ] Secondary: “Request appointment” (even if it only simulates success for now)
  - [ ] Add hours / location hints to reduce friction before users navigate elsewhere.
  - [ ] Ensure buttons are thumb-friendly on mobile.
- [ ] Contact page improvements:
  - [ ] Replace map placeholder with a static image thumbnail or an embedded iframe (frontend-only).
  - [ ] Make contact details more scannable:
    - [ ] consistent capitalization
    - [ ] icon + label + value grouping
  - [ ] Consider adding a “message us” inline form (client-side only) OR “copy email” helper button.
- [ ] Accessibility/UX:
  - [ ] Ensure all CTAs have clear accessible names.
  - [ ] Confirm tel/mail links use the correct `href`.
- [ ] QA pass:
  - [ ] Try on mobile and desktop:
    - [ ] tap CTAs
    - [ ] verify hover/focus states
    - [ ] confirm readability on small screens

---

## Suggested order of operations (fastest value first)
1. Hydration blank/white flash prevention
2. Reduced motion support
3. Navbar accessibility robustness
4. Anchor scrolling accuracy
5. Font consistency
6. Subpage header/footer consistency
7. Booking & Contact UX upgrades

