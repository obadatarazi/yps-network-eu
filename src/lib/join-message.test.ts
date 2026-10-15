import assert from "node:assert/strict";
import test from "node:test";
import { JOIN_CHANNELS } from "./join-channels.ts";
import { buildVisitorMail, validateJoin } from "./join-message.ts";

const base = {
  name: "Amina Diallo",
  email: "amina@example.com",
  organisation: "",
  place: "Dakar",
  region: "west-africa",
  access: "",
  message: "I want to join the regional work on youth and peace.",
  consent: true,
  lang: "en" as const,
  website: "",
  captchaToken: "",
};

test("visitor email names the region and asks the team to send the group when no link is set", () => {
  const checked = validateJoin(base, { captchaRequired: false });
  assert.equal(checked.ok, true);
  if (!checked.ok) return;
  const mail = buildVisitorMail(checked.submission);
  assert.equal(mail.to[0], "amina@example.com");
  assert.match(mail.text, /West Africa/);
  assert.match(mail.text, /regional team will email you the WhatsApp group link/);
  assert.equal(checked.submission.whatsappUrl, null);
});

test("arabic confirmation uses the Arabic region name", () => {
  const checked = validateJoin({ ...base, lang: "ar" }, { captchaRequired: false });
  assert.equal(checked.ok, true);
  if (!checked.ok) return;
  const mail = buildVisitorMail(checked.submission);
  assert.match(mail.subject, /استلمنا رسالتك/);
  assert.match(mail.text, /غرب أفريقيا/);
});

test("a configured WhatsApp link is included in the confirmation", () => {
  const previous = JOIN_CHANNELS.europe.whatsapp;
  JOIN_CHANNELS.europe.whatsapp = "https://chat.whatsapp.com/ExampleGroupInvite";
  try {
    const checked = validateJoin({ ...base, region: "europe" }, { captchaRequired: false });
    assert.equal(checked.ok, true);
    if (!checked.ok) return;
    const mail = buildVisitorMail(checked.submission);
    assert.match(mail.text, /https:\/\/chat\.whatsapp\.com\/ExampleGroupInvite/);
    assert.match(mail.text, /Europe/);
  } finally {
    JOIN_CHANNELS.europe.whatsapp = previous;
  }
});

test("a region that is not a channel is rejected", () => {
  const checked = validateJoin({ ...base, region: "Antarctica" }, { captchaRequired: false });
  assert.equal(checked.ok, false);
  if (checked.ok) return;
  assert.ok(checked.fields.includes("region"));
});
