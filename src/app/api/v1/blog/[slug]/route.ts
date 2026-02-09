// src/app/api/v1/blog/[slug]/route.ts
import { NextRequest } from "next/server";
import connectDB from "@/lib/utils/connectDB";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { BlogPostModel } from "@/mongoose/models/BlogPost";
import { EBlogStatus } from "@/types/blogPost.types";

export const GET = async (_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) => {
  try {
    await connectDB();

    const { slug } = await ctx.params;
    const post = await BlogPostModel.findOne({ slug, status: EBlogStatus.PUBLISHED }).lean();
    if (!post) return errorResponse(404, "Blog post not found");

    return successResponse(200, "Blog post", {
      blogPost: { ...post, id: (post as any)?._id?.toString?.() ?? "" },
    });
  } catch (error) {
    return errorResponse(error);
  }
};
