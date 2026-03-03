import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full rounded-md border border-input bg-transparent",
        "px-3 py-2 text-base md:text-sm",
        "placeholder:text-muted-foreground",
        "shadow-sm outline-none",
        "transition-colors",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "appearance-none",
        className
      )}
      {...props}
    />
  )
}

export { Input }
