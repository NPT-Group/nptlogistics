NPT Logistics marketing website built with Next.js.

## Getting Started

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Production Build Check

```bash
npm run lint
npm run build
```

## Analytics + Cookie Consent (GA4)

This project includes consent-aware GA4 tracking:

- Cookie banner with:
  - Accept all
  - Reject non-essential
  - Manage preferences
- Footer links:
  - Cookie Policy
  - Cookie Preferences (re-open settings)
- CTA click tracking and page view tracking only when analytics consent is granted.

### Required environment variable

Set this in your deployment environment (Vercel project settings):

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

If this variable is missing, analytics scripts and cookie banner are not rendered.

### Events tracked

- `cta_click`
  - Includes: `ctaId`, `location`, `destination`, `label`, `ts`
- `page_view`
  - Fired on route changes after consent

You can consume events in:

- Google Analytics (`gtag`)
- Google Tag Manager (`dataLayer`)

## Legal Pages

The following routes are available and linked in footer:

- `/privacy`
- `/terms`
- `/cookies`
- `/accessibility`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Deploy with Vercel and ensure `NEXT_PUBLIC_GA_MEASUREMENT_ID` is configured for production analytics.
