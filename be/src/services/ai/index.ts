import { aiTools } from "./tools";
import { generateSystemPrompt } from "./prompts";
import {
  executeGetBalance,
  executeCreateTransfer,
  executeGetTransactionHistory,
  executeEstimateFee,
} from "./executors";
import { prisma } from "../../config/database";
import { aiClient } from "./openrouter";

export async function processChat(
  userId: string,
  conversationId: string | null,
  message: string
) {
  let conversation;

  if (conversationId) {
    conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        userId,
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }
  } else {
    conversation = await prisma.conversation.create({
      data: {
        userId,
        title: message.slice(0, 50),
        isActive: true,
      },
    });

    conversationId = conversation.id;
  }
  
  // Save user message
  await prisma.message.create({
    data: {
      conversationId,
      role: "user",
      content: message,
    },
  });

  try {
    // --------------------------------------------------
    // 1️⃣ Get user + wallet
    // --------------------------------------------------
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found");

    if (!user.walletAddress) {
      throw new Error("Wallet not connected");
    }
    
    const walletAddress = user.walletAddress;
    
    const systemPrompt = generateSystemPrompt(walletAddress);

    // --------------------------------------------------
    // 2️⃣ Initial AI call WITH tools
    // --------------------------------------------------
    const completion = await aiClient.chat.completions.create({
      model: "openai/gpt-5.2",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      tools: aiTools,
      tool_choice: "auto",
      max_tokens: 1024,
    });

    const aiMessage = completion.choices?.[0]?.message;

    if (!aiMessage) {
      return {
        message: "No response from AI.",
        conversationId,
      };
    }

    // --------------------------------------------------
    // 3️⃣ If AI DID NOT request tool → return directly
    // --------------------------------------------------
    if (!aiMessage.tool_calls?.length) {
      const finalReply = aiMessage.content ?? "No reply.";
      
      // ✅ STEP 4 — SAVE ASSISTANT MESSAGE (no tool calls)
      await prisma.message.create({
        data: {
          conversationId,
          role: "assistant",
          content: finalReply,
        },
      });

      return {
        message: finalReply,
        conversationId,
      };
    }

    // --------------------------------------------------
    // 4️⃣ TOOL EXECUTION LOOP
    // --------------------------------------------------
    const toolCall = aiMessage.tool_calls[0] as any;
    const toolName = toolCall?.function?.name;

    let toolResult: any = null;

    if (toolName === "get_balance") {
      toolResult = await executeGetBalance(walletAddress);
    }

    // --------------------------------------------------
    // 5️⃣ Send tool result BACK to AI
    // --------------------------------------------------
    const secondCompletion = await aiClient.chat.completions.create({
      model: "openai/gpt-5.2",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
        aiMessage,
        {
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        },
      ],
      tools: aiTools,
      max_tokens: 1024,
    });

    const finalReply = secondCompletion.choices?.[0]?.message?.content ?? "No response.";

    // ✅ STEP 4 — SAVE ASSISTANT MESSAGE (with tool calls)
    await prisma.message.create({
      data: {
        conversationId,
        role: "assistant",
        content: finalReply,
        metadata: toolCall
          ? {
              toolCalls: [toolCall.function.name],
            }
          : undefined,
      },
    });

    return {
      message: finalReply,
      conversationId,
      transactionId:
        toolCall?.function.name === "create_transfer"
          ? toolResult?.transactionId
          : undefined,
      requiresApproval:
        toolCall?.function.name === "create_transfer",
    };
    
  } catch (err) {
    console.error("CHAT ERROR:", err);
    throw err;
  }
}