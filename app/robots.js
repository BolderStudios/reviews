export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ["/api", "/sign-in", "/sign-up", "/not-found"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  }
}
