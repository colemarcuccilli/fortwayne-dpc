import Link from "next/link";
import { ArrowRight, Info, Lightbulb } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { cn } from "@/lib/utils";
import {
  isSafeHref,
  liftTipButtons,
  type Block,
  type InlineNode,
} from "@/lib/blog-markdown";

/* ------------------------------------------------------------------ Inline */

function Inline({ nodes }: { nodes: InlineNode[] }) {
  return (
    <>
      {nodes.map((n, i) => {
        switch (n.type) {
          case "text":
            return n.value;
          case "bold":
            return (
              <strong key={i} className="font-semibold text-foreground">
                <Inline nodes={n.children} />
              </strong>
            );
          case "italic":
            return (
              <em key={i}>
                <Inline nodes={n.children} />
              </em>
            );
          case "code":
            return (
              <code
                key={i}
                className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground"
              >
                {n.value}
              </code>
            );
          case "link": {
            if (!isSafeHref(n.href)) return <Inline key={i} nodes={n.children} />;
            const external = /^https?:/i.test(n.href);
            const linkClass =
              "font-medium text-brand underline decoration-brand/40 underline-offset-4 transition-colors hover:decoration-brand";
            return external ? (
              <a
                key={i}
                href={n.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                <Inline nodes={n.children} />
              </a>
            ) : (
              <Link key={i} href={n.href} className={linkClass}>
                <Inline nodes={n.children} />
              </Link>
            );
          }
        }
      })}
    </>
  );
}

/* ------------------------------------------------------------------ Blocks */

const PARAGRAPH = "text-base leading-7 text-foreground/85 sm:text-[17px] sm:leading-8";

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockView key={i} block={b} />
      ))}
    </>
  );
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "heading":
      return block.level === 2 ? (
        <h2
          id={block.id}
          className="mt-12 scroll-mt-28 text-2xl font-semibold leading-tight tracking-tight text-foreground first:mt-0 sm:mt-14 sm:text-[1.75rem]"
        >
          {block.text}
        </h2>
      ) : (
        <h3
          id={block.id}
          className="mt-8 scroll-mt-28 text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          {block.text}
        </h3>
      );

    case "paragraph":
      return (
        <p className={cn(PARAGRAPH, "mt-5")}>
          <Inline nodes={block.children} />
        </p>
      );

    case "list": {
      const Tag = block.ordered ? "ol" : "ul";
      return (
        <Tag
          className={cn(
            PARAGRAPH,
            "mt-5 space-y-2.5 pl-6 marker:font-semibold marker:text-brand-accent",
            block.ordered ? "list-decimal" : "list-disc",
          )}
        >
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              <Inline nodes={item} />
            </li>
          ))}
        </Tag>
      );
    }

    case "quote":
      return (
        <blockquote className="mt-6 border-l-2 border-brand-accent/60 pl-5 text-lg leading-8 text-foreground/80">
          <Inline nodes={block.children} />
        </blockquote>
      );

    case "rule":
      return <hr className="my-10 border-border/70" />;

    case "image": {
      // Only absolute web images or site images are shown.
      if (!/^https:\/\//i.test(block.src) && !block.src.startsWith("/")) return null;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={block.src}
          alt={block.alt}
          loading="lazy"
          className="mt-6 w-full rounded-2xl border border-border/60"
        />
      );
    }

    case "callout":
      return <Callout block={block} />;
  }
}

/* ---------------------------------------------------------------- Callouts */

function Callout({
  block,
}: {
  block: Extract<Block, { type: "callout" }>;
}) {
  const isTip = block.kind === "tip";
  const { body, buttons } = isTip
    ? liftTipButtons(block.body)
    : { body: block.body, buttons: [] };
  const Icon = isTip ? Lightbulb : Info;

  return (
    <aside
      className={cn(
        "my-8 rounded-2xl border p-5 sm:p-6",
        isTip
          ? "border-brand/25 bg-brand-muted/50"
          : "border-brand-accent/30 bg-brand-accent-muted/70",
      )}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            isTip ? "bg-brand text-brand-foreground" : "bg-brand-accent text-brand-foreground",
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <p
            className={cn(
              "text-[11px] font-semibold uppercase tracking-[0.18em]",
              isTip ? "text-brand" : "text-brand-accent",
            )}
          >
            {isTip ? "Tip" : "Good to know"}
          </p>
          {block.title && (
            <p className="text-base font-semibold leading-snug text-foreground">
              {block.title}
            </p>
          )}
        </div>
      </div>

      <div className="[&>*:first-child]:mt-3 [&_p]:mt-3 [&_ul]:mt-3 [&_ol]:mt-3">
        <Blocks blocks={body} />
      </div>

      {buttons.length > 0 && (
        <div className="mt-5 flex flex-col items-stretch gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
          {buttons.map((btn) => (
            <LinkButton
              key={`${btn.href}|${btn.label}`}
              href={btn.href}
              variant="brand"
              size="md"
              className="h-auto min-h-10 justify-between gap-2 whitespace-normal py-2.5 text-left"
              {...(/^https?:/i.test(btn.href)
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <span>{btn.label}</span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </LinkButton>
          ))}
        </div>
      )}
    </aside>
  );
}

/* ------------------------------------------------------------------- Public */

export function BlogBody({ blocks }: { blocks: Block[] }) {
  return (
    <div>
      <Blocks blocks={blocks} />
    </div>
  );
}
