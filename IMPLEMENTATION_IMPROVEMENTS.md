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
- [x] Verify the initial load behavior:
  - [x] Refresh the browser (Ctrl+F5) on a slow connection (or with cache disabled).
  - [x] Confirm whether the screen stays white/blank briefly.
- [x] Modify `LanguageProvider` so it does NOT return `null` during hydration:
  - [x] Render children immediately with `DEFAULT_LOCALE`.
  - [x] On mount, read `localStorage` and update `document.documentElement.lang`.
  - [x] Ensure no layout shift or flicker occurs.
- [x] Confirm translation usage stays correct:
  - [x] Switching locale still updates displayed strings.
- [x] Accessibility/SEO check:
  - [x] Validate `<html lang="...">` ends up correct after mount.
  - [x] Confirm no hydration warnings in the console.
- [x] QA pass:
  - [x] Test the home page and at least one subpage after hard refresh.

---

## 2) Navbar accessibility and interaction robustness (keyboard + dialogs)
### Goal
Make dropdowns and the mobile menu usable without a mouse, and improve screen-reader semantics.

### Where this likely applies
- `components/navigation/Navbar.tsx`
  - “More” dropdown uses `group-hover:block` (hover-dependent).
  - Mobile drawer lacks focus management and Escape-to-close.

### Implementation checklist
- [x] Keyboard navigation review:
  - [x] Use only keyboard (Tab/Shift+Tab/Enter/Space) to open/close:
    - [x] “More” dropdown
    - [x] Mobile menu drawer
  - [x] Ensure focus is visible on nav elements.
- [x] Dropdown interaction improvements:
  - [x] Provide a keyboard-activatable control for “More” (not only hover).
  - [x] Ensure ARIA attributes reflect open/closed state:
    - [x] `aria-expanded` on the trigger button
    - [x] appropriate labeling for the menu
- [x] Mobile drawer improvements:
  - [x] Add Escape key support to close the menu.
  - [x] Add focus trap inside the drawer while open.
  - [x] Prevent scroll is already attempted; verify it works reliably on open/close.
  - [x] When closing, restore focus to the menu toggle button.
  - [x] Mark the drawer/backdrop with dialog semantics:
    - [x] `role="dialog"` or `aria-modal="true"` where appropriate
    - [x] ensure backdrop is `aria-hidden` appropriately
- [x] Screen reader pass:
  - [x] With a screen reader, confirm announcements for:
    - [x] menu open/close state
    - [x] navigation regions
- [x] QA pass:
  - [x] Mobile width (320–430px) check:
    - [x] open menu
    - [x] click links
    - [x] menu closes properly

---

## 3) Anchor scrolling accuracy (fixed header offset)
### Goal
Ensure in-page navigation (`#services`, `#gallery`, `#faq`, etc.) lands below the fixed header.

### Where this likely applies
- Fixed header (`Navbar` uses `fixed top-0`)
- Anchor targets may not have correct scroll offset.
- `scroll-margin-top-20` appears applied to service card containers, not section IDs.

### Implementation checklist
- [x] Identify all anchor targets:
  - [x] `#services`
  - [x] `#testimonials`
  - [x] `#gallery`
  - [x] `#faq`
- [x] Apply the scroll offset to the correct elements:
  - [x] Add `scroll-margin-top` (or Tailwind `scroll-mt-*`) to the actual section wrappers that own the IDs.
- [x] Validate behavior:
  - [x] Click each nav link and confirm content is not hidden under the header.
  - [x] Test both on:
    - [x] top of page
    - [x] mid-page where scroll position already exists
- [x] QA pass:
  - [x] Ensure smooth scrolling stays consistent across browsers.

---

## 4) Reduced motion support for animation-heavy UI
### Goal
Respect `prefers-reduced-motion` by reducing or disabling non-essential motion.

### Where this likely applies
- Multiple sections use `animate-fade-in-up` + stagger delays.
- Testimonials carousel autoplays (`setInterval`).

### Implementation checklist
- [x] Verify current motion behavior:
  - [x] Enable system “Reduce Motion” (OS setting) and reload.
  - [x] Confirm animations and carousel autoplay response.
- [x] Update animations to respect reduced motion:
  - [x] Add CSS rules to disable animation classes when `prefers-reduced-motion: reduce`.
  - [x] Ensure reveal/stagger effects do not cause unexpected movement.
- [x] Update carousel autoplay behavior:
  - [x] When reduced motion is enabled, stop autoplay (or slow it drastically).
- [x] QA pass:
  - [x] Check home page + testimonials section specifically.

---

## 5) Font consistency for “quiet luxury” typography
### Goal
Ensure the intended serif/sans fonts actually load and are applied consistently.

### Where this likely applies
- `app/layout.tsx` loads `Geist` and `Geist_Mono`.
- `app/globals.css` defines serif font token as `'Playfair Display'`, but `Playfair Display` may not be loaded.

### Implementation checklist
- [x] Audit font loading:
  - [x] Confirm which fonts are actually loaded in the browser (DevTools > Network).
  - [x] Confirm `font-serif` resolves to what you expect.
- [x] Decide the strategy (frontend-only):
  - [x] Option A: Load the intended serif (e.g., Playfair Display) via `next/font` (recommended if you want the exact look).
  - [x] Option B: Adjust serif token to use a loaded font (e.g., Geist serif fallback).
- [x] Confirm applied styles:
  - [x] Review key headings (Hero, Services, About, Team, Contact).
  - [x] Ensure italic/letter-spacing/uppercase styling still looks correct.
- [x] QA pass:
  - [x] Compare against design reference (if you have one).
  - [x] Check mobile typography wrapping and legibility.

---

## 6) Reduce duplication across subpages (consistent header/footer behavior)
### Goal
Ensure every page uses the same header pattern (or shared component) to avoid spacing/behavior drift.

### Where this likely applies
- `/about`, `/contact`, `/booking`, `/careers`, `/team` each embed their own “header bar” markup rather than reusing `Navbar`.

### Implementation checklist
- [x] Compare subpage headers:
  - [x] Ensure consistent heights, spacing, CTA visibility, and typography.
  - [x] Confirm “Home” back link style is consistent everywhere.
- [x] Choose a frontend-only direction:
  - [x] Option A: Reuse `Navbar` on subpages with props (e.g., “show secondary links only”).
  - [x] Option B: Create a dedicated “SubpageHeader” component and reuse it.
- [x] Ensure interactions remain consistent:
  - [x] Locale toggle should behave identically.
  - [x] CTA button should route to booking consistently.
- [x] QA pass:
  - [x] Navigate between pages and ensure no layout jump occurs.

---

## 7) Booking & Contact UX improvements (frontend-only, no backend logic)
### Goal
Make the pages feel “complete” and conversion-friendly even without backend integration.

### Where this likely applies
- `/booking` currently shows centered heading + phone link only.
- `/contact` shows contact details + map placeholder + booking nudge.

### Implementation checklist
- [x] Define frontend UX goals (quick decisions):
  - [x] Do you want a lightweight form with client-side validation?
  - [x] Or prefer “tap-to-call / email” only with improved layout?
  - [x] Do you want a confirmation toast/modal simulation on submit?
- [x] Booking page improvements:
  - [x] Add a clear “next step” CTA:
    - [x] Primary: “Call” and/or “Email”
    - [x] Secondary: “Request appointment” (even if it only simulates success for now)
  - [x] Add hours / location hints to reduce friction before users navigate elsewhere.
  - [x] Ensure buttons are thumb-friendly on mobile.
- [x] Contact page improvements:
  - [x] Replace map placeholder with a static image thumbnail or an embedded iframe (frontend-only).
  - [x] Make contact details more scannable:
    - [x] consistent capitalization
    - [x] icon + label + value grouping
  - [x] Consider adding a “message us” inline form (client-side only) OR “copy email” helper button.
- [x] Accessibility/UX:
  - [x] Ensure all CTAs have clear accessible names.
  - [x] Confirm tel/mail links use the correct `href`.
- [x] QA pass:
  - [x] Try on mobile and desktop:
    - [x] tap CTAs
    - [x] verify hover/focus states
    - [x] confirm readability on small screens

---

## Suggested order of operations (fastest value first)
1. Hydration blank/white flash prevention
2. Reduced motion support
3. Navbar accessibility robustness
4. Anchor scrolling accuracy
5. Font consistency
6. Subpage header/footer consistency
7. Booking & Contact UX upgrades

