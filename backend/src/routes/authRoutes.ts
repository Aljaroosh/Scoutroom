import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

const router = Router();

const RegisterRequestDataSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

router.post("/register", async (req, res) => {
  const result = RegisterRequestDataSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid registration data",
    });

    return;
  }

  const { email, password, name } = result.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "User already exists",
      });

      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        membershipLevel: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not register user",
    });
  }
});

export default router;