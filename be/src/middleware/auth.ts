import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";
import { verifyToken } from "../utils/jwt";

/**
 * Extend Express Request globally
 */
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      walletAddress: string;
    };
  }
}

/**
 * Authentication middleware
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // -----------------------------
    // Validate header
    // -----------------------------
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Missing token",
      });
    }

    const parts = authHeader.split(" ");

if (parts.length !== 2 || !parts[1]) {
  return res.status(401).json({ error: "Invalid token format" });
}

const token = parts[1];


    // -----------------------------
    // Verify JWT
    // -----------------------------
    let payload;
    try {
      payload = verifyToken(token);
    } catch (err: any) {
      if (err?.message === "JWT_EXPIRED") {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(401).json({ error: "Invalid token" });
    }

    // -----------------------------
    // Fetch user
    // -----------------------------
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Attach to request
    req.user = {
      id: user.id,
      walletAddress: user.walletAddress,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
};
