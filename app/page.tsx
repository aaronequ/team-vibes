import Image from "next/image";
import Link from "next/link";

const teams = [
  { name: "Team 1", href: "/team-1" },
  { name: "Team 2", href: "/team-2", winner: true },
  { name: "Team 3", href: "/team-3" },
  { name: "Team 4", href: "/team-4" },
];

function BrandDevice({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`} aria-hidden="true">
      <span className="block h-1.5 w-10 rounded-sm bg-current" />
      <span className="block h-1.5 w-10 rounded-sm bg-current" />
    </div>
  );
}

function CrownIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M3 8.5 6.5 13l3-6 2.5 5 2.5-5 3 6L21 8.5 19.5 18h-15L3 8.5Zm1.7 11.5h14.6v1.5H4.7V20Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-stone-2 px-4 pt-4 pb-16 sm:px-6 sm:pb-24">
        <header className="mb-8 flex items-center justify-between">
          <Image
            src="/equ-dark-transparent-bg.png"
            alt="equ"
            width={288}
            height={150}
            priority
          />
          <BrandDevice className="text-teal" />
        </header>
        <div className="max-w-3xl">
          <h1 className="mb-8">Robot Vibes</h1>
          <p className="max-w-2xl text-xl text-slate">
            A hands-on AI app building session. Group up, spec an idea
            together, and vibe code a working Proof of Concept with your team
            developer.
          </p>
          <Link
            href="/worldcup"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-dark px-6 py-3 font-heading text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:bg-teal"
          >
            World Cup Sweepstakes
            <span className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </section>

      <section className="bg-stone px-8 py-20 sm:px-16 sm:py-24">
        <header className="mb-12 flex items-end justify-between">
          <h2>The teams</h2>
          <BrandDevice className="text-salmon" />
        </header>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {teams.map((team) => (
            <li key={team.name}>
              <Link
                href={team.href}
                className={`group relative flex h-full flex-col justify-between gap-10 rounded-2xl border p-8 transition-colors ${
                  team.winner
                    ? "border-teal bg-teal text-white hover:bg-dark hover:border-dark"
                    : "border-stone-3 bg-white text-dark hover:border-dark hover:bg-dark hover:text-white"
                }`}
              >
                {team.winner && (
                  <span className="absolute -top-5 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-salmon text-white shadow-md ring-4 ring-stone">
                    <CrownIcon className="h-6 w-6" />
                    <span className="sr-only">Winning team</span>
                  </span>
                )}
                <span
                  className={`font-heading text-sm font-semibold tracking-widest uppercase ${
                    team.winner ? "text-white/80" : "text-teal"
                  }`}
                >
                  {team.winner ? "Winners" : "Group"}
                </span>
                <span className="font-heading text-4xl font-semibold tracking-tight">
                  {team.name}
                </span>
                <span
                  className={`text-sm transition-transform group-hover:translate-x-1 ${
                    team.winner ? "text-white/80" : "text-slate group-hover:text-white/80"
                  }`}
                >
                  View page →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-teal px-8 py-20 text-white sm:px-16 sm:py-24">
        <div className="flex max-w-3xl flex-col gap-8">
          <BrandDevice className="text-white" />
          <h2 className="text-white">Congratulations Team 2</h2>
          <p className="font-heading text-sm font-semibold tracking-widest text-white/70 uppercase">
            The winning team
          </p>
          <ul className="flex flex-wrap gap-3 text-2xl font-bold text-white">
            {["Gemma", "Caitlin", "Phil", "Jason"].map((name) => (
              <li
                key={name}
                className="rounded-full border border-white/30 bg-white/10 px-5 py-2"
              >
                {name}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="flex items-center justify-between bg-white px-8 py-8 sm:px-16">
        <Image
          src="/equ-dark-transparent-bg.png"
          alt="equ"
          width={72}
          height={38}
        />
        <p className="text-sm text-slate">robot-vibes — an equ session</p>
      </footer>
    </div>
  );
}
