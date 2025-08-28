import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-700">Get in touch with our sleep experts</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-600 mb-6">
                Have questions about our products or need help choosing the right mattress? 
                Our team is here to help you find the perfect sleep solution.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">(405) 564-0561</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">info@mattressking.com</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Hours</h3>
                  <p className="text-gray-600">Monday - Saturday: 9AM - 8PM</p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Visit Our Stores</h2>
              <p className="text-gray-600 mb-6">
                We have multiple locations across Oklahoma. Visit us in person to test 
                our mattresses and get personalized recommendations.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Oklahoma City</h3>
                  <p className="text-gray-600">123 Sleep Street, OKC, OK 73101</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Tulsa</h3>
                  <p className="text-gray-600">456 Dream Avenue, Tulsa, OK 74101</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
