"use client";

import { useState } from "react";

const CHANNEL = "lets-work-together";
const USER = {
  name: "Alex Morgan",
  email: "alex@equ.com",
  initials: "AM",
};
const WFH_STATUS = "Working from home";
const MEETING = {
  title: "Weekly Team Sync",
  time: "2:00 PM – 3:00 PM",
  room: "Meeting Room 2",
};

const STATUS_OPTIONS = [
  { id: "wfh", label: WFH_STATUS, emoji: "🏠" },
  { id: "office", label: "In the office", emoji: "🏢" },
] as const;

const SIDEBAR_CHANNELS = ["general", "random", CHANNEL, "team-updates"];

function BotAvatar() {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#2c2d30] text-xl"
      aria-hidden
    >
      🤖
    </div>
  );
}

function BotMeta() {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-sm font-bold text-white">Room Release Assistant</span>
      <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/70">
        App
      </span>
      <span className="text-xs text-white/40">Only visible to you</span>
    </div>
  );
}

export function SlackDemoVisual() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [roomReleased, setRoomReleased] = useState(false);

  const isWorkingFromHome = selectedStatus === WFH_STATUS;
  const showBookingNotification = isWorkingFromHome && !roomReleased;
  const showSuccessNotification = isWorkingFromHome && roomReleased;
  const showChannelBadge = showBookingNotification;

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setRoomReleased(false);
  };

  const handleReleaseRoom = () => {
    setRoomReleased(true);
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-slate">
        Set your status to <strong className="text-dark">{WFH_STATUS}</strong> to
        trigger the room booking alert, then release the room.
      </p>

      <div className="flex min-h-[28rem] overflow-hidden rounded-lg border border-white/10 shadow-xl">
        <nav
          className="hidden w-52 shrink-0 flex-col bg-[#3f0e40] sm:flex"
          aria-label="Slack sidebar"
        >
          <div className="border-b border-white/10 px-4 py-4">
            <p className="text-sm font-bold text-white">equ Workspace</p>
          </div>
          <ul className="px-2 py-3">
            <li className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-white/50">
              Channels
            </li>
            {SIDEBAR_CHANNELS.map((ch) => (
              <li key={ch}>
                <span
                  className={`flex items-center justify-between rounded px-2 py-1 text-sm ${
                    ch === CHANNEL
                      ? "bg-[#1164a3] font-medium text-white"
                      : "text-white/70"
                  }`}
                >
                  <span># {ch}</span>
                  {ch === CHANNEL && showChannelBadge && (
                    <span
                      className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e01e5a] px-1.5 text-xs font-bold text-white"
                      aria-hidden
                    >
                      1
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        <main className="flex min-w-0 flex-1 flex-col bg-[#1a1d21]">
          <header className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <span className="text-lg font-bold text-white"># {CHANNEL}</span>
            <span className="text-sm text-white/50">|</span>
            <span className="truncate text-sm text-white/70">
              Share where you&apos;re working today
            </span>
          </header>

          <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
            {/* Status picker */}
            <div className="flex gap-3">
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-teal text-sm font-semibold text-white"
                aria-hidden
              >
                {USER.initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-2 text-sm text-white/70">Set your status in this channel</p>
                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((opt) => {
                    const active = selectedStatus === opt.label;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleStatusSelect(opt.label)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition ${
                          active
                            ? "border-teal bg-teal/20 text-white"
                            : "border-white/20 text-white/80 hover:border-white/40 hover:bg-white/5"
                        }`}
                      >
                        <span className="mr-1" aria-hidden>
                          {opt.emoji}
                        </span>
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Status posted to channel */}
            {selectedStatus && (
              <div className="flex gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-stone-4 text-sm font-semibold text-dark"
                  aria-hidden
                >
                  {USER.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-white/50">
                    <span className="font-semibold text-white">{USER.name}</span>{" "}
                    · Just now
                  </p>
                  <div className="mt-1 inline-flex items-center gap-2 rounded-lg bg-[#222529] px-3 py-2 text-sm text-white">
                    <span aria-hidden>
                      {selectedStatus === WFH_STATUS ? "🏠" : "🏢"}
                    </span>
                    <span>
                      Set status to{" "}
                      <strong className="text-teal">{selectedStatus}</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Room booking notification */}
            {showBookingNotification && (
              <div
                className="flex gap-3 rounded-lg border-l-4 border-[#e8b339] bg-[#222529] px-4 py-4 shadow-lg"
                role="status"
              >
                <BotAvatar />
                <div className="min-w-0 flex-1 space-y-2">
                  <BotMeta />
                  <p className="text-base font-semibold leading-snug text-[#e8b339]">
                    Meeting room booked while you&apos;re working from home
                  </p>
                  <p className="text-sm leading-relaxed text-white/90">
                    Hi {USER.name.split(" ")[0]}, you&apos;re working from home today,
                    but you still have{" "}
                    <strong className="text-white">{MEETING.room}</strong> reserved
                    for <strong className="text-white">{MEETING.title}</strong> (
                    {MEETING.time}).
                  </p>
                  <div className="rounded-md border border-white/10 bg-[#1a1d21] px-3 py-2 text-sm text-white/80">
                    <p>
                      <span className="text-white/50">Room · </span>
                      {MEETING.room}
                    </p>
                    <p>
                      <span className="text-white/50">When · </span>
                      {MEETING.time}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReleaseRoom}
                    className="mt-1 rounded-md bg-[#007a5a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#148567]"
                  >
                    Release {MEETING.room}
                  </button>
                </div>
              </div>
            )}

            {/* Room released confirmation */}
            {showSuccessNotification && (
              <div
                className="flex gap-3 rounded-lg border-l-4 border-teal bg-light-teal/10 px-4 py-4 shadow-lg ring-1 ring-teal/30"
                role="status"
              >
                <BotAvatar />
                <div className="min-w-0 flex-1 space-y-2">
                  <BotMeta />
                  <p className="text-base font-semibold leading-snug text-teal">
                    <span className="mr-1.5" aria-hidden>
                      ✓
                    </span>
                    Room released successfully
                  </p>
                  <p className="text-sm leading-relaxed text-white/90">
                    <strong className="text-white">{MEETING.room}</strong> has been
                    removed from &quot;{MEETING.title}&quot; and is now available for
                    the team.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
