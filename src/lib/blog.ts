import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Blog posts are markdown files on disk (content/blog/YYYY-MM-DD-slug.md).
 * The file contract is BLOG-FORMAT.md. The publishing routine writes the
 * files; this module only reads them and decides what is visible.
 *
 * A post is visible on and after its `release_on` date in Fort Wayne time.
 * Nothing is baked in at build time: the blog pages and the site navigation
 * revalidate hourly, so a post appears on its date without a deploy. A post
 * with no valid `release_on` is never visible.
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const TIME_ZONE = "America/Indiana/Indianapolis";

export const SITE_URL = "https://www.fortwaynedpc.com";

export interface BlogSource {
  title: string;
  author?: string;
  url: string;
}

export interface BlogPost {
  post_id: string;
  seq: number;
  title: string;
  slug: string;
  /** YYYY-MM-DD, compared as a plain string against today's Fort Wayne date. */
  release_on: string;
  description: string;
  reading_minutes: number;
  sources: BlogSource[];
  /** Raw markdown body, after the front matter block. */
  body: string;
}

/** Today's date in Fort Wayne time as YYYY-MM-DD, comparable with release_on. */
export function todayInFortWayne(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isReleased(
  post: Pick<BlogPost, "release_on">,
  today = todayInFortWayne(),
): boolean {
  return DATE_RE.test(post.release_on) && post.release_on <= today;
}

export function formatReleaseDate(releaseOn: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${releaseOn}T00:00:00Z`));
}

/* ------------------------------------------------------------ Front matter */

type FrontValue = string | Record<string, string>[];

function unquote(value: string): string {
  const v = value.trim();
  if (v.length >= 2 && ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))) {
    return v.slice(1, -1);
  }
  return v;
}

/**
 * A small parser for the fixed front matter shape in BLOG-FORMAT.md: scalar
 * values, plus one list of maps for `sources`. It is not a general YAML
 * parser; the file format is a contract we control on both ends.
 */
function parseFrontmatter(raw: string): Record<string, FrontValue> {
  const lines = raw.replace(/\r\n?/g, "\n").split("\n");
  const result: Record<string, FrontValue> = {};
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (!m) {
      i++;
      continue;
    }
    const [, key, rest] = m;
    if (rest.trim() !== "") {
      result[key] = unquote(rest);
      i++;
      continue;
    }
    // Empty value: an indented list of maps follows (sources).
    const items: Record<string, string>[] = [];
    let j = i + 1;
    while (j < lines.length && /^\s*-\s/.test(lines[j])) {
      const item: Record<string, string> = {};
      const first = lines[j].match(/^\s*-\s*([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
      if (first) item[first[1]] = unquote(first[2]);
      j++;
      while (j < lines.length && /^\s{2,}[A-Za-z_]/.test(lines[j]) && !/^\s*-\s/.test(lines[j])) {
        const kv = lines[j].match(/^\s*([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
        if (kv) item[kv[1]] = unquote(kv[2]);
        j++;
      }
      items.push(item);
    }
    result[key] = items;
    i = items.length ? j : i + 1;
  }
  return result;
}

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function parsePost(filename: string, raw: string): BlogPost | null {
  const match = raw.replace(/^﻿/, "").replace(/\r\n?/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    console.error(`[blog:parse-failed] ${filename}: no front matter block`);
    return null;
  }
  const [, fmRaw, body] = match;
  const fm = parseFrontmatter(fmRaw);
  const str = (k: string) => (typeof fm[k] === "string" ? (fm[k] as string) : "");

  const post_id = str("post_id");
  const title = str("title");
  const slug = str("slug");
  if (!post_id || !title || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    console.error(`[blog:parse-failed] ${filename}: missing or invalid post_id, title or slug`);
    return null;
  }

  const rawSources = fm.sources;
  const sources: BlogSource[] = Array.isArray(rawSources)
    ? rawSources
        .filter((s) => s.title && s.url)
        .map((s) => ({ title: s.title, author: s.author || undefined, url: s.url }))
    : [];

  const trimmedBody = body.trim();
  const minutes = Number(str("reading_minutes"));

  return {
    post_id,
    seq: Number(str("seq")) || 0,
    title,
    slug,
    release_on: str("release_on"),
    description: str("description"),
    reading_minutes: Number.isFinite(minutes) && minutes > 0 ? Math.round(minutes) : Math.max(1, Math.round(wordCount(trimmedBody) / 220)),
    sources,
    body: trimmedBody,
  };
}

async function readAllPosts(): Promise<BlogPost[]> {
  let files: string[];
  try {
    files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith(".md")).sort();
  } catch {
    return [];
  }
  const parsed = await Promise.all(
    files.map(async (file) => {
      try {
        const post = parsePost(file, await readFile(path.join(BLOG_DIR, file), "utf8"));
        return post ? { post, file } : null;
      } catch (err) {
        console.error(`[blog:read-failed] ${file}`, err);
        return null;
      }
    }),
  );

  // One post per post_id. If two files claim the same post, the one whose file
  // name carries its own release date wins, otherwise the later release date.
  const byId = new Map<string, { post: BlogPost; file: string }>();
  for (const entry of parsed) {
    if (!entry) continue;
    const existing = byId.get(entry.post.post_id);
    if (!existing) {
      byId.set(entry.post.post_id, entry);
      continue;
    }
    const matchesOwnDate = (e: { post: BlogPost; file: string }) => e.file.startsWith(`${e.post.release_on}-`);
    if (matchesOwnDate(entry) && !matchesOwnDate(existing)) byId.set(entry.post.post_id, entry);
    else if (matchesOwnDate(entry) === matchesOwnDate(existing) && entry.post.release_on > existing.post.release_on)
      byId.set(entry.post.post_id, entry);
  }

  // One post per slug as well, so two pages never share an address.
  const bySlug = new Map<string, BlogPost>();
  for (const { post } of byId.values()) {
    const existing = bySlug.get(post.slug);
    if (!existing || post.release_on > existing.release_on) bySlug.set(post.slug, post);
  }
  return [...bySlug.values()];
}

/** Newest release first, then the later seq first for posts released the same day. */
function sortNewestFirst(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => {
    if (a.release_on !== b.release_on) return a.release_on < b.release_on ? 1 : -1;
    return b.seq - a.seq;
  });
}

/**
 * Released posts, newest first. Every list, page, feed and sitemap entry goes
 * through this one function, so nothing can show before its date.
 */
export async function getReleasedPosts(): Promise<BlogPost[]> {
  const today = todayInFortWayne();
  const posts = await readAllPosts();
  return sortNewestFirst(posts.filter((p) => isReleased(p, today)));
}

/** One post a page may show, or null (a 404) before its date or when it does not exist. */
export async function getReleasedPost(slug: string): Promise<BlogPost | null> {
  const posts = await getReleasedPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

export async function hasReleasedPosts(): Promise<boolean> {
  return (await getReleasedPosts()).length > 0;
}

/** Counts only, for the status route. No post text leaves here. */
export async function blogCounts(): Promise<{ today: string; files: number; released: number }> {
  const today = todayInFortWayne();
  const posts = await readAllPosts();
  return { today, files: posts.length, released: posts.filter((p) => isReleased(p, today)).length };
}
