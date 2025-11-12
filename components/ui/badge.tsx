import type * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "secondary" | "destructive" | "outline"

const getBadgeVariantClasses = (variant?: BadgeVariant) => {
  switch (variant) {
    case "secondary":
      return "border-transparent bg-slate-700 text-white hover:bg-slate-600"
    case "destructive":
      return "border-transparent bg-red-600 text-white hover:bg-red-700"
    case "outline":
      return "text-white hover:bg-white/10"
    default:
      return "border-transparent bg-violet-600 text-white hover:bg-violet-700"
  }
}

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> & {
  variant?: BadgeVariant
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : "span"

  const baseClasses =
    "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-colors overflow-hidden"

  return <Comp data-slot="badge" className={cn(baseClasses, getBadgeVariantClasses(variant), className)} {...props} />
}

export { Badge }
