export const MOODS = [
  "scared",
  "funny",
  "think",
  "feelings",
  "intense",
  "mystery",
  "scifi",
  "dark",
  "chill",
  "mindblow",
  "emotional",
  "surprise",
] as const;

export type MoodId = (typeof MOODS)[number];

export const FORMATS = ["movie", "tv", "documentary", "anything"] as const;
export type FormatId = (typeof FORMATS)[number];

export const COMMITMENTS = [
  "under2h",
  "movieNight",
  "fewEpisodes",
  "weekend",
  "any",
] as const;
export type CommitmentId = (typeof COMMITMENTS)[number];

export const EXPERIENCES = [
  "highlyRated",
  "hiddenGem",
  "popular",
  "classic",
  "recent",
  "any",
] as const;
export type ExperienceId = (typeof EXPERIENCES)[number];

export const PLATFORMS = [
  "netflix",
  "prime",
  "hotstar",
  "sonyliv",
  "zee5",
  "jiocinema",
  "appletv",
  "youtube",
  "other",
  "any",
] as const;
export type PlatformId = (typeof PLATFORMS)[number];

export const REGIONS = ["IN", "US", "GB", "CA", "AU"] as const;
export type RegionId = (typeof REGIONS)[number];

export type TitleType = "movie" | "tv" | "documentary";

export type Title = {
  id: string;
  imdbId: string;
  title: string;
  year: number;
  type: TitleType;
  runtimeMinutes: number;
  seasons?: number;
  episodes?: number;
  rating: number;
  votes: number;
  genres: string[];
  moods: MoodId[];
  tags: string[];
  weirdness: number;
  popularity: number;
  overview: string;
  hook: string;
  posterPath?: string;
};

export type AvailabilityMap = Record<string, Partial<Record<RegionId, PlatformId[]>>>;

export type QuizAnswers = {
  moods: MoodId[];
  format: FormatId;
  commitment: CommitmentId;
  experience: ExperienceId;
  weirdness: number;
  platforms: PlatformId[];
  region: RegionId;
};

export type ScoreBreakdown = {
  mood: number;
  format: number;
  commitment: number;
  experience: number;
  weirdness: number;
  rating: number;
  streaming: number;
  total: number;
};

export type RankedRecommendation = {
  title: Title;
  rank: 1 | 2 | 3 | 4 | 5;
  rankLabel: string;
  pitch: string;
  why: string;
  score: ScoreBreakdown;
  platforms: PlatformId[];
  availabilityKnown: boolean;
  onUserPlatforms: boolean;
};

export type RecommendResult = {
  picks: RankedRecommendation[];
  loosened: boolean;
  loosenNote?: string;
  region: RegionId;
  availabilityIsLive: boolean;
  dataMode: "mock" | "live";
  platformFilterActive: boolean;
};

export type SurpriseResult = {
  pick: RankedRecommendation;
  region: RegionId;
  availabilityIsLive: boolean;
  dataMode: "mock" | "live";
};
