export type AppMode = "default" | "display";

export function getAppMode(search: string): AppMode {
  const mode = new URLSearchParams(search).get("mode");
  return mode === "display" ? "display" : "default";
}

export function isDisplayMode(search: string): boolean {
  return getAppMode(search) === "display";
}
