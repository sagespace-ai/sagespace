import { NextResponse } from "next/server";

export async function GET() {
  const aiGatewayKey = process.env.AI_GATEWAY_API_KEY;
  const textModel = process.env.TEXT_MODEL;

  return NextResponse.json({
    // AI Gateway config (primary and only)
    aiGatewayKeyPresent: !!aiGatewayKey,
    aiGatewayUrl: "https://ai-gateway.vercel.sh/v1/chat/completions",
    
    // Model config
    textModel: textModel || "openai/gpt-4o-mini (default)",
    
    // Environment
    nodeEnv: process.env.NODE_ENV || "development",
    
    // Status message
    status: aiGatewayKey
      ? "✅ AI Gateway configured correctly"
      : "⚠️ AI_GATEWAY_API_KEY is missing. Add it in Settings → Vars section.",
    
    timestamp: new Date().toISOString(),
  });
}
