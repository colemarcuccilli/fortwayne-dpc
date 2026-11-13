// Shared public-site navigation — used by the header (desktop) and the
// mobile menu so they never drift apart.
export const PUBLIC_NAV = [
  { label: "About", href: "/about" },
  { label: "Membership", href: "/fortwaynedirectprimarycare.sigmamd.com/signup/memberships" },
  { label: "For Business", href: "/employers" },
  { label: "Weight Loss", href: "/weight-loss" },
  { label: "Aesthetics", href: "/aesthetics" },
  { label: "Patient Form", href: "/patient-form" },
  { label: "Contact", href: "/contact" },
];

export interface NavItem {
  label: string;
  href: string;
}

/**
 * Adds the Blog link just before Contact, and only when at least one post is
 * released. The header, mobile menu and footer all call this with the same
 * answer, so the link appears and disappears everywhere together.
 */
export function withBlogLink<T extends NavItem>(
  items: readonly T[],
  showBlog: boolean,
): (T | NavItem)[] {
  if (!showBlog) return [...items];
  const blog: NavItem = { label: "Blog", href: "/blog" };
  const at = items.findIndex((item) => item.href === "/contact");
  const next: (T | NavItem)[] = [...items];
  next.splice(at === -1 ? next.length : at, 0, blog);
  return next;
}
