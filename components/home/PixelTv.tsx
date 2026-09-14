const PALETTE: Record<string, string> = {
  k: "#161513",
  o: "#d4782c",
  d: "#a85a1c",
  c: "#f3d2a6",
  e: "#faf6ef",
  n: "#c01515",
  s: "#142a38",
  b: "#1c5060",
  f: "#f0c94d",
  y: "#fff4c4",
  r: "#cfc8bb",
  w: "#e7e1d6",
};

function Layer({
  x = 0,
  y = 0,
  rows,
  className,
}: {
  x?: number;
  y?: number;
  rows: string[];
  className?: string;
}) {
  return (
    <g className={className}>
      {rows.flatMap((row, dy) =>
        [...row].flatMap((ch, dx) => {
          const fill = PALETTE[ch];
          if (!fill) return [];
          return [
            <rect
              key={`${x + dx}-${y + dy}`}
              x={x + dx}
              y={y + dy}
              width={1}
              height={1}
              fill={fill}
            />,
          ];
        }),
      )}
    </g>
  );
}

const SCENE = [
  ".............kk.kk........k....k.....",
  "............ko.k.ok......k.k..k.k....",
  "............kooooo.k.......k..k......",
  "............keekookk...kkkkkkkkkkkkkk",
  "............k.nnookk...k............k",
  "............k.oooook...k.sbbbbbbbbs.k",
  "...........kkdoooook...k.sb......bs.k",
  "...........kodoooook...k.sb......bs.k",
  "...kkkkkkkkk.ooooook...k.sb......bs.k",
  "...kooooooooooooo.k....k.sb......bs.k",
  "...k.ooooccccooo.k.....k.sbbbbbbbbs.k",
  "....kooooooooooo.k.....k...........nk",
  ".....koooo..ooo.k......kkkkkkkkkkkkkk",
  "......kkkk..kkkk........kk........kk.",
  "......koo....ook........kk........kk.",
  "......kkkkkkkkkk.......kkk........kkk",
  ".....wwwwwwwwwwwwwwwwwwwwwwwwwwwwww..",
  "....rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr.",
  "...rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr.",
  "kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",
];

export function PixelTv() {
  return (
    <div className="pixel-stage" aria-hidden>
      <svg
        className="pixel-cat-scene"
        viewBox="0 0 40 20"
        shapeRendering="crispEdges"
      >
        <Layer rows={SCENE} />

        <Layer className="cat-eyes-open" x={13} y={3} rows={["ee"]} />
        <Layer className="cat-eyes-shut" x={13} y={3} rows={["kk"]} />

        <Layer
          className="cat-tail cat-tail-1"
          x={1}
          y={8}
          rows={["kk", "k.k", ".kk"]}
        />
        <Layer
          className="cat-tail cat-tail-2"
          x={0}
          y={5}
          rows={[".kk", "k..k", "k..k", ".kk"]}
        />
        <Layer
          className="cat-tail cat-tail-3"
          x={0}
          y={2}
          rows={[".kk", "k..k", "k..k", ".k", ".k", ".kk"]}
        />

        <Layer
          className="tv-show tv-show-1"
          x={29}
          y={6}
          rows={[".ffff", "fy.kf", ".ffff"]}
        />
        <Layer
          className="tv-show tv-show-2"
          x={31}
          y={7}
          rows={[".ffff", "fy.kf", ".ffff"]}
        />
        <Layer
          className="tv-show tv-show-3"
          x={33}
          y={6}
          rows={[".ffff", "fy.kf", ".ffff"]}
        />
      </svg>
    </div>
  );
}
