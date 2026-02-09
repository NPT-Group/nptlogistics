// Route: POST /api/v1/admin/blog/:id/publish
import { NextRequest } from "next/server";
import connectDB from "@/lib/utils/connectDB";
import { guard } from "@/lib/utils/auth/authUtils";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { parseJsonBody } from "@/lib/utils/reqParser";

import { BlogPostModel } from "@/mongoose/models/BlogPost";
import { EBlogStatus } from "@/types/blogPost.types";
import type { IBlogAuthor } from "@/types/blogPost.types";
import { normalizePublishFields } from "@/lib/utils/blog/blogPostUtils";

type Body = {
  publishedAt?: string | Date | null;
};

export const POST = async (req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();
    const user = await guard();

    const { id } = await ctx.params;
    const post = await BlogPostModel.findById(id);
    if (!post) return errorResponse(404, "Blog post not found");

    let nextPublishedAt: Date | undefined = (post as any).publishedAt ?? undefined;

    // Accept optional body; allow empty body too
    let body: Body | null = null;
    try {
      body = await parseJsonBody<Body>(req);
    } catch {
      body = null;
    }

    if (body?.publishedAt !== undefined) {
      if (body.publishedAt === null) {
        nextPublishedAt = undefined;
      } else {
        const d = new Date(body.publishedAt as any);
        if (isNaN(d.getTime())) return errorResponse(400, "publishedAt must be a valid date");
        nextPublishedAt = d;
      }
    }

    (post as any).status = EBlogStatus.PUBLISHED;
    (post as any).publishedAt = normalizePublishFields(EBlogStatus.PUBLISHED, nextPublishedAt);

    const editor: IBlogAuthor = { id: user.id, name: user.name, email: user.email };
    (post as any).lastEditedBy = editor as any;
    (post as any).lastEditedAt = new Date();
    (post as any).updatedAt = new Date();

    await post.save();

    return successResponse(200, "Blog post published", {
      id,
      status: (post as any).status,
      publishedAt: (post as any).publishedAt,
    });
  } catch (error) {
    return errorResponse(error);
  }
};
