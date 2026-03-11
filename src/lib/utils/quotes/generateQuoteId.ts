// src/lib/utils/quotes/generateQuoteId.ts
import { LogisticsQuoteModel } from "@/mongoose/models/LogisticsQuote";

/**
 * Friendly quote ID format:
 *   NPT-YYMMDD-XXXXX
 * Example:
 *   NPT-260311-7G4K2
 *
 * - Short enough for customers
 * - Date helps support/internal lookup
 * - Random suffix keeps it compact
 * - DB uniqueness is still enforced by unique index
 */

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function randomBase36(length: number) {
  let out = "";
  while (out.length < length) {
    out += Math.random().toString(36).slice(2).toUpperCase();
  }
  return out.slice(0, length);
}

function buildCandidate(date = new Date()) {
  const yy = String(date.getUTCFullYear()).slice(-2);
  const mm = pad2(date.getUTCMonth() + 1);
  const dd = pad2(date.getUTCDate());

  return `NPT-${yy}${mm}${dd}-${randomBase36(5)}`;
}

export async function generateUniqueQuoteId(): Promise<string> {
  // Extremely low collision chance, plus DB unique index.
  for (let i = 0; i < 20; i++) {
    const candidate = buildCandidate();
    const exists = await LogisticsQuoteModel.exists({ quoteId: candidate });
    if (!exists) return candidate;
  }

  // Fallback with longer suffix if somehow very unlucky
  for (let i = 0; i < 30; i++) {
    const yy = String(new Date().getUTCFullYear()).slice(-2);
    const mm = pad2(new Date().getUTCMonth() + 1);
    const dd = pad2(new Date().getUTCDate());
    const candidate = `NPT-${yy}${mm}${dd}-${randomBase36(7)}`;
    const exists = await LogisticsQuoteModel.exists({ quoteId: candidate });
    if (!exists) return candidate;
  }

  throw new Error("Failed to generate a unique quote reference");
}
