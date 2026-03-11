"use client";

const CELL_COUNT = 40;
const cells = Array.from({ length: CELL_COUNT * 2 });

export default function FilmStrip({
  position,
}: {
  position: "top" | "bottom";
}) {
  return (
    <div className={`filmstrip filmstrip-${position}`}>
      <div className="filmstrip-track">
        {cells.map((_, i) => (
          <div key={i} className="film-cell" />
        ))}
      </div>
    </div>
  );
}
