/**
 * A small, purpose-built markdown reader for blog post bodies. The body
 * format is a contract we control on both ends (BLOG-FORMAT.md): `##`
 * headings, `:::tip` and `:::note` callouts, lists, quotes and plain
 * paragraphs, with bold, italic, code and links inline. It is not a general
 * markdown parser, and it never produces raw HTML: everything comes back as
 * plain data that React renders as elements.
 *
 * Post text is rendered exactly as stored. Nothing here rewrites wording.
 */

export type InlineNode =
  | { type: "text"; value: string }
  | { type: "bold"; children: InlineNode[] }
  | { type: "italic"; children: InlineNode[] }
  | { type: "code"; value: string }
  | { type: "link"; href: string; children: InlineNode[] };

export type CalloutKind = "tip" | "note";

export type Block =
  | { type: "heading"; level: 2 | 3; text: string; id: string }
  | { type: "paragraph"; children: InlineNode[] }
  | { type: "list"; ordered: boolean; items: InlineNode[][] }
  | { type: "quote"; children: InlineNode[] }
  | { type: "rule" }
  | { type: "image"; alt: string; src: string }
  | { type: "callout"; kind: CalloutKind; title: string; body: Block[] };

export interface TocEntry {
  id: string;
  text: string;
}

/* ------------------------------------------------------------------ Inline */

/** Only plain web, mail, phone, page and anchor links are allowed through. */
export function isSafeHref(href: string): boolean {
  const h = href.trim();
  if (!h) return false;
  if (h.startsWith("/") || h.startsWith("#")) return !h.startsWith("//");
  return /^(https?:|mailto:|tel:)/i.test(h);
}

const INLINE_RE =
  /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)|\*\*(.+?)\*\*|__(.+?)__|`([^`]+)`|\*([^*\s](?:[^*]*[^*\s])?)\*|(?<![A-Za-z0-9])_([^_\s](?:[^_]*[^_\s])?)_(?![A-Za-z0-9])/g;

export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  const re = new RegExp(INLINE_RE.source, "g");
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push({ type: "text", value: text.slice(last, m.index) });
    if (m[1] !== undefined) {
      nodes.push({ type: "link", href: m[2], children: parseInline(m[1]) });
    } else if (m[3] !== undefined || m[4] !== undefined) {
      nodes.push({ type: "bold", children: parseInline((m[3] ?? m[4]) as string) });
    } else if (m[5] !== undefined) {
      nodes.push({ type: "code", value: m[5] });
    } else {
      nodes.push({ type: "italic", children: parseInline((m[6] ?? m[7]) as string) });
    }
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push({ type: "text", value: text.slice(last) });
  return nodes;
}

export function inlineToText(nodes: InlineNode[]): string {
  return nodes
    .map((n) => {
      if (n.type === "text" || n.type === "code") return n.value;
      return inlineToText(n.children);
    })
    .join("");
}

/* ------------------------------------------------------------------ Blocks */

export function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "section"
  );
}

const reHeading = /^(#{2,3})\s+(.+?)\s*#*\s*$/;
const reCalloutOpen = /^:::(tip|note)\b\s*(.*)$/i;
const reCalloutClose = /^:::\s*$/;
const reBullet = /^\s{0,3}[-*+]\s+(.*)$/;
const reOrdered = /^\s{0,3}\d+[.)]\s+(.*)$/;
const reRule = /^\s{0,3}([-*_])(\s*\1){2,}\s*$/;
const reQuote = /^\s{0,3}>\s?(.*)$/;
const reImage = /^!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)\s*$/;

function startsBlock(line: string): boolean {
  return (
    reHeading.test(line) ||
    reCalloutOpen.test(line.trim()) ||
    reCalloutClose.test(line) ||
    reBullet.test(line) ||
    reOrdered.test(line) ||
    reRule.test(line) ||
    reQuote.test(line) ||
    reImage.test(line.trim())
  );
}

function parseRun(
  lines: string[],
  start: number,
  stopAtClose: boolean,
  uniqueId: (text: string) => string,
): [Block[], number] {
  const out: Block[] = [];
  let i = start;

  while (i < lines.length) {
    const line = lines[i];

    if (stopAtClose && reCalloutClose.test(line)) break;

    if (!line.trim()) {
      i++;
      continue;
    }

    const open = line.trim().match(reCalloutOpen);
    if (open) {
      const kind = open[1].toLowerCase() as CalloutKind;
      const title = open[2].trim();
      const [body, next] = parseRun(lines, i + 1, true, uniqueId);
      out.push({ type: "callout", kind, title, body });
      // Skip the closing ::: when there is one.
      i = next < lines.length && reCalloutClose.test(lines[next]) ? next + 1 : next;
      continue;
    }

    // A stray closing marker outside a callout is ignored.
    if (reCalloutClose.test(line)) {
      i++;
      continue;
    }

    const heading = line.match(reHeading);
    if (heading) {
      const level = heading[1].length as 2 | 3;
      const text = heading[2].trim();
      out.push({ type: "heading", level, text, id: uniqueId(text) });
      i++;
      continue;
    }

    if (reRule.test(line)) {
      out.push({ type: "rule" });
      i++;
      continue;
    }

    const image = line.trim().match(reImage);
    if (image) {
      out.push({ type: "image", alt: image[1], src: image[2] });
      i++;
      continue;
    }

    if (reBullet.test(line) || reOrdered.test(line)) {
      const ordered = reOrdered.test(line);
      const items: InlineNode[][] = [];
      while (i < lines.length) {
        const l = lines[i];
        const item = ordered ? l.match(reOrdered) : l.match(reBullet);
        if (item) {
          let text = item[1].trim();
          i++;
          // Indented continuation lines belong to the same item.
          while (
            i < lines.length &&
            lines[i].trim() &&
            /^\s{2,}\S/.test(lines[i]) &&
            !reBullet.test(lines[i]) &&
            !reOrdered.test(lines[i])
          ) {
            text += " " + lines[i].trim();
            i++;
          }
          items.push(parseInline(text));
        } else {
          break;
        }
      }
      out.push({ type: "list", ordered, items });
      continue;
    }

    if (reQuote.test(line)) {
      const parts: string[] = [];
      while (i < lines.length && reQuote.test(lines[i])) {
        parts.push((lines[i].match(reQuote) as RegExpMatchArray)[1].trim());
        i++;
      }
      out.push({ type: "quote", children: parseInline(parts.join(" ").trim()) });
      continue;
    }

    // Plain paragraph: consecutive lines until a blank line or another block.
    const parts: string[] = [line.trim()];
    i++;
    while (i < lines.length && lines[i].trim() && !startsBlock(lines[i])) {
      parts.push(lines[i].trim());
      i++;
    }
    out.push({ type: "paragraph", children: parseInline(parts.join(" ")) });
  }

  return [out, i];
}

export function parseBody(markdown: string): Block[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const seen = new Map<string, number>();
  const uniqueId = (text: string) => {
    const base = slugifyHeading(text);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    return n === 0 ? base : `${base}-${n + 1}`;
  };
  const [blocks] = parseRun(lines, 0, false, uniqueId);
  return blocks;
}

/** The post's table of contents: every top level `##` heading, in order. */
export function tocFromBlocks(blocks: Block[]): TocEntry[] {
  const out: TocEntry[] = [];
  for (const b of blocks) {
    if (b.type === "heading" && b.level === 2) out.push({ id: b.id, text: b.text });
  }
  return out;
}

/* ---------------------------------------------------------------------- Tips */

export interface TipButton {
  label: string;
  href: string;
}

function collectLinks(nodes: InlineNode[], into: TipButton[]): InlineNode[] {
  return nodes.map((n): InlineNode => {
    if (n.type === "link") {
      const label = inlineToText(n.children).trim();
      if (label && isSafeHref(n.href)) into.push({ label, href: n.href.trim() });
      // The words stay in the sentence as plain text, never as a text link.
      return { type: "bold", children: n.children.length ? n.children : [{ type: "text", value: label }] };
    }
    if (n.type === "bold" || n.type === "italic") {
      return { ...n, children: collectLinks(n.children, into) };
    }
    return n;
  });
}

function trimTrailing(nodes: InlineNode[]): InlineNode[] {
  const copy = [...nodes];
  while (copy.length) {
    const last = copy[copy.length - 1];
    if (last.type === "text") {
      const trimmed = last.value.replace(/\s+$/, "");
      if (!trimmed) {
        copy.pop();
        continue;
      }
      copy[copy.length - 1] = { type: "text", value: trimmed };
    }
    break;
  }
  return copy;
}

/**
 * Tips hold their link as a button under the text, never as an inline link.
 * A link that closes a paragraph is lifted out as a button. A link in the
 * middle of a sentence keeps its words as plain emphasised text and also
 * becomes a button, so the sentence still reads whole.
 */
export function liftTipButtons(body: Block[]): { body: Block[]; buttons: TipButton[] } {
  const buttons: TipButton[] = [];
  const nextBody: Block[] = [];

  for (const block of body) {
    if (block.type === "paragraph" || block.type === "quote") {
      const children = block.children;
      const last = trimTrailing(children);
      const tail = last[last.length - 1];
      if (tail && tail.type === "link") {
        const label = inlineToText(tail.children).trim();
        if (label && isSafeHref(tail.href)) buttons.push({ label, href: tail.href.trim() });
        const rest = trimTrailing(collectLinks(last.slice(0, -1), buttons));
        if (rest.length) nextBody.push({ ...block, children: rest });
      } else {
        nextBody.push({ ...block, children: collectLinks(children, buttons) });
      }
    } else if (block.type === "list") {
      nextBody.push({ ...block, items: block.items.map((item) => collectLinks(item, buttons)) });
    } else {
      nextBody.push(block);
    }
  }

  const seen = new Set<string>();
  const unique = buttons.filter((b) => {
    const key = `${b.href}|${b.label}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return { body: nextBody, buttons: unique };
}
