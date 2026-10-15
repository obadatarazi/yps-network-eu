import assert from "node:assert/strict";
import { test } from "node:test";
import { resolveNitroPreset } from "./nitro-preset.mjs";

test("local and Vercel builds stay on the vercel preset", () => {
  assert.equal(resolveNitroPreset({}), "vercel");
  assert.equal(resolveNitroPreset({ NITRO_PRESET: "vercel" }), "vercel");
  assert.equal(resolveNitroPreset({ VERCEL: "1" }), "vercel");
});

test("Hostinger selects the node-server preset", () => {
  assert.equal(resolveNitroPreset({ NITRO_PRESET: "node-server" }), "node-server");
});

test("preview keeps the vercel preset even when Hostinger's flag is set", () => {
  assert.equal(
    resolveNitroPreset({ NITRO_PRESET: "node-server" }, { preview: true }),
    "vercel",
  );
});
