#!/usr/bin/env node
/**
 * Frontend-only deploy packer for Hostinger shared / static upload:
 * 1) builds without DB migrate
 * 2) copies .vercel/output/static → deploy/hostinger-public
 * 3) SSR-renders / into index.html (via nitro preview server)
 * 4) adds .htaccess
 * 5) zips deploy/hostinger-public with files at archive root
 */
import { spawn, spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const staticDir = join(root, ".vercel", "output", "static");
const serverEntry = join(
  root,
  ".vercel",
  "output",
  "functions",
  "__server.func",
  "index.mjs",
);
const outDir = join(root, "deploy");
const publicDir = join(outDir, "hostinger-public");
const htaccessSrc = join(outDir, ".htaccess");
const PREVIEW_PORT = 8791;
/** Every page is pre-rendered so each URL gets its own HTML (fast first paint, no hydration mismatch). */
const PAGES = ["/", "/pillars", "/regions", "/activities", "/resources", "/team", "/join"];
// English at the root, Arabic under /ar (see src/lib/i18n.ts).
const ROUTES = [...PAGES, ...PAGES.map((page) => (page === "/" ? "/ar" : `/ar${page}`))];

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchRouteHtml(route) {
  const url = `http://127.0.0.1:${PREVIEW_PORT}${route}`;
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        let html = await res.text();
        // Router match ids in the inline hydration script contain NUL chars.
        // Escape (never strip) them: stripping breaks hydration (React #418).
        html = html.replace(/\u0000/g, "\\u0000");
        return html;
      }
    } catch {
      // not ready yet
    }
    await sleep(250);
  }
  throw new Error(`Could not fetch SSR HTML from ${url}`);
}

async function renderAllRoutes() {
  if (!existsSync(serverEntry)) {
    throw new Error(`missing server entry ${serverEntry}`);
  }

  const child = spawn(
    "npx",
    [
      "--yes",
      "srvx",
      "--static",
      staticDir,
      serverEntry,
      "--port",
      String(PREVIEW_PORT),
      "--host",
      "127.0.0.1",
    ],
    {
      cwd: root,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, PORT: String(PREVIEW_PORT) },
    },
  );

  let stderr = "";
  child.stderr?.on("data", (d) => {
    stderr += String(d);
  });

  try {
    const pages = {};
    for (const route of ROUTES) pages[route] = await fetchRouteHtml(route);
    return pages;
  } finally {
    child.kill("SIGTERM");
    await sleep(300);
    if (!child.killed) child.kill("SIGKILL");
    if (stderr && !stderr.includes("Listening")) {
      console.warn("[pack:frontend] preview stderr:\n", stderr.slice(0, 800));
    }
  }
}

console.log("[pack:frontend] building…");
const build = spawnSync("npm", ["run", "build:frontend"], {
  cwd: root,
  stdio: "inherit",
  shell: process.platform === "win32",
});
if (build.status !== 0) process.exit(build.status ?? 1);

if (!existsSync(staticDir)) {
  console.error("[pack:frontend] missing", staticDir);
  console.error("Build did not emit Vercel static output.");
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
rmSync(publicDir, { recursive: true, force: true });
mkdirSync(publicDir, { recursive: true });
cpSync(staticDir, publicDir, { recursive: true });

console.log("[pack:frontend] pre-rendering pages…");
const pages = await renderAllRoutes();
for (const [route, html] of Object.entries(pages)) {
  // "/" → index.html, "/team" → team.html, "/ar/team" → ar/team.html
  // (.htaccess maps each clean URL to its .html file).
  const file = route === "/" ? "index.html" : `${route.slice(1)}.html`;
  mkdirSync(dirname(join(publicDir, file)), { recursive: true });
  writeFileSync(join(publicDir, file), html, "utf8");
  console.log(`[pack:frontend]   ${route} → ${file}`);
}
writeFileSync(join(outDir, "index.ssr.html"), pages["/"], "utf8");

if (existsSync(htaccessSrc)) {
  cpSync(htaccessSrc, join(publicDir, ".htaccess"));
} else {
  writeFileSync(
    join(publicDir, ".htaccess"),
    `Options -Indexes
DirectoryIndex index.html
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ index.html [L]
</IfModule>
`,
    "utf8",
  );
}

const zipName = `yps-frontend_${stamp()}.zip`;
const zipPath = join(outDir, zipName);

// Zip contents of hostinger-public at archive root (required by Hostinger).
const zip = spawnSync("zip", ["-r", zipPath, "."], {
  cwd: publicDir,
  stdio: "inherit",
});

if (zip.status !== 0) {
  console.error("[pack:frontend] `zip` CLI failed. Install zip and retry.");
  process.exit(zip.status ?? 1);
}

const uploadNote = `Upload to Hostinger Shared Hosting
==================================

File ready:
  deploy/${zipName}

OR unzipped folder:
  deploy/hostinger-public/

How to upload (hPanel)
----------------------
1. Websites → Manage → File Manager
2. Open public_html (or your domain folder)
3. Delete old default files if this domain is empty (index.php etc.) — only if safe
4. Upload the ZIP, then Extract
   — OR upload all files from deploy/hostinger-public/
5. Confirm these sit at the ROOT of public_html:
     index.html
     .htaccess
     assets/
     images/
     logo.png
     favicon.png
6. Visit your domain

Do NOT put files inside an extra folder like public_html/yps/...
(index.html must be directly in public_html)
`;

writeFileSync(join(outDir, "UPLOAD-HOSTINGER.txt"), uploadNote, "utf8");

console.log("[pack:frontend] wrote", zipPath);
console.log("[pack:frontend] folder", publicDir);
console.log("[pack:frontend] Upload the zip (or hostinger-public/) to public_html.");
