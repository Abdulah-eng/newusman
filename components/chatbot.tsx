"use client"

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Phone, Mail, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  type?: 'text' | 'quick_reply'
}

interface QuickReply {
  text: string
  action: string
}

const QUICK_REPLIES: QuickReply[] = [
  { text: "Product Information", action: "products" },
  { text: "Order Status", action: "order" },
  { text: "Delivery Info", action: "delivery" },
  { text: "Returns & Exchanges", action: "returns" },
  { text: "Contact Support", action: "contact" }
]

const BOT_RESPONSES: { [key: string]: string } = {
  greeting: "Hello! I'm here to help you with any questions about our mattresses, beds, and furniture. How can I assist you today?",
  products: "We offer a wide range of mattresses, beds, sofas, and furniture. You can browse our categories or tell me what you're looking for!",
  order: "To check your order status, please provide your order number or email address. You can also visit our orders page.",
  delivery: "We offer free delivery to most locations! Standard delivery takes 1-3 business days. Would you like to know about delivery to your specific area?",
  returns: "We offer a 14-night trial period and easy returns. You can return items within 14 days of delivery. Need help with a return?",
  contact: "You can reach us at:\n📞 Phone: 03301336323\n📧 Email: hello@bedoraliving.co.uk\n📍 We're located across the UK",
  default: "I understand you're looking for help. Let me connect you with our support team or you can choose from the options below.",
  error: "I'm having trouble connecting to our AI assistant right now. Please contact us directly at 03301336323 or hello@bedoraliving.co.uk for immediate assistance."
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const addMessage = (text: string, isUser: boolean, type: 'text' | 'quick_reply' = 'text') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      type
    }
    setMessages(prev => [...prev, newMessage])
  }

  // Removed simulateTyping function - now handled in handleSendMessage

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    addMessage(text, true)
    setInputValue('')

    // Show typing indicator
    setIsTyping(true)

    try {
      // Prepare conversation history for context
      const conversationHistory = messages
        .slice(-10) // Last 10 messages for context
        .map(msg => `${msg.isUser ? 'Customer' : 'Assistant'}: ${msg.text}`)
        .join('\n')

      // Call Gemini API
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          conversationHistory
        })
      })

      const data = await response.json()
      
      if (data.response) {
        // Use AI response
        setTimeout(() => {
          addMessage(data.response, false)
          setIsTyping(false)
        }, 1000 + Math.random() * 1000)
      } else {
        // Fallback to predefined responses
        const lowerText = text.toLowerCase()
        let fallbackResponse = BOT_RESPONSES.default

        if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
          fallbackResponse = BOT_RESPONSES.greeting
        } else if (lowerText.includes('product') || lowerText.includes('mattress') || lowerText.includes('bed')) {
          fallbackResponse = BOT_RESPONSES.products
        } else if (lowerText.includes('order') || lowerText.includes('status')) {
          fallbackResponse = BOT_RESPONSES.order
        } else if (lowerText.includes('delivery') || lowerText.includes('shipping')) {
          fallbackResponse = BOT_RESPONSES.delivery
        } else if (lowerText.includes('return') || lowerText.includes('exchange')) {
          fallbackResponse = BOT_RESPONSES.returns
        } else if (lowerText.includes('contact') || lowerText.includes('support') || lowerText.includes('help')) {
          fallbackResponse = BOT_RESPONSES.contact
        }

        setTimeout(() => {
          addMessage(data.fallback || fallbackResponse, false)
          setIsTyping(false)
        }, 1000 + Math.random() * 1000)
      }
    } catch (error) {
      console.error('Error calling chatbot API:', error)
      // Fallback to predefined responses
      const lowerText = text.toLowerCase()
      let fallbackResponse = BOT_RESPONSES.error

      if (lowerText.includes('hello') || lowerText.includes('hi') || lowerText.includes('hey')) {
        fallbackResponse = BOT_RESPONSES.greeting
      } else if (lowerText.includes('product') || lowerText.includes('mattress') || lowerText.includes('bed')) {
        fallbackResponse = BOT_RESPONSES.products
      } else if (lowerText.includes('order') || lowerText.includes('status')) {
        fallbackResponse = BOT_RESPONSES.order
      } else if (lowerText.includes('delivery') || lowerText.includes('shipping')) {
        fallbackResponse = BOT_RESPONSES.delivery
      } else if (lowerText.includes('return') || lowerText.includes('exchange')) {
        fallbackResponse = BOT_RESPONSES.returns
      } else if (lowerText.includes('contact') || lowerText.includes('support') || lowerText.includes('help')) {
        fallbackResponse = BOT_RESPONSES.contact
      }

      setTimeout(() => {
        addMessage(fallbackResponse, false)
        setIsTyping(false)
      }, 1000 + Math.random() * 1000)
    }
  }

  const handleQuickReply = (action: string) => {
    const quickReply = QUICK_REPLIES.find(qr => qr.action === action)
    if (quickReply) {
      handleSendMessage(quickReply.text)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(inputValue)
  }

  const toggleChatbot = () => {
    setIsOpen(!isOpen)
    if (!isOpen && messages.length === 0) {
      // Add welcome message when opening for the first time
      setTimeout(() => {
        addMessage(BOT_RESPONSES.greeting, false)
      }, 500)
    }
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={toggleChatbot}
          className="w-14 h-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-orange-500 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">Bedora Living</h3>
                <p className="text-xs text-orange-100">Online Support</p>
              </div>
            </div>
            <Button
              onClick={toggleChatbot}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-orange-600 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!message.isUser && <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.isUser && <User className="w-4 h-4 mt-0.5 flex-shrink-0" />}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Replies */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 text-center">Quick replies:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.slice(0, 3).map((reply) => (
                    <button
                      key={reply.action}
                      onClick={() => handleQuickReply(reply.action)}
                      className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full hover:bg-orange-100 transition-colors duration-200"
                    >
                      {reply.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="px-4 pb-2">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                <span>03301336323</span>
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>Support</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
