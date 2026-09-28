import type { MembershipLevel } from "../types";

// Rangordning för nivåerna. Record MembershipLevel, number tvingar ALLA nivåer: om någon lägger till en ny nivå i types.ts blir det kompileringsfel här tills den får en rang.//
const LEVEL_RANK: Record<MembershipLevel, number> = {
  BASIC: 1,
  PLUS: 2,
  FULL: 3,
};

// Har användaren tillräckligt hög nivå? Utloggad (null) har aldrig åtkomst.
export function hasAccess(
  userLevel: MembershipLevel | null,
  requiredLevel: MembershipLevel
): boolean {
  if (userLevel === null) return false;
  return LEVEL_RANK[userLevel] >= LEVEL_RANK[requiredLevel];
}