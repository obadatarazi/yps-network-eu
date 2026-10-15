/** Region the person chooses on the Join form. Each one maps to one WhatsApp group. */
export const JOIN_CHANNEL_IDS = [
  "asia",
  "europe",
  "west-africa",
  "central-africa",
  "eastern-southern-africa",
  "latin-america",
] as const;

export type JoinChannelId = (typeof JOIN_CHANNEL_IDS)[number];

export const JOIN_CHANNELS: Record<
  JoinChannelId,
  { en: string; ar: string; whatsapp: string; comingSoon?: boolean }
> = {
  asia: {
    en: "Asia and the Middle East",
    ar: "آسيا والشرق الأوسط",
    whatsapp: "",
  },
  europe: {
    en: "Europe",
    ar: "أوروبا",
    whatsapp: "",
  },
  "west-africa": {
    en: "West Africa",
    ar: "غرب أفريقيا",
    whatsapp: "",
  },
  "central-africa": {
    en: "Central Africa",
    ar: "وسط أفريقيا",
    whatsapp: "",
  },
  "eastern-southern-africa": {
    en: "Eastern and Southern Africa",
    ar: "شرق أفريقيا والجنوب الأفريقي",
    whatsapp: "",
    comingSoon: true,
  },
  "latin-america": {
    en: "Latin America and the Caribbean",
    ar: "أمريكا اللاتينية والكاريبي",
    whatsapp: "",
  },
};

export function isJoinChannelId(value: string): value is JoinChannelId {
  return Object.prototype.hasOwnProperty.call(JOIN_CHANNELS, value);
}

/** Only real WhatsApp invite links are included in email. */
export function safeWhatsappUrl(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:") return null;
    if (host !== "chat.whatsapp.com" && host !== "wa.me") return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Region name on the join form. A group without a link says so beside the name. */
export function joinChannelLabel(id: JoinChannelId, lang: "en" | "ar"): string {
  const channel = JOIN_CHANNELS[id];
  const name = channel[lang];
  if (!channel.comingSoon) return name;
  return lang === "ar" ? `${name} (قريبًا)` : `${name} (coming soon)`;
}

export function whatsappLinkFor(id: JoinChannelId): string | null {
  return safeWhatsappUrl(JOIN_CHANNELS[id].whatsapp);
}
