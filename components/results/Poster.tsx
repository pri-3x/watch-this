"use client";

import { posterUrl } from "@/lib/format";
import type { Title } from "@/lib/types";
import { useState } from "react";

export function Poster({
  title,
  priority = false,
}: {
  title: Title;
  priority?: boolean;
}) {
  const src = posterUrl(title);
  const [failed, setFailed] = useState(!src);

  return (
    <div className="pixel-frame relative aspect-[2/3]">
      {!failed && src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${title.title} poster`}
          className="pixel-img h-full w-full object-cover"
          onError={() => setFailed(true)}
          fetchPriority={priority ? "high" : "auto"}
        />
      ) : (
        <div className="flex h-full w-full flex-col justify-between bg-cream p-3">
          <p className="font-pixel text-[8px] text-muted">{title.year}</p>
          <p className="font-display text-xl leading-[1.1]">{title.title}</p>
        </div>
      )}
    </div>
  );
}
