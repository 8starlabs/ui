/**
 * Edge cache policy for prerendered text/markdown route handlers
 * (`/llms.txt`, `/llms-full.txt`, `/design.md`, `/llm/*`).
 *
 * Without this, every request — and LLM crawlers hit these hard — reaches the
 * function, costing an ISR read plus Fast Origin Transfer each time. The output
 * is a pure function of the build, so let the edge hold it for a year (a
 * deployment purges the CDN cache, so content stays fresh on release) while
 * browsers re-check daily. Mirrors the policy used for `/og` and public assets
 * in `next.config.ts`.
 */
export const STATIC_CONTENT_CACHE_CONTROL =
  "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800";
