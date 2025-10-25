"use client"

import { Suspense } from "react"
import { Download, Calendar, User, ArrowRight, Star, Newspaper, Tv, Radio, Globe, Mail, Phone, MessageCircle, FileText, Image as ImageIcon, Video, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const pressReleases = [
  {
    id: 1,
    title: "Bedora Living Launches Revolutionary Sleep Technology",
    excerpt: "New hybrid mattress collection combines advanced cooling technology with premium comfort materials for the ultimate sleep experience.",
    date: "2024-01-20",
    category: "Product Launch",
    featured: true,
    downloadUrl: "/press/bedora-sleep-tech-launch.pdf"
  },
  {
    id: 2,
    title: "Bedora Living Expands UK Operations with New Distribution Center",
    excerpt: "Strategic expansion to better serve customers across the United Kingdom with faster delivery and improved service.",
    date: "2024-01-15",
    category: "Business News",
    featured: true,
    downloadUrl: "/press/uk-expansion-announcement.pdf"
  },
  {
    id: 3,
    title: "Bedora Living Partners with Leading Sleep Research Institute",
    excerpt: "Collaboration aims to advance sleep science and develop next-generation mattress technologies.",
    date: "2024-01-10",
    category: "Partnership",
    featured: false,
    downloadUrl: "/press/sleep-research-partnership.pdf"
  },
  {
    id: 4,
    title: "Bedora Living Receives 'Best Mattress Brand 2024' Award",
    excerpt: "Industry recognition for excellence in product quality, customer service, and innovation.",
    date: "2024-01-05",
    category: "Awards",
    featured: false,
    downloadUrl: "/press/best-mattress-award-2024.pdf"
  }
]

const mediaAssets = [
  {
    id: 1,
    title: "Company Logo Pack",
    description: "High-resolution logos in various formats (PNG, SVG, EPS)",
    type: "Logo",
    format: "ZIP",
    size: "2.3 MB",
    downloadUrl: "/press/assets/bedora-logo-pack.zip"
  },
  {
    id: 2,
    title: "Product Photography",
    description: "Professional product images for editorial use",
    type: "Images",
    format: "JPG",
    size: "45.2 MB",
    downloadUrl: "/press/assets/product-photography.zip"
  },
  {
    id: 3,
    title: "Brand Guidelines",
    description: "Complete brand identity and usage guidelines",
    type: "Document",
    format: "PDF",
    size: "8.7 MB",
    downloadUrl: "/press/assets/brand-guidelines.pdf"
  },
  {
    id: 4,
    title: "Executive Headshots",
    description: "High-resolution photos of leadership team",
    type: "Images",
    format: "JPG",
    size: "12.1 MB",
    downloadUrl: "/press/assets/executive-headshots.zip"
  }
]

const companyInfo = {
  founded: "2010",
  headquarters: "United Kingdom",
  employees: "150+",
  customers: "50,000+",
  mission: "To provide exceptional sleep solutions that enhance the quality of life for our customers through innovative products, outstanding service, and unwavering commitment to comfort and quality."
}


export default function PressPage() {
  return (
    <>
      <head>
        <title>Press & Media | Bedora Living</title>
        <meta name="description" content="Press releases, media kit, company information, and resources for journalists covering Bedora Living." />
      </head>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Press & Media Center
            </h1>
            <p className="text-xl mb-8 text-orange-100">
              Resources, press releases, and media assets for journalists and media professionals covering Bedora Living.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3"
                onClick={() => window.open('mailto:hello@bedoraliving.co.uk?subject=Media Kit Request', '_blank')}
              >
                <Download className="h-5 w-5 mr-2" />
                Download Media Kit
              </Button>
              <Button 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                onClick={() => window.open('mailto:hello@bedoraliving.co.uk?subject=Press Inquiry', '_blank')}
              >
                <Mail className="h-5 w-5 mr-2" />
                Contact Press Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 border-orange-200">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-orange-500 mb-2">{companyInfo.founded}</div>
                <p className="text-gray-600">Founded</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-orange-200">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-orange-500 mb-2">{companyInfo.employees}</div>
                <p className="text-gray-600">Team Members</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-orange-200">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-orange-500 mb-2">{companyInfo.customers}</div>
                <p className="text-gray-600">Happy Customers</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-orange-200">
              <CardContent className="p-0">
                <div className="text-3xl font-bold text-orange-500 mb-2">UK</div>
                <p className="text-gray-600">Headquarters</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Press Releases */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Press Releases</h2>
            <p className="text-lg text-gray-600">Stay updated with our latest news and announcements</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pressReleases.filter(release => release.featured).map((release) => (
              <Card key={release.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {release.category}
                    </span>
                    <span className="text-gray-500 text-sm">{release.date}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-orange-600 transition-colors">
                    {release.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {release.excerpt}
                  </p>
                  
                  <div className="flex gap-3">
                    <Button 
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => alert('Press release content would be displayed here. This is a demo.')}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Read Full Release
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-orange-500 text-orange-500 hover:bg-orange-50"
                      onClick={() => alert('PDF download would start here. This is a demo.')}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Assets */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Media Assets</h2>
            <p className="text-lg text-gray-600">Download high-resolution images, logos, and brand materials</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mediaAssets.map((asset) => (
              <Card key={asset.id} className="group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                      {asset.type === "Logo" && <Globe className="h-8 w-8 text-orange-500" />}
                      {asset.type === "Images" && <ImageIcon className="h-8 w-8 text-orange-500" />}
                      {asset.type === "Document" && <FileText className="h-8 w-8 text-orange-500" />}
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-gray-900 mb-2">{asset.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{asset.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{asset.format}</span>
                    <span>{asset.size}</span>
                  </div>
                  
                  <Button 
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => alert(`Download would start for ${asset.title}. This is a demo.`)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Company Mission */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl mb-8 text-orange-100 leading-relaxed">
              {companyInfo.mission}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-white text-orange-500 hover:bg-gray-100 px-8 py-3"
                onClick={() => window.open('tel:03301336323', '_self')}
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Press Line: 03301336323
              </Button>
              <Button 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                onClick={() => window.open('mailto:hello@bedoraliving.co.uk?subject=Press Inquiry', '_blank')}
              >
                <Mail className="h-5 w-5 mr-2" />
                hello@bedoraliving.co.uk
              </Button>
              <Button 
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-500 px-8 py-3"
                onClick={() => window.open('mailto:hello@bedoraliving.co.uk?subject=Media Inquiry', '_blank')}
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Media Inquiries
              </Button>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}