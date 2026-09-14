"use client";

import { Poster } from "@/components/results/Poster";
import { justWatchUrl } from "@/lib/engine/copy";
import { formatMeta, imdbUrl } from "@/lib/format";
import { platformLabel, regionFlag, regionLabel } from "@/lib/quiz/options";
import type { RankedRecommendation, RegionId } from "@/lib/types";
import { useState } from "react";

export function TitleCard({
  pick,
  region,
  availabilityIsLive,
  platformFilterActive,
  indexLabel,
}: {
  pick: RankedRecommendation;
  region: RegionId;
  availabilityIsLive: boolean;
  platformFilterActive: boolean;
  indexLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const isFirst = pick.rank === 1 && !indexLabel;
  const watchable = pick.availabilityKnown && pick.platforms.length > 0;
  const number = indexLabel ?? String(pick.rank).padStart(2, "0");

  return (
    <article
      className="fade-up border-t-4 border-rule pt-8"
      style={{ animationDelay: `${pick.rank * 60}ms` }}
    >
      <div
        className={`grid gap-6 ${isFirst ? "md:grid-cols-[240px_1fr]" : "md:grid-cols-[168px_1fr]"}`}
      >
        <Poster title={pick.title} priority={isFirst} />

        <div className="min-w-0">
          <p className="font-pixel text-[9px] leading-relaxed">
            <span className={isFirst ? "text-mark" : "text-muted"}>{number}</span>
            <span className="text-muted"> {pick.rankLabel.toUpperCase()}</span>
          </p>

          <h2
            className={`font-display mt-3 leading-[1.1] ${
              isFirst ? "text-3xl md:text-5xl" : "text-2xl md:text-4xl"
            }`}
          >
            {pick.title.title}
          </h2>

          <p className="mt-3 text-sm text-muted">{formatMeta(pick.title)}</p>
          <p className="mt-2 text-sm">
            {pick.title.rating.toFixed(1)}
            <span className="text-muted"> / 10 IMDb</span>
          </p>

          <p className="font-display mt-5 max-w-xl text-xl leading-snug">
            {pick.pitch}
          </p>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted">
            {pick.title.overview}
          </p>

          <div className="mt-6 border-t-4 border-rule pt-4">
            <p className="font-pixel text-[9px] text-muted">
              Watch on
            </p>
            {platformFilterActive &&
            pick.availabilityKnown &&
            !pick.onUserPlatforms ? (
              <p className="mt-2 text-sm">Not on your subscriptions.</p>
            ) : null}
            {watchable ? (
              <p className="mt-2 text-sm font-medium">
                {pick.platforms
                  .filter((p) => p !== "other" && p !== "any")
                  .map((p) => platformLabel[p])
                  .join(" · ") || "Other"}
              </p>
            ) : pick.availabilityKnown ? (
              <p className="mt-2 text-sm text-muted">
                No confirmed listing on the services we track.
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted">
                We couldn&apos;t confirm where this is streaming right now.
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              <a
                href={justWatchUrl(pick.title, region)}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-rule underline-offset-4 hover:decoration-mark"
              >
                JustWatch
              </a>
              <a
                href={imdbUrl(pick.title.imdbId)}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-rule underline-offset-4 hover:decoration-mark"
              >
                IMDb
              </a>
            </div>
            <p className="mt-2 text-xs text-muted">
              {regionLabel[region]} {regionFlag[region]}
              {availabilityIsLive ? "" : " · sample data"}
              {" · "}
              Streaming availability may change.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-5 text-sm underline decoration-rule underline-offset-4"
          >
            {open ? "Hide why" : "Why this?"}
          </button>
          {open ? (
            <p className="mt-3 max-w-xl bg-wash px-4 py-3 text-sm leading-relaxed text-muted">
              {pick.why}
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
