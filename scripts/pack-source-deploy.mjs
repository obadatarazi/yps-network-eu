#!/usr/bin/env node
/** Zip source for Hostinger Node.js deploy (no node_modules, no .env). */
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const outDir = join(root, "deploy");
mkdirSync(outDir, { recursive: true });

const d = new Date();
const p = (n) => String(n).padStart(2, "0");
const stamp = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
const zipPath = join(outDir, `yps-source_${stamp}.zip`);

if (existsSync(join(root, ".git"))) {
  const r = spawnSync(
    "git",
    ["archive", "--format=zip", "-o", zipPath, "HEAD"],
    { cwd: root, stdio: "inherit" },
  );
  if (r.status === 0) {
    console.log("[pack:source] wrote", zipPath);
    console.log("[pack:source] Uncommitted changes are NOT included.");
    process.exit(0);
  }
}

const r = spawnSync(
  "zip",
  [
    "-r",
    zipPath,
    ".",
    "-x",
    "node_modules/*",
    ".git/*",
    ".vercel/*",
    "deploy/*.zip",
    ".env",
    ".env.*",
    "screenshots/*",
    "artifacts/*",
    "*.log",
  ],
  { cwd: root, stdio: "inherit" },
);

if (r.status !== 0) process.exit(r.status ?? 1);
console.log("[pack:source] wrote", zipPath);
