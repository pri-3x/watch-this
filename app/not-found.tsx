import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div>
        <p className="font-pixel text-[10px] text-muted">GAME OVER</p>
        <h1 className="font-display mt-3 text-5xl">404</h1>
        <Link href="/" className="btn btn-solid mt-8">
          Back to NoScroll
        </Link>
      </div>
    </div>
  );
}
