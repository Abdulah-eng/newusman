import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Clock, User, Tag } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

interface NewsItem {
  id: string
  title: string
  excerpt: string
  category: string
  read_time: string
  author: string
  date: string
  image: string | null
  featured: boolean
  tags: string[]
  content: string
  created_at: string
  updated_at: string
}

// Generate metadata for individual news items
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { data: newsItem } = await supabase
    .from('news')
    .select('title, excerpt, image')
    .eq('id', params.id)
    .single()

  if (!newsItem) {
    return {
      title: 'News Item Not Found | Bedora Living',
      description: 'The requested news item could not be found.',
    }
  }

  return {
    title: `${newsItem.title} | Bedora Living Press`,
    description: newsItem.excerpt,
    openGraph: {
      title: `${newsItem.title} | Bedora Living Press`,
      description: newsItem.excerpt,
      url: `https://www.bedoraliving.co.uk/press/${params.id}`,
      images: newsItem.image ? [{ url: newsItem.image }] : [],
      siteName: 'Bedora Living',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${newsItem.title} | Bedora Living Press`,
      description: newsItem.excerpt,
      images: newsItem.image ? [newsItem.image] : [],
    },
  }
}

export default async function SingleNewsPage({ params }: { params: { id: string } }) {
  const { data: newsItem, error } = await supabase
    .from('news')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !newsItem) {
    console.error('Error fetching single news item:', error?.message || 'News item not found')
    notFound() // Renders Next.js 404 page
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/press" passHref>
          <Button variant="ghost" className="mb-8 text-blue-600 hover:text-blue-800">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Press
          </Button>
        </Link>

        <article className="bg-white p-8 rounded-lg shadow-lg">
          {newsItem.image && (
            <div className="relative w-full h-80 mb-8 rounded-md overflow-hidden">
              <Image
                src={newsItem.image}
                alt={newsItem.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}

          <div className="flex items-center text-gray-500 text-sm mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium mr-4">
              {newsItem.category}
            </span>
            <span className="flex items-center mr-4">
              <User className="h-4 w-4 mr-1" />
              {newsItem.author}
            </span>
            <span className="flex items-center mr-4">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(newsItem.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {newsItem.read_time}
            </span>
          </div>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">{newsItem.title}</h1>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">{newsItem.excerpt}</p>

          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            {newsItem.content ? (
              <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
            ) : (
              <p className="text-gray-600 italic">Content coming soon...</p>
            )}
          </div>

          {newsItem.tags && newsItem.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {newsItem.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                    <Tag className="inline h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
