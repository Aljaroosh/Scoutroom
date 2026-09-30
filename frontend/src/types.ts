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