import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma.js";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Not authenticated",
    });

    return;
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const session = await prisma.authSession.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });

    if (!session) {
      res.status(401).json({
        success: false,
        message: "Invalid session",
      });

      return;
    }

    res.locals.user = session.user;
    res.locals.session = session;

    next();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Could not authenticate user",
    });
  }
};