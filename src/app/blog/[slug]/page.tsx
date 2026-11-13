import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";
import { BlogBody } from "@/components/blog/blog-body";
import { BlogContents } from "@/components/blog/blog-contents";
import { LinkButton } from "@/components/ui/link-button";
import {
  SITE_URL,
  formatReleaseDate,
  getReleasedPost,
  getReleasedPosts,
} from "@/lib/blog";
import { isSafeHref, parseBody, tocFromBlocks } from "@/lib/blog-markdown";

// A post page is rebuilt at least hourly and compares its release date with
// today's Fort Wayne date every time, so nothing shows early and nothing
// needs a deploy to appear.
export const revalidate = 3600;
export const dynamicParams = true;

const PRACTICE_NAME = "Fort Wayne Direct Primary Care";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  // Only posts already released are built ahead of time. Later ones render
  // on their first visit after their date.
  const posts = await getReleasedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getReleasedPost(slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description || undefined,
      url,
      siteName: PRACTICE_NAME,
      publishedTime: post.release_on,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getReleasedPost(slug);
  if (!post) notFound();

  const blocks = parseBody(post.body);
  const toc = tocFromBlocks(blocks);
  const url = `${SITE_URL}/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description || undefined,
    datePublished: post.release_on,
    dateModified: post.release_on,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    inLanguage: "en-US",
    author: { "@type": "Organization", name: PRACTICE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: PRACTICE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/assets/FortWayneDPCLogoPNG.png`,
      },
    },
    citation: post.sources.filter((s) => isSafeHref(s.url)).map((s) => s.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Escape "<" so post text can never close the script tag.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative overflow-hidden border-b border-border/60">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-muted/25 via-background to-background"
        />
        <div className="mx-auto w-full max-w-6xl px-5 pb-10 pt-12 sm:px-8 md:pb-14 md:pt-16">
          <div className="max-w-2xl xl:mx-auto">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand transition-colors hover:text-brand-dark"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              All articles
            </Link>
            <h1 className="mt-5 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-foreground sm:text-4xl md:text-5xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-brand-accent" aria-hidden />
                <time dateTime={post.release_on}>
                  {formatReleaseDate(post.release_on)}
                </time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-brand-accent" aria-hidden />
                {post.reading_minutes} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-8 md:pb-20 md:pt-14">
        <article className="max-w-2xl xl:mx-auto">
          <div id="post-body">
            <BlogBody blocks={blocks} />

            {post.sources.length > 0 && (
              <section
                aria-labelledby="post-sources"
                className="mt-14 border-t border-border/70 pt-8"
              >
                <h2
                  id="post-sources"
                  className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-accent"
                >
                  Sources
                </h2>
                <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-muted-foreground marker:text-muted-foreground/70">
                  {post.sources.map((source, i) => (
                    <li key={i} className="pl-1">
                      {isSafeHref(source.url) ? (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-brand underline decoration-brand/40 underline-offset-4 transition-colors hover:decoration-brand"
                        >
                          {source.title}
                        </a>
                      ) : (
                        <span className="font-medium text-foreground">
                          {source.title}
                        </span>
                      )}
                      {source.author ? <>, {source.author}</> : null}
                    </li>
                  ))}
                </ol>
              </section>
            )}
          </div>

          <div className="mt-12">
            <LinkButton href="/blog" variant="outline" size="md">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              More articles
            </LinkButton>
          </div>
        </article>
      </div>

      <BlogContents entries={toc} targetId="post-body" />
    </>
  );
}
