# NoScroll

Stop scrolling. Start watching.

A small Next.js app that asks a few vibe questions and returns **5** ranked things to watch — from an IMDb Top 250-style catalog, not another infinite grid.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it's wired

- UI: `app/` + `components/`
- Quiz state: `lib/quiz/`
- Ranking: `lib/engine/`
- Catalog + streaming: `lib/data/` (mock today, live adapters later)
- APIs: `POST /api/recommend`, `POST /api/surprise`

The prototype uses a curated mock dataset. Streaming rows are **illustrative**, labeled in the UI, and never claimed as live JustWatch data.

To plug in real sources later, keep keys in `.env` (see `.env.example`) and swap implementations in `lib/data/index.ts`. Do not send keys to the client.
