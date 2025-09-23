/** @type {import('next-sitemap').IConfig} */
// Hardcode production domain to avoid accidental localhost in robots.txt
const siteUrl = 'https://www.bedoraliving.co.uk'

module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/admin/*', '/api/*'],
  robotsTxtOptions: {
    additionalSitemaps: [`${siteUrl}/sitemap.xml`],
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api', '/admin'] },
    ],
  },
}


