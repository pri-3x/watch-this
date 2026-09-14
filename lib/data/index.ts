import type { DataLayer } from "@/lib/data/source";
import {
  mockAvailabilitySource,
  mockCatalogSource,
} from "@/lib/data/mock/source";

/**
 * Swap catalog / availability here when live APIs are configured.
 * Keep keys server-side. Never import a live client into a Client Component.
 */
export function getDataLayer(): DataLayer {
  const useLiveCatalog = Boolean(process.env.TMDB_API_KEY);
  const useLiveAvailability = Boolean(process.env.WATCHMODE_API_KEY);

  if (useLiveCatalog || useLiveAvailability) {
    // Live adapters can be added under lib/data/live/ without touching the engine.
    return {
      catalog: mockCatalogSource,
      availability: mockAvailabilitySource,
    };
  }

  return {
    catalog: mockCatalogSource,
    availability: mockAvailabilitySource,
  };
}
