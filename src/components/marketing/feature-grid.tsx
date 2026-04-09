import { cn } from "@/lib/utils";

interface Feature {
  title: string;
  body: string;
}

interface FeatureGridProps {
  features: Feature[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function FeatureGrid({
  features,
  columns = 3,
  className,
}: FeatureGridProps) {
  const cols =
    columns === 2
      ? "md:grid-cols-2"
      : columns === 4
        ? "md:grid-cols-2 lg:grid-cols-4"
        : "md:grid-cols-3";

  return (
    <div className={cn("grid gap-6", cols, className)}>
      {features.map((feature, i) => (
        <div
          key={feature.title}
          className="group relative rounded-2xl border border-border/70 bg-surface p-6 transition-colors hover:border-brand/40"
        >
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
            0{i + 1}
          </div>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
            {feature.title}
          </h3>
          <p className="mt-2.5 text-sm leading-6 text-muted-foreground">
            {feature.body}
          </p>
        </div>
      ))}
    </div>
  );
}
