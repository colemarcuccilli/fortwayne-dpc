import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLDivElement> {
  bleed?: boolean;
}

export function Section({ className, bleed, children, ...rest }: SectionProps) {
  return (
    <section
      className={cn(
        bleed ? "w-full" : "mx-auto w-full max-w-6xl px-5 sm:px-8",
        className,
      )}
      {...rest}
    >
      {children}
    </section>
  );
}

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
}

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-block text-xs font-semibold uppercase tracking-[0.18em] text-brand",
        className,
      )}
    >
      {children}
    </span>
  );
}
