"use client"

import { useState } from 'react'
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  FileText, 
  Truck, 
  Shield, 
  CreditCard, 
  RotateCcw, 
  HelpCircle,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Users,
  Settings,
  Package,
  Star,
  Clock,
  MapPin
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
  tags: string[]
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: "What is Bedora Living's 100-Night Comfort Guarantee?",
    answer: "Our exclusive 100-night trial period allows you to test your mattress risk-free. To participate, you must purchase a mattress protector with your new mattress. If the mattress doesn't meet your comfort needs, we offer a hassle-free, one-time exchange for a better-suited mattress with no restocking fees - only a minimal delivery fee. Exchanges must be conducted through our official delivery service.",
    category: "Returns & Trials",
    tags: ["trial", "returns", "guarantee", "exchange"]
  },
  {
    id: 2,
    question: "How long does delivery take?",
    answer: "Standard delivery typically takes 3-5 business days within our service area. We offer flexible delivery scheduling including same-day delivery for select areas. For urgent orders, please contact our customer service team to discuss expedited options. All deliveries include professional setup and old mattress removal.",
    category: "Delivery & Shipping",
    tags: ["delivery", "shipping", "setup", "removal"]
  },
  {
    id: 3,
    question: "What warranty coverage do your mattresses have?",
    answer: "All Bedora Living mattresses come with comprehensive warranty coverage. Our premium mattresses feature a 10-year warranty covering manufacturing defects, while our luxury lines offer extended 15-20 year warranties. The warranty covers issues like sagging, coil breakage, and material defects. Normal wear and tear, stains, and damage from improper use are not covered.",
    category: "Warranty & Care",
    tags: ["warranty", "coverage", "defects", "care"]
  },
  {
    id: 4,
    question: "How do I choose the right mattress firmness?",
    answer: "Mattress firmness is a personal preference that depends on your sleep position, body weight, and comfort needs. Side sleepers typically prefer medium to soft mattresses for pressure relief, back sleepers often choose medium to firm for spinal alignment, and stomach sleepers usually need firm support. Our sleep specialists can help you find the perfect firmness through our mattress finder quiz.",
    category: "Product Selection",
    tags: ["firmness", "sleep position", "selection", "comfort"]
  },
  {
    id: 5,
    question: "Do you offer financing options?",
    answer: "Yes! We offer flexible financing options to make your dream mattress affordable. We partner with leading financial institutions to provide 0% APR financing for qualified customers, with terms ranging from 6 to 60 months. We also offer lease-to-own options and accept all major credit cards. Apply online or visit our showroom for instant approval.",
    category: "Payment & Financing",
    tags: ["financing", "payment", "credit", "affordable"]
  },
  {
    id: 6,
    question: "How do I care for and maintain my mattress?",
    answer: "Proper mattress care extends its lifespan and maintains comfort. Rotate your mattress every 3-6 months, use a mattress protector to prevent stains, vacuum regularly to remove dust, and avoid jumping or standing on the mattress. For deep cleaning, use mild soap and warm water, and ensure thorough drying. Never use harsh chemicals or excessive water.",
    category: "Warranty & Care",
    tags: ["care", "maintenance", "cleaning", "protection"]
  }
]

const helpCategories = [
  {
    icon: Package,
    title: "Order & Delivery",
    description: "Track orders, delivery options, and setup services",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: RotateCcw,
    title: "Returns & Exchanges",
    description: "100-night trial, return policies, and exchanges",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Shield,
    title: "Warranty & Support",
    description: "Warranty coverage, claims, and product support",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: CreditCard,
    title: "Payment & Billing",
    description: "Financing options, payment methods, and billing",
    color: "from-orange-500 to-orange-600"
  },
  {
    icon: BookOpen,
    title: "Product Guides",
    description: "Care instructions, sizing guides, and tips",
    color: "from-indigo-500 to-indigo-600"
  },
  {
    icon: Users,
    title: "Customer Service",
    description: "Contact information and service hours",
    color: "from-pink-500 to-pink-600"
  }
]

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'Returns & Trials', 'Delivery & Shipping', 'Warranty & Care', 'Product Selection', 'Payment & Financing']

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-orange-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              How Can We Help You?
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Get expert support and find answers to all your questions about Bedora Living
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search for help articles, FAQs, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-0 rounded-2xl shadow-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
              <Phone className="w-6 h-6 text-orange-600" />
              <div>
                <p className="font-semibold text-gray-900">Call Us</p>
                <p className="text-sm text-gray-600">(405) 564-0561</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
              <Mail className="w-6 h-6 text-orange-600" />
              <div>
                <p className="font-semibold text-gray-900">Email Support</p>
                <p className="text-sm text-gray-600">support@bedoraliving.com</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-200">
              <MessageCircle className="w-6 h-6 text-orange-600" />
              <div>
                <p className="font-semibold text-gray-900">Live Chat</p>
                <p className="text-sm text-gray-600">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            What Do You Need Help With?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpCategories.map((category, index) => (
              <Card key={index} className="border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <category.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h2>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-orange-600 hover:bg-orange-700" : ""}
                >
                  {category === 'all' ? 'All Categories' : category}
                </Button>
              ))}
            </div>

            {/* FAQs List */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="border-gray-200 shadow-sm">
                  <CardContent className="p-0">
                    <button
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      )}
                    </button>
                    
                    {expandedFAQ === faq.id && (
                      <div className="px-6 pb-6 border-t border-gray-100">
                        <p className="text-gray-700 leading-relaxed mt-4">{faq.answer}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {faq.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-gradient-to-r from-orange-600 to-orange-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Still Need Help?
            </h2>
            <p className="text-xl text-orange-100 mb-8">
              Our expert support team is here to help you with any questions or concerns
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-orange-300" />
                    <h3 className="text-xl font-semibold">Business Hours</h3>
                  </div>
                  <p className="text-orange-100">
                    Mon-Fri: 10am - 7pm<br />
                    Sat: 10am - 6pm<br />
                    Sun: 12pm - 5pm
                  </p>
                </CardContent>
              </Card>
              
                             <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
                 <CardContent className="p-6">
                   <div className="flex items-center gap-3 mb-4">
                     <Mail className="w-6 h-6 text-orange-300" />
                     <h3 className="text-xl font-semibold">Email Support</h3>
                   </div>
                   <p className="text-orange-100">
                     support@bedoraliving.com<br />
                     We'll respond within 24 hours
                   </p>
                 </CardContent>
               </Card>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-700 hover:bg-gray-100 px-8 py-4">
                <Phone className="w-5 h-5 mr-2" />
                Call Support
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-700 px-8 py-4">
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Live Chat
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Manuals</h3>
                <p className="text-gray-600 mb-4">Download detailed product manuals and care guides</p>
                <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                  View Manuals
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Truck className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Delivery Info</h3>
                <p className="text-gray-600 mb-4">Learn about our delivery process and scheduling</p>
                <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                  Delivery Details
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 text-center">
                <Star className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Reviews</h3>
                <p className="text-gray-600 mb-4">Read what our customers say about our products</p>
                <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                  Read Reviews
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
