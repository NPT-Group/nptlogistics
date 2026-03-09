# Analytics + Cookie Consent Guide (NPT Logistics)

This document explains the full analytics and cookie-consent setup in this codebase, what each part does, and how to operate it in production.

---

## 1) What we set up

We implemented a consent-aware analytics system so tracking only runs when users allow analytics cookies.

### Core pieces

- `src/app/(site)/components/analytics/AnalyticsClient.tsx`
  - Loads Google Analytics (GA4) scripts.
  - Initializes Google Consent Mode with analytics **denied by default**.
  - Shows cookie consent banner.
  - Sends page view events after consent.
- `src/lib/analytics/consent.ts`
  - Stores and reads cookie preferences.
  - Applies consent updates to GA (`granted`/`denied`).
- `src/lib/analytics/cta.ts`
  - Tracks CTA clicks (`cta_click`) only when analytics consent is granted.
- `src/app/layout.tsx`
  - Mounts analytics globally across public routes (including `/tracking` and `/employee-portal`).
  - Excludes admin routes from analytics/banner rendering.
- Footer and legal pages:
  - `src/components/layout/SiteFooter.tsx`
  - `src/app/privacy/page.tsx`
  - `src/app/terms/page.tsx`
  - `src/app/cookies/page.tsx`
  - `src/app/cookie-preferences/page.tsx`
  - `src/app/accessibility/page.tsx`

---

## 2) Environment variable required

Analytics is enabled only when GA ID is provided:

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-ZPCBWTGTH8
```

Where to set:

- Local: `.env.local`
- Vercel: Project Settings -> Environment Variables

If this variable is missing, analytics scripts and the cookie banner are not rendered.

---

## 3) Consent behavior (Accept / Reject / Manage)

### A) User clicks **Accept all**

- Saved preference:
  - `analytics: true`
- Stored in:
  - `localStorage` key: `npt_cookie_consent`
  - cookie key: `npt_cookie_consent`
- GA consent updated to:
  - `analytics_storage: granted`
- Result:
  - Page views are sent.
  - CTA clicks are sent.
  - Dashboard data starts collecting.

### B) User clicks **Reject non-essential**

- Saved preference:
  - `analytics: false`
- GA consent updated to:
  - `analytics_storage: denied`
- Result:
  - No analytics page view events.
  - No CTA click events in GA/dataLayer.
  - Site still functions normally (necessary cookies remain).

### C) User clicks **Manage preferences**

- Banner opens preferences mode.
- User can enable/disable analytics toggle.
- Clicking **Save preferences** applies selected state immediately.

---

## 4) What events are tracked

### Page views

Sent from `AnalyticsClient` after consent:

- event: `page_view`
- includes:
  - `page_path`
  - `page_location`
  - `page_title`

### CTA clicks

Sent from homepage/action buttons via `trackCtaClick()`:

- event: `cta_click`
- includes:
  - `ctaId`
  - `location`
  - `destination`
  - `label`
  - `interaction_type` (`click`)
  - `page_path`
  - `page_title`
  - timestamp (`ts`)

Examples:

- `hero_primary_quote`
- `industries_desktop_explore_automotive`
- `tracking_primary_track_shipment`
- `final_cta_primary_request_quote`

---

## 5) Important compliance logic

### Default privacy-safe behavior

On first load:

- Consent mode defaults to denied for analytics/ad storage.
- No analytics tracking happens until user opts in.

### Non-essential tracking is consent-gated

`trackCtaClick()` checks consent before sending to:

- `window.dataLayer`
- `window.gtag`

If consent is denied, event is not sent to analytics providers.

### Event quality protections

- CTA payload values are normalized and length-limited before sending.
- `destination` is reduced to canonical path/hash to avoid high-cardinality URL noise.
- Duplicate click bursts on the same CTA (double-clicks) are deduped client-side.
- Dynamic IDs/messages are avoided for production reporting consistency.

---

## 6) Cookie banner placement + live chat

We positioned the cookie banner to avoid clashing with a bottom-right live chat widget:

- Desktop: bottom-left
- Mobile: safe full-width position above bottom area

This helps prevent overlap with chat launchers.

---

## 7) How users can change choices later

Users can reopen settings from:

- Footer -> **Cookie Preferences**
- Route: `/cookie-preferences`

Both trigger/open the consent preference controls.

---

## 8) How to validate after deploy

1. Open site in incognito/private tab.
2. Confirm banner appears.
3. Click **Reject non-essential**.
   - In GA Realtime: no session/page view should appear.
4. Reload in fresh private tab, click **Accept all**.
   - Navigate pages and click CTAs.
   - In GA Realtime: see page views + events.

Optional browser check:

- DevTools -> Application -> Local Storage:
  - verify `npt_cookie_consent` values.

---

## 9) Browser setup verification in GA4 (end-to-end)

Use this to confirm the browser, website, and GA4 property are fully connected.

### A) GA4 property checks (Google Analytics UI)

1. Go to **Admin -> Data streams -> Web** and open your stream.
2. Confirm stream URL is your production domain (for example: `https://nptlogistics.com`).
3. Confirm the **Measurement ID** matches app env:
   - GA UI: `G-XXXX...`
   - App: `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXX...`
4. In stream details, confirm **Enhanced measurement** is ON (keep defaults unless intentionally changed).

### B) Browser network checks (your site)

1. Open the site in a fresh incognito tab.
2. Open DevTools -> **Network**.
3. Filter by `gtag/js` and confirm:
   - request to `https://www.googletagmanager.com/gtag/js?id=G-...` is loaded.
4. Filter by `collect?v=2` (GA4 hit endpoint).
5. Before consent accept:
   - there should be no meaningful `page_view`/`cta_click` collection traffic.
6. Click **Accept all** in cookie banner.
7. Navigate pages and click tracked CTAs.
8. Confirm `collect?v=2` calls now appear consistently.

### C) Browser state checks (consent + storage)

1. DevTools -> Application -> Local Storage:
   - key `npt_cookie_consent` exists.
   - contains `analytics: true` after accept.
2. DevTools -> Application -> Cookies:
   - cookie `npt_cookie_consent` exists with expected value.
3. Reject flow retest:
   - clear storage/cookies, reload, click **Reject non-essential**.
   - verify no `cta_click`/`page_view` events are sent.

### D) GA4 real-time confirmation

1. In GA4 open **Reports -> Realtime**.
2. Visit site and accept analytics.
3. Confirm active user appears within ~5-30 seconds.
4. Confirm event stream includes:
   - `page_view`
   - `cta_click`
5. Click header CTAs and verify event count increments.

### E) DebugView (recommended for final QA)

1. Install **Google Analytics Debugger** extension (Chrome) or use GTM preview if available.
2. Open GA4 **Admin -> DebugView**.
3. Trigger actions on site:
   - page navigation
   - CTA click
4. Verify event parameters are present:
   - `ctaId`
   - `location`
   - `destination`
   - `label`
   - `page_path`
5. Ensure values are normalized and consistent (no random per-user strings).

---

## 10) Operating checklist for production

- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` set in Vercel Production
- [ ] Redeploy completed
- [ ] Banner appears for first-time visitors
- [ ] Realtime GA validation done (accept/reject paths)
- [ ] Confirm `/tracking` and `/employee-portal` appear in GA Realtime after consent
- [ ] Legal text reviewed by legal counsel for jurisdiction-specific requirements

---

## 11) How to read reports (what each means)

This section maps your current instrumentation to GA4 report interpretation.

### A) Realtime report (operational health)

Use for quick validation that tracking is alive right now.

- If users are active but no events appear:
  - check consent acceptance and measurement ID.
- If `page_view` appears but `cta_click` does not:
  - CTA wiring issue or no tracked CTA interaction.
- If both appear:
  - pipeline is healthy.

### B) Pages and screens report (content performance)

Primary dimension: page path.  
Use it to understand where traffic lands and where users spend attention.

- High views + low CTA activity:
  - content may be informative but weak at conversion.
- Low views on strategic pages (industries/services):
  - discoverability/internal linking issue.
- Strong views on `/tracking` and `/employee-portal`:
  - indicates high post-sale support intent from users.

### C) Events report (action performance)

Focus on:

- `page_view`: demand/engagement volume.
- `cta_click`: conversion intent signal.

How to read:

- Rising `cta_click` with stable traffic:
  - UX/copy improvements are working.
- Rising traffic with flat `cta_click`:
  - conversion rate pressure; improve CTA placement or value proposition.

### D) Parameter-level analysis (quality insights)

Use event parameter breakdowns for `cta_click`:

- `ctaId`: exact action ID (what was clicked)
- `location`: where on page it happened (header, hero, final_cta, etc.)
- `destination`: intended path/hash/mailto target
- `label`: human-readable CTA text

Interpretation examples:

- High clicks on `header_request_quote`:
  - header CTA is a strong conversion surface.
- High clicks on support/navigation CTAs but low quote CTAs:
  - user intent is exploratory; strengthen quote intent messaging.

### E) Suggested KPI reads for this setup

1. **CTA Intent Rate** = `cta_click` / `page_view`
   - Overall conversion intent quality.
2. **Quote Intent Share**
   - % of CTA clicks that are quote-related IDs.
3. **Support Intent Share**
   - % of CTA clicks to tracking/employee/support pathways.
4. **Top CTA Locations**
   - Highest-performing `location` values for design decisions.

### F) Noise checks when reading reports

If data looks suspicious, verify:

- No sudden cardinality spikes in `ctaId` or `label`.
- No duplicate bursts from accidental double-click patterns.
- Consent mix is understood (rejected users are intentionally untracked).

---

## 12) FAQ

### Do we need to paste GA script manually in Google UI?

No. Script injection is already implemented in `AnalyticsClient.tsx`.

### Is this only for homepage?

No. It is mounted in root layout, so it applies site-wide.

### What if user never chooses?

Analytics remains denied by default.

---

If needed, we can add:

- custom conversion events (quote form submit, contact submit)
- GA dashboard spec with KPI definitions
- GTM container integration (optional, if you want marketing tags managed in GTM)
