import Link from "next/link";

export function Header({ aside }: { aside?: string }) {
  return (
    <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-5 py-6">
      <Link href="/" className="font-pixel text-[10px] leading-none sm:text-[11px]">
        NOSCROLL
      </Link>
      {aside ? (
        <p className="text-right text-base text-muted">{aside}</p>
      ) : null}
    </header>
  );
}
