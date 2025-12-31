import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { BorderTrail } from "../motion-primitives/border-trail"

const badgeVariants = cva(
  "relative inline-flex items-center justify-center rounded-full border border-white/20 px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden transition-[color,box-shadow]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground",
        destructive:
          "bg-destructive text-white dark:bg-destructive/60",
        outline:
          "text-foreground hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type BadgeProps =
  React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean
    trail?: boolean
  }

function Badge({
  className,
  variant,
  asChild = false,
  trail = false,
  children,
  ...props
}: BadgeProps) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    >
      {trail && (
        <div className="absolute inset-0">
          <BorderTrail
            size={22} 
            className="bg-white"
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "linear",
            }}
            style={{
              boxShadow: `
                0 0 6px rgba(255,255,255,0.9),
                0 0 12px rgba(255,255,255,0.7),
                0 0 20px rgba(255,255,255,0.4)
              `,
            }}
          />
        </div>
      )}

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
    </Comp>
  )
}

export { Badge }
