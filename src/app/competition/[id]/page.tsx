import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCompetitions, getEntries } from "@/lib/data";
import { MuLogo } from "@/components/MuLogo";
import { EntryRow } from "@/components/EntryRow";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const competitions = await getCompetitions();
  const competition = competitions.find((c) => c.id === id);

  if (!competition) return {};

  const title = `${competition.challengeName} — Case Competitions`;
  return {
    title,
    description: competition.description ?? `Hosted by ${competition.host}`,
    openGraph: { title, description: competition.description ?? `Hosted by ${competition.host}` },
  };
}

export default async function CompetitionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [competitions, entries] = await Promise.all([getCompetitions(), getEntries()]);
  const competition = competitions.find((c) => c.id === id);

  if (!competition) {
    notFound();
  }

  const relatedEntries = entries.filter(
    (e) =>
      e.challengeName.toLowerCase() === competition.challengeName.toLowerCase() &&
      e.host.toLowerCase() === competition.host.toLowerCase(),
  );

  return (
    <main className="flex-1">
      <header className="sticky top-0 z-30 border-b border-hairline bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center px-5 py-4 md:px-8">
          <Link href="/">
            <MuLogo />
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-14 md:px-8">
        <Link
          href="/"
          className="text-sm text-ink-soft underline decoration-hairline underline-offset-4 hover:text-ink hover:decoration-brass"
        >
          Back to case competitions
        </Link>

        <h1 className="mt-8 font-display text-3xl text-ink">{competition.challengeName}</h1>
        <p className="mt-2 text-[15px] text-ink-soft">Hosted by {competition.host}</p>

        {competition.description && (
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">{competition.description}</p>
        )}

        {competition.aboutUrl && (
          <div className="mt-8 flex flex-wrap items-stretch gap-3">
            <a
              href={competition.aboutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-hairline px-4 py-2 text-sm leading-none text-ink transition-colors hover:border-brass hover:text-brass-deep"
            >
              Official page ↗
            </a>
          </div>
        )}

        {relatedEntries.length > 0 && (
          <div className="mt-12 border-t border-hairline pt-8">
            <h2 className="font-display text-lg text-ink">
              MU {relatedEntries.length === 1 ? "entry" : "entries"}
            </h2>
            <div className="mt-2">
              {relatedEntries.map((e) => (
                <EntryRow key={e.id} entry={e} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
