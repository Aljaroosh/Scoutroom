  export type MembershipLevel = "BASIC" | "PLUS" | "FULL";
  export type UserRole = "USER" | "ADMIN";

  export type User = {
    id: string;
    email: string;
    name: string | null;
    membershipLevel: MembershipLevel;
    role: UserRole;
  };

   export type Receipt = {
     id: string;
     membershipLevel: MembershipLevel;
     amountCents: number;
     receiptNumber: string;
     createdAt: string;
   };
export type ContentPage = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string; // markdown
  imageUrl: string | null;
  requiredLevel: MembershipLevel;
  createdById: string;
  createdAt: string;
  updatedAt: string;
};

export type ContentResult =
  | { status: "ok"; page: ContentPage }
  | { status: "login-required" }
  | { status: "upgrade-required"; requiredLevel: MembershipLevel }
  | { status: "not-found" };


   export type CreateContentInput = {
     title: string;
     slug: string;
     description?: string;
     content: string;
     imageUrl?: string;
     requiredLevel: MembershipLevel;
   };

export type ContentSummary = Pick<ContentPage, "id" | "title" | "slug">;