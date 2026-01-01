import { runAxe, sanitizeApiParam } from "@/app/lib/result-utils";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NormalizedAxeResult } from "@/app/models/screen-results";

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
      cache: 'force-cache',
      next: { revalidate: 3600 }
    });
    const html = await response.text();
    const results = await runAxe(html);
    return Response.json({ results });
  } catch (error) {
    let errorMessage = "Something went wrong";
    if (typeof error === "string") {
      errorMessage = error;
    }
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
};

export async function POST(request: NextRequest) {
  try {
    const { results, authUser, url } = await request.json();
    const dbUserDetails = await prisma.user.findUnique({
      where: { email: authUser.email },
    });
    let dbUserId = dbUserDetails?.id;
    // If the user doesn't exist in DB, create the user in DB
    if (!dbUserId) {
      const newDbUser = await prisma.user.create({
        data: {
          name: authUser.name as string,
          email: authUser.email as string,
        },
      });
      dbUserId = newDbUser?.id;
    }
    const timestamp = Date.now();
    const newResult = await prisma.result.create({
      data: {
        timestamp,
        siteUrl: url,
        userId: dbUserId,
      },
    });
    results.forEach(async (result: NormalizedAxeResult) => {
      await prisma.violation.create({
        data: {
          title: result.title,
          helpUrl: result.helpUrl,
          description: result.description,
          severity: result.severity,
          wcag: result.wcag,
          affectedNodes: result.affectedNodes,
          resultId: newResult.id,
        },
      });
    });
    return NextResponse.json({ message: 'successfully saved results to DB' }, { status: 204 });
  } catch {
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}