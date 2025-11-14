# SageSpace Gamification System

## Overview

SageSpace features a comprehensive gamification layer that transforms AI interaction into an engaging cosmic journey.

## Core Systems

### 1. Quest System

Complete structured challenges to earn XP and unlock new capabilities:

- **First Contact**: Have your first Sage conversation (100 XP)
- **Council Summon**: Convene a multi-Sage deliberation (200 XP)
- **Sage Training**: Provide feedback to improve Sages (300 XP)
- **Knowledge Upload**: Share documents with Sages (250 XP)
- **Sage Mastery**: Achieve expert level with a Sage (1000 XP)

Quests are tracked in the database with progress monitoring and automatic completion detection.

### 2. Sage Skill Trees

Each Sage has an orbital constellation of unlockable skills:

**Skill Categories:**
- Domain: Core expertise
- Communication: Better responses
- Reasoning: Deeper analysis
- Creativity: Novel ideas
- Integration: External tools
- Multimodal: Images, code, data

**Progression:**
- Earn XP through conversations
- Unlock prerequisite skills first
- Level up skills through training
- Gain concrete benefits per level

### 3. Streaks & Daily Engagement

Track consecutive daily usage:

- Daily streak counter
- Longest streak record
- Milestone rewards (7, 30, 100, 365 days)
- At-risk notifications
- Comeback bonuses

### 4. Challenges

Time-limited objectives:

- **Daily**: Quick wins (50-100 XP)
- **Weekly**: Moderate goals (300-500 XP)
- **Seasonal**: Long-term achievements (1000-5000 XP)

### 5. Badges & Achievements

Unlock cosmetic rewards:

- Quest completion badges
- Skill mastery badges
- Streak milestone badges
- Special event badges

**Rarity Tiers:**
- Common
- Rare
- Epic
- Legendary

### 6. Milestone Celebrations

Cosmic animations for:

- Level ups
- Skill unlocks
- Quest completions
- Streak milestones

## User Experience

### Retention Mechanics

1. **Daily Login Rewards**: Incremental XP bonuses
2. **Comeback Bonuses**: Extra rewards after breaks
3. **Personalized Recommendations**: Suggested quests based on usage
4. **Social Proof**: Featured community achievements
5. **Progress Visualization**: Clear skill tree & XP bars

### Engagement Triggers

- Floating streak banners
- Milestone celebration modals
- Push notifications (opt-in)
- Email digests (opt-in)
- New quest notifications

## Technical Implementation

### Database Tables

- `quest_definitions`: Quest library
- `user_quest_progress`: User progress tracking
- `sage_skills`: Skill tree definitions
- `user_sage_skills`: User skill progress
- `badges`: Badge library
- `user_badges`: User badge collection
- `challenges`: Time-limited challenges
- `user_challenges`: Challenge progress
- `sage_training_sessions`: Training history

### API Endpoints

- `GET /api/quests`: Fetch available quests
- `POST /api/quests`: Start/update quest
- `GET /api/skills/[sageId]`: Get skill tree
- `POST /api/skills/[sageId]/unlock`: Unlock skill
- `GET /api/engagement/streak`: Get streak data
- `POST /api/engagement/streak`: Update streak

### Analytics

Track:
- Quest completion rates
- Average streak duration
- Skill tree progress
- Feature engagement
- Retention risk
- Favorite features

## Charter Compliance

All gamification features:

- Use Groq for zero-cost AI operations
- Respect tier-based access control
- Maintain ISO 42001 audit logs
- Support Charter governance
- Enable user data export
- Preserve privacy by default

## Future Enhancements

- Three.js 3D skill tree visualization
- Multiplayer challenges
- Sage trading/sharing
- Tournament modes
- Guild systems
- Leaderboards (opt-in only)
