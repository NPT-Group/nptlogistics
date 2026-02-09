// src/app/api/v1/admin/blog/comments/[id]/route.ts
import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { guard } from "@/lib/utils/auth/authUtils";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { BlogCommentModel } from "@/mongoose/models/BlogComment";

export const DELETE = async (_req: NextRequest, ctx: { params: Promise<{ id: string }> }) => {
  try {
    await connectDB();
    await guard();

    const { id } = await ctx.params;
    if (!id) return errorResponse(400, "Missing comment id");

    const deleted = await BlogCommentModel.findByIdAndDelete(id).lean();
    if (!deleted) return errorResponse(404, "Comment not found");

    return successResponse(200, "Comment deleted", { id });
  } catch (error) {
    return errorResponse(error);
  }
};
