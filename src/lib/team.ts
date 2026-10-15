/** Regional administrators & coordinators from the EU YPS Network. */
export type TeamMemberId =
  | "rok-kozelj"
  | "bouraima-kabore"
  | "bertin-cituli"
  | "fatuma-adokorach"
  | "gebreegziabher-tadele-desalegn"
  | "kasim-ahmed"
  | "ema-mecaj"
  | "carol-zakhour"
  | "patricia-z-gaye"
  | "amani-habimana-jospin"
  | "yvette-ariwo"
  | "hamisi-mwatondo"
  | "yairy-vega-muenala"
  | "abdul-rahman-jalil"
  | "shan-rasheed";

export type TeamMemberCopy = {
  id: TeamMemberId;
  name: string;
  role: string;
  bio: string;
  image: string;
  alt: string;
};

/** Sorted by position: general coordination → administrators → coordinators → communication. */
export const TEAM_ORDER: TeamMemberId[] = [
  "rok-kozelj",
  "bouraima-kabore",
  "bertin-cituli",
  "fatuma-adokorach",
  "gebreegziabher-tadele-desalegn",
  "kasim-ahmed",
  "ema-mecaj",
  "carol-zakhour",
  "patricia-z-gaye",
  "amani-habimana-jospin",
  "yvette-ariwo",
  "hamisi-mwatondo",
  "yairy-vega-muenala",
  "abdul-rahman-jalil",
  "shan-rasheed",
];

const TEAM_IMAGES: Record<TeamMemberId, string> = {
  "rok-kozelj": "/images/team/rok-kozelj.webp",
  "bouraima-kabore": "/images/team/bouraima-kabore.webp",
  "bertin-cituli": "/images/team/bertin-cituli.webp",
  "fatuma-adokorach": "/images/team/fatuma-adokorach.webp",
  "gebreegziabher-tadele-desalegn": "/images/team/gebreegziabher-tadele-desalegn.webp",
  "kasim-ahmed": "/images/team/kasim-ahmed.webp",
  "ema-mecaj": "/images/team/ema-mecaj.webp",
  "carol-zakhour": "/images/team/carol-zakhour.webp",
  "patricia-z-gaye": "/images/team/patricia-z-gaye.webp",
  "amani-habimana-jospin": "/images/team/amani-habimana-jospin.webp",
  "yvette-ariwo": "/images/team/yvette-ariwo.webp",
  "hamisi-mwatondo": "/images/team/hamisi-mwatondo.webp",
  "yairy-vega-muenala": "/images/team/yairy-vega-muenala.webp",
  "abdul-rahman-jalil": "/images/team/abdul-rahman-jalil.webp",
  "shan-rasheed": "/images/team/shan-rasheed.webp",
};

export function teamImage(id: TeamMemberId) {
  return TEAM_IMAGES[id];
}
