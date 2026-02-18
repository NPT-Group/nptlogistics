# Analytics + Cookie Consent Guide (NPT Logistics)

This document explains the full analytics and cookie-consent setup in this codebase, what each part does, and how to operate it in production.

---

## 1) What we set up

We implemented a consent-aware analytics system so tracking only runs when users allow analytics cookies.

### Core pieces

- `src/components/analytics/AnalyticsClient.tsx`
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
  - Mounts analytics globally (site-wide, not homepage-only).
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

## 9) Operating checklist for production

- [ ] `NEXT_PUBLIC_GA_MEASUREMENT_ID` set in Vercel Production
- [ ] Redeploy completed
- [ ] Banner appears for first-time visitors
- [ ] Realtime GA validation done (accept/reject paths)
- [ ] Legal text reviewed by legal counsel for jurisdiction-specific requirements

---

## 10) FAQ

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
