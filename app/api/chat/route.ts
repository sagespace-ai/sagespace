/**
 * Unified Chat API Route
 * 
 * Single endpoint for all chat interactions in SageSpace.
 * Used by: Playground, Council, Companion, and all other chat UIs.
 */

import { NextResponse } from "next/server";
import { runChat, ChatMessage } from "@/lib/ai/chatClient";
import { createServerClient } from "@/lib/supabase/server";
import { SAGE_TEMPLATES } from "@/lib/sage-templates";

export async function POST(request: Request) {
  try {
    console.log("[v0] [Chat API] Starting request");
    
    const body = await request.json();
    const { messages, sageId, conversationId, systemPrompt: customSystemPrompt } = body;

    console.log("[v0] [Chat API] Request data:", {
      messageCount: messages?.length,
      sageId,
      conversationId,
    });

    // Validate request
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: messages array required and must not be empty" },
        { status: 400 }
      );
    }

    // Get authenticated user (optional)
    let userId: string | null = null;
    try {
      const supabase = await createServerClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    } catch (authError) {
      console.log("[v0] [Chat API] No authenticated user");
    }

    // Build system prompt if sage is specified
    let systemPrompt: string | undefined = customSystemPrompt;
    if (!systemPrompt && sageId) {
      const sage = SAGE_TEMPLATES.find((s) => s.id === sageId);
      if (sage) {
        systemPrompt = `You are ${sage.name}, ${sage.description}\n\nPersonality: ${sage.personality}\n\nRespond in character with helpful guidance.`;
      }
    }

    console.log("[v0] [Chat API] Calling runChat");
    const response = await runChat({
      messages,
      systemPrompt,
    });

    console.log("[v0] [Chat API] Response generated successfully");

    return NextResponse.json({
      message: response.content,
      reply: response.content, // Alias for consistency
      model: response.model,
    });
  } catch (error: any) {
    console.error("[v0] [Chat API] Error:", {
      name: error.name,
      message: error.message,
      stack: error.stack?.split("\n").slice(0, 3),
    });

    const aiGatewayKeyPresent = !!process.env.AI_GATEWAY_API_KEY;

    return NextResponse.json(
      {
        error: "CHAT_ERROR",
        message: error.message || "Chat service unavailable",
        envStatus: {
          aiGatewayKeyPresent,
        },
        helpMessage: !aiGatewayKeyPresent
          ? "AI_GATEWAY_API_KEY is not configured. Please add it in the Vars section (Settings → Vars)."
          : "The AI service encountered an error. Please try again.",
      },
      { status: 500 }
    );
  }
}
