import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import { PageHeader } from "@/components/marketing/page-header";
import { Section } from "@/components/marketing/section";
import { LinkButton } from "@/components/ui/link-button";
import { SITE_URL, formatReleaseDate, getReleasedPosts } from "@/lib/blog";

// The list is rebuilt at least hourly, so a post shows up on its release date
// without a deploy.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "General health topics explained in plain language by Fort Wayne Direct Primary Care.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
    types: { "application/rss+xml": `${SITE_URL}/blog/rss.xml` },
  },
};

export default async function BlogIndexPage() {
  const posts = await getReleasedPosts();

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title={
          <>
            Plain answers about{" "}
            <span className="text-brand-accent">primary care.</span>
          </>
        }
        subtitle="General health topics, explained in plain language. For education only, and never a replacement for your own doctor."
      />

      <Section className="py-14 md:py-20">
        {posts.length === 0 ? (
          <div className="max-w-2xl rounded-2xl border border-dashed border-border bg-surface p-8">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              No articles yet
            </h2>
            <p className="mt-2 text-base leading-7 text-muted-foreground">
              New articles will appear here as they are published.
            </p>
            <div className="mt-6">
              <LinkButton href="/contact" variant="outline" size="md">
                Contact the practice
              </LinkButton>
            </div>
          </div>
        ) : (
          <ul className="max-w-3xl space-y-5">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block rounded-2xl border border-border/70 bg-surface p-6 transition-colors hover:border-brand/40 hover:bg-brand-muted/20 sm:p-8"
                >
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 font-mono text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-brand-accent" aria-hidden />
                      <time dateTime={post.release_on}>
                        {formatReleaseDate(post.release_on)}
                      </time>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-brand-accent" aria-hidden />
                      {post.reading_minutes} min read
                    </span>
                  </div>
                  <h2 className="mt-4 text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground transition-colors group-hover:text-brand sm:text-[1.75rem]">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="mt-3 text-base leading-7 text-muted-foreground">
                      {post.description}
                    </p>
                  )}
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                    Read the article
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
