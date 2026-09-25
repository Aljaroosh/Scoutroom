import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const players = await prisma.player.findMany({
      include: {
        club: true,
      },
    });

    res.status(200).json(players);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Could not fetch players",
    });
  }
});

export default router;