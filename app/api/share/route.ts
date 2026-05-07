import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => ({}))) as { id?: string };

  if (!payload.id) {
    return NextResponse.json({ error: "An id is required." }, { status: 400 });
  }

  return NextResponse.json({ shareUrl: `/results/${encodeURIComponent(payload.id)}` });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "An id is required." }, { status: 400 });
  }

  return NextResponse.json({ shareUrl: `/results/${encodeURIComponent(id)}` });
}