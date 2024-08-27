import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        primary: "bg-gradient-to-r text-sm md:text-medium from-[#ff8f4d] to-[#ff5000] text-stone-100 text-center rounded-xl justify-center items-center max-w-[400px] font-semibold leading-none no-underline transition-[opacity,transform] duration-200 flex hover:opacity-90 hover:scale-105 focus:outline-offset-[6px] focus:outline focus:outline-[0.5px] focus:outline-[#8129004d] focus:shadow-[0_0_0_6px_#ff601733,inset_0_0_0_1.5px_#ffffff40]",
        customOutline: "bg-gradient-to-r text-sm md:text-medium from-white to-stone-100 text-stone-800 text-center rounded-xl justify-center items-center max-w-[400px] font-semibold leading-none no-underline transition-[opacity,transform] duration-200 flex hover:opacity-90 hover:scale-105 focus:outline-offset-[6px] focus:outline focus:outline-[0.5px] focus:outline-[#8129004d] focus:shadow-[0_0_0_6px_rgba(0,0,0,0.1),inset_0_0_0_1.5px_#e7e5e4]",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-6 px-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",

        // primary: "h-[48px] px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
