# Beauty Salon — Backend, Auth & Dashboards Implementation Plan

This document is the **step-by-step implementation plan** for adding Supabase (database, Auth, Storage, Edge Functions) and role-based dashboards to the existing **Next.js 16** app (“Maison Élite”). **No payments** in scope; clients pay on premises.

**Your decisions captured**

- **Session catalog**: **Type A** — treat “sessions” as a **catalog of session types** (services); real calendar events are **bookings** linked to a type + staff + time.
- **Business model**: **Single business** (one salon); no multi-tenant v1.
- **Staff**: **Required** — bookings associate with a **staff member**.
- **Admin bootstrap**: handled **later in Supabase** (seed / dashboard / policy); plan leaves explicit hooks.
- **User vs client**: **Resolved in plan** (recommended default below).
- **Banned/rejected users**: enforce at **Auth session + API/RLS**; audit reasons and timestamps.
- **Bookings**: **1:1**; admin **price override** allowed on a booking.
- **Availability**: plan recommends a **phased** approach (simple first, richer rules next).
- **Timezone**: **single** salon timezone (stored in settings).
- **Login history**: IP, user agent, timestamp, success/failure.
- **History / audit**: **row-based audit** for session types, bookings, roles, bans, settings (with snapshots where noted).
- **Media**: **sensible defaults** in plan (avatars + session type images optional).
- **Email**: **recommended default** — Supabase Auth emails for verify/reset; **transactional booking email** as a later sub-phase (optional hook).
- **Frontend**: **Next.js App Router**; toasts via **Sonner**, positioned **top-left**.
- **Branding**: **`app/globals.css`** + landing patterns are the **source of truth**.
- **Language**: **Bulgarian (`bg`) is the main language** for all new authenticated UI (dashboards, auth pages, toasts, validation). English remains available via the same **`LanguageContext` / `translations`** pattern as the marketing site; add keys with **Bulgarian as the authoritative string** and English as the alternate.

---

## 1. Recommended domain model (clarifies “user” vs “client”)

**Problem you flagged:** unsure how to treat “user” vs “client.”

**Recommendation (v1):**

| Concept | Implementation |
|--------|----------------|
| **Auth identity** | Supabase `auth.users` |
| **App profile** | `public.profiles` — display name, avatar URL, phone, `account_status`, link to `auth.users.id` |
| **Authorization role** | `public.profiles.role` enum: `admin`, `staff`, `user`, `client` |
| **Promotion rule** | When a booking first reaches **`confirmed`** or **`completed`** (not merely `pending` or `cancelled`), set `role` from `user` → `client`. **Do not** auto-demote on cancellations. **Never** overwrite `admin` or `staff` via this rule. |

**Staff:** either `role = 'staff'` or a separate `staff_members` table with `user_id` nullable for “external” stylists — **prefer `staff_members` + optional `user_id`** so you can add providers before they have login. Admins are not mutually exclusive with booking as a client if you want that later; v1 can forbid staff booking themselves for simplicity.

---

## 2. Booking statuses (your “you say”)

**Recommended lifecycle**

| Status | Meaning |
|--------|---------|
| `pending` | Created; may await admin/staff confirmation (optional policy). |
| `confirmed` | Firm appointment; **promotes `user` → `client`** on first occurrence. |
| `completed` | Visit happened (promotes if not already client). |
| `cancelled` | Cancelled by client or admin; requires `cancelled_at`, `cancel_reason` (optional for client if you want low friction; **required for admin-side cancel** in UI). |
| `no_show` | Marked by admin/staff after the slot. |

**Rules**

- Only **`confirmed` / `completed` / no_show** count as “realized” for reporting; cancellations excluded from revenue-style reports unless you add “lost revenue” later.
- **Datetime fields:** `starts_at`, `ends_at` (computed from type duration or stored explicitly), `cancelled_at`, `completed_at` (optional).

---

## 3. High-level architecture

```
Browser (Next.js App Router)
  ├── Server Components + Route Handlers (session where needed)
  ├── Client components (forms, calendars)
  └── Supabase: @supabase/ssr (cookies) for Auth
Supabase
  ├── Postgres + RLS
  ├── Auth (email/password + optional magic link later)
  ├── Storage (avatars, session images)
  └── Edge Functions (optional: heavy logic, webhooks, email fan-out)
```

**Step 1 — Project wiring**

1. Create Supabase project; note URL, anon key, service role (server-only).
2. Add dependencies: `@supabase/supabase-js`, `@supabase/ssr`.
3. Env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server only, never client).
4. Add server/client Supabase helpers per Supabase Next.js SSR guide.
5. Add middleware: refresh session cookie, protect `/admin/*`, `/app/*` (or your chosen prefixes).

---

## 4. Database schema (tables & enums)

Naming is illustrative; adjust to taste but keep **one source of truth** for enums in Postgres.

### 4.1 Core enums

- `user_role`: `admin`, `staff`, `user`, `client`
- `account_status`: `active`, `pending_review`, `rejected`, `banned` (subset optional v1)
- `booking_status`: `pending`, `confirmed`, `completed`, `cancelled`, `no_show`

### 4.2 Tables (v1)

**`profiles`**

- `id` (uuid, PK, FK → `auth.users.id`)
- `email` (cached, optional if always from auth)
- `full_name`, `phone`, `avatar_url`
- `role` `user_role`
- `account_status` `account_status`
- `rejected_at`, `rejected_reason`, `banned_at`, `ban_reason` (nullable)
- `created_at`, `updated_at`
- Trigger: on `auth.users` insert → create `profiles` row default `role = user`, `account_status = active` (or `pending_review` if you want manual approval later).

**`salon_settings`** (single row or key-value — single row is simpler)

- `id` (singleton)
- `salon_name`, `timezone` (IANA string, e.g. `Europe/Sofia`)
- `address`, `phone`, `email`
- `default_appointment_duration_minutes` (optional fallback)
- `updated_at`

**`staff_members`**

- `id` uuid PK
- `user_id` uuid nullable FK → `profiles.id` (if they can log in)
- `display_name`, `title`, `bio`, `photo_url`
- `is_active` boolean
- `created_at`, `updated_at`

**`session_types`** (catalog — your “session A”)

- `id` uuid PK
- `slug` text unique (for public URLs)
- `title`, `description`, `duration_minutes`
- `base_price` numeric (or integer cents — **pick one and stick to it**)
- `currency` text default salon currency
- `location_label` text (e.g. “Studio A”, “Main floor”) — single business, no `locations` table required v1
- `is_active` boolean
- `active_from` timestamptz nullable, `active_to` timestamptz nullable (**null** = no bound; both null + `is_active` = use other availability rules)
- `image_url` nullable
- `sort_order` int
- `created_at`, `updated_at`

**`bookings`**

- `id` uuid PK
- `client_id` FK → `profiles.id`
- `session_type_id` FK → `session_types.id`
- `staff_member_id` FK → `staff_members.id`
- `status` `booking_status`
- `starts_at`, `ends_at` timestamptz (stored in UTC; display in salon TZ)
- `price_final` numeric — **snapshot** at booking time (after admin override)
- `price_override` boolean + optional `admin_note`
- `cancelled_at`, `cancel_reason`
- `internal_note` (admin/staff only)
- `created_at`, `updated_at`

**`login_events`** (history)

- `id` bigserial PK
- `user_id` uuid nullable (failed logins may have null)
- `email_attempt` text nullable
- `ip`, `user_agent`
- `success` boolean
- `error_code` text nullable
- `created_at`

Population: **Auth hook** (Edge Function on `auth` events) or **Supabase Auth webhook** + server logging; alternatively log from Next.js route handlers on sign-in if you control the flow. Prefer **database or immutable log table** with RLS: users see only their rows; admins see all.

**`audit_logs`** (generic — satisfies session/booking/settings/role/ban audit)

- `id` bigserial
- `actor_id` uuid FK → `profiles.id` nullable (system actions null)
- `action` text — e.g. `session_type.updated`, `booking.cancelled`, `profile.role_changed`, `profile.banned`, `settings.updated`
- `entity_type` text, `entity_id` uuid/text
- `payload_before` jsonb, `payload_after` jsonb (snapshots or deltas — **snapshots** easier for “undo” later)
- `created_at`

**Optional split:** `session_type_revisions` if you want strictly versioned catalog rows; v1 **jsonb snapshots in `audit_logs`** are enough.

**Availability (phased)**

**Phase A — “good enough” (ship first)**

- On `session_types`: `is_active`, `active_from`, `active_to` (overall catalog window).
- On `staff_members`: optional `working_hours` as **jsonb** (simple weekly template) *or* skip until Phase B and rely on manual booking validation only (not ideal).

**Phase B — rules + exceptions (recommended target)**

- `availability_rules`: `id`, `staff_member_id` nullable (null = salon-wide default), `session_type_id` nullable, `rrule` or structured `{ weekdays[], start_time, end_time }`, `effective_from`, `effective_to` nullable
- `availability_exceptions`: `id`, `staff_member_id` nullable, `starts_at`, `ends_at`, `kind` (`blocked` | `extra_slot`), `note`

**Decision for plan:** implement **Phase A in milestone 1**; design tables for Phase B early so migrations are additive.

---

## 5. Row Level Security (RLS) — implementation steps

1. Enable RLS on **all** public tables.
2. **Helper:** SQL function `is_admin(uid)` / `is_staff(uid)` reading `profiles.role` (SECURITY DEFINER, stable).
3. **profiles:** users `select/update` own row; admins full access; optional staff read limited fields for booking UIs.
4. **session_types:** public `select` where `is_active` and within active window; staff/admin CRUD.
5. **bookings:** clients `select/insert/update` **own** where policy allows (e.g. cancel only `pending`/`confirmed`); staff `select` where `staff_member_id` matches or all if you trust staff; admins all.
6. **audit_logs / login_events:** clients none or own login_events only; admins `select all`.
7. **salon_settings:** public read minimal (name, tz); admin write.

**Banned / rejected:** implement **`account_status`** checks in RLS policies **or** a single middleware gate that signs user out if `banned`. **Do both**: middleware for UX; RLS for security.

**Promotion trigger:** Postgres trigger after `bookings` insert/update: if `status in ('confirmed','completed')` and `role = 'user'`, set `client`. Alternatively application layer in a Server Action — **DB trigger is more reliable**.

---

## 6. Supabase Auth flows (pages, not modals)

**Suggested routes (public auth)**

| Route | Purpose |
|-------|---------|
| `/login` | Email + password (or magic link later) |
| `/signup` | Register; optional email confirm |
| `/logout` | POST action or server route; clear session |
| `/forgot-password` | Supabase reset request |
| `/auth/callback` | OAuth/email confirm exchange (if used) |

**UX:** full pages with shared “auth layout” (brand, calm background). **Modals** only for “Discard changes?”, delete confirmations, quick field edits.

**Session handling**

- Use **cookie-based SSR** pattern so Server Components know the user.
- After login, redirect: `admin` → `/admin`, `staff` → `/admin` or `/staff` (see §7), `user`/`client` → `/app`.

---

## 7. Frontend information architecture (unique pages + slugs)

**Convention:** `/app/*` = client (and generic logged-in user); `/admin/*` = admin; **staff** can share `/admin` with reduced nav or use `/staff/*` — pick one to avoid duplicate UIs.

**Recommended:** **`/admin` for admin + staff** with **sidebar filtered by role** (staff sees bookings + their calendar only unless you grant more). Simpler than maintaining two shells.

### 7.1 General / shared (authenticated)

| Slug | Purpose |
|------|---------|
| `/app` | Client dashboard home |
| `/app/profile` | View/edit profile, avatar |
| `/app/bookings` | List bookings |
| `/app/bookings/new` | Create booking (session type, staff, slot) |
| `/app/bookings/[id]` | Detail, cancel flow, notes read-only |

### 7.2 Admin (+ staff UI)

| Slug |purpose |
|------|---------|
| `/admin` | Dashboard KPIs (today’s bookings, revenue-at-risk, counts) |
| `/admin/session-types` | List session catalog |
| `/admin/session-types/new` | Create |
| `/admin/session-types/[id]` | Edit, image, availability summary |
| `/admin/staff` | Staff CRUD |
| `/admin/staff/[id]` | Edit staff, photo, link user account |
| `/admin/bookings` | All bookings; filters |
| `/admin/bookings/[id]` | Admin edit, status changes, price override, internal note |
| `/admin/clients` | User list; role, status, promote/demote (careful), ban/reject |
| `/admin/clients/[id]` | Profile + history tabs |
| `/admin/calendar` | Staff/day views (uses bookings + optional availability) |
| `/admin/reporting` | Date range reports (export CSV later) |
| `/admin/audit` | Read-only audit trail (admin) |
| `/admin/settings` | Salon settings, timezone |

### 7.3 Additional pages worth adding

| Slug | Why |
|------|-----|
| `/admin/login-events` | Security / support (or tab under Reporting) |
| `/unauthorized` | Clear 403 UX |
| `/account/suspended` | If `banned` or `rejected`, explain next steps |
| `/privacy` / `/terms` | Login history & PII — transparency (even stub v1) |

**Public marketing** pages already exist (`/`, `/booking`, `/contact`, etc.). Consider linking **`/booking`** to **`/app/bookings/new`** once auth is live.

---

## 8. Edge Functions (when to use)

| Function | Purpose |
|---------|---------|
| `on-auth-event` | Write `login_events`; optionally block patterns (future) |
| `on-booking-write` | Optional: send email via Resend/SMTP (phase 1b) |
| `cron-reminders` | Optional: 24h reminder email (future) |

**Start minimal:** no Edge Functions until Auth logging is required server-side; first iteration can log from **Next.js Route Handler** calling Supabase with service role into `login_events` for controlled flows.

---

## 9. Storage buckets

**Default recommendation**

| Bucket | Contents | Policy sketch |
|--------|----------|----------------|
| `avatars` | Profile images | User writes own path `userId/*`; public read optional or signed URLs |
| `session-types` | Catalog images | Admin write; public read for active types |
| `staff-photos` | Staff portraits | Admin write; public read |

**Limits (defaults):** images only `image/jpeg`, `image/png`, `image/webp`; **max 5 MB**; resize client-side or via Edge Function later.

---

## 10. UI/UX standards

### 10.1 Pages vs modals

- **Dedicated routes** for: create/edit session type, booking detail, staff profile, client profile, settings sections.
- **Modals (`alert-dialog`)** for: confirm cancel booking, confirm ban user, destructive deletes, small quick edits (e.g. rename in place) if you want speed.

### 10.2 Toasts (top-left)

- Use existing **Sonner** wrapper (`components/ui/sonner.tsx`).
- Configure **`<Toaster position="top-left" />`** (and richColors / duration globally) in the root layout for dashboard routes (or app-wide for consistency).
- Prefer toast for **non-blocking success/error** after mutations; use inline form errors for validation.

### 10.3 Components

- Continue **shadcn-style** primitives already in `components/ui/*`: `button`, `input`, `card`, `tabs`, `table`, `calendar`, `select`, `badge` for status chips.

### 10.4 Language & copy (Bulgarian-first)

- **Default locale for dashboards:** treat **`bg` as primary** — match `lang="bg"` on the root layout and extend `lib/i18n/translations` (or equivalent) with namespaces such as `auth.*`, `app.*`, `admin.*`.
- **Authoring order:** write **Bulgarian first** in translation files; keep **English** in parallel for locale switching.
- **Server vs client:** where Server Components need strings, either pass locale from cookies/headers or use a small shared dictionary; avoid hardcoding English-only strings in new routes.
- **Domain words:** use consistent BG terms in UI (e.g. резервация, услуга, екип/специалист) and reuse the same keys in admin and client apps.

---

## 11. Branding guide (from current codebase)

**Source:** `app/globals.css`, `app/layout.tsx`, `components/sections/HeroSection.tsx`.

| Token | Usage |
|-------|--------|
| **Background / paper** | Alabaster `#F9F8F6` — `bg-background` |
| **Primary text** | Charcoal `#1A1A1B` — headings, body emphasis |
| **Accent / luxury highlight** | Champagne gold `#D4AF37` — `accent`, ring, decorative borders, highlighted wordmarks |
| **Muted / supporting text** | Warm stone `#8C8074` — subtitles, secondary links |
| **Deep charcoal** | `#0F0F10` — rare depth (footers, contrast blocks if needed) |
| **Borders** | `#E5E0D8` — `border` |
| **Radius** | `0.25rem` — tight, refined corners; keep dashboard cards consistent |
| **Typography** | **Playfair Display** (`font-serif`) for page titles / dashboard H1–H2; **Geist** (`font-sans`) for UI, tables, forms |
| **Motion** | Prefer subtle `reveal` / short fades; respect `prefers-reduced-motion` (already in CSS) |
| **Decorative motif** | Thin gold border frames (`border-[#D4AF37]/30`) sparingly on hero-like sections — optional in dashboard empty states |

**Dashboard layout**

- Light mode default; keep plenty of whitespace (quiet luxury).
- Primary actions: charcoal buttons; secondary: outline or ghost; **destructive** only for ban/delete.
- Status badges: map booking status to stone/gold/charcoal neutrals, avoid loud rainbow.

---

## 12. Reporting (v1)

**Admin `/admin/reporting`**

- Filters: date range, staff, session type, status.
- Metrics: booking counts by status, **completed** count, **no-show** count, **cancellation rate**, sum of `price_final` for completed (cash-on-premises proxy).
- Tables: upcoming week, busiest staff, popular session types.

**Export:** CSV optional in milestone 2.

---

## 13. Milestone sequencing (recommended)

### Milestone M0 — Foundation

- Supabase project, env, SSR helpers, middleware, `profiles` + trigger, RLS baseline.
- Auth pages: login, signup, logout, forgot password.
- Profile page; Sonner top-left; account status gate for banned users.

### Milestone M1 — Catalog & staff

- `session_types`, `staff_members`, admin CRUD pages, Storage for images.
- Public read of active session types for booking flow.

### Milestone M2 — Bookings

- Client booking flow with staff + slot picker (start **simple**: discrete slots generated server-side from rules Phase A, or manual admin slotting in v0.5).
- Admin booking management, status transitions, price override, cancel reasons.
- Promotion `user` → `client` trigger.

### Milestone M3 — History & audit

- `login_events`, `audit_logs`, admin read UI.
- Admin client management: reject/ban with reasons; RLS + middleware.

### Milestone M4 — Availability Phase B

- Rules + exceptions tables; calendar UX; validation when booking.

### Milestone M5 — Polish

- Optional transactional email; **Bulgarian-first i18n** for any dashboard strings not yet in `translations`; fill English pass; accessibility pass on tables/forms.

---

## 14. Other history / metrics to track (suggestions)

Beyond login, session types, bookings, role/ban/settings:

- **Staff assignment changes** on a booking (`staff_member_id` changed) — audits disputes.
- **Price override history** — either in `audit_logs` or columns `price_override_at`, `price_override_by`.
- **Profile changes** (PII) for support (store in `audit_logs` with redaction policy).
- **Exported reports** log (who ran export, when) if compliance matters later.

---

## 15. Payments & future

- **v1:** `price_final` is informational; optional `payment_status` enum later (`unpaid`, `paid_on_site`) if front desk wants to tick payments without Stripe.
- **Future:** Stripe Checkout, deposits, no-show fees — **out of scope** per your note.

---

## 16. Open points (intentionally deferred)

- **Exact admin bootstrap** in Supabase (you’ll define when ready).
- **Email provider** for non-Auth mail (Resend vs SMTP).
- **Staff self-service** (shift swaps, personal availability) — future.
- **Dashboard i18n** — **Bulgarian primary**; English secondary (`LanguageContext`). Defer extra locales until needed.

---

## 17. File deliverables when implementation starts (for traceability)

- `supabase/migrations/*` — schema, RLS, triggers.
- `lib/supabase/*` — server, client, middleware helpers.
- `app/(auth)/*`, `app/app/*`, `app/admin/*` — route groups as appropriate.
- Shared `components/layouts` for App shell vs Admin shell.
- Types: generated from Supabase CLI or hand-maintained `database.types.ts`.

---

*End of implementation plan.*
