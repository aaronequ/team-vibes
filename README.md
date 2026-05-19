# robot-vibes

The welcome page for an equ AI App building session, with the equ brand
styles and a Gemini chat endpoint preloaded.

## Quick start

```bash
npm install
echo "GEMINI_API_KEY=your-key-here" > .env.local
npm run dev
```

Open <http://localhost:3000>.

## Environment

| Var | Required | Notes |
| --- | --- | --- |
| `GEMINI_API_KEY` | yes | Server-side only. Get one at <https://aistudio.google.com/apikey>. |

`.env*` is gitignored.

## Scripts

- `npm run dev` — Next dev server (Turbopack).
- `npm run build` — production build.
- `npm run start` — serve the production build.
- `npm run lint` — ESLint.

## Project layout

```
app/
  layout.tsx          # loads Inter / Heebo / Just Me Again Down Here
  page.tsx            # session intro page
  globals.css         # brand tokens (@theme) + base typography
  api/chat/route.ts   # POST /api/chat — Gemini chat endpoint
lib/
  gemini.ts           # server-only Gemini client (getGemini())
public/
  equ-dark-transparent-bg.png
  equ-green-transparent-bg.png
```

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind CSS v4 (CSS-first `@theme`)
- TypeScript 6, ESLint 9
- `@google/genai` 2.x
- `better-sqlite3` 12.x (installed; no schema yet)

> Per `AGENTS.md`: this Next.js has breaking changes from older releases.
> Check `node_modules/next/dist/docs/` before writing route handlers, fonts,
> or config.

## Brand styles

Tokens live in `app/globals.css` under `@theme` and are exposed as Tailwind
utilities.

**Colours:** `teal`, `light-teal`, `salmon`, `light-salmon`, `white`,
`stone`, `stone-2`, `stone-3`, `stone-4`, `slate`, `dark`, `dark-2` — use as
`bg-*`, `text-*`, `border-*`, etc.

**Fonts:** `font-sans` (Heebo, body default), `font-heading` (Inter),
`font-handwritten` (Just Me Again Down Here — only use ≥20px per the brand
guide).

`<h1>`–`<h6>` are pre-styled to brand spec via `@layer base`: Inter Semi
Bold, Dark, -2% tracking, 110% line-height, sizes 64 / 56 / 48 / 32 / 28 /
20 px. `<strong>` / `<b>` shift to Dark to match the "emphasised" rule.

## Using Gemini

**Server code** (route handlers, server components, server actions):

```ts
import { getGemini, DEFAULT_MODEL } from "@/lib/gemini";

const res = await getGemini().models.generateContent({
  model: DEFAULT_MODEL,
  contents: "your prompt",
});
console.log(res.text);
```

**Client code** — call the route handler:

```ts
const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: "your prompt" }],
  }),
});
const { text } = await res.json();
```

The route accepts
`{ messages: [{role: "user"|"model", content: string}], model?, systemInstruction? }`
and returns `{ text: string }`.

`lib/gemini.ts` imports `server-only`, so importing it from a Client
Component will fail at build time and the API key cannot leak to the
browser.
