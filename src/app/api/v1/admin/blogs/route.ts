import { successResponse } from "@/lib/utils/apiResponse";

export async function GET() {
  return successResponse(200, "Admin blogs route", { blogs: [] });
}
