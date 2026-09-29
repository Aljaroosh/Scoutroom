import { Router } from "express";
import { z } from "zod";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

const AddPlayerSchema = z.object({
  playerId: z.string().min(1),
  note: z.string().optional(),
  rating: z.number().int().min(1).max(5).optional(),
});

const scoutListLimits = {
  BASIC: 5,
  PLUS: 15,
  FULL: Infinity,
} as const;

// Hämta användarens ScoutList
router.get("/", requireAuth, async (_req, res) => {
  const user = res.locals.user;

  try {
    const scoutList = await prisma.scoutListEntry.findMany({
      where: {
        userId: user.id,
      },
      include: {
        player: {
          include: {
            club: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      scoutList,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not fetch scout list",
    });
  }
});

// Lägg till spelare i ScoutList
router.post("/", requireAuth, async (req, res) => {
  const user = res.locals.user;

  const result = AddPlayerSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid scout list data",
    });
    return;
  }

  const { playerId, note, rating } = result.data;

  const membershipLevel =
    user.membershipLevel as keyof typeof scoutListLimits;

  if (membershipLevel === "BASIC" && (note || rating)) {
    res.status(403).json({
      success: false,
      message: "Upgrade required",
      requiredLevel: "PLUS",
    });
    return;
  }

  if (membershipLevel === "PLUS" && rating) {
    res.status(403).json({
      success: false,
      message: "Upgrade required",
      requiredLevel: "FULL",
    });
    return;
  }

  try {
    const player = await prisma.player.findUnique({
      where: {
        id: playerId,
      },
    });

    if (!player) {
      res.status(404).json({
        success: false,
        message: "Player not found",
      });
      return;
    }

    const existingEntry = await prisma.scoutListEntry.findUnique({
      where: {
        userId_playerId: {
          userId: user.id,
          playerId,
        },
      },
    });

    if (existingEntry) {
      res.status(400).json({
        success: false,
        message: "Player already in scout list",
      });
      return;
    }

    const currentCount = await prisma.scoutListEntry.count({
      where: {
        userId: user.id,
      },
    });

    const limit = scoutListLimits[membershipLevel];

    if (currentCount >= limit) {
      res.status(403).json({
        success: false,
        message: "ScoutList limit reached",
        currentLevel: membershipLevel,
        limit,
      });
      return;
    }

    const entry = await prisma.scoutListEntry.create({
      data: {
        userId: user.id,
        playerId,
        note,
        rating,
      },
      include: {
        player: {
          include: {
            club: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      entry,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not add player to scout list",
    });
  }
});
// Uppdatera anteckning eller rating i ScoutList
router.patch("/:playerId", requireAuth, async (req, res) => {
  const user = res.locals.user;

  const playerId = Array.isArray(req.params.playerId)
    ? req.params.playerId[0]
    : req.params.playerId;

  if (!playerId) {
    res.status(400).json({
      success: false,
      message: "Invalid player id",
    });
    return;
  }

  const UpdateScoutListSchema = z.object({
    note: z.string().optional(),
    rating: z.number().int().min(1).max(5).optional(),
  });

  const result = UpdateScoutListSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid scout list data",
    });
    return;
  }

  const membershipLevel =
    user.membershipLevel as keyof typeof scoutListLimits;

  if (membershipLevel === "BASIC") {
    res.status(403).json({
      success: false,
      message: "Upgrade required",
      requiredLevel: "PLUS",
    });
    return;
  }

  if (
    membershipLevel === "PLUS" &&
    result.data.rating !== undefined
  ) {
    res.status(403).json({
      success: false,
      message: "Upgrade required",
      requiredLevel: "FULL",
    });
    return;
  }

  try {
    const entry = await prisma.scoutListEntry.findUnique({
      where: {
        userId_playerId: {
          userId: user.id,
          playerId,
        },
      },
    });

    if (!entry) {
      res.status(404).json({
        success: false,
        message: "Player not found in scout list",
      });
      return;
    }

    const updatedEntry = await prisma.scoutListEntry.update({
      where: {
        id: entry.id,
      },
      data: result.data,
      include: {
        player: {
          include: {
            club: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      entry: updatedEntry,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not update scout list entry",
    });
  }
});
// Uppdatera anteckning eller rating i ScoutList
router.patch("/:playerId", requireAuth, async (req, res) => {
  const user = res.locals.user;

  const playerId = Array.isArray(req.params.playerId)
    ? req.params.playerId[0]
    : req.params.playerId;

  if (!playerId) {
    res.status(400).json({
      success: false,
      message: "Invalid player id",
    });
    return;
  }

  const UpdateScoutListSchema = z.object({
    note: z.string().optional(),
    rating: z.number().int().min(1).max(5).optional(),
  });

  const result = UpdateScoutListSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid scout list data",
    });
    return;
  }

  const membershipLevel =
    user.membershipLevel as keyof typeof scoutListLimits;

  if (membershipLevel === "BASIC") {
    res.status(403).json({
      success: false,
      message: "Upgrade required",
      requiredLevel: "PLUS",
    });
    return;
  }

  if (
    membershipLevel === "PLUS" &&
    result.data.rating !== undefined
  ) {
    res.status(403).json({
      success: false,
      message: "Upgrade required",
      requiredLevel: "FULL",
    });
    return;
  }

  try {
    const entry = await prisma.scoutListEntry.findUnique({
      where: {
        userId_playerId: {
          userId: user.id,
          playerId,
        },
      },
    });

    if (!entry) {
      res.status(404).json({
        success: false,
        message: "Player not found in scout list",
      });
      return;
    }

    const updatedEntry = await prisma.scoutListEntry.update({
      where: {
        id: entry.id,
      },
      data: result.data,
      include: {
        player: {
          include: {
            club: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      entry: updatedEntry,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not update scout list entry",
    });
  }
});

// Ta bort spelare från ScoutList
router.delete("/:playerId", requireAuth, async (req, res) => {
  const user = res.locals.user;

  const playerId = Array.isArray(req.params.playerId)
    ? req.params.playerId[0]
    : req.params.playerId;

  if (!playerId) {
    res.status(400).json({
      success: false,
      message: "Invalid player id",
    });
    return;
  }

  try {
    const entry = await prisma.scoutListEntry.findUnique({
      where: {
        userId_playerId: {
          userId: user.id,
          playerId,
        },
      },
    });

    if (!entry) {
      res.status(404).json({
        success: false,
        message: "Player not found in scout list",
      });
      return;
    }

    await prisma.scoutListEntry.delete({
      where: {
        id: entry.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Player removed from scout list",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not remove player from scout list",
    });
  }
});

export default router;