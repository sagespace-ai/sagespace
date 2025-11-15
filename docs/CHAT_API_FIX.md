# v0 Chat Fix – Root Cause & Changes

## Root Cause

The HTTP 500 error occurred because `routedStreamText()` was adding the `routingDecision` property using direct property assignment:

\`\`\`typescript
(streamResult as any).routingDecision = decision
\`\`\`

This approach **does not preserve the prototype chain** and causes the `toUIMessageStreamResponse()` method from the AI SDK's `StreamTextResult` to be lost. When the chat API tries to call `result.toUIMessageStreamResponse()`, it fails with "toUIMessageStreamResponse is not a function".

## What Was Changed

### 1. Fixed Method Preservation in `lib/ai/model-router.ts`

**Before:**
\`\`\`typescript
(streamResult as any).routingDecision = decision
return streamResult
\`\`\`

**After:**
\`\`\`typescript
const augmentedResult = Object.create(
  Object.getPrototypeOf(streamResult),
  {
    ...Object.getOwnPropertyDescriptors(streamResult),
    routingDecision: {
      value: decision,
      writable: false,
      enumerable: true,
      configurable: false
    }
  }
)
return augmentedResult
\`\`\`

This uses `Object.create()` with `Object.getOwnPropertyDescriptors()` to:
- Preserve the entire prototype chain (including all SDK methods)
- Copy all properties with their descriptors
- Add `routingDecision` as a proper property

### 2. Enhanced API Key Validation in `lib/ai-client.ts`

Added upfront validation with clear error messages:

\`\`\`typescript
const apiKey = process.env.API_KEY_GROQ_API_KEY || process.env.GROQ_API_KEY
if (!apiKey) {
  const error = new Error('GROQ_API_KEY is not configured...')
  error.name = 'GROQ_API_KEY_MISSING'
  throw error
}
\`\`\`

### 3. Improved Error Handling in `app/api/chat/route.ts`

- Added structured error responses with helpful instructions
- Specific handling for GROQ_API_KEY_MISSING errors
- Clear guidance on how to fix the issue

### 4. Added Debugging & Logging

Comprehensive logging at every step to trace execution:
- Method existence checks
- Prototype inspection
- Error context with stack traces

## Environment Variables Required

### Local Development (.env.local)

\`\`\`bash
# Required: Groq API Key (get from https://console.groq.com/keys)
API_KEY_GROQ_API_KEY=gsk_your_api_key_here
# OR
GROQ_API_KEY=gsk_your_api_key_here
\`\`\`

### Vercel Deployment

1. Go to your Vercel project → Settings → Environment Variables
2. Add variable:
   - **Name**: `API_KEY_GROQ_API_KEY` or `GROQ_API_KEY`
   - **Value**: Your Groq API key from https://console.groq.com/keys
   - **Environments**: Check Production, Preview, and Development
3. Redeploy your application

## How to Test

### Local Testing

1. **Verify API key is set:**
   \`\`\`bash
   echo $API_KEY_GROQ_API_KEY
   # Should output your key
   \`\`\`

2. **Start dev server:**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Test chat:**
   - Go to http://localhost:3000/playground
   - Select a Sage guide
   - Start a session
   - Send a message
   - Verify you get a streaming response

4. **Check logs:**
   \`\`\`
   [v0] generateChatResponse called
   [v0] Calling routedStreamText
   [v0] routedStreamText succeeded
   [v0] Chat API: Returning stream response
   \`\`\`

### Vercel Testing

1. **Deploy to Vercel:**
   \`\`\`bash
   vercel deploy
   \`\`\`

2. **Check environment variables:**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Verify `API_KEY_GROQ_API_KEY` or `GROQ_API_KEY` is set

3. **Test on deployed URL:**
   - Visit your-app.vercel.app/playground
   - Perform the same tests as local

4. **Check Vercel logs:**
   - Vercel Dashboard → Project → Logs
   - Filter for "v0" to see chat-related logs

## Troubleshooting

### Still Getting HTTP 500?

1. **Check API Key:**
   - Verify it starts with `gsk_`
   - Test it at https://console.groq.com/playground

2. **Check Logs:**
   - Look for `[v0]` prefixed messages
   - Check for "API key validation failed"

3. **Verify Method Preservation:**
   - Look for log: "routedStreamText returning augmented result"
   - Should show: `hasToUIMethod: true`

### Error: "toUIMessageStreamResponse is not a function"

This means the fix didn't fully apply. Ensure:
- You've restarted the dev server
- You've cleared Next.js cache: `rm -rf .next`
- The changes to `model-router.ts` are correct

### Error: "GROQ_API_KEY is not configured"

1. Add the key to your environment
2. Restart your dev server
3. For Vercel, ensure variable is set and redeploy

## Success Indicators

✅ **Working correctly when you see:**
- Messages stream in real-time
- No HTTP 500 errors
- Logs show: `[v0] routedStreamText succeeded`
- Logs show: `hasToUIMethod: true`

## Support

If issues persist:
1. Check browser console for client-side errors
2. Check server logs for `[v0]` messages
3. Verify Groq API key is valid
4. Ensure all files are saved and server restarted
