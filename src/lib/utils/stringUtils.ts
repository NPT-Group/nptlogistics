// src/lib/utils/stringUtils.ts

/** Trim; return undefined if empty/nullish. */
export function trim(v?: string | null): string | undefined {
  if (v == null) return undefined;
  const t = String(v).trim();
  return t || undefined;
}

export function optionalString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

/** Uppercase+trim; return undefined if empty/nullish. */
export function upperTrim(v?: string | null): string | undefined {
  if (v == null) return undefined;
  const t = trim(v);
  return t ? t.toUpperCase() : undefined;
}

/** LowerCase+trim; return undefined if empty/nullish. */
export function lowerTrim(v?: string | null): string | undefined {
  if (v == null) return undefined;
  const t = trim(v);
  return t ? t.toLowerCase() : undefined;
}

/** Helper for enum messages */
export const enumMsg = (label: string, values: string[]) =>
  `${label} must be one of: ${values.join(", ")}`;

/** Slugify a string: lowercase, trim, replace non-alnum with hyphen, remove apostrophes, max 120 chars */
export const slugify = (input: string): string => {
  return (
    input
      .toLowerCase()
      .trim()
      // replace apostrophes
      .replace(/['’]/g, "")
      // non-alnum -> hyphen
      .replace(/[^a-z0-9]+/g, "-")
      // trim hyphens
      .replace(/^-+|-+$/g, "")
      // avoid empty slug
      .slice(0, 120) || "post"
  );
};
