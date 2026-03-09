import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "btn-glass-primary text-white border-0 bg-transparent",
        destructive:
          "bg-destructive text-destructive-foreground rounded-[9px] " +
          "hover:-translate-y-0.5 transition-transform duration-200",
        outline:
          "btn-glass-outline text-foreground border-0",
        secondary:
          "bg-secondary text-secondary-foreground rounded-[9px] " +
          "hover:bg-secondary/80 transition-colors duration-200",
        ghost:
          "text-foreground hover:bg-primary/6 hover:text-primary rounded-[9px] " +
          "transition-colors duration-200",
        link:
          "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-[9px]",
        sm:      "h-8  px-3 text-xs rounded-[8px]",
        lg:      "h-11 px-6 text-[15px] rounded-[10px]",
        icon:    "h-10 w-10 rounded-[9px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
