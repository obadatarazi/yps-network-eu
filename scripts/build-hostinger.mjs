#!/usr/bin/env node
/**
 * Hostinger Node.js production build.
 *
 * Same steps as `npm run build`, with Nitro's node-server preset so the
 * output is `.output/server/index.mjs`. Hostinger's build command should be
 * `npm run build:hostinger`, output directory `.output`, entry `server/index.mjs`.
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = { ...process.env, NITRO_PRESET: "node-server" };

function run(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, args, { cwd: root, env, stdio: "inherit" });
    child.on("error", (err) => {
      console.error("[build:hostinger]", err?.message || err);
      resolve(127);
    });
    child.on("exit", (code, signal) => {
      resolve(signal ? 1 : (code ?? 1));
    });
  });
}

const buildCode = await run([join(root, "scripts/with-app-env.mjs"), "vite", "build"]);
if (buildCode !== 0) process.exit(buildCode);

const migrateCode = await run([join(root, "scripts/migrate.mjs")]);
process.exit(migrateCode);
