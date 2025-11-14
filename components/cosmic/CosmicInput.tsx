import { InputHTMLAttributes, ReactNode } from 'react'
import { Input } from '@/components/ui/input'

interface CosmicInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactNode
  error?: string
}

export function CosmicInput({
  icon,
  error,
  className = '',
  ...props
}: CosmicInputProps) {
  return (
    <div className="w-full">
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <Input
          className={`
            bg-slate-800/80 border-2 border-slate-600 
            focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10
            text-white placeholder:text-slate-500
            transition-all duration-200
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500/50 focus:border-red-500' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}
