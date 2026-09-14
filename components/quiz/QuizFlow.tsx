"use client";

import { Header } from "@/components/ui/Header";
import {
  commitmentOptions,
  defaultAnswers,
  experienceOptions,
  formatOptions,
  moodOptions,
  platformOptions,
  quizCopy,
  regionOptions,
} from "@/lib/quiz/options";
import { decodeAnswers, encodeAnswersBrowser } from "@/lib/quiz/encode";
import type { MoodId, PlatformId, QuizAnswers } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const TOTAL = 5;

function initialAnswers(token: string | null): QuizAnswers {
  if (token) {
    const decoded = decodeAnswers(token);
    if (decoded) return decoded;
  }
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("noscroll-answers");
    if (stored) {
      const decoded = decodeAnswers(stored);
      if (decoded) return decoded;
    }
    const locale = navigator.language.toUpperCase();
    const base = defaultAnswers();
    if (locale.includes("US")) return { ...base, region: "US" };
    if (locale.includes("GB")) return { ...base, region: "GB" };
    if (locale.includes("CA")) return { ...base, region: "CA" };
    if (locale.includes("AU")) return { ...base, region: "AU" };
    return base;
  }
  return defaultAnswers();
}

export function QuizFlow() {
  const router = useRouter();
  const search = useSearchParams();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>(() =>
    initialAnswers(search.get("q")),
  );

  const copy = quizCopy[step];
  const progress = ((step + 1) / TOTAL) * 100;
  const canContinue = useMemo(() => {
    if (step === 0) return answers.moods.length > 0;
    return true;
  }, [answers.moods.length, step]);

  function goNext() {
    if (step < TOTAL - 1) {
      setStep((s) => s + 1);
      return;
    }
    const token = encodeAnswersBrowser(answers);
    sessionStorage.setItem("noscroll-answers", token);
    router.push(`/results?q=${token}`);
  }

  function toggleMood(id: MoodId, exclusive?: boolean) {
    setAnswers((prev) => {
      if (exclusive) return { ...prev, moods: [id] };
      const withoutSurprise: MoodId[] = prev.moods.filter((m) => m !== "surprise");
      const next = withoutSurprise.includes(id)
        ? withoutSurprise.filter((m) => m !== id)
        : [...withoutSurprise, id];
      return { ...prev, moods: next };
    });
  }

  function togglePlatform(id: PlatformId) {
    setAnswers((prev) => {
      if (id === "any") return { ...prev, platforms: ["any"] };
      const withoutAny = prev.platforms.filter((p) => p !== "any");
      const next = withoutAny.includes(id)
        ? withoutAny.filter((p) => p !== id)
        : [...withoutAny, id];
      return { ...prev, platforms: next.length ? next : ["any"] };
    });
  }

  return (
    <div className="min-h-screen pb-28">
      <Header aside={`${String(step + 1).padStart(2, "0")} / 05`} />

      <div className="mx-auto w-full max-w-3xl px-5">
        <div className="pixel-bar">
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>

      <main className="mx-auto w-full max-w-3xl px-5 pt-10">
        <p className="text-lg text-muted">{copy.kicker}</p>
        <h1 className="font-display mt-3 text-3xl leading-[1.1] md:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-3 max-w-lg text-lg text-muted">{copy.sub}</p>

        <div className="mt-8">
          {step === 0 && (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {moodOptions.map((mood) => {
                const selected = answers.moods.includes(mood.id);
                return (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => toggleMood(mood.id, mood.exclusive)}
                    className={`choice min-h-16 px-4 py-3 ${selected ? "choice-on" : ""}`}
                  >
                    <span className="text-sm">{mood.emoji}</span>
                    <span className="ml-3 text-lg">{mood.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-2 gap-2">
              {formatOptions.map((format) => {
                const selected = answers.format === format.id;
                return (
                  <button
                    key={format.id}
                    type="button"
                    onClick={() => {
                      setAnswers((a) => ({ ...a, format: format.id }));
                      setTimeout(() => setStep(2), 120);
                    }}
                    className={`choice min-h-28 px-4 py-5 ${selected ? "choice-on" : ""}`}
                  >
                    <span className="block text-xl">{format.emoji}</span>
                    <span className="font-display mt-3 block text-2xl">
                      {format.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-2">
              {commitmentOptions(answers.format).map((option) => {
                const selected = answers.commitment === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setAnswers((a) => ({ ...a, commitment: option.id }));
                      setTimeout(() => setStep(3), 120);
                    }}
                    className={`choice px-4 py-4 ${selected ? "choice-on" : ""}`}
                  >
                    <p className="font-medium">
                      {option.emoji} {option.label}
                    </p>
                    <p
                      className={`mt-1 text-base ${selected ? "text-paper/70" : "text-muted"}`}
                    >
                      {option.hint}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {experienceOptions.map((option) => {
                const selected = answers.experience === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setAnswers((a) => ({ ...a, experience: option.id }));
                      setTimeout(() => setStep(4), 120);
                    }}
                    className={`choice px-4 py-4 ${selected ? "choice-on" : ""}`}
                  >
                    <p className="font-medium">{option.label}</p>
                    <p
                      className={`mt-1 text-base ${selected ? "text-paper/70" : "text-muted"}`}
                    >
                      {option.hint}
                    </p>
                  </button>
                );
              })}
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="mb-5 flex flex-wrap gap-2">
                {regionOptions.map((region) => {
                  const selected = answers.region === region.id;
                  return (
                    <button
                      key={region.id}
                      type="button"
                      onClick={() =>
                        setAnswers((a) => ({ ...a, region: region.id }))
                      }
                      className={`choice px-3 py-2 text-sm ${selected ? "choice-on" : ""}`}
                    >
                      {region.flag} {region.label}
                    </button>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {platformOptions.map((platform) => {
                  const selected = answers.platforms.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      type="button"
                      onClick={() => togglePlatform(platform.id)}
                      className={`choice min-h-14 px-4 py-3 text-left text-sm font-medium ${
                        selected ? "choice-on" : ""
                      }`}
                    >
                      {platform.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="fixed right-0 bottom-0 left-0 border-t-4 border-ink bg-paper px-5 py-4">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn btn-line"
          >
            Back
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canContinue}
            className="btn btn-solid"
          >
            {step === TOTAL - 1 ? "Show me five" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
