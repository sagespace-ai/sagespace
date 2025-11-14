import { InferenceBadge } from '../InferenceIndicator'
import type { ModelProvider } from '@/lib/ai/model-registry'

interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant' | 'system'
    content: string
    provider?: ModelProvider
    timestamp?: Date
  }
  // ... existing props ...
}

export function ChatMessage({ message, ...props }: ChatMessageProps) {
  return (
    <div className="group relative flex gap-3 px-4 py-3">
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-sm">
            {message.role === 'user' ? 'You' : 'Sage'}
          </span>
          
          {message.role === 'assistant' && message.provider && (
            <InferenceBadge provider={message.provider} />
          )}
          
          {message.timestamp && (
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(message.timestamp)}
            </span>
          )}
        </div>
        
        <div className="prose prose-sm max-w-none">
          {message.content}
        </div>
      </div>
      
    </div>
  )
}
