import { env } from "@/lib/env.server";
import { isHoneypotTripped } from "@/lib/form-security";
import { safeWhatsappUrl, type JoinChannelId } from "@/lib/join-channels";
import {
  buildStaffMail,
  buildVisitorMail,
  validateJoin,
  type JoinInput,
  type JoinLang,
  type MailDraft,
} from "@/lib/join-message";
import nodemailer from "nodemailer";

const WHATSAPP_MARK_PNG =
  "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";

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const hits = new Map<string, number[]>();

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string, now = Date.now()): boolean {
  const recent = (hits.get(ip) ?? []).filter((stamp) => now - stamp < RATE_WINDOW_MS);
  hits.set(ip, recent);
  return recent.length >= RATE_MAX;
}

function recordHit(ip: string, now = Date.now()): void {
  const recent = (hits.get(ip) ?? []).filter((stamp) => now - stamp < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function readInput(body: unknown): JoinInput {
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const lang: JoinLang = record.lang === "ar" ? "ar" : "en";
  return {
    name: asString(record.name),
    email: asString(record.email),
    organisation: asString(record.organisation),
    place: asString(record.place),
    region: asString(record.region),
    access: asString(record.access),
    message: asString(record.message),
    consent: record.consent === true,
    lang,
    website: asString(record.website),
    captchaToken: asString(record.captchaToken),
  };
}

const WHATSAPP_ENV: Record<JoinChannelId, string> = {
  asia: "WHATSAPP_ASIA",
  europe: "WHATSAPP_EUROPE",
  "west-africa": "WHATSAPP_WEST_AFRICA",
  "central-africa": "WHATSAPP_CENTRAL_AFRICA",
  "eastern-southern-africa": "WHATSAPP_EASTERN_SOUTHERN_AFRICA",
  "latin-america": "WHATSAPP_LATIN_AMERICA",
};

function withWhatsappLink<T extends { region: JoinChannelId; whatsappUrl: string | null }>(submission: T): T {
  const fromEnv = safeWhatsappUrl(env(WHATSAPP_ENV[submission.region]) ?? "");
  if (!fromEnv) return submission;
  return { ...submission, whatsappUrl: fromEnv };
}

async function captchaOk(token: string, ip: string, secret: string): Promise<boolean> {
  const payload = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });
  const response = await fetch("https://api.hcaptcha.com/siteverify", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: payload,
  });
  if (!response.ok) return false;
  const data = (await response.json()) as { success?: boolean };
  return data.success === true;
}

async function sendMail(draft: MailDraft, pass: string): Promise<void> {
  const port = Number(env("SMTP_PORT") ?? "465");
  const user = env("SMTP_USER") ?? "no-reply@euypsnet.org";
  const transporter = nodemailer.createTransport({
    host: env("SMTP_HOST") ?? "smtp.hostinger.com",
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  const withIcon = draft.html.includes("cid:whatsapp-mark");
  await transporter.sendMail({
    from: `EU YPS Network <${user}>`,
    envelope: { from: user, to: draft.to },
    to: draft.to,
    replyTo: draft.replyTo,
    subject: draft.subject,
    text: draft.text,
    html: draft.html,
    attachments: withIcon
      ? [{ filename: "whatsapp.png", content: Buffer.from(WHATSAPP_MARK_PNG, "base64"), cid: "whatsapp-mark" }]
      : undefined,
  });
}

export async function handleJoinRequest(request: Request): Promise<Response> {
  if (request.method !== "POST") return json({ ok: false, error: "method" }, 405);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "validation", fields: ["message"] }, 400);
  }

  const input = readInput(body);
  if (isHoneypotTripped(input.website)) return json({ ok: true, whatsappUrl: null });

  const ip = clientIp(request);
  if (isRateLimited(ip)) return json({ ok: false, error: "rate" }, 429);

  const secret = env("HCAPTCHA_SECRET");
  const checked = validateJoin(input, { captchaRequired: Boolean(secret) });
  if (!checked.ok) return json({ ok: false, error: "validation", fields: checked.fields }, 400);

  const submission = withWhatsappLink(checked.submission);

  if (secret) {
    const passed = await captchaOk(submission.captchaToken, ip, secret);
    if (!passed) return json({ ok: false, error: "captcha" }, 400);
  }

  const pass = env("SMTP_PASS");
  if (!pass) return json({ ok: false, error: "unconfigured" }, 503);

  try {
    await sendMail(buildStaffMail(submission), pass);
    await sendMail(buildVisitorMail(submission), pass);
  } catch (error) {
    console.error("[join] mail failed", error);
    return json({ ok: false, error: "send" }, 502);
  }

  recordHit(ip);
  return json({ ok: true, whatsappUrl: submission.whatsappUrl });
}
