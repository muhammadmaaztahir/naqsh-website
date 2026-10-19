// Lightweight Sanity (headless CMS) client — read-only, uses the public CDN API.
// Set VITE_SANITY_PROJECT_ID (and optionally VITE_SANITY_DATASET) in .env / hosting env vars.

export const SANITY_PROJECT_ID = (import.meta.env["VITE_SANITY_PROJECT_ID"] as string | undefined)?.trim();
export const SANITY_DATASET = (import.meta.env["VITE_SANITY_DATASET"] as string | undefined)?.trim() || "production";
export const SANITY_API_VERSION = "2024-01-01";

export const isSanityConfigured = Boolean(SANITY_PROJECT_ID);

export async function sanityFetch<T>(query: string): Promise<T> {
  if (!SANITY_PROJECT_ID) throw new Error("Sanity project id is not configured");
  const url = `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sanity request failed (${res.status})`);
  const json = (await res.json()) as { result: T };
  return json.result;
}
