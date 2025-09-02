"use client"

import { Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Bedora Living</h1>
          <p className="text-xl text-gray-700">Get in touch with our sleep experts for personalized assistance</p>
        </div>
        
        <div className="max-w-6xl mx-auto">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
                           {/* Corporate Inquiries Card */}
              <Card className="border-orange-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Corporate Inquiries</h2>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Business Inquiries</p>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    For business partnerships, wholesale inquiries, or corporate matters, 
                    please contact us via email.
                  </p>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-2"
                    onClick={() => window.location.href = 'mailto:info@bedoraliving.com'}
                  >
                    <Mail className="w-4 h-4" />
                    info@bedoraliving.com
                  </Button>
                </CardContent>
              </Card>

             {/* Sales & Product Questions Card */}
             <Card className="border-orange-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-orange-50 to-orange-100">
               <CardContent className="p-6">
                 <h2 className="text-xl font-bold text-gray-900 mb-2">Sales & Product Related Questions</h2>
                 <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                   Get expert advice from our sleep specialists to ensure your best night's sleep.
                 </p>
                 <div className="space-y-3">
                   <Button 
                     className="w-full bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-2"
                     onClick={() => window.location.href = 'tel:+14055640561'}
                   >
                     <Phone className="w-4 h-4" />
                     (405) 564-0561
                   </Button>
                   <Button 
                     variant="outline" 
                     className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 flex items-center justify-center gap-2"
                   >
                     <MessageCircle className="w-4 h-4" />
                     Chat now
                   </Button>
                 </div>
                 <div className="mt-4 text-xs text-gray-500 leading-relaxed">
                   Hours are Mon-Fri: 10am - 7pm<br />
                   Sat: 10am - 6pm and Sun: 12pm - 5pm
                 </div>
               </CardContent>
             </Card>

           </div>

                     {/* Additional Contact Information */}
           <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                           <Card className="border-orange-200 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Customer Support</h2>
                  <p className="text-gray-600 mb-4">
                    Our dedicated support team is here to help with any questions about our products, 
                    services, or policies. We're committed to providing exceptional customer service.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Support Hours</p>
                        <p className="text-gray-600">Mon-Fri: 10am - 7pm | Sat: 10am - 6pm | Sun: 12pm - 5pm</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-semibold text-gray-900">Live Chat</p>
                        <p className="text-gray-600">Available during business hours</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

                         <Card className="border-orange-200 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
               <CardContent className="p-6">
                 <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need More Help?</h2>
                 <p className="text-gray-600 mb-4">
                   Can't find what you're looking for? Our customer support team is here to help 
                   with any questions about our products, services, or policies.
                 </p>
                 <div className="space-y-3">
                   <Button 
                     className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                     onClick={() => window.location.href = 'mailto:support@bedoraliving.com'}
                   >
                     <Mail className="w-4 h-4 mr-2" />
                     Email Support
                   </Button>
                   <Button 
                     variant="outline" 
                     className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                   >
                     <MessageCircle className="w-4 h-4 mr-2" />
                     Live Chat Support
                   </Button>
                 </div>
               </CardContent>
             </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
