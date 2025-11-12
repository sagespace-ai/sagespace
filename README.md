# Sagespace AI build

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/sagespace-ais-projects/v0-sagespace-ai-build)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/t9Wa2KrSZUp)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/sagespace-ais-projects/v0-sagespace-ai-build](https://vercel.com/sagespace-ais-projects/v0-sagespace-ai-build)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/t9Wa2KrSZUp](https://v0.app/chat/t9Wa2KrSZUp)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

---

## Getting Started

### Prerequisites

- Supabase integration connected
- At least one AI provider API key (OpenAI, Anthropic, Groq, or xAI)

### Setup Steps

1. **Initialize Database**
   - Open the Scripts panel in v0
   - Run `000-initialize-database.sql`
   - This creates all tables and demo data

2. **Add AI Provider**
   - Go to v0 Vars panel
   - Add one of: `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GROQ_API_KEY`, or configure xAI integration

3. **Start Exploring**
   - Visit `/setup` for an interactive setup guide
   - Try the `/playground` to chat with agents
   - Explore `/council`, `/observatory`, `/memory`, and more

### Key Features

- Multi-agent collaboration with automatic threshold detection
- Democratic council voting system for ethical deliberation
- Real-time agent observatory for monitoring interactions
- Persistent memory system for agent learning and evolution
- Multiverse chat manager for organizing conversations
- Custom persona editor for creating specialized agents
- Spatial universe map visualization

### Tech Stack

- Next.js 16 (App Router) with React 19
- Supabase (PostgreSQL) for database
- Vercel AI SDK v5 for multi-provider AI
- Tailwind CSS v4 for styling

For detailed setup instructions, see [SETUP.md](./SETUP.md)
