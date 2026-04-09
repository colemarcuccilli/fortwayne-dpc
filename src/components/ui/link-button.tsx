import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * next/link styled as a button. The shadcn "base-nova" Button component
 * ships via @base-ui/react/button and does not support asChild, so we use
 * this whenever a CTA needs to be a link (which is almost always for
 * marketing pages).
 */
const linkButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg border border-transparent font-medium whitespace-nowrap transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        brand: "bg-brand text-brand-foreground hover:bg-brand/90",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline:
          "border-border bg-background text-foreground hover:bg-muted hover:text-foreground",
        ghost: "text-foreground hover:bg-muted",
        inverse:
          "bg-background text-foreground hover:bg-background/90",
        "outline-inverse":
          "border-brand-foreground/30 bg-transparent text-brand-foreground hover:bg-brand-foreground/10",
      },
      size: {
        sm: "h-9 gap-1.5 rounded-md px-3.5 text-sm",
        md: "h-10 gap-1.5 rounded-lg px-4 text-sm",
        lg: "h-12 gap-2 rounded-lg px-6 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "md",
    },
  },
);

type LinkButtonProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof linkButtonVariants>;

export function LinkButton({
  className,
  variant,
  size,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      {...props}
      className={cn(linkButtonVariants({ variant, size }), className)}
    />
  );
}

export { linkButtonVariants };
