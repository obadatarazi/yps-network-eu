import { FIELD_LIMITS, sanitizeText } from "./form-security.ts";
import {
  JOIN_CHANNELS,
  isJoinChannelId,
  whatsappLinkFor,
  type JoinChannelId,
} from "./join-channels.ts";

export const STAFF_INBOXES = ["no-reply@euypsnet.org", "euypsnet@gmail.com"] as const;
export const MAIL_FROM = "EU YPS Network <no-reply@euypsnet.org>";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type JoinLang = "en" | "ar";

export type JoinField = "name" | "email" | "region" | "message" | "consent" | "captcha";

export type JoinInput = {
  name: string;
  email: string;
  organisation: string;
  place: string;
  region: string;
  access: string;
  message: string;
  consent: boolean;
  lang: JoinLang;
  website: string;
  captchaToken: string;
};

export type JoinSubmission = {
  name: string;
  email: string;
  organisation: string;
  place: string;
  region: JoinChannelId;
  regionLabel: string;
  access: string;
  message: string;
  lang: JoinLang;
  captchaToken: string;
  whatsappUrl: string | null;
};

export type MailDraft = {
  to: string[];
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};

function oneLine(value: string, max: number): string {
  return sanitizeText(value, max).replace(/[\r\n]+/g, " ").trim();
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mailPage(lang: JoinLang, body: string): string {
  const dir = lang === "ar" ? "rtl" : "ltr";
  return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><body style="margin:0;background:#f8f9fa;color:#1a1a1a;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #c5cdd6;border-radius:12px;">
<tr><td style="padding:28px 24px;font-family:Arial,sans-serif;font-size:16px;line-height:1.5;text-align:start;">
${body}
</td></tr></table>
</td></tr></table>
</body></html>`;
}

function whatsappButton(label: string, href: string): string {
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0 8px;">
<tr><td bgcolor="#25D366" style="border-radius:8px;">
<a href="${safeHref}" style="display:inline-block;padding:12px 18px;font-family:Arial,sans-serif;font-size:16px;font-weight:700;line-height:22px;color:#ffffff;text-decoration:none;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="padding:0 10px 0 0;"><img src="cid:whatsapp-mark" width="22" height="22" alt="" style="display:block;border:0;" /></td>
<td style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:700;line-height:22px;">${safeLabel}</td>
</tr></table>
</a>
</td></tr></table>
<p style="margin:8px 0 0;font-size:14px;"><a href="${safeHref}" style="color:#003366;">${safeHref}</a></p>`;
}

export function validateJoin(
  input: JoinInput,
  options: { captchaRequired: boolean },
): { ok: true; submission: JoinSubmission } | { ok: false; fields: JoinField[] } {
  const fields: JoinField[] = [];
  const name = oneLine(input.name, FIELD_LIMITS.name);
  const email = oneLine(input.email, FIELD_LIMITS.email);
  const organisation = oneLine(input.organisation, FIELD_LIMITS.organisation);
  const place = oneLine(input.place, FIELD_LIMITS.place);
  const access = sanitizeText(input.access, FIELD_LIMITS.access).trim();
  const message = sanitizeText(input.message, FIELD_LIMITS.message).trim();
  const region = input.region.trim();

  if (!name) fields.push("name");
  if (!EMAIL_PATTERN.test(email)) fields.push("email");
  if (!isJoinChannelId(region)) fields.push("region");
  if (message.length < 8) fields.push("message");
  if (input.consent !== true) fields.push("consent");
  if (options.captchaRequired && !input.captchaToken.trim()) fields.push("captcha");
  if (fields.length || !isJoinChannelId(region)) return { ok: false, fields };

  const lang: JoinLang = input.lang === "ar" ? "ar" : "en";
  return {
    ok: true,
    submission: {
      name,
      email,
      organisation,
      place,
      region,
      regionLabel: JOIN_CHANNELS[region][lang],
      access,
      message,
      lang,
      captchaToken: input.captchaToken.trim(),
      whatsappUrl: whatsappLinkFor(region),
    },
  };
}

export function buildStaffMail(submission: JoinSubmission): MailDraft {
  const none = "None stated";
  const lines = [
    "New join request for the EU YPS Network",
    "",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Organisation: ${submission.organisation || none}`,
    `City or country: ${submission.place || none}`,
    `Region: ${submission.regionLabel}`,
    `Accessibility: ${submission.access || none}`,
    `Language: ${submission.lang === "ar" ? "Arabic" : "English"}`,
    "",
    "Message:",
    submission.message,
    "",
    submission.whatsappUrl
      ? `WhatsApp group included in their confirmation:\n${submission.whatsappUrl}`
      : JOIN_CHANNELS[submission.region].comingSoon
        ? "The WhatsApp group for this region is coming soon. Their confirmation says that."
        : "No WhatsApp link is set for this region yet. Their confirmation says the regional team will send it.",
  ];
  const text = lines.join("\n");
  const groupHtml = submission.whatsappUrl
    ? `<p style="margin:16px 0 0;">WhatsApp group included in their confirmation:</p>${whatsappButton(`Join the ${submission.regionLabel} group`, submission.whatsappUrl)}`
    : `<p style="margin:16px 0 0;">${escapeHtml(lines[lines.length - 1] ?? "")}</p>`;
  const html = mailPage("en", [
    "<p style=\"margin:0 0 12px;\">New join request for the EU YPS Network</p>",
    `<p style="margin:0;">Name: ${escapeHtml(submission.name)}<br>Email: ${escapeHtml(submission.email)}<br>Organisation: ${escapeHtml(submission.organisation || none)}<br>City or country: ${escapeHtml(submission.place || none)}<br>Region: ${escapeHtml(submission.regionLabel)}<br>Accessibility: ${escapeHtml(submission.access || none)}<br>Language: ${submission.lang === "ar" ? "Arabic" : "English"}</p>`,
    `<p style="margin:16px 0 0;">Message:</p><p style="margin:8px 0 0;white-space:pre-wrap;">${escapeHtml(submission.message)}</p>`,
    groupHtml,
  ].join(""));
  return {
    to: [...STAFF_INBOXES],
    replyTo: submission.email,
    subject: oneLine(`Join request — ${submission.name} — ${submission.regionLabel}`, 180),
    text,
    html,
  };
}

export function buildVisitorMail(submission: JoinSubmission): MailDraft {
  const link = submission.whatsappUrl;
  const text =
    submission.lang === "ar"
      ? arabicVisitor(submission, link)
      : englishVisitor(submission, link);
  const subject =
    submission.lang === "ar"
      ? "استلمنا رسالتك — شبكة الاتحاد الأوروبي للشباب والسلام والأمن"
      : "We received your message — EU YPS Network";
  return {
    to: [submission.email],
    replyTo: "no-reply@euypsnet.org",
    subject,
    text,
    html: submission.lang === "ar" ? arabicVisitorHtml(submission, link) : englishVisitorHtml(submission, link),
  };
}

function englishVisitorHtml(submission: JoinSubmission, link: string | null): string {
  const group = link
    ? whatsappButton(`Join the ${submission.regionLabel} group`, link)
    : `<p style="margin:16px 0 0;">${escapeHtml(
        JOIN_CHANNELS[submission.region].comingSoon
          ? `The WhatsApp group for ${submission.regionLabel} is coming soon.`
          : `The regional team will email you the WhatsApp group link for ${submission.regionLabel}.`,
      )}</p>`;
  return mailPage("en", [
    `<p style="margin:0 0 12px;">Hello ${escapeHtml(submission.name)},</p>`,
    "<p style=\"margin:0 0 12px;\">Thank you for writing to the EU YPS Network.</p>",
    `<p style="margin:0;">We received your message about the ${escapeHtml(submission.regionLabel)} region.</p>`,
    group,
    "<p style=\"margin:16px 0 0;\">The network team has the same message. Reply to this email if you need a different format.</p>",
    "<p style=\"margin:16px 0 0;\">EU YPS Network<br>no-reply@euypsnet.org</p>",
  ].join(""));
}

function arabicVisitorHtml(submission: JoinSubmission, link: string | null): string {
  const group = link
    ? whatsappButton(`انضم إلى مجموعة ${submission.regionLabel}`, link)
    : `<p style="margin:16px 0 0;">${escapeHtml(
        JOIN_CHANNELS[submission.region].comingSoon
          ? `مجموعة واتساب لإقليم ${submission.regionLabel} ستتوفر قريبًا.`
          : `سيرسل الفريق الإقليمي رابط مجموعة واتساب لإقليم ${submission.regionLabel}.`,
      )}</p>`;
  return mailPage("ar", [
    `<p style="margin:0 0 12px;">مرحباً ${escapeHtml(submission.name)}،</p>`,
    "<p style=\"margin:0 0 12px;\">شكراً لكتابتك إلى شبكة الاتحاد الأوروبي للشباب والسلام والأمن.</p>",
    `<p style="margin:0;">استلمنا رسالتك بخصوص إقليم ${escapeHtml(submission.regionLabel)}.</p>`,
    group,
    "<p style=\"margin:16px 0 0;\">وصل النص نفسه إلى فريق الشبكة. رد على هذا البريد إذا احتجت صيغة مختلفة.</p>",
    "<p style=\"margin:16px 0 0;\">شبكة الاتحاد الأوروبي للشباب والسلام والأمن<br>no-reply@euypsnet.org</p>",
  ].join(""));
}

function englishVisitor(submission: JoinSubmission, link: string | null): string {
  const group = link
    ? `Join the WhatsApp group for ${submission.regionLabel}:\n${link}`
    : JOIN_CHANNELS[submission.region].comingSoon
      ? `The WhatsApp group for ${submission.regionLabel} is coming soon.`
      : `The regional team will email you the WhatsApp group link for ${submission.regionLabel}.`;
  return [
    `Hello ${submission.name},`,
    "",
    "Thank you for writing to the EU YPS Network.",
    `We received your message about the ${submission.regionLabel} region.`,
    "",
    group,
    "",
    "The network team has the same message. Reply to this email if you need a different format.",
    "",
    "EU YPS Network",
    "no-reply@euypsnet.org",
  ].join("\n");
}

function arabicVisitor(submission: JoinSubmission, link: string | null): string {
  const group = link
    ? `مجموعة واتساب لإقليم ${submission.regionLabel}:\n${link}`
    : JOIN_CHANNELS[submission.region].comingSoon
      ? `مجموعة واتساب لإقليم ${submission.regionLabel} ستتوفر قريبًا.`
      : `سيرسل الفريق الإقليمي رابط مجموعة واتساب لإقليم ${submission.regionLabel}.`;
  return [
    `مرحباً ${submission.name}،`,
    "",
    "شكراً لكتابتك إلى شبكة الاتحاد الأوروبي للشباب والسلام والأمن.",
    `استلمنا رسالتك بخصوص إقليم ${submission.regionLabel}.`,
    "",
    group,
    "",
    "وصل النص نفسه إلى فريق الشبكة. رد على هذا البريد إذا احتجت صيغة مختلفة.",
    "",
    "شبكة الاتحاد الأوروبي للشباب والسلام والأمن",
    "no-reply@euypsnet.org",
  ].join("\n");
}
