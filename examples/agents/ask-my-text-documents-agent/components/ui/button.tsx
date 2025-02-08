import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import cn from 'mxcn'

const buttonVariants = cva(
  'focus-visible:ring-ring-muted-foreground/25 inline-flex cursor-pointer select-none items-center justify-center rounded-lg text-sm font-medium transition-colors focus:ring-1 focus:ring-muted-foreground/25 focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 gap-2 group',
  {
    variants: {
      variant: {
        default:
          'border border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/90',
        warn: 'bg-warning text-warning-foreground hover:bg-warning/90 shadow-sm',
        destructive:
          'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        'destructive-hover':
          'border border-input bg-muted font-bold text-destructive shadow-sm hover:bg-destructive hover:text-destructive-foreground',
        'outline-background':
          'border border-input bg-background text-foreground shadow-sm transition-colors hover:bg-foreground hover:text-background',
        'outline-inverse':
          'border border-input bg-muted-foreground text-muted shadow-sm hover:bg-foreground hover:text-background',
        outline:
          'border border-input bg-transparent shadow-sm hover:bg-foreground hover:text-background',
        'outline-muted':
          'border border-input bg-muted text-foreground shadow-sm hover:bg-foreground hover:text-background',
        secondary:
          'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        green:
          'rounded-lg bg-green-500 text-primary shadow-sm hover:bg-green-400 dark:bg-green-700 dark:hover:bg-green-800'
      },
      size: {
        default: 'h-9 px-4 py-2',
        xs: 'h-6 rounded-lg px-2 text-xs',
        sm: 'h-8 rounded-lg px-3 text-xs',
        lg: 'h-10 rounded-lg px-8',
        xl: 'h-14 rounded-lg px-10',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
