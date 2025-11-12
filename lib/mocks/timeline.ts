import type { TimelineEvent } from "../types"

export const MOCK_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: "1",
    conversationId: "1",
    type: "conversation_started",
    title: "Conversation started",
    description: "Learning React Hooks conversation initiated",
    timestamp: new Date("2024-11-01T09:00:00"),
  },
  {
    id: "2",
    conversationId: "1",
    type: "agent_joined",
    title: "Claude Assistant joined",
    description: "Agent is now active in the conversation",
    timestamp: new Date("2024-11-01T09:05:00"),
    metadata: { agentId: "1" },
  },
  {
    id: "3",
    conversationId: "1",
    type: "message",
    title: "Message sent",
    description: "Claude sent a message about React hooks",
    timestamp: new Date("2024-11-01T10:00:00"),
    metadata: { messageId: "1" },
  },
  {
    id: "4",
    conversationId: "1",
    type: "message",
    title: "User sent a message",
    timestamp: new Date("2024-11-01T10:01:00"),
    metadata: { messageId: "2" },
  },
  {
    id: "5",
    conversationId: "1",
    type: "message",
    title: "Claude sent detailed explanation",
    timestamp: new Date("2024-11-01T10:02:00"),
    metadata: { messageId: "3", tokens: 145 },
  },
]
