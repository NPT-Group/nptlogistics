// src/app/api/v1/admin/blog/[id]/archive/route.ts
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

    // Archive keeps publishedAt (historical)
    (post as any).status = EBlogStatus.ARCHIVED;

    const editor: IBlogAuthor = { id: user.id, name: user.name, email: user.email };
    (post as any).lastEditedBy = editor as any;
    (post as any).lastEditedAt = new Date();
    (post as any).updatedAt = new Date();

    await post.save();

    return successResponse(200, "Blog post archived", { id, status: (post as any).status, publishedAt: (post as any).publishedAt ?? null });
  } catch (error) {
    return errorResponse(error);
  }
};
