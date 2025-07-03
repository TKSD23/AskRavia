import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  // Using a placeholder domain. You should replace this with your actual domain.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://numawise.com';
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
