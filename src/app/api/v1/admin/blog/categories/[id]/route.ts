// src/app/api/v1/admin/blog/categories/[id]/route.ts
import { NextRequest } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/utils/connectDB";
import { guard } from "@/lib/utils/auth/authUtils";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { parseJsonBody } from "@/lib/utils/reqParser";
import { trim, slugify } from "@/lib/utils/stringUtils";

import { BlogCategoryModel } from "@/mongoose/models/BlogCategory";
import { BlogPostModel } from "@/mongoose/models/BlogPost";

async function ensureUniqueCategorySlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base);
  let candidate = root;

  const exists0 = await BlogCategoryModel.exists({ slug: candidate, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
  if (!exists0) return candidate;

  for (let i = 2; i < 1000; i++) {
    candidate = `${root}-${i}`;
    const exists = await BlogCategoryModel.exists({ slug: candidate, ...(excludeId ? { _id: { $ne: excludeId } } : {}) });
    if (!exists) return candidate;
  }

  return `${root}-${Date.now()}`;
}

type PatchBody = {
  name?: string;
  slug?: string;
  description?: string | null;
};

export const PATCH = async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();
    await guard();

    const { id } = await ctx.params;
    if (!id) return errorResponse(400, "Missing category id");
    if (!mongoose.isValidObjectId(id)) return errorResponse(400, "Invalid category id");

    const body = await parseJsonBody<PatchBody>(req);
    const update: any = {};

    const name = trim(body?.name);
    if (name) update.name = name;

    const slugRaw = trim(body?.slug);
    if (slugRaw) update.slug = await ensureUniqueCategorySlug(slugRaw, id);
    else if (name) update.slug = await ensureUniqueCategorySlug(name, id);

    if (body?.description !== undefined) update.description = trim(body.description ?? undefined);

    const updated = await BlogCategoryModel.findByIdAndUpdate(id, update, { new: true }).lean();
    if (!updated) return errorResponse(404, "Category not found");

    return successResponse(200, "Blog category updated", {
      category: { ...updated, id: (updated as any)?._id?.toString?.() ?? id },
    });
  } catch (error) {
    const msg = (error as any)?.message || "";
    if (msg.includes("E11000") && msg.includes("slug")) return errorResponse(409, "Category slug already exists");
    return errorResponse(error);
  }
};

export const DELETE = async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  const session = await mongoose.startSession();

  try {
    await connectDB();
    await guard();

    const { id } = await ctx.params;
    if (!id) return errorResponse(400, "Missing category id");
    if (!mongoose.isValidObjectId(id)) return errorResponse(400, "Invalid category id");

    const categoryObjectId = new mongoose.Types.ObjectId(id);

    let postsModified = 0;

    await session.withTransaction(async () => {
      // 1) Remove this category from all posts that reference it
      const pullRes = await BlogPostModel.updateMany({ categoryIds: { $in: [categoryObjectId] } } as any, { $pull: { categoryIds: categoryObjectId } } as any, { session });

      // Mongoose can return different shapes depending on version
      postsModified = (pullRes as any)?.modifiedCount ?? (pullRes as any)?.nModified ?? 0;

      // 2) Delete the category
      const deleted = await BlogCategoryModel.findByIdAndDelete(categoryObjectId, { session }).lean();
      if (!deleted) {
        // Throw so the transaction aborts (and the $pull rolls back)
        throw new Error("CATEGORY_NOT_FOUND");
      }
    });

    return successResponse(200, "Blog category deleted", { id, postsModified });
  } catch (error) {
    const msg = (error as any)?.message || "";

    if (msg === "CATEGORY_NOT_FOUND") return errorResponse(404, "Category not found");
    return errorResponse(error);
  } finally {
    session.endSession();
  }
};
