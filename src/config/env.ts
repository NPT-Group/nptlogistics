// src/config/env.ts

// MongoDB Configuration
export const MONGO_URI = process.env.MONGO_URI!;

// Session and Token Settings
export const HASH_SECRET = process.env.HASH_SECRET!;

// Encryption and Security Keys
export const ENC_KEY = process.env.ENC_KEY!;
export const CRON_SECRET = process.env.CRON_SECRET!;

// AWS Configuration
export const APP_AWS_BUCKET_NAME = process.env.APP_AWS_BUCKET_NAME!;
export const APP_AWS_REGION = process.env.APP_AWS_REGION!;
export const APP_AWS_ACCESS_KEY_ID = process.env.APP_AWS_ACCESS_KEY_ID!;
export const APP_AWS_SECRET_ACCESS_KEY = process.env.APP_AWS_SECRET_ACCESS_KEY!;
export const NEXT_IMAGE_DOMAINS = process.env.NEXT_IMAGE_DOMAINS!;

// Authentication Configuration
export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME! || "";
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL!;
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET!;
export const ADMIN_EMAILS = process.env.ADMIN_EMAILS!;

// for disabling auth check ('true' or 'false') - for development purposes
export const DISABLE_AUTH = process.env.DISABLE_AUTH === "true";

// Azure AD
export const AZURE_AD_CLIENT_ID = process.env.AZURE_AD_CLIENT_ID!;
export const AZURE_AD_CLIENT_SECRET = process.env.AZURE_AD_CLIENT_SECRET!;
export const AZURE_AD_TENANT_ID = process.env.AZURE_AD_TENANT_ID!;
export const NPT_HR_EMAIL = process.env.NPT_HR_EMAIL!;

// Cloudflare
export const NEXT_PUBLIC_TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!;
export const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY!;

// Application Environment
export const isProd = process.env.NODE_ENV === "production";
export const PORT = process.env.PORT! ?? 3000;
