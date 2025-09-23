/** @type {import('next-sitemap').IConfig} */
// Hardcode production domain to avoid accidental localhost in robots.txt
const siteUrl = 'https://www.bedoraliving.co.uk'

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/admin/*', '/api/*'],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api', '/admin'] },
    ],
  },
  transform: async (config, path) => ({
    loc: path,
    changefreq: config.changefreq,
    priority: config.priority,
  }),
  additionalPaths: async (config) => {
    const extra = []

    // High-value static pages
    const staticPages = [
      '/',
      '/mattresses', '/beds', '/sofas', '/pillows', '/toppers', '/bunkbeds', '/kids',
      '/bedding', '/bed-frames', '/adjustable-bases', '/box-springs',
      '/sale', '/reviews', '/guides', '/contact', '/privacy', '/terms', '/delivery', '/returns', '/size-guide'
    ]
    staticPages.forEach(p => extra.push({ loc: p }))

    // Dynamic product detail pages from API
    try {
      const res = await fetch(`${siteUrl}/api/products?limit=10000`)
      if (res.ok) {
        const data = await res.json()
        const products = Array.isArray(data.products) ? data.products : []
        products.forEach(p => {
          const category = p.category || p.categories?.slug || 'mattresses'
          extra.push({ loc: `/products/${category}/${p.id}` })
        })
      }
    } catch (e) {
      // Fail silently; sitemap will still be valid with static pages
    }

    return extra
  },
}


