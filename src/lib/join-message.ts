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
};

function oneLine(value: string, max: number): string {
  return sanitizeText(value, max).replace(/[\r\n]+/g, " ").trim();
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
  return {
    to: [...STAFF_INBOXES],
    replyTo: submission.email,
    subject: oneLine(`Join request — ${submission.name} — ${submission.regionLabel}`, 180),
    text: lines.join("\n"),
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
  };
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
