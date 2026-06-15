import { headers } from "next/headers";

// Diagnostic endpoint: echoes the requesting client's User-Agent as plain text.
// Reading headers() makes this dynamic (per-request), so loading it on the TV
// reveals exactly which browser engine/version the signage player uses — even
// though JavaScript does not run there.
export async function GET() {
  const h = await headers();
  const ua = h.get("user-agent") ?? "(no user-agent header)";
  const accept = h.get("accept") ?? "(no accept header)";

  const body = [
    "Worldcup signage diagnostic",
    "",
    `User-Agent: ${ua}`,
    `Accept: ${accept}`,
  ].join("\n");

  return new Response(body + "\n", {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
