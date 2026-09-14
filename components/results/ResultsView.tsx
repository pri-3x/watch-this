"use client";

import { LoadingOracle } from "@/components/results/LoadingOracle";
import { TitleCard } from "@/components/results/TitleCard";
import { Header } from "@/components/ui/Header";
import { decodeAnswers, encodeAnswersBrowser } from "@/lib/quiz/encode";
import type { RankedRecommendation, RecommendResult } from "@/lib/types";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export function ResultsView() {
  const search = useSearchParams();
  const router = useRouter();
  const token = search.get("q");
  const answers = useMemo(() => (token ? decodeAnswers(token) : null), [token]);
  const [data, setData] = useState<RecommendResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [surprise, setSurprise] = useState<RankedRecommendation | null>(null);
  const [surpriseBusy, setSurpriseBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!answers) {
      router.replace("/quiz");
      return;
    }

    const started = Date.now();
    fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("fail");
        return (await res.json()) as RecommendResult;
      })
      .then(async (result) => {
        const wait = Math.max(0, 1100 - (Date.now() - started));
        await new Promise((resolve) => window.setTimeout(resolve, wait));
        setData(result);
      })
      .catch(() => {
        setError("Something broke. Try again.");
      })
      .finally(() => setLoading(false));
  }, [answers, router, token]);

  async function onSurprise() {
    if (!answers || !data) return;
    setSurpriseBusy(true);
    try {
      const res = await fetch("/api/surprise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          excludeIds: data.picks.map((p) => p.title.id),
        }),
      });
      if (!res.ok) throw new Error("fail");
      const json = (await res.json()) as { pick: RankedRecommendation };
      setSurprise(json.pick);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Could not roll a surprise. Try again.");
    } finally {
      setSurpriseBusy(false);
    }
  }

  async function onShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My NoScroll picks",
          text: "Stop scrolling. Start watching.",
          url,
        });
        return;
      }
    } catch {
      // fall through to copy
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  if (loading) return <LoadingOracle />;

  if (error && !data) {
    return (
      <div className="grid min-h-screen place-items-center px-5">
        <div>
          <h1 className="font-display text-4xl">{error}</h1>
          <Link href="/quiz" className="btn btn-solid mt-6">
            Change my answers
          </Link>
        </div>
      </div>
    );
  }

  if (!data || !answers) return null;

  const quizLink = `/quiz?q=${encodeAnswersBrowser(answers)}`;

  return (
    <div className="min-h-screen pb-20">
      <Header
        aside={data.dataMode === "mock" ? "Prototype catalog" : "Live catalog"}
      />

      <main className="mx-auto w-full max-w-4xl px-5">
        <p className="text-lg text-muted">Okay. We picked for you.</p>
        <h1 className="font-display mt-3 max-w-3xl text-3xl leading-[1.1] md:text-5xl">
          If you only watch one thing, take 01.
        </h1>

        {data.loosened ? (
          <p className="mt-6 max-w-2xl border-l-4 border-mark pl-4 text-lg text-muted">
            {data.loosenNote}
          </p>
        ) : null}

        {surprise ? (
          <section className="mt-12">
            <p className="text-xs tracking-[0.16em] text-mark uppercase">
              Surprise
            </p>
            <TitleCard
              pick={surprise}
              region={data.region}
              availabilityIsLive={data.availabilityIsLive}
              platformFilterActive={data.platformFilterActive}
              indexLabel="—"
            />
          </section>
        ) : null}

        <div className="mt-10">
          {data.picks.map((pick) => (
            <TitleCard
              key={pick.title.id}
              pick={pick}
              region={data.region}
              availabilityIsLive={data.availabilityIsLive}
              platformFilterActive={data.platformFilterActive}
            />
          ))}
        </div>

        <section className="mt-14 border-t-4 border-rule pt-10">
          <h2 className="font-display text-3xl">Still stuck?</h2>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onSurprise}
              disabled={surpriseBusy}
              className="btn btn-solid"
            >
              {surpriseBusy ? "Picking…" : "Surprise me"}
            </button>
            <Link href={quizLink} className="btn btn-line">
              Change my vibe
            </Link>
            <button type="button" onClick={onShare} className="btn btn-line">
              {copied ? "Copied" : "Share my picks"}
            </button>
          </div>
          {error ? <p className="mt-4 text-sm text-mark">{error}</p> : null}
        </section>
      </main>
    </div>
  );
}
