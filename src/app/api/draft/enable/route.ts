import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const redirect = request.nextUrl.searchParams.get("redirect") || "/";
  if (!process.env.SANITY_API_READ_TOKEN || secret !== process.env.SANITY_REVALIDATE_SECRET) return new NextResponse("Neispravan token", { status: 401 });
  (await draftMode()).enable();
  return NextResponse.redirect(new URL(redirect.startsWith("/") ? redirect : "/", request.url));
}
