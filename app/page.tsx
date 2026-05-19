import Image from "next/image";

const sessionSteps = [
  "Group up with a developer",
  "Develop a spec for an app as a group using AI",
  "Help your group developer prompt the AI to vibe code a Proof of Concept",
];

function BrandDevice({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`} aria-hidden="true">
      <span className="block h-1.5 w-10 rounded-sm bg-current" />
      <span className="block h-1.5 w-10 rounded-sm bg-current" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section className="bg-stone-2 px-8 py-16 sm:px-16 sm:py-24">
        <header className="mb-20 flex items-center justify-between">
          <Image
            src="/equ-dark-transparent-bg.png"
            alt="equ"
            width={96}
            height={50}
            priority
          />
          <BrandDevice className="text-teal" />
        </header>
        <div className="max-w-3xl">
          <p className="mb-6 font-heading text-base font-semibold tracking-widest text-teal uppercase">
            Welcome to
          </p>
          <h1 className="mb-8">robot-vibes</h1>
          <p className="max-w-2xl text-xl text-slate">
            <span className="font-bold text-dark">
              Get ready for a proper AI App building session.
            </span>{" "}
            Bring your ideas, your group, and a willingness to vibe code your way
            to a working Proof of Concept.
          </p>
        </div>
      </section>

      <section className="bg-dark px-8 py-20 text-white sm:px-16 sm:py-24">
        <header className="mb-16 flex items-start justify-between">
          <h2 className="text-white">In this session we will:</h2>
          <Image
            src="/equ-green-transparent-bg.png"
            alt="equ"
            width={80}
            height={42}
          />
        </header>
        <ol className="grid max-w-5xl gap-12 sm:grid-cols-3">
          {sessionSteps.map((step, i) => (
            <li key={step} className="flex flex-col gap-4">
              <span className="font-heading text-5xl font-semibold leading-none tracking-tight text-teal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-lg text-white/60">{step}</p>
            </li>
          ))}
        </ol>
        <div className="mt-20 max-w-3xl border-t border-white/10 pt-12 text-lg leading-relaxed">
          <span className="font-bold text-white">
            The developer will be allowed to do BASIC preparation beforehand.
          </span>{" "}
          <span className="text-white/60">You may start brainstorming now.</span>
        </div>
      </section>

      <section className="bg-teal px-8 py-20 text-white sm:px-16 sm:py-24">
        <div className="flex max-w-3xl flex-col gap-8">
          <BrandDevice className="text-white" />
          <h2 className="text-white">
            We will vote as a team on the BEST proof of concept.
          </h2>
          <p className="text-2xl font-bold text-white">
            There may be a prize for the winning team.
          </p>
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
