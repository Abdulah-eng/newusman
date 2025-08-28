"use client"

import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, Calendar } from "lucide-react"

interface ExpertAssistanceProps {
  phoneNumber?: string
  onPhoneCall?: () => void
  onChat?: () => void
  onBookAppointment?: () => void
}

export function ExpertAssistance({
  phoneNumber = "(405) 564-0561",
  onPhoneCall,
  onChat,
  onBookAppointment
}: ExpertAssistanceProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      {/* Title */}
      <h3 className="text-lg font-bold text-orange-600">Expert Assistance Awaits</h3>
      
      {/* Description */}
      <p className="text-gray-700">
        Get expert advice from our sleep specialists to ensure your best night's sleep.
      </p>
      
      {/* Contact Options */}
      <div className="flex gap-3">
        {/* Phone Button */}
        <Button
          variant="outline"
          onClick={onPhoneCall}
          className="flex-1 bg-white border-gray-300 hover:bg-gray-50 text-gray-900"
        >
          <Phone className="w-4 h-4 mr-2 text-gray-500" />
          {phoneNumber}
        </Button>
        
        {/* Chat Button */}
        <Button
          variant="outline"
          onClick={onChat}
          className="flex-1 bg-white border-gray-300 hover:bg-gray-50 text-orange-600"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat now
        </Button>
      </div>
      
      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">OR</span>
        </div>
      </div>
      
      {/* In-Store Visit Information */}
      <div className="space-y-3">
        <p className="text-gray-700">
          Prefer a Personal Touch? Book Your In-Store Visit to discover mattresses and sleep essentials customized for your comfort.
        </p>
        
        {/* Book Appointment Button */}
        <Button
          onClick={onBookAppointment}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          Book an appointment
        </Button>
      </div>
    </div>
  )
}
