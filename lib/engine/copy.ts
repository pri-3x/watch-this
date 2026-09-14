import { moodOptions, platformLabel } from "@/lib/quiz/options";
import type {
  QuizAnswers,
  RankedRecommendation,
  RegionId,
  ScoreBreakdown,
  Title,
} from "@/lib/types";

export const rankMeta: Record<1 | 2 | 3 | 4 | 5, { label: string }> = {
  1: { label: "You should absolutely watch this" },
  2: { label: "Very strong choice" },
  3: { label: "You'd probably love this" },
  4: { label: "Wild card" },
  5: { label: "Hear me out" },
};

export function buildPitch(
  title: Title,
  answers: QuizAnswers,
  rank: 1 | 2 | 3 | 4 | 5,
): string {
  const moods = answers.moods.filter((m) => m !== "surprise");
  const moodBits = moods
    .slice(0, 2)
    .map((id) => moodOptions.find((m) => m.id === id)?.label.toLowerCase())
    .filter((label): label is string => Boolean(label));

  if (rank === 1) {
    if (moodBits.length) {
      return `You said you wanted ${joinAnd(moodBits)}. ${title.hook} That's the cheat code.`;
    }
    return `${title.hook} If you only watch one thing, make it this.`;
  }

  if (rank === 4) {
    return `${title.hook} A little sideways from your brief — in a good way.`;
  }

  if (rank === 5) {
    return `${title.hook} Not the obvious pick. That's the point.`;
  }

  if (answers.commitment === "under2h" && title.runtimeMinutes <= 120) {
    return `${title.hook} And it respects your evening.`;
  }

  return title.hook;
}

export function buildWhy(
  title: Title,
  answers: QuizAnswers,
  score: ScoreBreakdown,
  onUserPlatforms: boolean,
): string {
  const parts: string[] = [];
  const moodLabels = answers.moods
    .filter((m) => m !== "surprise")
    .map((id) => moodOptions.find((m) => m.id === id)?.label)
    .filter((label): label is string => Boolean(label));

  const picked = [
    moodLabels.length ? moodLabels.join(" + ") : "Surprise me",
    formatWord(answers.format),
    commitmentWord(answers.commitment, answers.format),
    experienceWord(answers.experience),
  ];

  parts.push(`You picked: ${picked.join(" + ")}.`);

  const reasons: string[] = [];
  if (score.mood >= 0.7 && moodLabels.length) {
    reasons.push("it matches the vibe you asked for");
  }
  if (score.commitment >= 0.8 && answers.commitment !== "any") {
    reasons.push("the runtime actually fits");
  }
  if (score.experience >= 0.75 && answers.experience !== "any") {
    reasons.push("it hits the kind of experience you wanted");
  }
  reasons.push(`it carries a ${title.rating.toFixed(1)} IMDb rating`);
  if (onUserPlatforms) {
    reasons.push("and it's on a service you already pay for");
  }

  parts.push(`This scored highly because ${joinAnd(reasons)}.`);
  return parts.join(" ");
}

export function toRecommendation(
  title: Title,
  answers: QuizAnswers,
  score: ScoreBreakdown,
  rank: 1 | 2 | 3 | 4 | 5,
  platforms: import("@/lib/types").PlatformId[],
  availabilityKnown: boolean,
  onUserPlatforms: boolean,
): RankedRecommendation {
  const meta = rankMeta[rank];
  return {
    title,
    rank,
    rankLabel: meta.label,
    pitch: buildPitch(title, answers, rank),
    why: buildWhy(title, answers, score, onUserPlatforms),
    score,
    platforms,
    availabilityKnown,
    onUserPlatforms,
  };
}

export function userPlatformsSelected(answers: QuizAnswers) {
  return answers.platforms.length > 0 && !answers.platforms.includes("any");
}

const JUSTWATCH_REGION: Record<RegionId, string> = {
  IN: "in",
  US: "us",
  GB: "uk",
  CA: "ca",
  AU: "au",
};

export function justWatchUrl(title: Title, region: RegionId) {
  const slug = JUSTWATCH_REGION[region];
  return `https://www.justwatch.com/${slug}/search?q=${encodeURIComponent(title.title)}`;
}

export function platformNames(platforms: import("@/lib/types").PlatformId[]) {
  return platforms
    .filter((p) => p !== "any")
    .map((p) => platformLabel[p]);
}

function formatWord(format: QuizAnswers["format"]) {
  if (format === "movie") return "Movie";
  if (format === "tv") return "TV series";
  if (format === "documentary") return "Documentary";
  return "Anything";
}

function commitmentWord(
  commitment: QuizAnswers["commitment"],
  format: QuizAnswers["format"],
) {
  if (commitment === "under2h") {
    return format === "tv" ? "Short series" : "Under 2 hours";
  }
  if (commitment === "movieNight") return "Movie night";
  if (commitment === "fewEpisodes") return "A few episodes";
  if (commitment === "weekend") return "Weekend binge";
  return "Any length";
}

function experienceWord(experience: QuizAnswers["experience"]) {
  if (experience === "highlyRated") return "Highly rated";
  if (experience === "hiddenGem") return "Hidden gem";
  if (experience === "popular") return "Popular";
  if (experience === "classic") return "Classic";
  if (experience === "recent") return "Recent";
  return "Any era";
}

function joinAnd(items: string[]) {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
