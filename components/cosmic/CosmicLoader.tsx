import { CosmicLogoThinking } from '@/components/branding/CosmicLogo'

interface CosmicLoaderProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export function CosmicLoader({ text, size = 'md' }: CosmicLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <CosmicLogoThinking size={size} />
      {text && (
        <p className="text-slate-400 text-sm animate-pulse">{text}</p>
      )}
    </div>
  )
}
