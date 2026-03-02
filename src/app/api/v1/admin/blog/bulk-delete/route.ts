import { NextRequest } from "next/server";

import connectDB from "@/lib/utils/connectDB";
import { guard } from "@/lib/utils/auth/authUtils";
import { errorResponse, successResponse } from "@/lib/utils/apiResponse";
import { parseJsonBody } from "@/lib/utils/reqParser";

import { BlogPostModel } from "@/mongoose/models/BlogPost";
import { BlogCommentModel } from "@/mongoose/models/BlogComment";

import { isTempKey, collectS3KeysDeep } from "@/lib/utils/s3Helper";
import { deleteS3Objects } from "@/lib/utils/s3Helper/server";

type Body = {
  ids: string[];
};

export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    await guard();

    const body = await parseJsonBody<Body>(req);

    const ids = Array.isArray(body?.ids) ? body.ids.map(String).filter(Boolean) : [];
    if (!ids.length) return errorResponse(400, "ids is required (non-empty array)");

    // Load posts first so we can clean S3 assets best-effort
    const posts = await BlogPostModel.find({ _id: { $in: ids } })
      .select({ bannerImage: 1, body: 1 })
      .lean();

    // Collect referenced S3 keys (final only)
    const keysToDelete = new Set<string>();
    for (const p of posts) {
      for (const k of collectS3KeysDeep({
        bannerImage: (p as any).bannerImage,
        body: (p as any).body,
      })) {
        if (!isTempKey(k)) keysToDelete.add(k);
      }
    }

    // Delete posts + their comments
    const postDel = await BlogPostModel.deleteMany({ _id: { $in: ids } });
    const commentDel = await BlogCommentModel.deleteMany({ blogPostId: { $in: ids } });

    // Best-effort S3 cleanup AFTER DB deletion (you can invert order if you prefer)
    await deleteS3Objects(Array.from(keysToDelete));

    return successResponse(200, "Blog posts deleted", {
      requested: ids.length,
      postsDeleted: postDel.deletedCount ?? 0,
      commentsDeleted: commentDel.deletedCount ?? 0,
      s3KeysDeleted: keysToDelete.size,
    });
  } catch (error) {
    return errorResponse(error);
  }
};
