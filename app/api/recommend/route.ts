import { recommend } from "@/lib/engine/recommend";
import { sanitizeAnswers } from "@/lib/quiz/encode";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const answers = sanitizeAnswers(
      typeof body === "object" && body !== null
        ? (body as Record<string, unknown>)
        : {},
    );
    const result = await recommend(answers);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Our crystal ball cracked. Try again." },
      { status: 500 },
    );
  }
}
