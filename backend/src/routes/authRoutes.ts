import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { randomUUID } from "node:crypto";
import prisma from "../lib/prisma.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

const RegisterRequestDataSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(2),
});
const LoginRequestDataSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
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
router.post("/login", async (req, res) => {
  const result = LoginRequestDataSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Invalid login data",
    });

    return;
  }

  const { email, password } = result.data;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

      return;
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });

      return;
    }
    const token = randomUUID();

    await prisma.authSession.create({
    data: {
    token,
    userId: user.id,
  },
});
    res.status(200).json({
  success: true,
  token,
  user: {
        id: user.id,
        email: user.email,
        name: user.name,
        membershipLevel: user.membershipLevel,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not log in",
    });
  }
});
router.get("/me", requireAuth, async (_req, res) => {
  const user = res.locals.user;

  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      membershipLevel: user.membershipLevel,
      role: user.role,
    },
  });
});
router.post("/logout", requireAuth, async (_req, res) => {
  const session = res.locals.session;

  try {
    await prisma.authSession.delete({
      where: {
        id: session.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Logged out",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not log out",
    });
  }
});
export default router;