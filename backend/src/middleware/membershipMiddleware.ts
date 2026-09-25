import { NextFunction, Request, Response } from "express";

const membershipRank = {
  BASIC: 1,
  PLUS: 2,
  FULL: 3,
} as const;

type MembershipLevel = keyof typeof membershipRank;

export const requireMembership = (requiredLevel: MembershipLevel) => {
  return (_req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Not authenticated",
      });

      return;
    }

    const userLevel = user.membershipLevel as MembershipLevel;

    if (membershipRank[userLevel] < membershipRank[requiredLevel]) {
      res.status(403).json({
        success: false,
        message: "Upgrade required",
        requiredLevel,
        currentLevel: userLevel,
      });

      return;
    }

    next();
  };
};