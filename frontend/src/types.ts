  export type MembershipLevel = "BASIC" | "PLUS" | "FULL";
  export type UserRole = "USER" | "ADMIN";

  export type User = {
    id: string;
    email: string;
    name: string | null;
    membershipLevel: MembershipLevel;
    role: UserRole;
  };