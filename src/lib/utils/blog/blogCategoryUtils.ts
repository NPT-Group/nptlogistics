// src/lib/utils/blog/blogCategoryUtils.ts
import mongoose from "mongoose";
import { BlogCategoryModel } from "@/mongoose/models/BlogCategory";

/**
 * Normalize incoming category ids (strings/unknown) into:
 * - unique string ids
 * - only valid ObjectId strings
 */
export function normalizeCategoryIdStrings(input: unknown): string[] {
  const arr = Array.isArray(input) ? input : [];
  const unique = new Set<string>();

  for (const raw of arr) {
    const s = String(raw ?? "").trim();
    if (!s) continue;
    if (!mongoose.isValidObjectId(s)) continue;
    unique.add(s);
  }

  return Array.from(unique);
}

/**
 * Given normalized ObjectId strings, returns which exist and which are missing.
 * This is the "resilient" piece: we don't throw; caller chooses behavior.
 */
export async function splitExistingCategoryIds(ids: string[]): Promise<{ existingIds: string[]; missingIds: string[] }> {
  if (!ids.length) return { existingIds: [], missingIds: [] };

  const rows = await BlogCategoryModel.find({ _id: { $in: ids } })
    .select({ _id: 1 })
    .lean();
  const existingSet = new Set(rows.map((r: any) => r._id?.toString?.()).filter(Boolean));

  const existingIds = ids.filter((id) => existingSet.has(id));
  const missingIds = ids.filter((id) => !existingSet.has(id));

  return { existingIds, missingIds };
}
