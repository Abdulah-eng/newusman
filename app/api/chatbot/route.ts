import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = 'AIzaSyAG4y_lmu728vT3oRCY49j7UrfqPomOpnI'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

export async function GET() {
  return NextResponse.json({ 
    status: 'Chatbot API is running',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('Chatbot API: Request received')
    
    const { message, conversationHistory } = await request.json()
    console.log('Chatbot API: Message received:', message)

    if (!message) {
      console.log('Chatbot API: No message provided')
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Create context for the AI about your business
    const systemPrompt = `You are a helpful customer service chatbot for Bedora Living, a UK-based furniture and mattress company. 

Company Information:
- We sell mattresses, beds, sofas, pillows, toppers, bunkbeds, and kids furniture
- We offer free delivery to most locations
- Standard delivery takes 1-3 business days
- We have a 14-night trial period
- 1-year warranty on products
- Contact: Phone: 03301336323, Email: hello@bedoraliving.co.uk
- We're located across the UK

Your role:
- Help customers with product information, orders, delivery, returns, and general inquiries
- Be friendly, professional, and helpful
- Provide accurate information about our products and services
- If you don't know something specific, offer to connect them with our support team
- Keep responses concise but informative
- Always be encouraging about our products and services

Previous conversation context: ${conversationHistory || 'This is the start of the conversation.'}

Customer's current message: ${message}

Please respond as the Bedora Living chatbot:`

    const requestBody = {
      contents: [{
        parts: [{
          text: systemPrompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    }

    console.log('Chatbot API: Making request to Gemini API')
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    console.log('Chatbot API: Gemini response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Gemini API error:', response.status, response.statusText, errorText)
      return NextResponse.json({ 
        error: 'Failed to get AI response',
        fallback: "I'm having trouble connecting to our AI assistant right now. Please contact us directly at 03301336323 or hello@bedoraliving.co.uk for immediate assistance."
      }, { status: 500 })
    }

    const data = await response.json()
    console.log('Chatbot API: Gemini response data:', JSON.stringify(data, null, 2))
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const aiResponse = data.candidates[0].content.parts[0].text
      console.log('Chatbot API: AI response generated successfully')
      return NextResponse.json({ response: aiResponse })
    } else {
      console.error('Unexpected Gemini API response:', data)
      return NextResponse.json({ 
        error: 'Invalid AI response',
        fallback: "I'm having trouble processing your request right now. Please contact us directly at 03301336323 or hello@bedoraliving.co.uk for immediate assistance."
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      fallback: "I'm experiencing technical difficulties. Please contact us directly at 03301336323 or hello@bedoraliving.co.uk for immediate assistance."
    }, { status: 500 })
  }
}
