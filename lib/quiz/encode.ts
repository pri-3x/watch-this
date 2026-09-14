import { defaultAnswers } from "@/lib/quiz/options";
import type { MoodId, PlatformId, QuizAnswers } from "@/lib/types";
import {
  COMMITMENTS,
  EXPERIENCES,
  FORMATS,
  MOODS,
  PLATFORMS,
  REGIONS,
} from "@/lib/types";

const isIn = <T extends string>(list: readonly T[], value: unknown): value is T =>
  typeof value === "string" && (list as readonly string[]).includes(value);

export function encodeAnswers(answers: QuizAnswers): string {
  const raw = JSON.stringify(answers);
  return Buffer.from(raw, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function encodeAnswersBrowser(answers: QuizAnswers): string {
  const raw = JSON.stringify(answers);
  const b64 =
    typeof window === "undefined"
      ? Buffer.from(raw, "utf8").toString("base64")
      : btoa(raw);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function decodeAnswers(token: string): QuizAnswers | null {
  try {
    const padded = token.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof window === "undefined"
        ? Buffer.from(padded, "base64").toString("utf8")
        : atob(padded);
    const parsed = JSON.parse(json) as Partial<QuizAnswers>;
    return sanitizeAnswers(parsed);
  } catch {
    return null;
  }
}

export function sanitizeAnswers(input: Partial<QuizAnswers> | null | undefined): QuizAnswers {
  const fallback = defaultAnswers();
  const moods = Array.isArray(input?.moods)
    ? input.moods.filter((m): m is MoodId => isIn(MOODS, m))
    : [];

  return {
    moods: moods.length ? moods : ["surprise"],
    format: isIn(FORMATS, input?.format) ? input.format : fallback.format,
    commitment: isIn(COMMITMENTS, input?.commitment)
      ? input.commitment
      : fallback.commitment,
    experience: isIn(EXPERIENCES, input?.experience)
      ? input.experience
      : fallback.experience,
    weirdness: clampWeird(input?.weirdness),
    platforms: Array.isArray(input?.platforms)
      ? input.platforms.filter((p): p is PlatformId => isIn(PLATFORMS, p))
      : fallback.platforms,
    region: isIn(REGIONS, input?.region) ? input.region : fallback.region,
  };
}

function clampWeird(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return 35;
  return Math.max(0, Math.min(100, Math.round(n)));
}
