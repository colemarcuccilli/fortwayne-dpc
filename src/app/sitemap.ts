import type { MetadataRoute } from "next";
import { SITE_URL, getReleasedPosts } from "@/lib/blog";

// Rebuilt at least hourly. A blog post is listed only from its release date.
export const revalidate = 3600;

// Public marketing pages. Admin, portal, research and the patient form are
// left out on purpose.
const PAGES = [
  "/",
  "/about",
  "/membership",
  "/employers",
  "/weight-loss",
  "/aesthetics",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getReleasedPosts();

  const entries: MetadataRoute.Sitemap = PAGES.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
  }));

  if (posts.length > 0) {
    entries.push({
      url: `${SITE_URL}/blog`,
      lastModified: posts[0].release_on,
    });
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.release_on,
      });
    }
  }

  return entries;
}
