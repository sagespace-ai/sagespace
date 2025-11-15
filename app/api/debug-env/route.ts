import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    aiGatewayKeyPresent: !!process.env.AI_GATEWAY_API_KEY,
    groqKeyPresent: !!process.env.GROQ_API_KEY,
    textModel: process.env.TEXT_MODEL ?? null,
    nodeEnv: process.env.NODE_ENV ?? null,
  });
}
