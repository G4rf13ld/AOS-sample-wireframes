import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-lg border border-[#D4D4D8] bg-white px-3 py-2 text-sm text-[#18181B] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#5F5F68] focus-visible:outline-none focus-visible:border-[#18181B] focus-visible:ring-1 focus-visible:ring-[#18181B] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
