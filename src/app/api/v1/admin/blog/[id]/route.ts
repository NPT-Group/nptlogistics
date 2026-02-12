// src/app/api/v1/admin/blog/[id]/route.ts
import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { guard } from "@/lib/utils/auth/authUtils";
import { parseJsonBody } from "@/lib/utils/reqParser";
import { trim } from "@/lib/utils/stringUtils";

import { BlogPostModel } from "@/mongoose/models/BlogPost";
import { BlogCommentModel } from "@/mongoose/models/BlogComment";

import type { IBlogAuthor } from "@/types/blogPost.types";
import { EBlogStatus } from "@/types/blogPost.types";
import type { BlockNoteDocJSON, IFileAsset } from "@/types/shared.types";

import {
  ensureUniqueSlug,
  calcReadingTimeMinutesFromBlockNote,
  finalizeBlogPostAssetsAllOrNothing,
  normalizePublishFields,
  cleanupRemovedAssets,
  deleteAllBlogPostAssets,
} from "@/lib/utils/blog/blogPostUtils";
import {
  normalizeCategoryIdStrings,
  splitExistingCategoryIds,
} from "@/lib/utils/blog/blogCategoryUtils";

/* -------------------------------------------------------------------------- */
/* GET /api/v1/admin/blog/:id                                                 */
/* -------------------------------------------------------------------------- */

export const GET = async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();
    await guard();

    const { id } = await ctx.params;
    const post = await BlogPostModel.findById(id).lean();
    if (!post) return errorResponse(404, "Blog post not found");

    const ids = Array.isArray((post as any).categoryIds)
      ? (post as any).categoryIds.map((x: any) => String(x))
      : [];
    const { existingIds, missingIds } = await splitExistingCategoryIds(ids);

    return successResponse(200, "Blog post", {
      blogPost: { ...post, id: post?._id?.toString?.() ?? id },
      // help admin UI show a warning; does NOT mutate post
      ...(missingIds.length
        ? { missingCategoryIds: missingIds, existingCategoryIds: existingIds }
        : {}),
    });
  } catch (error) {
    return errorResponse(error);
  }
};

/* -------------------------------------------------------------------------- */
/* PATCH /api/v1/admin/blog/:id                                               */
/* -------------------------------------------------------------------------- */

type PatchBody = {
  title?: string;
  slug?: string;
  excerpt?: string | null;

  content?: any;
  body?: BlockNoteDocJSON;

  bannerImage?: IFileAsset;

  categoryIds?: string[];

  status?: EBlogStatus;
  publishedAt?: string | Date | null;
};

export const PATCH = async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  let rollback: (() => Promise<void>) | null = null;

  try {
    await connectDB();
    const user = await guard();

    const { id } = await ctx.params;
    const existing = await BlogPostModel.findById(id);
    if (!existing) return errorResponse(404, "Blog post not found");

    const beforeSnapshot = {
      body: existing.body,
      bannerImage: existing.bannerImage,
    };

    const body = await parseJsonBody<PatchBody>(req);

    const nextTitle = body?.title != null ? trim(body.title) : undefined;
    if (body?.title != null && !nextTitle) return errorResponse(400, "title cannot be empty");

    const incomingDoc = (body?.body ?? body?.content) as BlockNoteDocJSON | undefined;
    if (
      (body?.body != null || body?.content != null) &&
      (!incomingDoc || typeof incomingDoc !== "object")
    ) {
      return errorResponse(400, "content/body must be valid BlockNote JSON");
    }

    const requestedSlug = body?.slug != null ? trim(body.slug) : undefined;
    if (requestedSlug === "")
      return errorResponse(400, "slug cannot be empty (omit it to auto-generate)");

    if (nextTitle != null) existing.title = nextTitle;
    if (body?.excerpt !== undefined) existing.excerpt = trim(body.excerpt ?? undefined);

    if (requestedSlug != null) {
      if (requestedSlug && requestedSlug !== (existing as any).slug) {
        (existing as any).slug = await ensureUniqueSlug(requestedSlug);
      }
    }

    // categories (resilient to dangling refs)
    // - If client sends categoryIds containing deleted/missing ids, we silently drop them.
    // - We return missingCategoryIds so admin UI can show a warning if desired.
    let missingCategoryIds: string[] = [];

    if (body?.categoryIds !== undefined) {
      const requestedIds = normalizeCategoryIdStrings(body.categoryIds);

      if (requestedIds.length) {
        const split = await splitExistingCategoryIds(requestedIds);
        missingCategoryIds = split.missingIds;

        (existing as any).categoryIds = split.existingIds.length
          ? (split.existingIds as any)
          : undefined;
      } else {
        // explicit empty array => clear categories
        (existing as any).categoryIds = undefined;
      }
    }

    // status / publishedAt parsing
    if (body?.status !== undefined) (existing as any).status = body.status;

    let nextPublishedAt: Date | undefined = (existing as any).publishedAt ?? undefined;
    if (body?.publishedAt !== undefined) {
      if (body.publishedAt === null) {
        nextPublishedAt = undefined;
      } else {
        const d = new Date(body.publishedAt as any);
        if (isNaN(d.getTime())) return errorResponse(400, "publishedAt must be a valid date");
        nextPublishedAt = d;
      }
    }

    // enforce invariants AFTER all updates
    (existing as any).publishedAt = normalizePublishFields(
      (existing as any).status,
      nextPublishedAt,
    );

    // Body/banner updates (and finalization)
    const nextBody = incomingDoc ?? ((existing as any).body as any);
    const nextBanner =
      body?.bannerImage !== undefined ? body.bannerImage : ((existing as any).bannerImage as any);

    const postId = existing._id.toString();
    const finalized = await finalizeBlogPostAssetsAllOrNothing({
      postId,
      body: nextBody,
      bannerImage: nextBanner,
    });

    rollback = finalized.rollback;

    (existing as any).body = finalized.body as any;
    (existing as any).bannerImage = finalized.bannerImage as any;

    // reading time always server-side
    (existing as any).readingTimeMinutes = calcReadingTimeMinutesFromBlockNote(
      (existing as any).body,
    );

    // last edited
    const editor: IBlogAuthor = { id: user.id, name: user.name, email: user.email };
    (existing as any).lastEditedBy = editor as any;
    (existing as any).lastEditedAt = new Date();
    (existing as any).updatedAt = new Date();

    await existing.validate();
    await existing.save();

    // Best-effort: delete assets removed from body/banner by the update
    try {
      const afterSnapshot = {
        body: (existing as any).body,
        bannerImage: (existing as any).bannerImage,
      };
      await cleanupRemovedAssets(beforeSnapshot, afterSnapshot);
    } catch (e) {
      console.warn("Asset cleanup (removed assets) failed:", e);
    }

    const obj = existing.toObject({ virtuals: true, getters: true });

    return successResponse(200, "Blog post updated", {
      blogPost: { ...obj, id: (obj as any)?._id?.toString?.() ?? postId },
      assetsFinalizedCount: finalized.movedCount,
      ...(missingCategoryIds.length ? { missingCategoryIds } : {}),
    });
  } catch (error) {
    if (rollback) await rollback();
    return errorResponse(error);
  }
};

/* -------------------------------------------------------------------------- */
/* DELETE /api/v1/admin/blog/:id                                              */
/* -------------------------------------------------------------------------- */

export const DELETE = async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();
    await guard();

    const { id } = await ctx.params;

    const post = await BlogPostModel.findById(id).select({ body: 1, bannerImage: 1 }).lean();
    if (!post) return errorResponse(404, "Blog post not found");

    await BlogPostModel.deleteOne({ _id: id });
    await BlogCommentModel.deleteMany({ blogPostId: id });

    // Best-effort S3 delete
    try {
      await deleteAllBlogPostAssets({
        body: (post as any).body,
        bannerImage: (post as any).bannerImage,
      });
    } catch (e) {
      console.warn("Failed to delete S3 assets for post:", id, e);
    }

    return successResponse(200, "Blog post deleted", { id });
  } catch (error) {
    return errorResponse(error);
  }
};
