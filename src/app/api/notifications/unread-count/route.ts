import { NextResponse } from "next/server";
import { getUnreadCountAction } from "@/actions/notification";

export async function GET() {
  try {
    const result = await getUnreadCountAction();
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
