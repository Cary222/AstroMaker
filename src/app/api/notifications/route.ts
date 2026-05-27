import { NextRequest, NextResponse } from "next/server";
import { getNotificationsAction } from "@/actions/notification";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const cursor = searchParams.get("cursor") || undefined;

  try {
    const result = await getNotificationsAction({ cursor });
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
