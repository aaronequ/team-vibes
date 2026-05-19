# Merge Plan: team-1 (SnapChef) into team-host

Bringing the SnapChef recipe app from `C:\Projects\Training\team-1` into the
host under `/team-1`. This merge is **not** a pure copy — team-1 has multiple
interlinked routes with hardcoded absolute paths, plus its own theme that
overlaps with the host's globals. Source files will be copied, then a small
number of mechanical path edits applied.

## Route mapping

| Source                          | Destination in host                |
| ------------------------------- | ---------------------------------- |
| `team-1/app/page.tsx` (home)    | `/team-1`                          |
| `team-1/app/scan/page.tsx`      | `/team-1/scan`                     |
| `team-1/app/recipes/page.tsx`   | `/team-1/recipes`                  |
| `team-1/app/cook/page.tsx`      | `/team-1/cook`                     |
| `team-1/app/api/scan/route.ts`  | `/team-1/api/scan` (POST)          |
| `team-1/app/api/recipes/route.ts` | `/team-1/api/recipes` (POST)     |

Existing host stub at `app/team-1/page.tsx` is overwritten by the SnapChef home.

## Why this is more involved than teams 2/3/4

Same starter heritage, so deps / fonts / `@/*` alias are aligned. But team-1
adds three things that need handling:

1. **A custom Tailwind theme** (Basil green / navy / citrus) with
   `--color-primary`, `--color-secondary`, `--color-accent`,
   `--color-text-main`, `--color-text-light`, `--color-bg-main`,
   `--color-bg-surface`, plus a `.card-shadow` utility. Names don't collide
   with host's `--color-teal` / `--color-stone` / etc., so we can additively
   merge.
2. **A different `app/layout.tsx`** that sets a custom `viewport`, a
   `manifest.json` reference, and `<body>` classes (`bg-bg-main text-text-main
   selection:bg-primary/20 selection:text-secondary`). We can't re-emit
   `<html>` / `<body>` in a nested layout, so we extract metadata + viewport +
   body classes into a wrapping `<div>` in `app/team-1/layout.tsx`.
3. **Hardcoded absolute paths** in nine places (Links, `router.push`,
   `fetch` URLs) that have to be prefixed with `/team-1`.

## Per-file moves

### Pages and API routes

| From                                          | To                                          |
| --------------------------------------------- | ------------------------------------------- |
| `team-1/app/page.tsx`                         | `team-host/app/team-1/page.tsx` *(overwrites stub)* |
| `team-1/app/scan/page.tsx`                    | `team-host/app/team-1/scan/page.tsx`        |
| `team-1/app/recipes/page.tsx`                 | `team-host/app/team-1/recipes/page.tsx`     |
| `team-1/app/cook/page.tsx`                    | `team-host/app/team-1/cook/page.tsx`        |
| `team-1/app/api/scan/route.ts`                | `team-host/app/team-1/api/scan/route.ts`    |
| `team-1/app/api/recipes/route.ts`             | `team-host/app/team-1/api/recipes/route.ts` |

### Components

All nine components copied verbatim — their relative imports (`../components/...`,
`./components/...`) preserve correctness if we keep the folder location.

| From                                          | To                                          |
| --------------------------------------------- | ------------------------------------------- |
| `team-1/app/components/AppHeader.tsx`         | `team-host/app/team-1/components/AppHeader.tsx` |
| `team-1/app/components/CameraCapture.tsx`     | `team-host/app/team-1/components/CameraCapture.tsx` |
| `team-1/app/components/CookStep.tsx`          | `team-host/app/team-1/components/CookStep.tsx` |
| `team-1/app/components/IngredientChip.tsx`    | `team-host/app/team-1/components/IngredientChip.tsx` |
| `team-1/app/components/IngredientList.tsx`    | `team-host/app/team-1/components/IngredientList.tsx` |
| `team-1/app/components/LoadingScanner.tsx`    | `team-host/app/team-1/components/LoadingScanner.tsx` |
| `team-1/app/components/RecipeCard.tsx`        | `team-host/app/team-1/components/RecipeCard.tsx` |
| `team-1/app/components/RecipeFilters.tsx`     | `team-host/app/team-1/components/RecipeFilters.tsx` |
| `team-1/app/components/ui/Button.tsx`         | `team-host/app/team-1/components/ui/Button.tsx` |

### New nested layout (created from team-1's root layout, minus html/body)

`team-host/app/team-1/layout.tsx`:

```tsx
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "SnapChef",
  description: "Your Smart Fridge Recipe Assistant",
};

export const viewport: Viewport = {
  themeColor: "#F8FAFC",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function Team1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col bg-bg-main text-text-main selection:bg-primary/20 selection:text-secondary">
      {children}
    </div>
  );
}
```

Dropped from the original: `<html>` / `<body>` wrappers (host root layout
owns those), the Inter font import (host already loads Inter as
`--font-inter`), and the `manifest.json` reference (skipping for now —
PWA-only and we'd otherwise have to copy/rename `manifest.json` to avoid
collision).

### Public assets

| From                          | To                              |
| ----------------------------- | ------------------------------- |
| `team-1/public/logo.png`      | `team-host/public/logo.png`     |

`team-1/public/manifest.json` is **not** copied (see layout note above).
Everything else under `team-1/public/` already exists in the host (the equ
logos and the Next default SVGs aren't referenced by team-1's pages).

### globals.css merge

Append into the host's existing `@theme` block (no overwrites — the names are
disjoint from host's):

```css
--color-primary: #10B981;
--color-primary-dark: #059669;
--color-secondary: #1E293B;
--color-accent: #F59E0B;
--color-text-main: #334155;
--color-text-light: #64748B;
--color-bg-main: #F8FAFC;
--color-bg-surface: #FFFFFF;
```

Plus, outside `@theme`, append team-1's utility layer:

```css
@layer utilities {
  .card-shadow {
    box-shadow: 0 4px 20px -4px rgba(0, 0, 0, 0.05);
  }
}
```

**Skipping** team-1's `@layer base` rules — they redefine `body` and h1–h4
sizes globally. Team-1's pages already use explicit Tailwind classes
(`text-3xl font-bold`, `text-4xl font-bold`, etc.) so they don't rely on
those base rules. The body classes that *do* matter are reapplied via the
wrapping `<div>` in the new nested layout.

## Required path edits (post-copy)

These are the only edits to source content — paths must be rewritten because
team-1 was authored at the root of its own project. Nine call sites:

| File                                          | Original                              | After                                          |
| --------------------------------------------- | ------------------------------------- | ---------------------------------------------- |
| `app/team-1/page.tsx`                         | `Link href="/scan"`                   | `Link href="/team-1/scan"`                     |
| `app/team-1/components/AppHeader.tsx`         | `Link href="/"`                       | `Link href="/team-1"`                          |
| `app/team-1/scan/page.tsx`                    | `fetch("/api/scan", …)`               | `fetch("/team-1/api/scan", …)`                 |
| `app/team-1/scan/page.tsx`                    | `router.push("/recipes")`             | `router.push("/team-1/recipes")`               |
| `app/team-1/scan/page.tsx`                    | `router.push("/")` *(camera cancel)*  | `router.push("/team-1")`                       |
| `app/team-1/recipes/page.tsx`                 | `router.push('/scan')` *(×2)*         | `router.push('/team-1/scan')`                  |
| `app/team-1/recipes/page.tsx`                 | `fetch('/api/recipes', …)`            | `fetch('/team-1/api/recipes', …)`              |
| `app/team-1/recipes/page.tsx`                 | `router.push('/cook')`                | `router.push('/team-1/cook')`                  |
| `app/team-1/cook/page.tsx`                    | `router.push('/recipes')`             | `router.push('/team-1/recipes')`               |
| `app/team-1/cook/page.tsx`                    | `router.push('/')` *(completion)*     | `router.push('/team-1')`                       |

Choice point: the two `router.push('/')` cases (camera cancel, recipe
completion) currently land on the SnapChef home. I'm rewriting them to
`/team-1` (back to SnapChef home) rather than `/` (back to the host team
picker) — keeps the user inside the app flow. Easy to flip the other way if
preferred.

## Env / runtime

- Team-1's own `lib/gemini.ts` checks `HOUSE_GEMINI_KEY`. We're **not**
  copying it — the host's `lib/gemini.ts` (which uses `GEMINI_API_KEY` and is
  already wired up for teams 2/3/4) will resolve the `@/lib/gemini` imports
  in the team-1 API routes. So no env mismatch — `GEMINI_API_KEY` from
  host's `.env.local` is the only key needed.
- Team-1's `next.config.ts` sets `allowedDevOrigins: ['10.100.41.154']`. Not
  copying — host doesn't have this. If anyone needs to dev-test from that
  LAN IP we can add it later.

## What is *not* being done

- No `npm install` — host already declares every dep at matching versions.
- Public `manifest.json` not copied (avoids needing a PWA scope and a
  rename — easy to add later if you want SnapChef installable).
- The Next default SVGs from `team-1/public/` aren't copied — already in the
  host and unused by these pages anyway.
- Host's root `layout.tsx` and `globals.css` shell stay untouched apart from
  the additive theme vars and utility above.
- Components aren't restructured — folder lives at `app/team-1/components/`
  to preserve every `../components/...` relative import as-is.

## Caveats

- **Camera capture** in `CameraCapture.tsx` uses `getUserMedia`. Browsers
  require HTTPS (or localhost) for camera access — works in dev; production
  deploy needs HTTPS.
- **`fetch('/api/scan')` payload size**: base64-encoded fridge images can be
  several MB. No Next.js body-size limit issue currently configured; flag if
  a 413 shows up.
- **Heading sizes** differ between team-1 (h1: 2rem) and host (h1: 64px) at
  the base layer. Since we're skipping team-1's `@layer base` override,
  team-1's headings will inherit host's base sizes unless they have explicit
  Tailwind classes. From inspection, every visible heading on team-1's pages
  already has explicit classes — but if anything renders too large, the fix
  is to scope team-1's base rules into a `.team-1-scope` class and apply it
  on the layout's wrapping div.

## Resulting structure (new bits only)

```
team-host/
  app/
    globals.css                          (extended @theme + .card-shadow)
    team-1/
      layout.tsx                         (NEW — nested layout)
      page.tsx                           (SnapChef home; replaces stub)
      scan/page.tsx
      recipes/page.tsx
      cook/page.tsx
      components/
        AppHeader.tsx
        CameraCapture.tsx
        CookStep.tsx
        IngredientChip.tsx
        IngredientList.tsx
        LoadingScanner.tsx
        RecipeCard.tsx
        RecipeFilters.tsx
        ui/Button.tsx
      api/
        scan/route.ts
        recipes/route.ts
  public/
    logo.png                             (NEW)
```
