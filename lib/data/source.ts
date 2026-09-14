import type { AvailabilityMap, PlatformId, RegionId, Title } from "@/lib/types";

export type CatalogSource = {
  mode: "mock" | "live";
  getTitles: () => Promise<Title[]>;
};

export type AvailabilityLookup = {
  platforms: PlatformId[];
  known: boolean;
};

export type AvailabilitySource = {
  isLive: boolean;
  getAvailability: (
    titleId: string,
    region: RegionId,
  ) => Promise<AvailabilityLookup>;
};

export type DataLayer = {
  catalog: CatalogSource;
  availability: AvailabilitySource;
};

export type { AvailabilityMap };
