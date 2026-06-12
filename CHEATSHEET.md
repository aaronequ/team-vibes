# Vibe Coding Cheat Sheet

A reference for groups building a POC on top of this foundation.

---

## 1 · What's already built

You do **not** need to spec these — they exist and work.

| Piece | Where | What it gives you |
| --- | --- | --- |
| Welcome page | `app/page.tsx` | Branded session intro. Replace freely. |
| Brand styles | `app/globals.css` | Colours, fonts, heading sizes — already global. |
| Inter / Heebo / handwritten fonts | `app/layout.tsx` | Loaded via `next/font`. Just use them. |
| equ logos | `public/equ-{dark,green}-transparent-bg.png` | Use with `<Image>`. |
| Gemini client | `lib/gemini.ts` | `getGemini()` — server-side singleton. |
| Chat endpoint | `app/api/chat/route.ts` | `POST /api/chat`, text in → text out. |
| SQLite (installed, no schema) | `better-sqlite3` in deps | Add a schema if you need persistence. |

Stack: **Next.js 16** (App Router) · **React 19** · **Tailwind v4** ·
**TypeScript 6** · **`@google/genai` 2.x** · `better-sqlite3` 12.x.

---

## 2 · Capabilities you can lean on

**Cheap & fast (already wired):**
- Text-in / text-out chat with Gemini 2.5 Flash.
- Multi-turn conversations (pass full `messages` history each call).
- System prompts to steer tone, format, persona (`systemInstruction`).
- New brand-styled pages — `<h1>`–`<h6>`, brand colours, fonts all default.
- Server-side data fetching in any page or route handler.

**Cheap but needs a few lines of code:**
- Structured JSON output from Gemini (set `config.responseSchema`).
- A second API route for a non-chat task (summary, classification, etc.).
- A SQLite table for storing things between requests.
- A form on the welcome page that posts to a new route.

**Possible but cost real time — be careful:**
- Image / file uploads to Gemini (route needs multimodal `parts`).
- Streaming responses (route currently waits for full reply).
- Auth, user accounts, sessions.
- Anything multi-page with shared state.
- Realtime / websockets.

---

## 3 · Constraints (read these before designing)

- **API key is server-side only.** Never call Gemini from a browser
  component — go through a route handler. `lib/gemini.ts` enforces this at
  build time.
- **Brand palette is the design system.** Use `bg-teal`, `text-slate`,
  `bg-stone-2`, `bg-dark`, `text-dark`, etc. — don't reach for raw hex or
  default Tailwind colours unless you really need to.
- **Heading sizes are already set.** Use `<h1>` through `<h6>`; don't
  re-style them per page.
- **The dev session is timeboxed.** Anything you can't demo in 30 seconds
  probably isn't worth speccing.
- **Next.js 16 has breaking changes vs older Next.** If the developer is
  unsure about a Next API, the docs are at `node_modules/next/dist/docs/`
  — point them there.

---

## 4 · Spec template — fill these in as a group

A good vibe-coding spec is **one page**. Aim to answer every line below
before the developer starts prompting.

### A. The pitch
**One sentence.** "An app that ___ for ___ so they can ___."

### B. The user
- Who is the primary user? (one persona, not a list)
- What problem are they trying to solve in the next 5 minutes?
- Why would they open this app instead of just googling / asking ChatGPT?

### C. The demo path (THE most important section)
The 30-second story you'll show when voting happens. Step by step:
1. User lands on…
2. They click / type…
3. The app responds with…
4. They see…
5. (optional) They can also…

> If you can't write the demo path in five steps, the scope is too big.

### D. Gemini's job
Be specific. Pick one or two:
- [ ] **Generate** something (text, list, plan, story, summary).
- [ ] **Transform** input (rewrite, translate, simplify, formalise).
- [ ] **Classify / extract** (label, score, pull fields from text).
- [ ] **Converse** (multi-turn chat with a persona / domain).
- [ ] **Reason / decide** (recommend, compare, choose).

What's the **input format**? What's the **output format**?
(One sentence each. "User types a sentence, AI returns three rhyming alternatives" beats "AI writes poetry.")

### E. Data
- Does anything need to survive a page reload? **Yes / No.**
- If yes: what table(s), what columns, what's the key?
- If no: keep it in component state, you're done.

### F. Screens
List the views. Probably 1–3.
- `/` — what it shows
- `/<something>` — what it shows

### G. Out of scope (explicit non-goals)
The 3–5 things you are deliberately **not** building. This is what
protects you from feature creep in the last 10 minutes.

### H. Stretch goals
Only if everything above is working. Don't start here.

---

## 5 · Tips for prompting the AI well

- **Show, don't tell.** Paste an example of the input and the desired
  output. One concrete example beats five paragraphs of description.
- **Anchor in this codebase.** Tell the AI: "Use the existing
  `getGemini()` helper in `lib/gemini.ts`. Use brand colours from
  `app/globals.css` (`bg-teal`, `text-slate`, etc.)." This prevents the AI
  from installing new packages or inventing a new design system.
- **Build vertically, not horizontally.** Get *one* end-to-end path
  working (form → Gemini → result page rendered) before adding features.
  A janky working demo beats a beautiful broken one.
- **Test the Gemini call first.** Before wiring it into a UI, curl
  `/api/chat` with your prompt and see what Gemini actually returns. If
  the output's wrong, fix the prompt — don't paper over it in code.
- **Name your demo path out loud.** Before each AI prompt, the developer
  should be able to say "this gets us closer to step N of the demo."
  If it doesn't, skip it.
- **One feature, one prompt.** Don't ask the AI to "build the whole app."
  Ask it to "add a textarea to `app/page.tsx` that posts its value to
  `/api/chat` and renders the response below."

---

## 6 · Worked example (fictional)

> **The pitch**: An app that turns a vague project idea into a one-page
> spec sheet, for non-technical PMs, so they can hand it to a developer.
>
> **User**: A PM with a half-formed idea, 60 seconds, no time to write
> docs.
>
> **Demo path**:
> 1. Land on a Stone-2 page with a single textarea: "What's the idea?"
> 2. PM types: "an app that finds me a lunch spot based on the weather"
> 3. Click *Make spec*.
> 4. Page shows a brand-styled spec card: pitch, user, 3-step flow,
>    data needs, out of scope — all generated by Gemini in one call.
> 5. (Stretch) A copy-to-clipboard button.
>
> **Gemini's job**: Transform. Input = free-text idea. Output = JSON with
> fields `{pitch, user, flow: string[], data, outOfScope: string[]}`,
> rendered into a styled card.
>
> **Data**: None — stateless.
>
> **Screens**: Just `/`.
>
> **Out of scope**: Saving specs, accounts, editing the output,
> regenerating sections, dark mode.
>
> **Stretch**: Copy button; example prompts the user can click.

---

## 7 · Pre-flight checklist

Before the developer starts coding, the group should be able to say
"yes" to all of these:

- [ ] We have a one-sentence pitch.
- [ ] We have a 5-step demo path.
- [ ] We know exactly what Gemini's input and output look like.
- [ ] We know whether anything needs to persist.
- [ ] We have a written list of what we're **not** building.
- [ ] The whole thing fits comfortably in the time you have.

If any of these are "no", spec a smaller app.
