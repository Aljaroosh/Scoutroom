  export type MembershipLevel = "BASIC" | "PLUS" | "FULL";
  export type UserRole = "USER" | "ADMIN";

  export type User = {
    id: string;
    email: string;
    name: string | null;
    membershipLevel: MembershipLevel;
    role: UserRole;
  };

  // --- Innehållssidor ---
export type ContentType = "PLAYER_PROFILE" | "CLUB_REPORT" | "ARTICLE";

// Fullständig post – det admin ser och redigerar
export type ContentPage = {
  id: string;
  title: string;
  slug: string; 
  type: ContentType;
  excerpt: string; 
  body: string; 
  imageUrl: string | null;
  requiredLevel: MembershipLevel; // lägsta nivå som krävs
  published: boolean;
};

// Det en användare får från API:t: upplåst MED body, eller låst UTAN body
type ContentPreview = Omit<ContentPage, "body">;

export type ContentForUser =
  | (ContentPreview & { locked: false; body: string })
  | (ContentPreview & { locked: true });