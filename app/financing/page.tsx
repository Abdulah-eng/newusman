import { CheckCircle, CreditCard, Calculator, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FinancingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Financing Options</h1>
          <p className="text-xl text-gray-700">Flexible payment plans for your perfect sleep setup</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">0% APR Financing</h2>
              <p className="text-gray-600 mb-6">
                Get the mattress of your dreams with our interest-free financing options. 
                Spread the cost over 12, 24, or 36 months with no hidden fees.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• No credit check required</li>
                <li>• Quick approval process</li>
                <li>• Flexible payment terms</li>
                <li>• No prepayment penalties</li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Monthly Payment Calculator</h2>
              <p className="text-gray-600 mb-6">
                See how affordable your dream mattress can be with our financing options.
              </p>
              <div className="bg-white p-6 rounded-lg border">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">$99/month</p>
                  <p className="text-gray-600">for a $1,200 mattress over 12 months</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
