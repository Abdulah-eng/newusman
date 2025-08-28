"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type Question = {
  id: string
  question: string
  options: { label: string; value: string; hint?: string }[]
}

export default function MattressFinderPage() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  const questions: Question[] = [
    { id: "partner", question: "Do you have a sleep partner?", options: [
      { label: "I share my bed", value: "share" },
      { label: "I'm a solo sleeper", value: "solo" }
    ]},
    { id: "position", question: "What's your primary sleep position?", options: [
      { label: "Side", value: "side" },
      { label: "Back", value: "back" },
      { label: "Stomach", value: "stomach" },
      { label: "Combination", value: "combo" }
    ]},
    { id: "firmness", question: "What firmness do you prefer?", options: [
      { label: "Soft", value: "soft" },
      { label: "Medium", value: "medium" },
      { label: "Firm", value: "firm" },
      { label: "Not sure", value: "unsure" }
    ]},
    { id: "heat", question: "Do you tend to sleep hot?", options: [
      { label: "Yes, run hot", value: "hot" },
      { label: "Neutral", value: "neutral" },
      { label: "I run cool", value: "cool" }
    ]},
    { id: "feel", question: "What feel do you prefer?", options: [
      { label: "Hug / contouring (foam)", value: "foam" },
      { label: "Lift / bounce (springs)", value: "springs" },
      { label: "A balanced hybrid", value: "hybrid" }
    ]},
  ]

  const total = questions.length
  const current = questions[step - 1]

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  // Lightweight AI-styled illustration generator (SVG data URI)
  const createIllustration = (label: string, tint: string) => {
    const svg = encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 160'>
        <defs>
          <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stop-color='${tint}' stop-opacity='0.25'/>
            <stop offset='100%' stop-color='${tint}' stop-opacity='0.6'/>
          </linearGradient>
        </defs>
        <rect x='0' y='0' width='200' height='160' rx='20' fill='url(#g)'/>
        <g fill='white' opacity='0.35'>
          <circle cx='50' cy='50' r='18'/>
          <circle cx='95' cy='35' r='8'/>
          <circle cx='150' cy='60' r='12'/>
          <rect x='35' y='100' width='130' height='18' rx='9'/>
        </g>
        <text x='100' y='88' dominant-baseline='middle' text-anchor='middle' font-family='system-ui,Segoe UI,Arial' font-weight='700' font-size='18' fill='#0f172a'>${label}</text>
      </svg>
    `)
    return `data:image/svg+xml;charset=UTF-8,${svg}`
  }

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [step])

  const nextStep = () => setStep(prev => Math.min(prev + 1, total + 1))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const getRecommendation = () => {
    const pos = answers["position"]
    const firm = answers["firmness"]
    if (pos === "side" && (firm === "soft" || firm === "medium")) return "Memory Foam / Hybrid Medium-Soft"
    if (pos === "back" && firm === "firm") return "Hybrid / Pocket-Spring Firm"
    if (pos === "stomach") return "Firm Supportive Mattress"
    return "Balanced Hybrid Medium"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-orange-50">
      {/* Hero */}
      <section className="container mx-auto px-4 py-10 sm:py-14">
        <div className="rounded-3xl bg-gradient-to-br from-blue-100/70 via-white to-orange-100/60 p-6 sm:p-10 shadow-sm border border-white/60">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 text-center md:text-left">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-blue-900">
                Your best night's sleep starts here
              </h1>
              <p className="mt-4 text-base sm:text-lg text-blue-900/80 max-w-2xl mx-auto md:mx-0">
                Answer a few quick questions and our Mattress Match will browse our collection to find the perfect feel for you.
              </p>
              <div className="mt-6">
                <a href="#quiz" className="inline-flex items-center justify-center rounded-full bg-blue-700 text-white px-6 py-3 font-semibold shadow hover:bg-blue-800 transition">
                  Match me
                </a>
              </div>
            </div>
            <div className="hidden md:block" />
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section id="quiz" ref={containerRef} className="container mx-auto px-4 pb-16">
        {/* Stepper */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="relative">
            <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden" />
            {/* Progress fill */}
            <div
              className="absolute left-0 top-0 h-1.5 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(step, total) / total * 100}%` }}
            />
            {/* Number bubble */}
            <div
              className="absolute -top-8"
              style={{ left: `calc(${Math.min(step, total) / total * 100}% - 24px)` }}
            >
              <div className="px-2.5 py-1 rounded-md bg-orange-600 text-white text-xs font-semibold shadow border border-orange-700">
                {step <= total ? `${step} of ${total}` : `${total} of ${total}`}
              </div>
              <div className="w-2 h-2 bg-orange-600 border border-orange-700 rotate-45 mx-auto -mt-1" />
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {step <= total ? (
            <Card className="border-blue-100 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 text-center mb-6">{current.question}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {current.options.map((opt) => {
                    const selected = answers[current.id] === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(current.id, opt.value)}
                        className={`text-left rounded-2xl border p-5 sm:p-6 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 ${
                          selected ? "border-blue-600 ring-2 ring-blue-200 bg-blue-50" : "border-blue-100 bg-white"
                        }`}
                      >
                        <div className="mb-3 h-28 flex items-center justify-center">
                          <img
                            alt={opt.label}
                            src={createIllustration(opt.label, '#3b82f6')}
                            className="h-24 w-auto rounded-xl shadow-sm"
                          />
                        </div>
                        <div className="text-lg font-semibold text-blue-900">{opt.label}</div>
                        {opt.hint && <div className="text-sm text-blue-900/70 mt-1">{opt.hint}</div>}
                      </button>
                    )
                  })}
                      </div>

                <div className="flex items-center justify-between mt-8">
                  <Button variant="outline" onClick={prevStep} disabled={step === 1}>Previous</Button>
                  <Button onClick={nextStep} disabled={!answers[current.id]} className="bg-blue-700 hover:bg-blue-800">
                    {step === total ? "Get results" : "Next"}
                    </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-blue-100 shadow-sm">
              <CardContent className="p-6 sm:p-8 text-center space-y-6">
                <h2 className="text-3xl font-extrabold text-blue-900">Your Mattress Match</h2>
                <p className="text-blue-900/80 max-w-2xl mx-auto">Based on your preferences, we think you'll love:</p>
                <div className="text-2xl font-bold text-orange-600">{getRecommendation()}</div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button asChild className="bg-blue-700 hover:bg-blue-800">
                    <a href="/mattresses">Shop recommendations</a>
                  </Button>
                  <Button variant="outline" onClick={() => { setStep(1); setAnswers({}) }}>Retake quiz</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
