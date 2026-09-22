const MEDAL_STYLES: Record<number, string> = {
  1: "bg-brass text-paper border-brass",
  2: "bg-ink-soft/20 text-ink border-ink-soft/40",
  3: "bg-rust/20 text-rust border-rust/40",
};

export function RankBadge({ rank }: { rank: number | null }) {
  const style = (rank && MEDAL_STYLES[rank]) || "bg-panel text-ink-faint border-hairline";
  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-display text-sm ${style}`}
    >
      {rank ? `#${rank}` : "—"}
    </div>
  );
}
