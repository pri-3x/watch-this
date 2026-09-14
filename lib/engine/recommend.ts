import { getDataLayer } from "@/lib/data";
import { toRecommendation, userPlatformsSelected } from "@/lib/engine/copy";
import { hasMoodOverlap, matchesFormat, scoreTitle } from "@/lib/engine/score";
import type {
  QuizAnswers,
  RankedRecommendation,
  RecommendResult,
  SurpriseResult,
  Title,
} from "@/lib/types";

type Scored = {
  title: Title;
  score: ReturnType<typeof scoreTitle>;
  platforms: RankedRecommendation["platforms"];
  availabilityKnown: boolean;
  onUserPlatforms: boolean;
};

export async function recommend(answers: QuizAnswers): Promise<RecommendResult> {
  const { catalog, availability } = getDataLayer();
  const titles = await catalog.getTitles();
  const scored = await scoreAll(titles, answers);

  const wantsMood = answers.moods.some((m) => m !== "surprise");
  let loosened = false;
  let loosenNote: string | undefined;

  let pool = scored.filter((row) => matchesFormat(row.title, answers.format));

  if (wantsMood) {
    const moodPool = pool.filter((row) => hasMoodOverlap(row.title, answers.moods));
    if (moodPool.length >= 5) {
      pool = moodPool;
    } else {
      loosened = true;
      loosenNote =
        "Okay, you're being VERY specific. We couldn't find 5 perfect matches, so we loosened the mood rules a little.";
    }
  }

  if (pool.length < 5) {
    pool = scored;
    loosened = true;
    loosenNote =
      loosenNote ??
      "Your combo was spicy. We opened the catalog a bit so you still get five real options.";
  }

  const ranked = pickDiverse(sortPool(pool, answers), 5);
  const top = ranked.map((row, index) => {
    const rank = (index + 1) as 1 | 2 | 3 | 4 | 5;
    return toRecommendation(
      row.title,
      answers,
      row.score,
      rank,
      row.platforms,
      row.availabilityKnown,
      row.onUserPlatforms,
    );
  });

  return {
    picks: top,
    loosened,
    loosenNote,
    region: answers.region,
    availabilityIsLive: availability.isLive,
    dataMode: catalog.mode,
    platformFilterActive: userPlatformsSelected(answers),
  };
}

export async function surprisePick(
  answers: QuizAnswers,
  excludeIds: string[] = [],
): Promise<SurpriseResult> {
  const { catalog, availability } = getDataLayer();
  const titles = await catalog.getTitles();
  const scored = await scoreAll(titles, answers);
  const eligible = scored.filter((row) => !excludeIds.includes(row.title.id));
  const pool = (eligible.length ? eligible : scored).filter((row) => {
    if (answers.format !== "anything" && !matchesFormat(row.title, answers.format)) {
      return row.title.weirdness >= 40;
    }
    return true;
  });

  const pickRow = weightedSurprise(pool.length ? pool : scored, answers);
  const pick = toRecommendation(
    pickRow.title,
    answers,
    pickRow.score,
    1,
    pickRow.platforms,
    pickRow.availabilityKnown,
    pickRow.onUserPlatforms,
  );

  return {
    pick: {
      ...pick,
      rankLabel: "We refuse to overthink this",
      pitch: `${pickRow.title.hook} You asked to be surprised. Don't negotiate with yourself now.`,
    },
    region: answers.region,
    availabilityIsLive: availability.isLive,
    dataMode: catalog.mode,
  };
}

async function scoreAll(titles: Title[], answers: QuizAnswers): Promise<Scored[]> {
  const { availability } = getDataLayer();
  const cares = userPlatformsSelected(answers);

  return Promise.all(
    titles.map(async (title) => {
      const lookup = await availability.getAvailability(title.id, answers.region);
      const onUserPlatforms =
        cares &&
        lookup.known &&
        lookup.platforms.some((p) => answers.platforms.includes(p));
      return {
        title,
        score: scoreTitle(title, answers, lookup.platforms, lookup.known),
        platforms: lookup.platforms,
        availabilityKnown: lookup.known,
        onUserPlatforms,
      };
    }),
  );
}

const TITLE_CLUSTERS: Record<string, string> = {
  tt5491994: "nature-earth",
  tt0796366: "nature-earth",
  tt9204164: "nature-earth",
  tt2395427: "nature-earth",
  tt0167260: "lotr",
  tt0120737: "lotr",
  tt0903747: "gilligan",
  tt3032476: "gilligan",
};

function clusterOf(title: Title) {
  return TITLE_CLUSTERS[title.imdbId] ?? TITLE_CLUSTERS[title.id];
}

function titleTokens(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !["part", "season", "series"].includes(word));
}

function tooSimilar(a: Title, b: Title) {
  if (clusterOf(a) && clusterOf(a) === clusterOf(b)) return true;
  const left = titleTokens(a.title);
  const right = titleTokens(b.title);
  const shared = left.filter((word) => right.includes(word));
  if (shared.length >= 2) return true;
  if (
    shared.length === 1 &&
    a.type === b.type &&
    (shared[0] === "planet" || shared[0] === "earth")
  ) {
    return true;
  }
  const aStem = left.join(" ");
  const bStem = right.join(" ");
  return Boolean(aStem && bStem && (aStem.includes(bStem) || bStem.includes(aStem)));
}

function pickDiverse(ranked: Scored[], count: number) {
  const picked: Scored[] = [];
  const rest = [...ranked];

  while (picked.length < count && rest.length) {
    const index = rest.findIndex((row) =>
      picked.every((seen) => !tooSimilar(row.title, seen.title)),
    );
    const next = index === -1 ? 0 : index;
    picked.push(rest[next]);
    rest.splice(next, 1);
  }

  return picked;
}

function sortPool(pool: Scored[], answers: QuizAnswers) {
  const surpriseMode = answers.moods.includes("surprise") && answers.moods.length === 1;
  return [...pool].sort((a, b) => {
    if (surpriseMode) {
      const jitterA = seeded(a.title.id + answers.weirdness) * 6;
      const jitterB = seeded(b.title.id + answers.weirdness) * 6;
      return b.score.total + jitterB - (a.score.total + jitterA);
    }
    if (Math.abs(b.score.total - a.score.total) > 0.15) {
      return b.score.total - a.score.total;
    }
    return b.title.rating - a.title.rating;
  });
}

function weightedSurprise(pool: Scored[], answers: QuizAnswers) {
  const weights = pool.map((row) => {
    const weirdBonus = (row.title.weirdness / 100) * (0.4 + answers.weirdness / 200);
    return Math.max(0.15, 1.15 - row.score.total / 120 + weirdBonus);
  });
  const total = weights.reduce((sum, w) => sum + w, 0);
  let cursor = seeded(JSON.stringify(answers) + "surprise") * total;
  for (let i = 0; i < pool.length; i += 1) {
    cursor -= weights[i];
    if (cursor <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

function seeded(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}
