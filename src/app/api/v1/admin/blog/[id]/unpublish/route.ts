// src/app/api/v1/admin/blog/[id]/unpublish/route.ts
import { NextRequest } from "next/server";
import connectDB from "@/lib/utils/connectDB";
import { guard } from "@/lib/utils/auth/authUtils";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";

import { BlogPostModel } from "@/mongoose/models/BlogPost";
import { EBlogStatus } from "@/types/blogPost.types";
import type { IBlogAuthor } from "@/types/blogPost.types";

export const POST = async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();
    const user = await guard();

    const { id } = await ctx.params;
    const post = await BlogPostModel.findById(id);
    if (!post) return errorResponse(404, "Blog post not found");

    // Unpublish => draft (and MUST clear publishedAt)
    (post as any).status = EBlogStatus.DRAFT;
    (post as any).publishedAt = undefined;

    const editor: IBlogAuthor = { id: user.id, name: user.name, email: user.email };
    (post as any).lastEditedBy = editor as any;
    (post as any).lastEditedAt = new Date();
    (post as any).updatedAt = new Date();

    await post.save();

    return successResponse(200, "Blog post unpublished", { id, status: (post as any).status, publishedAt: null });
  } catch (error) {
    return errorResponse(error);
  }
};
