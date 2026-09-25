import { Router } from "express";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

const UpgradeRequestDataSchema = z.object({
  membershipLevel: z.enum(["PLUS", "FULL"]),
});

const membershipRank = {
  BASIC: 1,
  PLUS: 2,
  FULL: 3,
} as const;

const prices = {
  PLUS: 9900,
  FULL: 19900,
} as const;

router.post("/upgrade", requireAuth, async (req, res) => {
  const result = UpgradeRequestDataSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid membership level",
    });

    return;
  }

  const user = res.locals.user;
  const newLevel = result.data.membershipLevel;

  const currentLevel =
    user.membershipLevel as keyof typeof membershipRank;

  if (membershipRank[newLevel] <= membershipRank[currentLevel]) {
    res.status(400).json({
      success: false,
      message: "Choose a higher membership level",
    });

    return;
  }

  const amountCents = prices[newLevel];
  const receiptNumber = `SR-${randomUUID()}`;

  try {
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        membershipLevel: newLevel,
        amountCents,
        receiptNumber,
      },
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        membershipLevel: newLevel,
      },
    });

    res.status(201).json({
      success: true,
      message: "Fake payment completed",
      membershipLevel: newLevel,
      receipt: {
        receiptNumber: payment.receiptNumber,
        amountCents: payment.amountCents,
        createdAt: payment.createdAt,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not complete payment",
    });
  }
});
router.get("/receipts", requireAuth, async (_req, res) => {
  const user = res.locals.user;

  try {
    const payments = await prisma.payment.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        membershipLevel: true,
        amountCents: true,
        receiptNumber: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      receipts: payments,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not fetch receipts",
    });
  }
});
export default router;