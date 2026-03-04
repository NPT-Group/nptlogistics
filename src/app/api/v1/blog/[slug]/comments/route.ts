// src/app/api/v1/blog/[slug]/comments/route.ts
import { NextRequest } from "next/server";
import connectDB from "@/lib/utils/connectDB";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { parseJsonBody } from "@/lib/utils/reqParser";
import { parsePagination, parseSort, buildMeta } from "@/lib/utils/queryUtils";
import { trim, lowerTrim } from "@/lib/utils/stringUtils";

import { BlogPostModel } from "@/mongoose/models/BlogPost";
import { BlogCommentModel } from "@/mongoose/models/BlogComment";
import { EBlogStatus } from "@/types/blogPost.types";

type CreateCommentBody = {
  name: string;
  email?: string | null;
  comment: string;
};

async function getPublishedPostIdBySlug(slug: string): Promise<string | null> {
  const post = await BlogPostModel.findOne({ slug, status: EBlogStatus.PUBLISHED })
    .select({ _id: 1 })
    .lean();

  return post?._id?.toString?.() ?? null;
}

export const GET = async (req: NextRequest, ctx: { params: Promise<{ slug: string }> }) => {
  try {
    await connectDB();

    const { slug } = await ctx.params;

    const postId = await getPublishedPostIdBySlug(slug);
    if (!postId) return errorResponse(404, "Blog post not found");

    const url = new URL(req.url);
    const sp = url.searchParams;

    const { page, limit, skip } = parsePagination(sp.get("page"), sp.get("pageSize"), 200);
    const allowedSortKeys = ["createdAt"] as const;
    const { sortBy, sortDir } = parseSort(
      sp.get("sortBy"),
      sp.get("sortDir"),
      allowedSortKeys,
      "createdAt",
    );

    const filter = { blogPostId: postId };
    const total = await BlogCommentModel.countDocuments(filter);

    const docs = await BlogCommentModel.find(filter)
      .sort({ [sortBy]: sortDir })
      .skip(skip)
      .limit(limit)
      .select({ blogPostId: 1, name: 1, email: 1, comment: 1, createdAt: 1 })
      .lean();

    const items = docs.map((d: any) => ({
      id: d?._id?.toString?.() ?? "",
      blogPostId: d?.blogPostId?.toString?.() ?? String(d?.blogPostId ?? ""),
      name: d?.name,
      email: d?.email ?? undefined,
      comment: d?.comment,
      createdAt: d?.createdAt,
    }));

    const meta = buildMeta({
      page,
      pageSize: limit,
      total,
      sortBy,
      sortDir,
      filters: { slug, postId },
    });

    return successResponse(200, "Blog comments", { items, meta });
  } catch (error) {
    return errorResponse(error);
  }
};

export const POST = async (req: NextRequest, ctx: { params: Promise<{ slug: string }> }) => {
  try {
    await connectDB();

    const { slug } = await ctx.params;

    const postId = await getPublishedPostIdBySlug(slug);
    if (!postId) return errorResponse(404, "Blog post not found");

    const body = await parseJsonBody<CreateCommentBody>(req);

    const name = trim(body?.name);
    const comment = trim(body?.comment);
    const email = lowerTrim(body?.email ?? undefined);

    if (!name) return errorResponse(400, "name is required");
    if (!comment) return errorResponse(400, "comment is required");

    const created = await BlogCommentModel.create({
      blogPostId: postId,
      name,
      email,
      comment,
    });

    const obj = created.toObject({ virtuals: true, getters: true });

    return successResponse(201, "Comment created", {
      comment: { ...obj, id: (obj as any)?._id?.toString?.() ?? "" },
    });
  } catch (error) {
    return errorResponse(error);
  }
};
