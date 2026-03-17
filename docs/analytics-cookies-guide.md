# Analytics + Cookie Consent Guide (NPT Logistics)

This is a beginner-friendly guide to understand exactly what is implemented, how to verify it in the browser and GA4, how to read reports, and how to add tracking later without creating noisy data.

---

## 1) What is implemented right now

### Tracking model

- Google Analytics 4 (GA4) is loaded site-wide on public pages.
- Tracking is consent-aware:
  - analytics is denied by default
  - tracking starts only after user accepts analytics cookies
- We track two core event types:
  - `page_view` (manual, controlled by app)
  - `cta_click` (for important links/buttons)

### Source-of-truth files

- `src/app/(site)/components/analytics/AnalyticsClient.tsx`
  - loads GA scripts
  - sets Consent Mode defaults
  - renders cookie banner
  - sends `page_view` when route changes after consent
- `src/lib/analytics/consent.ts`
  - reads consent from `localStorage`
  - writes consent to `localStorage` and cookie
  - updates GA consent state (`granted`/`denied`)
- `src/lib/analytics/cta.ts`
  - shared CTA tracking helper (`trackCtaClick`)
  - normalizes IDs/locations
  - dedupes accidental fast double clicks
- `src/app/(site)/components/analytics/TrackedLink.tsx`
  - reusable tracked `Link` for server-rendered pages
  - used where direct client `onClick` tracking is needed

---

## 2) Environment variable required

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Set in:

- local: `.env.local`
- production: Vercel project environment variables

If missing, analytics client does not run.

---

## 3) Consent behavior (exactly what happens)

### If user clicks Accept all

- consent saved with `analytics: true`
- analytics consent updated to `granted`
- `page_view` and `cta_click` are sent

### If user clicks Reject non-essential

- consent saved with `analytics: false`
- analytics consent updated to `denied`
- `page_view` and `cta_click` are not sent to GA

### If user clicks Manage preferences

- user can toggle analytics on/off
- Save preferences applies immediately

Storage keys used:

- localStorage: `npt_cookie_consent`
- cookie: `npt_cookie_consent`

---

## 4) What events we send

### `page_view`

Sent from `AnalyticsClient` after consent on route change.

Parameters:

- `page_path`
- `page_location`
- `page_title`

### `cta_click`

Sent from `trackCtaClick()` after consent.

Parameters:

- `ctaId`
- `location`
- `destination`
- `label`
- `interaction_type` (`click`)
- `page_path`
- `page_title`

Important quality controls:

- `ctaId` and `location` are normalized and trimmed
- `destination` is canonicalized to path/hash
- rapid duplicate clicks are deduped

---

## 5) What was improved in this audit

- Added tracked links for:
  - lanes hub cards (`/lanes`)
  - lane detail CTAs (`/lanes/[slug]`)
  - locations hub cards (`/locations`)
  - location detail CTAs (`/locations/[slug]`)
  - footer navigation and quick-action links
  - desktop and mobile nav dropdown link interactions
- Hardened first-load reliability:
  - pageview dispatch now waits for `window.gtag` readiness retry

Result: higher coverage of high-intent interactions with cleaner reporting.

---

## 6) Browser + GA4 verification (baby steps)

Do this in order after each deployment.

### Step A - Confirm stream setup in GA4

1. Open GA4 -> Admin -> Data Streams -> Web.
2. Open your stream.
3. Confirm Measurement ID matches `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
4. Confirm stream domain is correct.

### Step B - Confirm scripts in browser

1. Open a new Incognito window.
2. Open DevTools (F12 or right‑click → Inspect) **before** loading the site.
3. Go to the **Network** tab.
4. In the filter box, type `gtag` (or `gtag/js`).
5. Check **Preserve log** so the request is not cleared on navigation.
6. Load or refresh the site (`nptlogistics-seo.vercel.app` or your domain).
7. Confirm a request appears to `googletagmanager.com/gtag/js?id=G-...` (your Measurement ID, e.g. `G-ZPCBWTGTH8`).

**If the list is empty:** The request was sent before you started recording. Refresh the page with DevTools already open and the filter applied.

### Step C - Test Reject flow

1. Reload in clean Incognito.
2. Click `Reject non-essential`.
3. Navigate pages and click CTA buttons/links.
4. In GA4 Realtime, you should not see your interactions as normal analytics events.

### Step D - Test Accept flow

1. Open clean Incognito again.
2. Click `Accept all`.
3. Navigate to a few pages.
4. Click important CTAs (quote, nav links, lane/location links).
5. In GA4 Realtime, confirm:
   - `page_view` appears
   - `cta_click` appears

### Step E - Confirm consent storage

1. DevTools -> Application -> Local Storage.
2. Check `npt_cookie_consent`.
3. DevTools -> Application -> Cookies.
4. Check cookie `npt_cookie_consent`.

### Step F - Optional DebugView deep test

1. Open GA4 DebugView.
2. Trigger page changes and CTA clicks.
3. Inspect event params for consistency:
   - `ctaId`, `location`, `destination`, `label`

---

## 7) How to read GA4 reports for your presentation

Use this simple framework.

### 1) Realtime report (health)

Question answered: Is tracking working right now?

- If no events: check consent + Measurement ID
- If only `page_view`: traffic exists but CTA interactions are low/not triggered
- If `page_view` + `cta_click`: full tracking pipeline healthy

### 2) Pages and screens report (attention)

Question answered: Where users spend time.

- identify top viewed pages
- compare strategic pages vs support pages
- find pages with high visits but low CTA engagement

### 3) Events report (intent)

Question answered: What users try to do.

- monitor `cta_click` trend over time
- break down by `ctaId` (exact CTA)
- break down by `location` (where CTA sits in UI)

### 4) Useful KPIs to present

- **CTA Intent Rate** = `cta_click / page_view`
- **Quote Intent Share** = quote-related CTA clicks / total CTA clicks
- **Top CTA Locations** = strongest layout surfaces by `location`
- **Top Destinations** = where users navigate after clicking CTAs

### 5) How to explain business value

- We see where attention is high but action is low.
- We can test CTA copy/placement and measure improvement.
- We can identify top lanes/locations interest and prioritize sales/ops focus.

---

## 8) How to add tracking when you add a new page or CTA

Use this checklist every time.

### For a client component button/link

1. Import `trackCtaClick` from `src/lib/analytics/cta.ts`.
2. Add `onClick={() => trackCtaClick({...})}`.
3. Use stable values:
   - `ctaId`: fixed ID (never dynamic timestamp/user text)
   - `location`: fixed UI region name
   - `destination`: route/hash target
   - `label`: visible CTA text

Example:

```tsx
onClick={() =>
  trackCtaClick({
    ctaId: "services_hero_request_quote",
    location: "services:hero",
    destination: "/quote",
    label: "Request a Quote",
  })
}
```

### For a server-rendered page link

Use `TrackedLink` from `src/app/(site)/components/analytics/TrackedLink.tsx`.

```tsx
<TrackedLink
  href="/quote"
  ctaId="location_detail_quote_toronto_on"
  location="location_detail:hero"
  label="Request a freight quote"
>
  Request a freight quote
</TrackedLink>
```

### Naming rules to avoid noisy reports

- Good: `section_action_target` style IDs
- Bad: IDs with random numbers, user names, timestamps
- Keep `location` values consistent (`header`, `footer`, `lane_detail:hero`, etc.)

---

## 9) Troubleshooting quick table

- Banner not showing:
  - check if consent already saved in storage
  - check `NEXT_PUBLIC_GA_MEASUREMENT_ID` exists
- No events after Accept:
  - check GA stream ID match
  - check Realtime (can lag briefly)
  - check console for JS errors
- Duplicate events:
  - verify CTA isn’t wired twice
  - use one tracking call per click surface
- Data looks messy:
  - audit `ctaId`/`location` naming for consistency

---

## 10) Production checklist

- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` set in production
- [ ] Reject flow tested (no analytics events)
- [ ] Accept flow tested (`page_view` and `cta_click`)
- [ ] lanes/locations links verified in Realtime
- [ ] Header + footer CTA tracking verified
- [ ] Cookie preferences page retest completed

---

## 11) Cookie banner UI recommendation

Current recommendation: keep compact on desktop and full-width only on mobile.

Why:

- lower visual disruption on large screens
- avoids competing with primary page content
- still easy to use and compliant
- mobile full-width is better for tap accessibility

If you want a wider desktop banner, use a medium-width card, not full-bleed full-width.
