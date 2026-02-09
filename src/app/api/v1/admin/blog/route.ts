// src/app/api/v1/admin/blog/route.ts
import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { guard } from "@/lib/utils/auth/authUtils";
import { parseJsonBody } from "@/lib/utils/reqParser";
import { parseBool, parseIsoDate, inclusiveEndOfDay, parseEnumParam, parsePagination, parseSort, buildMeta, rx } from "@/lib/utils/queryUtils";
import { trim } from "@/lib/utils/stringUtils";

import { BlogPostModel } from "@/mongoose/models/BlogPost";
import { BlogCategoryModel } from "@/mongoose/models/BlogCategory";
import { BlogCommentModel } from "@/mongoose/models/BlogComment";

import type { IBlogAuthor, IBlogPost, BlockNoteDocJSON } from "@/types/blogPost.types";
import { EBlogStatus } from "@/types/blogPost.types";
import type { IFileAsset } from "@/types/shared.types";

import { ensureUniqueSlug, calcReadingTimeMinutesFromBlockNote, finalizeBlogPostAssetsAllOrNothing, normalizePublishFields, deleteAllBlogPostAssets } from "@/lib/utils/blog/blogPostUtils";

/* -------------------------------------------------------------------------- */
/* Optional list mapper                                                       */
/* -------------------------------------------------------------------------- */

function mapPostToAdminListItem(p: any) {
  return {
    id: p?._id?.toString?.() ?? p?.id ?? "",
    title: p?.title,
    slug: p?.slug,
    excerpt: p?.excerpt,
    status: p?.status,
    publishedAt: p?.publishedAt ?? null,
    bannerImage: p?.bannerImage,
    author: p?.author,
    categoryIds: (p?.categoryIds ?? []).map((x: any) => x?.toString?.() ?? String(x)),
    readingTimeMinutes: p?.readingTimeMinutes ?? null,
    viewCount: p?.viewCount ?? 0,
    lastEditedBy: p?.lastEditedBy ?? null,
    lastEditedAt: p?.lastEditedAt ?? null,
    createdAt: p?.createdAt,
    updatedAt: p?.updatedAt,
  };
}

/* -------------------------------------------------------------------------- */
/* GET /api/v1/admin/blog                                                     */
/* -------------------------------------------------------------------------- */

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    await guard();

    const url = new URL(req.url);
    const sp = url.searchParams;

    const q = trim(sp.get("q"));
    const status = parseEnumParam(sp.get("status"), Object.values(EBlogStatus) as readonly EBlogStatus[], "status");

    const publishedOnly = parseBool(sp.get("publishedOnly")) ?? null;
    const categoryId = trim(sp.get("categoryId"));
    const authorId = trim(sp.get("authorId"));

    const allowedDateFields = ["created", "updated", "published"] as const;
    const dateField = parseEnumParam(sp.get("dateField"), allowedDateFields, "dateField") ?? "created";

    const fromRaw = sp.get("from");
    const toRaw = sp.get("to");

    const fromDate = parseIsoDate(fromRaw);
    if (fromRaw && !fromDate) return errorResponse(400, "Invalid 'from' date. Expected ISO format.");

    const toParsed = parseIsoDate(toRaw);
    if (toRaw && !toParsed) return errorResponse(400, "Invalid 'to' date. Expected ISO format.");

    const toDate = toParsed ? inclusiveEndOfDay(toParsed, toRaw) : null;

    const { page, limit, skip } = parsePagination(sp.get("page"), sp.get("pageSize"), 100);

    const allowedSortKeys = ["createdAt", "updatedAt", "publishedAt", "title", "status", "viewCount"] as const;
    const { sortBy, sortDir } = parseSort(sp.get("sortBy"), sp.get("sortDir"), allowedSortKeys, "createdAt");

    const includeBody = parseBool(sp.get("includeBody")) ?? false;
    const includeComments = parseBool(sp.get("includeComments")) ?? false;
    const includeCategories = parseBool(sp.get("includeCategories")) ?? false;

    const filter: any = {};
    if (status) filter.status = status;
    if (publishedOnly === true) filter.status = EBlogStatus.PUBLISHED;
    if (authorId) filter["author.id"] = authorId;

    if (categoryId) {
      const catExists = await BlogCategoryModel.exists({ _id: categoryId });
      if (!catExists) return errorResponse(404, "Category not found");
      filter.categoryIds = categoryId;
    }

    if (q) {
      const tokens = q.split(/\s+/).filter(Boolean);
      filter.$and = tokens.map((t) => ({
        $or: [{ title: rx(t) }, { excerpt: rx(t) }, { slug: rx(t) }],
      }));
    }

    if (fromDate || toDate) {
      const fieldMap: Record<(typeof allowedDateFields)[number], string> = {
        created: "createdAt",
        updated: "updatedAt",
        published: "publishedAt",
      };
      const field = fieldMap[dateField];
      filter[field] = { ...(fromDate ? { $gte: fromDate } : {}), ...(toDate ? { $lte: toDate } : {}) };
    }

    const projection: any = {
      title: 1,
      slug: 1,
      excerpt: 1,
      status: 1,
      publishedAt: 1,
      bannerImage: 1,
      author: 1,
      categoryIds: 1,
      readingTimeMinutes: 1,
      viewCount: 1,
      lastEditedBy: 1,
      lastEditedAt: 1,
      createdAt: 1,
      updatedAt: 1,
    };
    if (includeBody) projection.body = 1;

    const total = await BlogPostModel.countDocuments(filter);

    let query = BlogPostModel.find(filter)
      .sort({ [sortBy]: sortDir })
      .skip(skip)
      .limit(limit)
      .select(projection);

    // Comments are separate collection: includeComments could mean "include commentsCount" or actual list.
    // We'll keep it simple: if includeComments, attach latest comments via an extra query per item is expensive.
    // So: ignore includeComments for now, or implement a commentsCount aggregation later.
    if (includeCategories) query = query.populate({ path: "categoryIds", model: "BlogCategory" });

    const docs = await query.lean();

    const items = docs.map((d: any) => {
      const base = includeBody || includeCategories ? { ...d } : mapPostToAdminListItem(d);
      (base as any).id = d?._id?.toString?.() ?? d?.id ?? "";

      if (includeCategories && Array.isArray((base as any).categoryIds)) {
        (base as any).categories = (base as any).categoryIds.map((c: any) => ({
          id: c?._id?.toString?.() ?? c?.id ?? "",
          name: c?.name,
          slug: c?.slug,
          description: c?.description,
          createdAt: c?.createdAt,
          updatedAt: c?.updatedAt,
        }));
        (base as any).categoryIds = (base as any).categoryIds.map((c: any) => c?._id?.toString?.() ?? String(c));
      }

      return base;
    });

    const meta = buildMeta({
      page,
      pageSize: limit,
      total,
      sortBy,
      sortDir,
      filters: {
        q: q ?? null,
        status: status ?? null,
        publishedOnly,
        categoryId: categoryId ?? null,
        authorId: authorId ?? null,
        dateField,
        from: fromRaw,
        to: toRaw,
        includeBody,
        includeComments,
        includeCategories,
      },
    });

    return successResponse(200, "Blog posts list", { items, meta });
  } catch (error) {
    return errorResponse(error);
  }
};

/* -------------------------------------------------------------------------- */
/* POST /api/v1/admin/blog                                                    */
/* -------------------------------------------------------------------------- */

type PostBody = {
  title: string;
  slug?: string;
  excerpt?: string | null;

  content?: any;
  body?: BlockNoteDocJSON;

  bannerImage?: IFileAsset;
  categoryIds?: string[];

  status?: EBlogStatus;
  publishedAt?: string | Date | null;
};

export const POST = async (req: NextRequest) => {
  let rollback: (() => Promise<void>) | null = null;

  try {
    await connectDB();
    const user = await guard();

    const body = await parseJsonBody<PostBody>(req);

    const title = trim(body?.title);
    if (!title) return errorResponse(400, "title is required");

    const incomingDoc = (body?.body ?? body?.content) as BlockNoteDocJSON;
    if (!incomingDoc || typeof incomingDoc !== "object") {
      return errorResponse(400, "content/body (BlockNote JSON) is required");
    }

    const requestedSlug = trim(body?.slug);
    const slug = requestedSlug ? await ensureUniqueSlug(requestedSlug) : await ensureUniqueSlug(title);

    const status: EBlogStatus = body?.status ?? EBlogStatus.DRAFT;

    // parse publishedAt if supplied
    let publishedAt: Date | undefined;
    if (body?.publishedAt) {
      const d = new Date(body.publishedAt);
      if (isNaN(d.getTime())) return errorResponse(400, "publishedAt must be a valid date");
      publishedAt = d;
    }

    // enforce invariants here
    publishedAt = normalizePublishFields(status, publishedAt);

    const author: IBlogAuthor = { id: user.id, name: user.name, email: user.email };

    const categoryIds = Array.isArray(body?.categoryIds) ? body.categoryIds.map((x) => String(x)).filter(Boolean) : undefined;
    if (categoryIds?.length) {
      const count = await BlogCategoryModel.countDocuments({ _id: { $in: categoryIds } });
      if (count !== categoryIds.length) return errorResponse(400, "One or more categoryIds are invalid");
    }

    const now = new Date();

    const post = new BlogPostModel({
      title,
      slug,
      excerpt: trim(body?.excerpt ?? undefined),

      body: incomingDoc,
      bannerImage: body?.bannerImage,

      author,
      categoryIds: categoryIds?.length ? categoryIds : undefined,

      status,
      publishedAt,

      readingTimeMinutes: 1, // overwritten below
      viewCount: 0,

      lastEditedBy: author,
      lastEditedAt: now,
      createdAt: now,
      updatedAt: now,
    } as Partial<IBlogPost>);

    const postId = post._id.toString();

    const finalized = await finalizeBlogPostAssetsAllOrNothing({
      postId,
      body: incomingDoc,
      bannerImage: post.bannerImage,
    });

    rollback = finalized.rollback;

    post.body = finalized.body;
    post.bannerImage = finalized.bannerImage;

    post.readingTimeMinutes = calcReadingTimeMinutesFromBlockNote(post.body);

    await post.validate();
    await post.save();

    const obj = post.toObject({ virtuals: true, getters: true });

    return successResponse(201, "Blog post created", {
      blogPost: { ...obj, id: (obj as any)?._id?.toString?.() ?? postId },
      assetsFinalizedCount: finalized.movedCount,
    });
  } catch (error) {
    if (rollback) await rollback();
    return errorResponse(error);
  }
};

/* -------------------------------------------------------------------------- */
/* DELETE /api/v1/admin/blog (bulk delete)                                    */
/* -------------------------------------------------------------------------- */

type BulkDeleteBody = { ids: string[] };

export const DELETE = async (req: NextRequest) => {
  try {
    await connectDB();
    await guard();

    const body = await parseJsonBody<BulkDeleteBody>(req);
    const ids = Array.isArray(body?.ids) ? body.ids.map((x) => String(x)).filter(Boolean) : [];
    if (!ids.length) return errorResponse(400, "ids is required (non-empty array)");

    // Load posts (for asset cleanup)
    const posts = await BlogPostModel.find({ _id: { $in: ids } })
      .select({ body: 1, bannerImage: 1 })
      .lean();

    // Delete posts + comments
    const resPosts = await BlogPostModel.deleteMany({ _id: { $in: ids } });
    await BlogCommentModel.deleteMany({ blogPostId: { $in: ids } });

    // Best-effort S3 delete
    for (const p of posts) {
      try {
        await deleteAllBlogPostAssets({ body: (p as any).body, bannerImage: (p as any).bannerImage });
      } catch (e) {
        console.warn("Failed to delete assets for post:", (p as any)?._id?.toString?.(), e);
      }
    }

    return successResponse(200, "Blog posts deleted", {
      requested: ids.length,
      deleted: resPosts.deletedCount ?? 0,
    });
  } catch (error) {
    return errorResponse(error);
  }
};
