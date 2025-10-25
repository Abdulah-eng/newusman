import Link from "next/link"
import { MessageCircle, Phone, Mail, Facebook, Instagram, Youtube, MapPin, Clock, Truck, Shield, CreditCard, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-[#33373E] text-white overflow-hidden">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info & Logo */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-16 h-16 flex items-center justify-center">
                <img 
                  src="/mainlogo.png" 
                  alt="Bedora Living Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-3xl font-extrabold tracking-tight">Bedora Living</span>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Your trusted partner for quality mattresses, sofas, and home furnishings. We're committed to providing exceptional comfort and style for your home.
            </p>
            
            <div className="space-y-4">
              <Button className="w-full justify-center bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md hover:shadow-lg">
                <MessageCircle className="h-4 w-4 mr-2" />
                Live Chat Support
              </Button>
              
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-3 text-orange-400" />
                <span className="text-sm">03301336323</span>
              </div>
              
              <div className="flex items-center text-gray-300">
                <Mail className="h-4 w-4 mr-3 text-orange-400" />
                <span className="text-sm">hello@bedoraliving.co.uk</span>
              </div>
              
              <div className="flex items-center text-gray-300">
                <MapPin className="h-4 w-4 mr-3 text-orange-400" />
                <span className="text-sm">United Kingdom</span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Products</h4>
            <ul className="space-y-3">
              <li><Link href="/mattresses" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Mattresses</Link></li>
              <li><Link href="/sofas" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Sofas & Couches</Link></li>
              <li><Link href="/beds" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Beds & Bed Frames</Link></li>
              <li><Link href="/pillows" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Pillows & Bedding</Link></li>
              <li><Link href="/adjustable-bases" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Adjustable Bases</Link></li>
              <li><Link href="/beanbags" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Beanbags</Link></li>
              <li><Link href="/sale" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Sale & Clearance</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Customer Service</h4>
            <ul className="space-y-3">
              <li><Link href="/mattress-finder" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Mattress Finder Quiz</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/support" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Support Center</Link></li>
              <li><Link href="/reviews" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Customer Reviews</Link></li>
              <li><Link href="/size-guide" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Size Guide</Link></li>
              <li><Link href="/delivery" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Delivery Information</Link></li>
              <li><Link href="/returns" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Returns & Exchanges</Link></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="font-semibold text-lg mb-6 text-white">Company</h4>
            <ul className="space-y-3 mb-6">
              <li><Link href="/about" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">About Us</Link></li>
              <li><Link href="/careers" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Careers</Link></li>
              <li><Link href="/guides" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Blog & Guides</Link></li>
              <li><Link href="/press" className="text-gray-300 hover:text-orange-400 transition-colors text-sm">Press & Media</Link></li>
            </ul>
            
            <h5 className="font-semibold text-white mb-4">Follow Us</h5>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-700 hover:bg-orange-500 rounded-full flex items-center justify-center transition-colors">
                <Youtube className="h-5 w-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Trust Badges & Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 pt-12 border-t border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Truck className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Free Delivery</div>
              <div className="text-gray-400 text-xs">On orders over £50</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">100% Secure</div>
              <div className="text-gray-400 text-xs">Safe & secure payments</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Flexible Payment</div>
              <div className="text-gray-400 text-xs">0% interest available</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">24/7 Support</div>
              <div className="text-gray-400 text-xs">Always here to help</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-600 bg-[#2a2e34]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>© 2024 Bedora Living. All rights reserved.</span>
              <Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-orange-400 transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-orange-400 transition-colors">Cookie Policy</Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Powered by</span>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-500 rounded"></div>
                <span className="text-white font-semibold">Bedora</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
