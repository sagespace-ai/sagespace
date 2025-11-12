import type { Conversation } from "../types"

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    title: "Learning React Hooks",
    agents: ["Claude Assistant", "Code Writer"],
    messageCount: 12,
    createdAt: new Date("2024-11-01"),
    ethicsReview: "passed",
  },
  {
    id: "2",
    title: "Creative Content Strategy",
    agents: ["Creative Bot", "Research Agent"],
    messageCount: 8,
    createdAt: new Date("2024-11-02"),
    ethicsReview: "passed",
  },
  {
    id: "3",
    title: "Data Analysis Discussion",
    agents: ["Research Agent", "Claude Assistant"],
    messageCount: 15,
    createdAt: new Date("2024-11-03"),
    ethicsReview: "pending",
  },
]
