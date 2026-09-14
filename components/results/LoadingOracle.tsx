"use client";

import { useEffect, useState } from "react";

const lines = [
  "Reading your mind.",
  "Judging your taste.",
  "Finding the one.",
];

export function LoadingOracle({
  extra = "This will only take a second.",
}: {
  extra?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % lines.length);
    }, 700);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="grid min-h-[70vh] place-items-center px-5">
      <div className="w-full max-w-xl">
        <p className="text-lg text-muted">{extra}</p>
        <h1 className="font-display mt-3 text-3xl leading-tight md:text-5xl">
          {lines[index]}
        </h1>
        <div className="pixel-bar mt-8">
          <div className="w-1/3" />
        </div>
      </div>
    </div>
  );
}
