import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * next/link styled as an admin button (slate palette). The shadcn
 * base-nova Button does not support asChild, so anywhere we need a
 * link-styled action button in the admin panel we use this.
 */
const adminButtonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        solid:
          "border-slate-900 bg-slate-900 text-white hover:bg-slate-800",
        outline:
          "border-slate-200 bg-white text-slate-900 hover:bg-slate-100",
        ghost:
          "border-transparent bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
        subtle:
          "border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100",
        danger:
          "border-rose-200 bg-white text-rose-700 hover:bg-rose-50",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-3.5 text-sm",
        lg: "h-10 px-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  },
);

type Props = React.ComponentProps<typeof Link> &
  VariantProps<typeof adminButtonVariants>;

export function AdminButton({ className, variant, size, ...props }: Props) {
  return (
    <Link
      {...props}
      className={cn(adminButtonVariants({ variant, size }), className)}
    />
  );
}

export { adminButtonVariants };
