/**
 * Vercel AI Gateway Client for SageSpace
 * 
 * Single source of truth for all LLM requests in the application.
 * All chat UIs (Sages, Council, Companion, etc.) use this client.
 * 
 * REQUIRED ENVIRONMENT VARIABLES:
 * - AI_GATEWAY_URL: Vercel AI Gateway endpoint
 * - AI_GATEWAY_API_KEY: Authentication key for the Gateway
 * - AI_MODEL_ID: Default model identifier (e.g. "gpt-4o-mini", "gpt-4o")
 * 
 * NEVER call external LLM providers (Groq, OpenAI, etc.) directly.
 * All requests go through: Frontend → /api/chat → aiGateway.ts → Vercel AI Gateway
 */

function assertEnv(name: string, value: string | undefined): string {
  if (!value) {
    const errorMsg = `[AI Gateway] CRITICAL ERROR: Missing required environment variable: ${name}\n\nTo fix this:\n1. Go to your Vercel project settings\n2. Navigate to Environment Variables\n3. Add ${name} with the appropriate value\n4. Redeploy your application\n\nAlternatively, add to .env.local for local development.`
    console.error(errorMsg)
    throw new Error(errorMsg)
  }
  return value
}

// Load and validate environment variables
const AI_GATEWAY_URL = process.env.AI_GATEWAY_URL || 'https://api.openai.com/v1/chat/completions';
const AI_GATEWAY_API_KEY = process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY;
const AI_MODEL_ID = process.env.AI_MODEL_ID || process.env.TEXT_MODEL || 'gpt-4o-mini';

if (!AI_GATEWAY_API_KEY) {
  console.warn('[AI Gateway] WARNING: AI_GATEWAY_API_KEY not set. Council and chat features will not work.');
  console.warn('[AI Gateway] Please set AI_GATEWAY_API_KEY or OPENAI_API_KEY in your environment variables.');
}

console.log('[AI Gateway] Initialized with:', {
  url: AI_GATEWAY_URL,
  defaultModel: AI_MODEL_ID,
  hasApiKey: !!AI_GATEWAY_API_KEY,
});

export type ChatRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export interface AiChatOptions {
  messages: ChatMessage[];
  model?: string;
  // Optional caller metadata
  userId?: string | null;
  sageId?: string | null;
  sessionId?: string | null;
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Call Vercel AI Gateway for chat completions
 * 
 * @param options - Chat configuration including messages, model, and metadata
 * @returns Promise resolving to the assistant's response
 */
export async function aiChat(options: AiChatOptions): Promise<any> {
  if (!AI_GATEWAY_API_KEY) {
    throw new Error(
      '[AI Gateway] AI_GATEWAY_API_KEY is not configured. Please set this environment variable to enable AI features.',
    );
  }

  const {
    messages,
    model = AI_MODEL_ID,
    userId = null,
    sageId = null,
    sessionId = null,
    stream = false,
    temperature = 0.7,
    maxTokens,
  } = options;

  console.log('[AI Gateway] aiChat called:', {
    messageCount: messages.length,
    model,
    userId,
    sageId,
    stream,
  });

  // Build request payload (OpenAI-compatible schema)
  const body = {
    model,
    messages,
    stream,
    temperature,
    max_tokens: maxTokens,
    // Optional metadata (if Gateway/provider supports it)
    metadata: {
      userId: userId ?? undefined,
      sageId: sageId ?? undefined,
      sessionId: sessionId ?? undefined,
    },
  };

  try {
    const res = await fetch(AI_GATEWAY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AI_GATEWAY_API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '(no response body)');
      const truncatedError = errorText.length > 500 
        ? errorText.slice(0, 500) + '...' 
        : errorText;

      console.error('[AI Gateway] Request failed:', {
        status: res.status,
        statusText: res.statusText,
        error: truncatedError,
      });

      throw new Error(
        `[AI Gateway] HTTP ${res.status}: ${res.statusText}\n${truncatedError}`
      );
    }

    // Parse response
    const data = await res.json();
    
    console.log('[AI Gateway] Response received:', {
      model: data.model || model,
      hasChoices: !!data.choices,
      choiceCount: data.choices?.length,
    });

    // Extract message content from OpenAI-style response
    const message = data.choices?.[0]?.message?.content || '';

    return {
      model: data.model || model,
      message,
      raw: data,
    };
  } catch (error: any) {
    console.error('[AI Gateway] aiChat error:', {
      message: error.message,
      stack: error.stack?.split('\n').slice(0, 3),
    });

    throw error;
  }
}

/**
 * Streaming version of aiChat (for future implementation)
 * Currently returns non-streaming response for simplicity
 */
export async function aiChatStream(options: AiChatOptions): Promise<any> {
  // For now, just use the non-streaming version
  // TODO: Implement proper streaming with Server-Sent Events
  console.log('[AI Gateway] aiChatStream called (using non-streaming fallback)');
  return aiChat({ ...options, stream: false });
}
