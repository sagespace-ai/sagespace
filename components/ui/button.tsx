import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
type ButtonSize = "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg"

const getVariantClasses = (variant?: ButtonVariant) => {
  switch (variant) {
    case "destructive":
      return "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/20"
    case "outline":
      return "border bg-transparent shadow-xs hover:bg-white/10 hover:text-white border-white/20"
    case "secondary":
      return "bg-slate-700 text-white hover:bg-slate-600"
    case "ghost":
      return "hover:bg-white/10 hover:text-white"
    case "link":
      return "text-violet-400 underline-offset-4 hover:underline"
    default:
      return "bg-violet-600 text-white hover:bg-violet-700"
  }
}

const getSizeClasses = (size?: ButtonSize) => {
  switch (size) {
    case "sm":
      return "h-8 rounded-md gap-1.5 px-3"
    case "lg":
      return "h-10 rounded-md px-6"
    case "icon":
      return "size-9"
    case "icon-sm":
      return "size-8"
    case "icon-lg":
      return "size-10"
    default:
      return "h-9 px-4 py-2"
  }
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  variant?: ButtonVariant
  size?: ButtonSize
}) {
  const Comp = asChild ? Slot : "button"

  const baseClasses =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:ring-2"

  return (
    <Comp
      data-slot="button"
      className={cn(baseClasses, getVariantClasses(variant), getSizeClasses(size), className)}
      {...props}
    />
  )
}

export { Button }
