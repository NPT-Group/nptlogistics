# Analytics Presentation Guide (NPT Logistics)

Use this as your speaking script + slide outline for presenting why analytics matters, what was implemented, and how to use the data for business decisions.

---

## 0) Presentation goal (say this first)

We now have a privacy-aware analytics system that helps us understand:

- where users spend time (`page_view`)
- what actions they try to take (`cta_click`)
- which pages/CTAs need optimization for better conversion

And we can do this without noisy data or non-consented tracking.

---

## 1) Suggested slide structure (10-12 slides)

### Slide 1 - Title

**Title:** "How Analytics Improves Revenue and UX at NPT Logistics"

Say:

- We implemented analytics not for vanity metrics, but for decision-making.
- This gives us visibility into user behavior and conversion intent.

### Slide 2 - Business problem

**Title:** "What We Could Not See Before"

Say:

- We previously had limited visibility into what users clicked and where they dropped off.
- We could not confidently prove which CTA placements were effective.
- We had less clarity on lane/location interest trends.

### Slide 3 - What is now instrumented

**Title:** "What We Track Today"

Show:

- `page_view`
- `cta_click`
- Key surfaces: header, footer, lane/location pages, major CTA areas

Say:

- We intentionally track high-value actions only.
- This keeps reports clean and useful.

### Slide 4 - Privacy and compliance by design

**Title:** "Consent-First Analytics"

Say:

- Analytics is denied by default.
- User must opt in before `page_view` and `cta_click` are sent.
- Users can change preference later via Cookie Preferences.

### Slide 5 - Data quality controls

**Title:** "How We Avoid Noisy Reports"

Say:

- Stable CTA naming (`ctaId`, `location`)
- Canonical destination values
- Duplicate-click dedupe
- No random user/time identifiers in CTA dimensions

### Slide 6 - Architecture (simple diagram)

**Title:** "How Tracking Flows"

Flow to show:

1. User interaction
2. `trackCtaClick()` / `TrackedLink`
3. Consent check
4. GA event send (`gtag` + `dataLayer`)
5. GA4 reports

### Slide 7 - Live verification

**Title:** "How We Confirm It Works"

Show screenshots:

- DevTools network (`gtag/js`)
- GA4 Realtime with `page_view` and `cta_click`

Say:

- We verify both accept and reject flows.
- This confirms both compliance and instrumentation health.

### Slide 8 - How to read the reports

**Title:** "From Events to Decisions"

Say:

- Realtime: operational health check
- Pages and screens: where attention is concentrated
- Events: which CTAs are driving intent

### Slide 9 - KPI framework

**Title:** "KPIs We Will Use"

Include:

- CTA Intent Rate = `cta_click / page_view`
- Quote Intent Share
- Top CTA Locations
- Top Lane/Location click demand

### Slide 10 - Example actions analytics enables

**Title:** "How This Improves the Site"

Say:

- Move/upgrade underperforming CTAs
- Improve copy on high-traffic, low-intent pages
- Prioritize lane/location content based on demand
- Validate whether design changes improved outcomes

### Slide 11 - Governance and process

**Title:** "How We Keep Data Reliable"

Say:

- Every new high-value CTA must be tracked
- Naming standards must be followed
- QA in GA Realtime before release sign-off
- Use checklist from `docs/analytics-cookies-guide.md`

### Slide 12 - Close

**Title:** "Why This Matters"

Say:

- We now have measurable user behavior, not assumptions.
- This reduces decision risk and helps us improve conversion and customer experience continuously.

---

## 2) 7-minute speaking script (quick version)

### Minute 0-1: Context

"We built analytics so we can clearly see both traffic and intent, while staying consent-compliant. Our goal is practical business intelligence, not vanity dashboards."

### Minute 1-2: What was implemented

"We track page views and CTA clicks across core surfaces: header, footer, and lane/location experiences. We also improved reliability so first-page tracking is not missed."

### Minute 2-3: Compliance and trust

"Tracking is opt-in. If a user rejects non-essential cookies, analytics events are not sent to GA. This protects user trust and compliance posture."

### Minute 3-4: Data quality

"We enforce naming consistency and normalize payloads to avoid high-cardinality noise. We dedupe accidental rapid repeated clicks so reports stay readable."

### Minute 4-5: How to use reports

"Realtime confirms implementation health. Pages and Screens shows where users spend time. Events shows where intent happens. Together they reveal what to optimize."

### Minute 5-6: KPI story

"We focus on CTA Intent Rate, Quote Intent Share, and top CTA locations. These metrics connect UX and content decisions to measurable behavior."

### Minute 6-7: Business impact

"This gives us a repeatable optimization loop: observe behavior, prioritize improvements, release changes, and validate uplift with data."

---

## 3) What screenshots to prepare

Prepare these before the presentation:

1. GA4 Realtime showing `page_view` + `cta_click`
2. GA4 Events report filtered to `cta_click`
3. GA4 Pages and Screens report (top pages)
4. Site cookie banner (accept/reject/manage)
5. Optional: DebugView showing CTA event params

Tip: blur/redact any sensitive details before sharing externally.

---

## 4) Likely stakeholder questions and strong answers

### Q: "How do we know this data is trustworthy?"

A:

- We use consistent naming conventions.
- We dedupe accidental click bursts.
- We validate in Realtime and DebugView before sign-off.
- Build and lint checks pass with instrumentation updates.

### Q: "Are we compliant with privacy expectations?"

A:

- Yes. Consent mode defaults analytics to denied.
- Events are sent only after opt-in.
- Users can update preferences anytime from Cookie Preferences.

### Q: "Can we measure lane/location demand now?"

A:

- Yes. Lane and location cards/CTAs are now instrumented.
- We can analyze click demand by route/location content surfaces.

### Q: "How will this improve revenue?"

A:

- It exposes where intent is high and where conversion is weak.
- We can optimize CTA placement/copy based on evidence.
- This supports better quote pipeline performance over time.

---

## 5) Demo checklist (if presenting live)

1. Open site in incognito.
2. Show cookie banner.
3. Click Accept all.
4. Navigate to lanes/locations and click a few CTAs.
5. In GA Realtime, show events appearing.
6. Explain `page_view` vs `cta_click` difference.

Backup plan:

- Keep screenshots ready in case Realtime has delay.

---

## 6) Presenter one-liners you can reuse

- "We moved from assumptions to measurable behavior."
- "This setup is privacy-aware and business-focused."
- "Our reporting is intentionally clean: high-value events, low noise."
- "Every UX/content change can now be validated with evidence."

---

## 7) After-presentation next steps

- Build a monthly analytics review ritual (30 mins).
- Pick 2-3 CTA experiments per month.
- Track KPI movement before/after each change.
- Expand tracking only when there is clear business value.
