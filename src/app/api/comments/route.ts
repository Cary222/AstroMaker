import { NextRequest, NextResponse } from "next/server";
import { getCommentsAction } from "@/actions/comment-actions";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const postId = searchParams.get("postId");
  const cursor = searchParams.get("cursor") || undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

  if (!postId) {
    return NextResponse.json({ error: "postId required" }, { status: 400 });
  }

  try {
    const result = await getCommentsAction({ postId, cursor, limit });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
