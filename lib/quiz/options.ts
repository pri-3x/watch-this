import type {
  CommitmentId,
  ExperienceId,
  FormatId,
  MoodId,
  PlatformId,
  RegionId,
} from "@/lib/types";

export const moodOptions: {
  id: MoodId;
  emoji: string;
  label: string;
  exclusive?: boolean;
}[] = [
  { id: "scared", emoji: "😱", label: "Make me scared" },
  { id: "funny", emoji: "😂", label: "I need something funny" },
  { id: "think", emoji: "🧠", label: "Make me think" },
  { id: "feelings", emoji: "❤️", label: "Give me feelings" },
  { id: "intense", emoji: "🔥", label: "I want something intense" },
  { id: "mystery", emoji: "🕵️", label: "Mystery / thriller" },
  { id: "scifi", emoji: "👽", label: "Sci-fi / fantasy" },
  { id: "dark", emoji: "💀", label: "Dark & disturbing" },
  { id: "chill", emoji: "😌", label: "Chill & easy" },
  { id: "mindblow", emoji: "🤯", label: "Blow my mind" },
  { id: "emotional", emoji: "🎭", label: "Something emotional" },
  { id: "surprise", emoji: "🎲", label: "Surprise me", exclusive: true },
];

export const formatOptions: { id: FormatId; emoji: string; label: string }[] = [
  { id: "movie", emoji: "🎬", label: "Movie" },
  { id: "tv", emoji: "📺", label: "TV Series" },
  { id: "documentary", emoji: "🎞️", label: "Documentary" },
  { id: "anything", emoji: "🤷", label: "Anything" },
];

export const commitmentOptions = (
  format: FormatId,
): { id: CommitmentId; emoji: string; label: string; hint: string }[] => {
  if (format === "tv") {
    return [
      {
        id: "under2h",
        emoji: "⚡",
        label: "A short one",
        hint: "Mini-series energy. In and out.",
      },
      {
        id: "fewEpisodes",
        emoji: "🕐",
        label: "A few episodes",
        hint: "Normal-length, no 8-season trap.",
      },
      {
        id: "movieNight",
        emoji: "🍿",
        label: "One good night",
        hint: "A season you can actually finish.",
      },
      {
        id: "weekend",
        emoji: "🧎",
        label: "Ruin my weekend",
        hint: "Long. Deserved. No mercy.",
      },
      {
        id: "any",
        emoji: "🤷",
        label: "Doesn't matter",
        hint: "Time is a construct.",
      },
    ];
  }

  return [
    {
      id: "under2h",
      emoji: "⚡",
      label: "Under 2 hours",
      hint: "In before the snacks get warm.",
    },
    {
      id: "movieNight",
      emoji: "🍿",
      label: "Movie night",
      hint: "A proper sit-down. Runtime be damned.",
    },
    {
      id: "fewEpisodes",
      emoji: "🕐",
      label: "A few episodes",
      hint: "Or a movie. We're flexible.",
    },
    {
      id: "weekend",
      emoji: "🧎",
      label: "Lose my entire weekend",
      hint: "I came to disappear.",
    },
    {
      id: "any",
      emoji: "🤷",
      label: "Doesn't matter",
      hint: "Just make it good.",
    },
  ];
};

export const experienceOptions: {
  id: ExperienceId;
  emoji: string;
  label: string;
  hint: string;
}[] = [
  {
    id: "highlyRated",
    emoji: "⭐",
    label: "Something highly rated",
    hint: "Certified bangers only.",
  },
  {
    id: "hiddenGem",
    emoji: "💎",
    label: "Hidden gem",
    hint: "Less algorithm, more discovery.",
  },
  {
    id: "popular",
    emoji: "📈",
    label: "Popular for a reason",
    hint: "Yes, everyone saw it. You should too.",
  },
  {
    id: "classic",
    emoji: "📼",
    label: "Old-school classic",
    hint: "Before the timeline ruined cinema.",
  },
  {
    id: "recent",
    emoji: "✨",
    label: "Something recent",
    hint: "Still has that new-obsession smell.",
  },
  {
    id: "any",
    emoji: "🤷",
    label: "Doesn't matter",
    hint: "Vibe first. Era later.",
  },
];

export const platformOptions: { id: PlatformId; label: string }[] = [
  { id: "netflix", label: "Netflix" },
  { id: "prime", label: "Amazon Prime Video" },
  { id: "hotstar", label: "Disney+ / JioHotstar" },
  { id: "sonyliv", label: "SonyLIV" },
  { id: "zee5", label: "ZEE5" },
  { id: "jiocinema", label: "JioCinema" },
  { id: "appletv", label: "Apple TV+" },
  { id: "youtube", label: "YouTube" },
  { id: "other", label: "Other" },
  { id: "any", label: "I don't care" },
];

export const regionOptions: { id: RegionId; flag: string; label: string }[] = [
  { id: "IN", flag: "🇮🇳", label: "India" },
  { id: "US", flag: "🇺🇸", label: "United States" },
  { id: "GB", flag: "🇬🇧", label: "United Kingdom" },
  { id: "CA", flag: "🇨🇦", label: "Canada" },
  { id: "AU", flag: "🇦🇺", label: "Australia" },
];

export const platformLabel: Record<PlatformId, string> = {
  netflix: "Netflix",
  prime: "Prime Video",
  hotstar: "JioHotstar",
  sonyliv: "SonyLIV",
  zee5: "ZEE5",
  jiocinema: "JioCinema",
  appletv: "Apple TV+",
  youtube: "YouTube",
  other: "Other",
  any: "Anywhere",
};

export const regionLabel: Record<RegionId, string> = {
  IN: "India",
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
  AU: "Australia",
};

export const regionFlag: Record<RegionId, string> = {
  IN: "🇮🇳",
  US: "🇺🇸",
  GB: "🇬🇧",
  CA: "🇨🇦",
  AU: "🇦🇺",
};

export const defaultAnswers = (): QuizAnswersShape => ({
  moods: [],
  format: "anything",
  commitment: "any",
  experience: "any",
  weirdness: 35,
  platforms: ["any"],
  region: "IN",
});

export type QuizAnswersShape = {
  moods: MoodId[];
  format: FormatId;
  commitment: CommitmentId;
  experience: ExperienceId;
  weirdness: number;
  platforms: PlatformId[];
  region: RegionId;
};

export const quizCopy = [
  {
    kicker: "Alright, let's diagnose your Netflix paralysis.",
    title: "What are you in the mood for?",
    sub: "Pick as many as your brain can handle. Or tap surprise and walk away.",
  },
  {
    kicker: "Format check. Keep it simple.",
    title: "What do you want?",
    sub: "One container. We will fill it.",
  },
  {
    kicker: "Be honest. How much time are you willing to waste?",
    title: "How much commitment?",
    sub: "Your couch deserves a realistic plan.",
  },
  {
    kicker: "This one quietly changes everything.",
    title: "What kind of experience?",
    sub: "We will not overwhelm you. We will just judge you a little.",
  },
  {
    kicker: "Okay, we have enough information to judge you.",
    title: "Where do you actually have subscriptions?",
    sub: "Optional. We'll still pick. This just tells us where to send you.",
  },
] as const;
