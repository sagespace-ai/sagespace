import type { Setting } from "../types"

export const MOCK_SETTINGS: Setting[] = [
  {
    id: "1",
    key: "theme",
    value: "dark",
    category: "display",
    description: "Application theme preference",
    type: "select",
  },
  {
    id: "2",
    key: "autoSave",
    value: true,
    category: "behavior",
    description: "Enable automatic saving of conversations",
    type: "boolean",
  },
  {
    id: "3",
    key: "messageNotifications",
    value: true,
    category: "notifications",
    description: "Enable notifications for new messages",
    type: "boolean",
  },
  {
    id: "4",
    key: "dataRetention",
    value: 90,
    category: "privacy",
    description: "Number of days to retain conversation history",
    type: "number",
  },
  {
    id: "5",
    key: "fontSize",
    value: "medium",
    category: "display",
    description: "Font size for conversation text",
    type: "select",
  },
  {
    id: "6",
    key: "shareAnalytics",
    value: false,
    category: "privacy",
    description: "Share usage analytics with SageSpace",
    type: "boolean",
  },
]
