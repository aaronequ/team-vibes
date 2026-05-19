import Link from "next/link";

export function RoomReleaseHeader() {
  return (
    <header className="border-b border-stone-3 bg-white px-6 py-4 sm:px-10">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal">
            Visual demo
          </p>
          <h1 className="text-2xl! sm:text-3xl!">Room Release Connector</h1>
          <p className="mt-1 max-w-xl text-sm text-slate">
            Set your status to <strong className="text-dark">Working from home</strong>{" "}
            to see the room booking alert for{" "}
            <strong className="text-dark">Meeting Room 2</strong>, then release the
            room to confirm it is cleared.
          </p>
        </div>
        <Link
          href="/"
          className="text-sm font-medium text-teal hover:underline"
        >
          ← Back to session home
        </Link>
      </div>
    </header>
  );
}
