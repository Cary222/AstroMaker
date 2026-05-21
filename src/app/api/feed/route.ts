import { NextRequest, NextResponse } from "next/server";
import { getFeedPosts } from "@/actions/feed";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tab = (searchParams.get("tab") as "hot" | "following" | "latest") || "latest";
  const cursor = searchParams.get("cursor") || undefined;
  const categorySlug = searchParams.get("category") || undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

  try {
    const result = await getFeedPosts({ tab, cursor, categorySlug, limit });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
