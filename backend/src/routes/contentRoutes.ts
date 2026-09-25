import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

const CreateContentPageSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  content: z.string().min(1),
  imageUrl: z.string().optional(),
  requiredLevel: z.enum(["BASIC", "PLUS", "FULL"]),
});

const membershipRank = {
  BASIC: 1,
  PLUS: 2,
  FULL: 3,
} as const;

// Admin skapar en innehållssida
router.post("/", requireAuth, async (req, res) => {
  const user = res.locals.user;

  if (user.role !== "ADMIN") {
    res.status(403).json({
      success: false,
      message: "Admin access required",
    });

    return;
  }

  const result = CreateContentPageSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid content data",
    });

    return;
  }

  try {
    const page = await prisma.contentPage.create({
      data: {
        ...result.data,
        createdById: user.id,
      },
    });

    res.status(201).json({
      success: true,
      page,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not create content page",
    });
  }
});

// Användare hämtar en innehållssida
router.get("/:slug", requireAuth, async (req, res) => {
  const user = res.locals.user;

  const slug = Array.isArray(req.params.slug)
    ? req.params.slug[0]
    : req.params.slug;

  if (!slug) {
    res.status(400).json({
      success: false,
      message: "Invalid slug",
    });

    return;
  }

  try {
    const page = await prisma.contentPage.findUnique({
      where: {
        slug,
      },
    });

    if (!page) {
      res.status(404).json({
        success: false,
        message: "Content page not found",
      });

      return;
    }

    const userLevel =
      user.membershipLevel as keyof typeof membershipRank;

    const requiredLevel =
      page.requiredLevel as keyof typeof membershipRank;

    if (membershipRank[userLevel] < membershipRank[requiredLevel]) {
      res.status(403).json({
        success: false,
        message: "Upgrade required",
        currentLevel: userLevel,
        requiredLevel,
      });

      return;
    }

    res.status(200).json({
      success: true,
      page,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not fetch content page",
    });
  }
});

export default router;