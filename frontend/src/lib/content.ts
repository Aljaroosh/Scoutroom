import type { ContentForUser, ContentPage, MembershipLevel } from "../types";
import { hasAccess } from "./access";

// TILLFÄLLIG exempeldata tills backendens endpoints finns.
// Nivåerna matchar vad TIERS lovar: klubbrapporter = PLUS, exklusiva rapporter = FULL.
const pages: ContentPage[] = [
  {
    id: "1",
    title: "Allsvenskans mest lovande U21-backar",
    slug: "u21-backar-allsvenskan",
    type: "ARTICLE",
    excerpt: "Fem unga backar som sticker ut statistiskt denna säsong.",
    body: "## Översikt\nHär är grundstatistiken för fem backar...",
    imageUrl: null,
    requiredLevel: "BASIC",
    published: true,
  },
  {
    id: "2",
    title: "Klubbrapport: akademin som levererar",
    slug: "klubbrapport-akademi",
    type: "CLUB_REPORT",
    excerpt: "Hur en akademi fått fram sju A-lagsspelare på fem år.",
    body: "## Akademin\nSedan 2021 har akademin...",
    imageUrl: null,
    requiredLevel: "PLUS",
    published: true,
  },
  {
    id: "3",
    title: "Exklusiv rapport: nästa stora anfallare",
    slug: "exklusiv-anfallare",
    type: "PLAYER_PROFILE",
    excerpt: "Vår chefsscouts fullständiga analys av en 19-årig nia.",
    body: "## Profil\nStark i djupled, xG per 90...",
    imageUrl: null,
    requiredLevel: "FULL",
    published: true,
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getContentForUser(
  slug: string,
  userLevel: MembershipLevel | null
): Promise<ContentForUser | null> {
  await delay(400);
  const page = pages.find((p) => p.slug === slug && p.published);
  if (!page) return null;

  const { body, ...preview } = page;
  if (hasAccess(userLevel, page.requiredLevel)) {
    return { ...preview, locked: false, body };
  }
  return { ...preview, locked: true };
}

export async function getAllPagesForAdmin(): Promise<ContentPage[]> {
  await delay(400);
  return [...pages]; // kopia, så att ingen kan ändra listan utifrån
}