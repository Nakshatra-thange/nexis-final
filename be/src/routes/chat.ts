import { Router } from "express";
import { z } from "zod";
import { processChat } from "../services/ai";
import { authMiddleware } from "../middleware/auth";
import { aiClient } from "../services/ai/openrouter";
const router = Router();

/**
 * Request validation schema
 */
const chatSchema = z.object({
  message: z.string().min(1).max(5000),
  conversationId: z.string().optional(),
});

router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      // -------------------------
      // Validate body
      // -------------------------
      const parsed = chatSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: "Invalid request body",
          details: parsed.error.flatten(),
        });
      }

      const { message, conversationId } = parsed.data;

      // -------------------------
      // Auth context
      // -------------------------
      const user = req.user;
      if (!user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      // -------------------------
      // Process chat
      // -------------------------
      const result = await processChat(
        user.id,
        conversationId ?? null,
        message
      );

      return res.status(200).json(result);
    } catch (error) {
      console.error("CHAT ERROR:", error); 
      return res.status(500).json({
        error: "Failed to process chat",
      });
    }
  }
);

export default router;
