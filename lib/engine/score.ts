import type {
  CommitmentId,
  ExperienceId,
  FormatId,
  MoodId,
  PlatformId,
  QuizAnswers,
  ScoreBreakdown,
  Title,
} from "@/lib/types";

const WEIGHTS = {
  mood: 40,
  format: 12,
  commitment: 13,
  experience: 10,
  weirdness: 8,
  rating: 12,
  streaming: 5,
} as const;

export function scoreTitle(
  title: Title,
  answers: QuizAnswers,
  availableOn: PlatformId[],
  availabilityKnown: boolean,
): ScoreBreakdown {
  const mood = moodScore(title, answers.moods);
  const format = formatScore(title, answers.format);
  const commitment = commitmentScore(title, answers.commitment, answers.format);
  const experience = experienceScore(title, answers.experience);
  const weirdness = weirdnessScore(title, answers.weirdness);
  const rating = ratingScore(title, answers.experience);
  const streaming = streamingScore(
    availableOn,
    availabilityKnown,
    answers.platforms,
  );

  const total =
    mood * WEIGHTS.mood +
    format * WEIGHTS.format +
    commitment * WEIGHTS.commitment +
    experience * WEIGHTS.experience +
    weirdness * WEIGHTS.weirdness +
    rating * WEIGHTS.rating +
    streaming * WEIGHTS.streaming;

  return {
    mood,
    format,
    commitment,
    experience,
    weirdness,
    rating,
    streaming,
    total,
  };
}

export function moodScore(title: Title, moods: MoodId[]) {
  const selected = moods.filter((m) => m !== "surprise");
  if (!selected.length) return 0.72;

  const hits = selected.filter((mood) => title.moods.includes(mood));
  if (!hits.length) return 0;

  const coverage = hits.length / selected.length;
  const extra = Math.min(0.2, (hits.length - 1) * 0.08);
  const primary = selected.some((mood) => title.moods.slice(0, 2).includes(mood))
    ? 0.14
    : 0;
  return Math.min(1, 0.52 + coverage * 0.4 + extra + primary);
}

export function formatScore(title: Title, format: FormatId) {
  if (format === "anything") return 0.85;
  if (format === title.type) return 1;
  if (format === "tv" && title.type === "documentary" && title.episodes) {
    return 0.45;
  }
  if (format === "movie" && title.type === "documentary" && !title.episodes) {
    return 0.4;
  }
  return 0;
}

function isShortSeries(title: Title) {
  if (title.type !== "tv" && !(title.type === "documentary" && title.episodes)) {
    return false;
  }
  if (title.tags.includes("short")) return true;
  if (title.seasons === 1 && (title.episodes ?? 99) <= 10) return true;
  return (title.episodes ?? 99) <= 8;
}

function isLongCommitment(title: Title) {
  if (title.tags.includes("long")) return true;
  if (title.type === "movie") return title.runtimeMinutes >= 165;
  return (title.seasons ?? 0) >= 4 || (title.episodes ?? 0) >= 30;
}

export function commitmentScore(
  title: Title,
  commitment: CommitmentId,
  format: FormatId,
) {
  if (commitment === "any") return 0.8;

  if (commitment === "under2h") {
    if (title.type === "movie" || (title.type === "documentary" && !title.episodes)) {
      if (title.runtimeMinutes <= 125) return 1;
      if (title.runtimeMinutes <= 135) return 0.55;
      return 0.08;
    }
    return isShortSeries(title) ? 0.95 : 0.12;
  }

  if (commitment === "movieNight") {
    if (title.type === "movie" || (title.type === "documentary" && !title.episodes)) {
      if (title.runtimeMinutes >= 90 && title.runtimeMinutes <= 180) return 1;
      return 0.45;
    }
    if (isShortSeries(title)) return 0.9;
    if ((title.episodes ?? 0) <= 16) return 0.55;
    return 0.2;
  }

  if (commitment === "fewEpisodes") {
    if (title.type === "movie") return format === "anything" ? 0.55 : 0.25;
    if (isShortSeries(title)) return 1;
    if ((title.episodes ?? 99) <= 16) return 0.85;
    return 0.15;
  }

  if (commitment === "weekend") {
    return isLongCommitment(title) ? 1 : 0.22;
  }

  return 0.5;
}

export function experienceScore(title: Title, experience: ExperienceId) {
  if (experience === "any") return 0.7;

  if (experience === "highlyRated") {
    if (title.rating >= 9) return 1;
    if (title.rating >= 8.5) return 0.9;
    if (title.rating >= 8.2) return 0.7;
    return 0.25;
  }

  if (experience === "hiddenGem") {
    const gemTag = title.tags.includes("hidden-gem") ? 0.35 : 0;
    const lowPop = title.popularity < 70 ? 0.4 : 0.1;
    const lowVotes = title.votes < 400000 ? 0.25 : 0.05;
    return Math.min(1, gemTag + lowPop + lowVotes);
  }

  if (experience === "popular") {
    const tag = title.tags.includes("popular") ? 0.35 : 0.1;
    return Math.min(1, tag + title.popularity / 140);
  }

  if (experience === "classic") {
    if (title.tags.includes("classic") || title.year < 2000) return 1;
    if (title.year < 2008) return 0.45;
    return 0.08;
  }

  if (experience === "recent") {
    if (title.tags.includes("recent") || title.year >= 2018) return 1;
    if (title.year >= 2014) return 0.4;
    return 0.06;
  }

  return 0.5;
}

export function weirdnessScore(title: Title, userWeird: number) {
  const closeness = 1 - Math.abs(userWeird - title.weirdness) / 100;
  if (userWeird <= 25) {
    const mainstream = (100 - title.weirdness) / 100;
    return closeness * 0.45 + mainstream * 0.55;
  }
  if (userWeird >= 75) {
    return closeness * 0.4 + (title.weirdness / 100) * 0.6;
  }
  return closeness;
}

export function ratingScore(title: Title, experience: ExperienceId) {
  const normalized = clamp((title.rating - 7.0) / 2.5, 0, 1);
  if (experience === "hiddenGem") return normalized * 0.65 + 0.2;
  if (experience === "highlyRated") return normalized;
  return normalized * 0.85 + 0.1;
}

export function streamingScore(
  availableOn: PlatformId[],
  known: boolean,
  selected: PlatformId[],
) {
  const cares = selected.length > 0 && !selected.includes("any");
  if (!cares) return 0.55;
  if (!known) return 0.4;
  const overlap = availableOn.some((p) => selected.includes(p));
  return overlap ? 1 : 0.12;
}

export function matchesFormat(title: Title, format: FormatId) {
  return formatScore(title, format) >= 0.85;
}

export function hasMoodOverlap(title: Title, moods: MoodId[]) {
  const selected = moods.filter((m) => m !== "surprise");
  if (!selected.length) return true;
  return selected.some((mood) => title.moods.includes(mood));
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
