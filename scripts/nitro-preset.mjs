/**
 * Nitro target for a production build.
 *
 * `npm run build` stays on `vercel` (`.vercel/output`). Hostinger Node.js
 * cannot start that bundle. `npm run build:hostinger` sets
 * `NITRO_PRESET=node-server`, which writes `.output/server/index.mjs`.
 * Preview always stays on `vercel` so it serves the local Vercel build.
 */
export function resolveNitroPreset(env, { preview = false } = {}) {
  if (preview) return "vercel";
  return env.NITRO_PRESET === "node-server" ? "node-server" : "vercel";
}
