import { formatUpdatedAt, sortParticipants } from "../lib/sortParticipants";
import { getSweepstakesData } from "../lib/tournament/data";

/*
 * Self-contained signage board for Fusion Signage on LG webOS (and the rest of
 * Fusion's supported range, down to Tizen 4 / Chromium ~56).
 *
 * It deliberately uses NONE of the app's Tailwind v4 styling: Tailwind v4 emits
 * cascade layers (`@layer`) and `oklch()` colors that older SoC webviews
 * (webOS 4-6 ≈ Chromium 53-79) cannot parse, so the entire Tailwind stylesheet
 * is dropped on those panels. Instead, all styling is an inline <style> block
 * restricted to old-safe CSS:
 *   - flexbox WITHOUT the `gap` property (unsupported before Chromium 84)
 *   - no CSS grid (unsupported before Chromium 57)
 *   - hex / rgba colors only, plain at-rules only
 * The page also renders entirely server-side and needs no JavaScript to display.
 */

const CSS = `
.wcd-root, .wcd-root * { box-sizing: border-box; }
.wcd-root {
  display: flex;
  height: 100vh;
  width: 100%;
  margin: 0;
  overflow: hidden;
  background: #f5ebe0;
  color: #26272c;
  font-family: var(--font-heebo), Arial, Helvetica, sans-serif;
}
.wcd-aside {
  flex: 0 0 18rem;
  width: 18rem;
  background: #1a1a1d;
  border-right: 1px solid rgba(76, 79, 94, 0.3);
  padding: 1.25rem;
  overflow-y: auto;
}
.wcd-title { font-size: 1.4rem; line-height: 1.2; font-weight: 700; color: #ffffff; margin: 0; }
.wcd-title-accent { color: #46c2ac; }
.wcd-updated { font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); margin: 0.5rem 0 0 0; }
.wcd-summary { margin-top: 1.25rem; }
.wcd-summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.45rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
}
.wcd-summary-num { font-weight: 700; color: #ffffff; }
.wcd-main { flex: 1 1 auto; overflow-y: auto; padding: 1.25rem; }
.wcd-error {
  background: #ffe6e0;
  border: 1px solid rgba(245, 138, 141, 0.4);
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.wcd-grid { display: flex; flex-wrap: wrap; margin: -0.5rem; }
.wcd-card {
  flex: 1 1 14rem;
  max-width: 22rem;
  margin: 0.5rem;
  background: #ffffff;
  border: 1px solid #e4d7c9;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}
.wcd-card-out { opacity: 0.7; }
.wcd-card-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; }
.wcd-name { font-size: 1rem; font-weight: 600; margin: 0; color: #26272c; }
.wcd-name-out { color: #4c4f5e; }
.wcd-out-badge {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  color: #e31e36;
  background: #ffe6e0;
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
  white-space: nowrap;
}
.wcd-flags { display: flex; flex-wrap: wrap; }
.wcd-flag { width: 4.5rem; text-align: center; margin: 0 0.75rem 0.5rem 0; }
.wcd-flag-elim { opacity: 0.5; }
.wcd-flag-imgwrap {
  position: relative;
  width: 3rem;
  height: 2rem;
  margin: 0 auto;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid #e4d7c9;
  background: #f8f8f8;
}
.wcd-flag-img { width: 100%; height: 100%; object-fit: cover; display: block; }
.wcd-flag-missing { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #4c4f5e; }
.wcd-flag-x {
  position: absolute;
  left: 0; top: 0; right: 0; bottom: 0;
  background: linear-gradient(to top right, transparent 49.5%, rgba(227, 30, 54, 0.85) 50%, transparent 50.5%);
}
.wcd-flag-name { font-size: 0.7rem; line-height: 1.15; margin-top: 0.2rem; color: #26272c; }
.wcd-flag-name-elim { text-decoration: line-through; color: #4c4f5e; }
.wcd-flag-meta { font-size: 0.6rem; line-height: 1.2; color: #4c4f5e; margin-top: 0.1rem; }
.wcd-flag-vs { font-weight: 600; color: #26272c; }
`;

export async function DisplayBoard() {
  const data = await getSweepstakesData();
  const participants = sortParticipants(data.participants, "still-in-first");

  const title = data.title;
  const equPrefix = title.match(/^equ/i)?.[0];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wcd-root">
        <aside className="wcd-aside">
          <h1 className="wcd-title">
            {equPrefix ? (
              <>
                <span className="wcd-title-accent">{equPrefix}</span>
                {title.slice(equPrefix.length)}
              </>
            ) : (
              title
            )}
          </h1>
          <p className="wcd-updated">
            Updated {formatUpdatedAt(data.status.updatedAt)}
          </p>

          <div className="wcd-summary">
            <div className="wcd-summary-row">
              <span>Total</span>
              <span className="wcd-summary-num">{data.summary.total}</span>
            </div>
            <div className="wcd-summary-row">
              <span>Still in</span>
              <span className="wcd-summary-num">{data.summary.stillIn}</span>
            </div>
            <div className="wcd-summary-row">
              <span>Eliminated</span>
              <span className="wcd-summary-num">{data.summary.eliminated}</span>
            </div>
          </div>
        </aside>

        <main className="wcd-main">
          {data.status.error && (
            <div className="wcd-error">
              Tournament data refresh failed: {data.status.error}
            </div>
          )}

          <div className="wcd-grid">
            {participants.map((participant) => {
              const isOut = participant.status === "eliminated";
              return (
                <article
                  key={participant.name}
                  className={isOut ? "wcd-card wcd-card-out" : "wcd-card"}
                >
                  <div className="wcd-card-head">
                    <h2 className={isOut ? "wcd-name wcd-name-out" : "wcd-name"}>
                      {participant.name}
                    </h2>
                    {isOut && <span className="wcd-out-badge">Out</span>}
                  </div>

                  <div className="wcd-flags">
                    {participant.countries.map((country) => {
                      const eliminated = country.status === "eliminated";
                      return (
                        <div
                          key={country.fifaCode}
                          className={
                            eliminated ? "wcd-flag wcd-flag-elim" : "wcd-flag"
                          }
                        >
                          <div className="wcd-flag-imgwrap">
                            {country.flagUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                className="wcd-flag-img"
                                src={country.flagUrl}
                                alt=""
                              />
                            ) : (
                              <span className="wcd-flag-missing">?</span>
                            )}
                            {eliminated && <span className="wcd-flag-x" />}
                          </div>
                          <div
                            className={
                              eliminated
                                ? "wcd-flag-name wcd-flag-name-elim"
                                : "wcd-flag-name"
                            }
                          >
                            {country.name}
                          </div>
                          {eliminated ? (
                            <div className="wcd-flag-meta">eliminated</div>
                          ) : (
                            country.nextMatch && (
                              <div className="wcd-flag-meta">
                                vs{" "}
                                <span className="wcd-flag-vs">
                                  {country.nextMatch.opponentFifaCode ??
                                    country.nextMatch.opponentName}
                                </span>
                                <br />
                                {country.nextMatch.kickoffDateLabel}
                                <br />
                                {country.nextMatch.kickoffTimeLabel}
                              </div>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}
