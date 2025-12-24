import { sanitizeApiParam } from "@/app/lib/common-utils";
import { runAxe } from "@/app/lib/result-utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET (request: NextRequest) {
  try {
    const nextUrl = request.nextUrl;
    const siteUrl = nextUrl.searchParams.get("url");
    if (!siteUrl) {
      return NextResponse.json({ message: 'URL is required'}, { status: 400 });
    }
    const sanitizedSiteUrl = sanitizeApiParam(siteUrl);
    const response = await fetch(sanitizedSiteUrl, {
      headers: {
        "User-Agent": "a11y-screener/1.0",
      },
    });
    const html = await response.text();
    const results = await runAxe(html);
    // console.log(results)
    return Response.json({ results });
  } catch (error) {
    let errorMessage = "Something went wrong";
    if (typeof error === "string") {
      errorMessage = error;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}