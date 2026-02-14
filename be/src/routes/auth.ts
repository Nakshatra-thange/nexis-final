import { Router } from "express";
import { z } from "zod";
import { prisma } from "../config/database";
import { generateToken } from "../utils/jwt";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

const router = Router();

/**
 * Request validation schema
 */
const verifySchema = z.object({
  walletAddress: z.string().min(32),
  signature: z.string().min(1),
  message: z.string().min(1),
});

/**
 * POST /api/auth/verify
 */
router.post("/verify", async (req, res) => {
  try {
    const parsed = verifySchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request body",
        details: parsed.error.flatten(),
      });
    }

    const { walletAddress, signature, message } = parsed.data;

    // 🔥 FIXED: Use TextEncoder instead of Buffer
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Buffer.from(signature, "base64");
    const pubkeyBytes = new PublicKey(walletAddress).toBytes();

    // Verify wallet signature
    const isValid = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      pubkeyBytes
    );

    if (!isValid) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Upsert user
    const user = await prisma.user.upsert({
      where: { walletAddress },
      update: {
        lastSeenAt: new Date(),
      },
      create: {
        walletAddress,
      },
    });

    // Generate JWT
    const token = generateToken(user.id, user.walletAddress);

    return res.json({
      token,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error) {
    console.error("Auth verify error:", error);
    return res.status(500).json({ error: "Authentication failed" });
  }
});

/**
 * POST /api/auth/logout
 */
router.post("/logout", (_req, res) => {
  return res.json({ success: true });
});

export default router;