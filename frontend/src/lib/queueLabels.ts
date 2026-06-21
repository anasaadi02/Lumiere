const LABELS: Record<number, string> = {
  0: "Now Playing",
  1: "Up Next",
};

export function getLabel(position: number): string {
  return LABELS[position] ?? "Queued";
}