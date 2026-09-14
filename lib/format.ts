import { posterByImdbId } from "@/lib/data/posters";
import type { Title } from "@/lib/types";

export function formatRuntime(title: Title) {
  if (title.type === "tv" || (title.type === "documentary" && title.episodes)) {
    const seasons = title.seasons
      ? `${title.seasons} season${title.seasons === 1 ? "" : "s"}`
      : null;
    const episodes = title.episodes
      ? `${title.episodes} ep${title.episodes === 1 ? "" : "s"}`
      : null;
    return [seasons, episodes].filter(Boolean).join(" · ");
  }

  const hours = Math.floor(title.runtimeMinutes / 60);
  const minutes = title.runtimeMinutes % 60;
  if (!hours) return `${minutes}m`;
  if (!minutes) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

export function formatMeta(title: Title) {
  return [title.year, formatRuntime(title), title.genres[0]].filter(Boolean).join(" · ");
}

export function posterUrl(title: Pick<Title, "imdbId" | "posterPath">) {
  const path = posterByImdbId[title.imdbId];
  if (!path) return null;
  return `https://image.tmdb.org/t/p/w185${path}`;
}

export function imdbUrl(imdbId: string) {
  return `https://www.imdb.com/title/${imdbId}/`;
}
