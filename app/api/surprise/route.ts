import { surprisePick } from "@/lib/engine/recommend";
import { sanitizeAnswers } from "@/lib/quiz/encode";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      answers?: Record<string, unknown>;
      excludeIds?: string[];
    };
    const answers = sanitizeAnswers(body.answers);
    const result = await surprisePick(answers, body.excludeIds ?? []);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "The dice rolled under the couch." },
      { status: 500 },
    );
  }
}
