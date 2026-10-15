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
  await transporter.sendMail({
    from: `EU YPS Network <${user}>`,
    envelope: { from: user, to: draft.to },
    to: draft.to,
    replyTo: draft.replyTo,
    subject: draft.subject,
    text: draft.text,
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
