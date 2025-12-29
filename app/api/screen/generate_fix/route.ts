import { NextRequest, NextResponse } from "next/server";
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { generateMessages } from "@/app/api/screen/llm_utils";
import { schema } from "@/app/api/screen/schema";

export async function POST(request: NextRequest) {
  try {
    const { issueDescription, affectedHtml } = await request.json();
    console.log('affectedHtml', affectedHtml);
    if (affectedHtml) {
      const model = google('gemini-2.5-flash');
      const messages = generateMessages({ VIOLATION_DESCRIPTION: issueDescription, VIOLATING_HTML_CODE: affectedHtml });
      console.time();
      // return new Promise(resolve => setTimeout(resolve, 2000));
      const object = await generateObject({ model, messages, schema, temperature: 0, topP: 1 });
      console.timeEnd();
      return object.toJsonResponse();
    }
  }
  catch (error) {
    let errorMessage = 'Something went wrong';
    if (typeof error === "string") {
      errorMessage = error;
    }
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    )
  }
}