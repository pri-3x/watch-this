import type { AvailabilitySource, CatalogSource } from "@/lib/data/source";
import { mockAvailability, platformsFor } from "@/lib/data/mock/availability";
import { mockDocumentaries } from "@/lib/data/mock/documentaries";
import { mockMovies } from "@/lib/data/mock/movies";
import { mockSeries } from "@/lib/data/mock/series";

export const mockCatalogSource: CatalogSource = {
  mode: "mock",
  async getTitles() {
    return [...mockMovies, ...mockSeries, ...mockDocumentaries];
  },
};

export const mockAvailabilitySource: AvailabilitySource = {
  isLive: false,
  async getAvailability(titleId, region) {
    return platformsFor(mockAvailability, titleId, region);
  },
};
