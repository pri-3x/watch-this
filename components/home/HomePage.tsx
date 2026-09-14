import { PixelTv } from "@/components/home/PixelTv";
import { Header } from "@/components/ui/Header";
import Link from "next/link";

const example = [
  { n: "01", title: "Se7en" },
  { n: "02", title: "The Silence of the Lambs" },
  { n: "03", title: "Zodiac" },
  { n: "04", title: "Memories of Murder" },
  { n: "05", title: "Gone Girl" },
];

export function HomePage() {
  return (
    <div className="min-h-screen">
      <Header aside="No catalog. Five picks." />

      <main className="mx-auto w-full max-w-5xl px-5 pb-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0 max-w-3xl">
            <p className="font-pixel fade-up text-[10px] leading-relaxed text-mark">
              STOP SCROLLING. START WATCHING.
            </p>

            <h1 className="font-display fade-up mt-5 text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              What the hell do you want to watch?
            </h1>

            <p className="fade-up mt-6 max-w-md text-xl text-muted">
              Tell us your vibe. We&apos;ll do the scrolling for you. Then you
              pick number one and go.
            </p>

            <div className="fade-up mt-10 flex flex-col gap-3">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/quiz" className="btn btn-solid w-full sm:w-auto">
                  Find me something
                </Link>
                <p className="text-lg text-muted">About 30 seconds. No account.</p>
              </div>
              <p className="press-start">PRESS START</p>
            </div>
          </div>

          <div className="fade-up w-[220px] shrink-0 sm:w-[240px]">
            <PixelTv />
          </div>
        </div>

        <section className="mt-16 grid gap-0 border-t-4 border-rule md:grid-cols-2">
          <div className="border-rule py-10 md:border-r-4 md:pr-12">
            <p className="font-pixel text-[10px] text-muted">YOU</p>
            <p className="font-display mt-4 text-2xl leading-snug sm:text-3xl">
              “I want something disturbing but actually good.”
            </p>
          </div>

          <div className="py-10 md:pl-12">
            <p className="font-pixel text-[10px] text-muted">NOSCROLL</p>
            <ol className="mt-5 space-y-3">
              {example.map((item, i) => (
                <li key={item.title} className="flex items-baseline gap-4">
                  <span
                    className={`font-pixel w-10 text-[10px] ${i === 0 ? "text-mark" : "text-muted"}`}
                  >
                    {item.n}
                  </span>
                  <span className="font-display text-xl leading-none sm:text-2xl">
                    {item.title}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-lg text-muted">
              If you only watch one thing, take 01. That is the product.
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-10 border-t-4 border-rule pt-10 md:grid-cols-3">
          <p className="text-lg text-muted">
            You don&apos;t need another catalog. You need someone to just pick
            something.
          </p>
          <p className="text-lg text-muted">
            Five questions. Five titles. No feed, no infinite scroll, no “because
            you watched.”
          </p>
          <p className="font-display text-2xl leading-snug">
            Fine. I&apos;ll watch this.
          </p>
        </section>
      </main>
    </div>
  );
}
