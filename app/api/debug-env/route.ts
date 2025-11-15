import { NextResponse } from "next/server";

export async function GET() {
  const groqKey = process.env.GROQ_API_KEY || process.env.API_KEY_GROQ_API_KEY;
  const textModel = process.env.TEXT_MODEL;
  
  const effectiveModel = (() => {
    if (textModel && !textModel.includes('gpt-') && !textModel.includes('openai/')) {
      return textModel;
    }
    return 'llama-3.3-70b-versatile (default)';
  })();

  return NextResponse.json({
    // Groq API config
    groqKeyPresent: !!groqKey,
    groqKeyLength: groqKey?.length || 0,
    groqApiUrl: "https://api.groq.com/openai/v1/chat/completions",
    
    // Model config
    textModel: textModel || "Not set",
    effectiveModel,
    modelWarning: textModel?.includes('gpt-') || textModel?.includes('openai/')
      ? "TEXT_MODEL is set to an OpenAI model, using Groq fallback instead"
      : null,
    
    // Environment
    nodeEnv: process.env.NODE_ENV || "development",
    
    // Status message
    message: groqKey
      ? "✅ Groq API is configured correctly"
      : "⚠️ GROQ_API_KEY is missing. Add it in Settings → Vars section.",
    
    timestamp: new Date().toISOString(),
  });
}
