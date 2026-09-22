import { getEntries, getOpportunities } from "@/lib/data";
import { Board } from "@/components/Board";
import { MuLogo } from "@/components/MuLogo";

export default async function Home() {
  const [entries, opportunities] = await Promise.all([getEntries(), getOpportunities()]);

  const wins = entries.filter((e) => e.rank === 1).length;
  const podiums = entries.filter((e) => e.rank && e.rank <= 3).length;
  const openCount = opportunities.filter((o) => o.status !== "Closed").length;

  const stats = [
    { label: "Competitions entered", value: entries.length },
    { label: "1st place wins", value: wins },
    { label: "Podium finishes", value: podiums },
    { label: "Open to apply now", value: openCount },
  ];

  return (
    <main className="flex-1">
      <header className="sticky top-0 z-30 border-b border-hairline bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center px-5 py-4 md:px-8">
          <MuLogo />
        </div>
      </header>

      <div className="border-b border-hairline">
        <div className="mu-fade-up mx-auto max-w-6xl px-5 py-10 md:px-8 md:py-14">
          <h1 className="max-w-2xl font-display text-3xl leading-tight text-ink md:text-5xl">
            Case Competitions
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-ink-soft md:mt-4">
            Case competitions Masters&rsquo; Union students have entered and
            won, plus open competitions you&rsquo;re still eligible to apply
            to.
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:flex sm:flex-wrap sm:gap-x-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-[13px] uppercase tracking-wide text-ink-faint">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-display text-2xl text-teal md:text-3xl">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="pt-6 md:pt-10">
        <Board entries={entries} opportunities={opportunities} />
      </div>
    </main>
  );
}
