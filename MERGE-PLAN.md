# Merge Plan: team-2, team-3, team-4 into team-host

Bringing three sibling Next.js projects into this host app as nested route
segments. Source pages are copied **as is** — no rewrites.

## Route mapping

| Source                                       | Destination in host |
| -------------------------------------------- | ------------------- |
| `team-2/app/page.tsx`                        | `/team-2`           |
| `team-3/app/page.tsx`                        | `/team-3`           |
| `team-4/app/room-release/page.tsx`           | `/team-4`           |

Team 1 is left untouched for now. Team 4's own `app/page.tsx` is **not**
brought over — `/team-4` lands directly on the room-release content.

## Why this is mostly a copy job

All three team projects are forks of the same starter. The host already has:

- `lib/gemini.ts` (identical across all four projects)
- `app/api/chat/route.ts` (identical across all four projects)
- The two `equ-*.png` logos in `public/`
- Identical `package.json` dependency versions
- Identical `app/layout.tsx` (fonts, html shell)
- Identical `app/globals.css` core (team-3 has 3 extra animations — see below)
- `@/*` path alias pointing to project root

Net effect: no `npm install`, no duplicate API routes, no font setup, no asset copying.
All team pages call `/api/chat` as an **absolute path**, so the existing host
route handles them from any depth.

## Per-team file moves

### Team 2 → `/team-2`

| From                                          | To                                          |
| --------------------------------------------- | ------------------------------------------- |
| `team-2/app/page.tsx`                         | `team-host/app/team-2/page.tsx`             |

Single-file move. ~1076-line pirate-themed client component. Calls `/api/chat`
(host already serves it).

### Team 3 → `/team-3`

| From                                          | To                                                  |
| --------------------------------------------- | --------------------------------------------------- |
| `team-3/app/page.tsx`                         | `team-host/app/team-3/page.tsx`                     |
| `team-3/app/components/QuoteDisplay.tsx`      | `team-host/app/team-3/components/QuoteDisplay.tsx`  |
| `team-3/app/components/TimerDisplay.tsx`      | `team-host/app/team-3/components/TimerDisplay.tsx`  |
| `team-3/app/api/quote/route.ts`               | `team-host/app/api/quote/route.ts` *(new)*          |
| `team-3/lib/hooks/useAudioPlayer.ts`          | `team-host/lib/hooks/useAudioPlayer.ts`             |
| `team-3/lib/hooks/useFitnessTimer.ts`         | `team-host/lib/hooks/useFitnessTimer.ts`            |

**`globals.css` merge required.** Team-3 adds three keyframe animations
inside its `@theme` block:

```css
--animate-beat-fast: beat-fast 0.46s infinite ease-in-out;
--animate-beat-slow: beat-slow 1s infinite ease-in-out;
--animate-beat-breath: beat-breath 1.5s infinite ease-in-out;

@keyframes beat-fast { ... }
@keyframes beat-slow { ... }
@keyframes beat-breath { ... }
```

These get appended into the host's existing `@theme` block. No other CSS
deltas. `useFitnessTimer.ts` calls `/api/quote` as an absolute path — works
once the route is in place at the host root.

### Team 4 → `/team-4` (room-release content, directly)

| From                                                                | To                                                  |
| ------------------------------------------------------------------- | --------------------------------------------------- |
| `team-4/app/room-release/page.tsx`                                  | `team-host/app/team-4/page.tsx`                     |
| `team-4/app/room-release/layout.tsx`                                | `team-host/app/team-4/layout.tsx`                   |
| `team-4/app/room-release/RoomReleaseHeader.tsx`                     | `team-host/app/team-4/RoomReleaseHeader.tsx`        |
| `team-4/app/room-release/_components/SlackDemoVisual.tsx`           | `team-host/app/team-4/_components/SlackDemoVisual.tsx` |

All internal imports are relative (`./_components/...`,
`./RoomReleaseHeader`) so they keep resolving after the move. The header's
"Back to session home" link points to `/`, which lands on the host
team-picker page — reads correctly.

## What is *not* being done

- Public assets are not copied — host already has the equ logos; the Next
  default SVGs (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`,
  `window.svg`) aren't referenced by any of the team pages we're bringing
  over.
- Team page source is not edited — copied as is.
- No `npm install` — host's `package.json` already declares every required
  dependency at the same version (`@google/genai`, `better-sqlite3`,
  `server-only`, Next 16.2.6, React 19.2.6, Tailwind 4.3.0).
- Host's root `layout.tsx` and `globals.css` shell are kept — fonts, html
  wrapper, body classes match across all projects.

## Caveats to flag

- Team-3's `useAudioPlayer.ts` loads the YouTube IFrame API and mounts a
  player into a `#youtube-player-container` div. That div is rendered by
  the copied `page.tsx` so it should work in-place, but YouTube-side
  autoplay / rate-limit behaviour hasn't been verified end-to-end.
- Team-2's `app/page.tsx` is large and client-heavy; copied verbatim. If
  any hidden absolute imports exist beyond the `@/lib/gemini` style ones
  already covered by the host alias, they will surface as build errors at
  copy time.

## Resulting host structure (relevant parts)

```
team-host/
  app/
    page.tsx                          (host home — team picker; unchanged)
    layout.tsx                        (host root layout)
    globals.css                       (host CSS + merged team-3 animations)
    api/
      chat/route.ts                   (existing — shared with all teams)
      quote/route.ts                  (NEW — copied from team-3)
    team-1/page.tsx                   (existing stub; untouched)
    team-2/
      page.tsx
    team-3/
      page.tsx
      components/
        QuoteDisplay.tsx
        TimerDisplay.tsx
    team-4/
      layout.tsx
      page.tsx
      RoomReleaseHeader.tsx
      _components/
        SlackDemoVisual.tsx
  lib/
    gemini.ts                         (existing — shared)
    hooks/                            (NEW directory)
      useAudioPlayer.ts
      useFitnessTimer.ts
```
