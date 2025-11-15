# Vercel AI Gateway Setup for SageSpace

This document explains how to configure the Vercel AI Gateway integration that powers all AI features in SageSpace.

## Overview

SageSpace uses **Vercel AI Gateway** as the single source of truth for all LLM requests. This architecture:

- ✅ Centralizes AI calls through one gateway endpoint
- ✅ Keeps API keys secure on the server
- ✅ Eliminates `GROQ_API_KEY` dependencies
- ✅ Provides unified error handling and monitoring
- ✅ Supports multiple LLM providers through Gateway configuration

## Required Environment Variables

### 1. `AI_GATEWAY_URL`

The Vercel AI Gateway endpoint URL.

**Example value:**
\`\`\`
https://gateway.ai.vercel.com/api/chat/completions
\`\`\`

**Where to set:**
- **Local development:** Add to `.env.local`
- **Vercel deployment:** Project Settings → Environment Variables

### 2. `AI_GATEWAY_API_KEY`

Authentication key for the Vercel AI Gateway.

**Where to get:**
- Vercel Dashboard → Your Project → Integrations → AI Gateway → API Keys

**Where to set:**
- **Local development:** Add to `.env.local`
- **Vercel deployment:** Project Settings → Environment Variables (mark as "Secret")

### 3. `AI_MODEL_ID` (Optional)

Default model identifier to use for chat completions.

**Example values:**
- `gpt-4o-mini` (default, cost-effective)
- `gpt-4.1` (more capable, higher cost)
- `llama-3.1-70b` (open source alternative)

**Default:** `gpt-4o-mini`

## Local Development Setup

Create a `.env.local` file in the project root:

\`\`\`bash
AI_GATEWAY_URL=https://gateway.ai.vercel.com/api/chat/completions
AI_GATEWAY_API_KEY=your_gateway_api_key_here
AI_MODEL_ID=gpt-4o-mini
\`\`\`

**IMPORTANT:** Never commit `.env.local` to version control.

## Vercel Deployment Setup

1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add each variable:
   - Variable name: `AI_GATEWAY_URL`
   - Value: Your Gateway endpoint URL
   - Environments: Production, Preview, Development
   
   - Variable name: `AI_GATEWAY_API_KEY`
   - Value: Your API key
   - **Check "Secret"** to encrypt it
   - Environments: Production, Preview, Development
   
   - Variable name: `AI_MODEL_ID`
   - Value: `gpt-4o-mini` (or your preferred model)
   - Environments: Production, Preview, Development

4. Redeploy your application for changes to take effect

## Verification

After configuring environment variables, test the integration:

1. Visit the **Playground** page
2. Select a sage and send a test message
3. You should see a response within 2-3 seconds
4. Check browser console and Vercel logs for any errors

## Architecture

\`\`\`
Frontend (Playground, Council, etc.)
    ↓ POST /api/chat
Server API Route (app/api/chat/route.ts)
    ↓ aiChat()
AI Gateway Client (lib/aiGateway.ts)
    ↓ fetch() with Authorization header
Vercel AI Gateway
    ↓ Routes to configured provider
LLM Provider (OpenAI, Anthropic, etc.)
\`\`\`

## Removed Dependencies

The following are **NO LONGER USED** and have been removed:

- ❌ `GROQ_API_KEY` - Direct Groq integration
- ❌ `@ai-sdk/groq` - Groq provider package
- ❌ `lib/ai-client.ts` (old implementation)
- ❌ `lib/ai/model-router.ts` (old routing logic)
- ❌ Direct calls to Groq, OpenAI, or other providers

## Troubleshooting

### Error: "Missing required env var: AI_GATEWAY_URL"

**Solution:** Add `AI_GATEWAY_URL` to your environment variables.

### Error: "Missing required env var: AI_GATEWAY_API_KEY"

**Solution:** Add `AI_GATEWAY_API_KEY` to your environment variables.

### Error: "HTTP 401: Unauthorized"

**Solution:** Check that `AI_GATEWAY_API_KEY` is correct. Regenerate it in Vercel Dashboard if needed.

### Error: "HTTP 404: Not Found"

**Solution:** Verify `AI_GATEWAY_URL` is correct and includes `/api/chat/completions` path.

### Chat responses are slow or timing out

**Solution:** 
- Check Vercel AI Gateway status
- Try a faster model like `gpt-4o-mini`
- Check your Gateway usage limits

## Support

For issues with the AI Gateway integration:
1. Check Vercel Dashboard → Your Project → Logs
2. Review browser console for client-side errors
3. Contact Vercel Support for Gateway-specific issues
4. File an issue in the SageSpace repository for app-specific problems
