// src/app/api/v1/admin/blog/categories/route.ts
import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { guard } from "@/lib/utils/auth/authUtils";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { parseJsonBody } from "@/lib/utils/reqParser";
import { parsePagination, parseSort, buildMeta, rx } from "@/lib/utils/queryUtils";
import { trim, slugify } from "@/lib/utils/stringUtils";

import { BlogCategoryModel } from "@/mongoose/models/BlogCategory";
import type { IBlogCategory } from "@/types/blogPost.types";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

async function ensureUniqueCategorySlug(base: string): Promise<string> {
  const root = slugify(base);
  let candidate = root;

  const exists0 = await BlogCategoryModel.exists({ slug: candidate });
  if (!exists0) return candidate;

  for (let i = 2; i < 1000; i++) {
    candidate = `${root}-${i}`;
    const exists = await BlogCategoryModel.exists({ slug: candidate });
    if (!exists) return candidate;
  }

  return `${root}-${Date.now()}`;
}

/* -------------------------------------------------------------------------- */
/* GET /api/v1/admin/blog/categories                                          */
/* -------------------------------------------------------------------------- */

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    await guard();

    const url = new URL(req.url);
    const sp = url.searchParams;

    const q = trim(sp.get("q"));

    const { page, limit, skip } = parsePagination(sp.get("page"), sp.get("pageSize"), 200);
    const allowedSortKeys = ["createdAt", "updatedAt", "name", "slug"] as const;
    const { sortBy, sortDir } = parseSort(sp.get("sortBy"), sp.get("sortDir"), allowedSortKeys, "name");

    const filter: any = {};
    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      filter.$and = tokens.map((t) => ({
        $or: [{ name: rx(t) }, { slug: rx(t) }, { description: rx(t) }],
      }));
    }

    const total = await BlogCategoryModel.countDocuments(filter);

    const docs = await BlogCategoryModel.find(filter)
      .sort({ [sortBy]: sortDir })
      .skip(skip)
      .limit(limit)
      .select({ name: 1, slug: 1, description: 1, createdAt: 1, updatedAt: 1 })
      .lean();

    const items = docs.map((d: any) => ({
      id: d?._id?.toString?.() ?? d?.id ?? "",
      name: d?.name,
      slug: d?.slug,
      description: d?.description ?? "",
      createdAt: d?.createdAt,
      updatedAt: d?.updatedAt,
    }));

    const meta = buildMeta({
      page,
      pageSize: limit,
      total,
      sortBy,
      sortDir,
      filters: { q: q ?? null },
    });

    return successResponse(200, "Blog categories list", { items, meta });
  } catch (error) {
    return errorResponse(error);
  }
};

/* -------------------------------------------------------------------------- */
/* POST /api/v1/admin/blog/categories                                         */
/* -------------------------------------------------------------------------- */

type CreateBody = {
  name: string;
  slug?: string;
  description?: string | null;
};

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    await guard();

    const body = await parseJsonBody<CreateBody>(req);

    const name = trim(body?.name);
    if (!name) return errorResponse(400, "name is required");

    const requestedSlug = trim(body?.slug);
    const slug = requestedSlug ? await ensureUniqueCategorySlug(requestedSlug) : await ensureUniqueCategorySlug(name);

    const description = trim(body?.description ?? undefined);

    const created = await BlogCategoryModel.create({
      name,
      slug,
      description,
    } as Partial<IBlogCategory>);

    const obj = created.toObject({ virtuals: true, getters: true });

    return successResponse(201, "Blog category created", {
      category: {
        ...obj,
        id: (obj as any)?._id?.toString?.() ?? created._id.toString(),
      },
    });
  } catch (error) {
    // Handle duplicate slug race
    const msg = (error as any)?.message || "";
    if (msg.includes("E11000") && msg.includes("slug")) return errorResponse(409, "Category slug already exists");
    return errorResponse(error);
  }
};
