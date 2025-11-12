# SageSpace Setup Guide

Welcome to SageSpace! Follow these steps to get your prototype up and running.

## Prerequisites

- Node.js 18+ installed
- A Vercel account (for deployment)
- Supabase project connected (already done!)

## Step 1: Initialize the Database

The database is already connected via Supabase integration. Now you need to run the initialization script:

1. Open the Scripts panel in v0 (bottom left corner)
2. Find and run: `000-initialize-database.sql`
3. Wait for "Script executed successfully"

This creates all tables and inserts demo agents!

## Step 2: Get an AI API Key

SageSpace needs at least one AI provider to work. Choose ONE of these options:

### Option A: OpenAI (Recommended for testing)
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add to v0 environment variables:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-...` (your key)

### Option B: Anthropic Claude
1. Go to https://console.anthropic.com/
2. Get an API key
3. Add to v0 environment variables:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (your key)

### Option C: xAI Grok (Already configured!)
1. Get a key from https://console.x.ai/
2. Add the `xAI` integration in v0
3. No additional setup needed!

### Option D: Groq (Free, Fast!)
1. Go to https://console.groq.com/
2. Get an API key
3. Add the `Groq` integration in v0

## Step 3: Test the Prototype

Now everything should work! Try these features:

1. **Playground** (`/playground`)
   - Chat with different AI models
   - Enable "Auto-Collaborate" to see multi-agent interactions

2. **Council** (`/council`)
   - Submit a complex ethical query
   - Watch multiple agents deliberate and vote

3. **Observatory** (`/observatory`)
   - Monitor agent interactions in real-time
   - Intervene in conversations

4. **Memory** (`/memory`)
   - View what agents have learned
   - Track agent evolution over time

5. **Multiverse** (`/multiverse`)
   - Create and manage multiple conversations
   - Each can have different agent roles

6. **Persona Editor** (`/persona-editor`)
   - Create custom AI agents
   - Configure tone, capabilities, and prompts

## Troubleshooting

### "Error fetching agents"
- Make sure you ran the database initialization script
- Check that Supabase is connected in the integrations panel

### "AI model not responding"
- Verify you added at least one AI API key
- Check the key is correct in environment variables
- Try a different model from the dropdown

### "RLS policy violation"
- The demo uses anonymous access (no auth required)
- If you added authentication, you may need to adjust RLS policies

## Next Steps

Once the prototype works:

1. **Add Authentication** - Enable Supabase auth for user accounts
2. **Customize Agents** - Create your own specialized agents
3. **Configure Policies** - Define custom governance rules
4. **Deploy to Production** - Click "Publish" to deploy on Vercel

## Architecture Overview

- **Frontend**: Next.js 16 with React 19
- **Database**: Supabase (PostgreSQL)
- **AI**: AI SDK v5 with multiple providers
- **Styling**: Tailwind CSS v4 with custom design system

## Key Features

- Multi-agent collaboration with threshold detection
- Democratic council voting system
- Real-time agent observatory
- Persistent memory and learning
- Spatial universe visualization
- Custom agent creation

Need help? Check the documentation in the `/docs` folder or reach out to the community!
