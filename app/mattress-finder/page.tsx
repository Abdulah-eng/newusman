"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useMemo } from "react"

type Question = {
  id: string
  question: string
  options: { label: string; value: string; hint?: string }[]
}

export default function MattressFinderPage() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [recommendation, setRecommendation] = useState<any>(null)
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState(false)
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

  // Curated lifestyle images (royalty-free sources like Unsplash/Pexels)
  // Local images provided by user; will be cycled across all tiles
  const localImages = ['/test1.webp','/test2.jpg','/test3.jpeg','/test4.jpg','/test5.jpg','/test6.jpeg','/test7.jpeg']

  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [step])

  const nextStep = () => {
    if (step === total) {
      // Get recommendation when moving to results
      getRecommendation()
    }
    setStep(prev => Math.min(prev + 1, total + 1))
  }
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  const getRecommendation = async () => {
    setIsLoadingRecommendation(true)
    try {
      const response = await fetch('/api/quiz/recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      })
      
      if (response.ok) {
        const data = await response.json()
        setRecommendation(data.recommendation)
      } else {
        // Fallback to hardcoded logic if API fails
        const pos = answers["position"]
        const firm = answers["firmness"]
        let title = "Balanced Hybrid Medium"
        if (pos === "side" && (firm === "soft" || firm === "medium")) title = "Memory Foam / Hybrid Medium-Soft"
        else if (pos === "back" && firm === "firm") title = "Hybrid / Pocket-Spring Firm"
        else if (pos === "stomach") title = "Firm Supportive Mattress"
        
        setRecommendation({
          title,
          description: "A versatile choice that works for most sleep preferences",
          products: []
        })
      }
    } catch (error) {
      console.error('Error fetching recommendation:', error)
      // Fallback recommendation
      setRecommendation({
        title: "Balanced Hybrid Medium",
        description: "A versatile choice that works for most sleep preferences",
        products: []
      })
    } finally {
      setIsLoadingRecommendation(false)
    }
  }

  // Reusable image with robust fallbacks (tries list of URLs → finally local asset)
  function OptionImage({ srcList, alt }: { srcList: string[]; alt: string }) {
    const candidates = useMemo(() => [...srcList, '/secondbanner.jpg', '/bedcollect.jpeg', '/sofacollect.jpg'], [srcList])
    const [index, setIndex] = useState(0)
    const activeSrc = candidates[Math.min(index, candidates.length - 1)]
    return (
      <Image
        src={activeSrc}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onError={() => setIndex(i => Math.min(i + 1, candidates.length - 1))}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-orange-50">
      {/* Hero */}
      <section className="container mx-auto px-4 py-10 sm:py-14">
        <div className="relative overflow-hidden rounded-3xl shadow-sm border border-white/60">
          <Image
            src="/test1.webp"
            alt="Young couple relaxing on a comfortable bed"
            width={2000}
            height={800}
            className="h-[340px] w-full object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 sm:px-10">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow">
                Find your perfect mattress
              </h1>
              <p className="mt-4 text-base sm:text-lg text-white/90 max-w-2xl">
                Answer a few quick questions and we’ll match you with the ideal comfort and support — for you or for two.
              </p>
              <div className="mt-6">
                <a href="#quiz" className="inline-flex items-center justify-center rounded-full bg-orange-600 text-white px-6 py-3 font-semibold shadow hover:bg-orange-700 transition">
                  Start your quiz
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quiz */}
      <section id="quiz" ref={containerRef} className="container mx-auto px-4 pb-16">
        {/* Stepper */}
        <div className="max-w-4xl mx-auto mb-6">
          <div className="relative">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden" />
            {/* Progress fill */}
            <div
              className="absolute left-0 top-0 h-1.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
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
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-6">{current.question}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {current.options.map((opt, idx) => {
                    const selected = answers[current.id] === opt.value
                    const imgSrc = localImages[(step * 10 + idx) % localImages.length]
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleAnswer(current.id, opt.value)}
                        className={`relative overflow-hidden text-left rounded-2xl border p-0 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 ${
                          selected ? "border-orange-600 ring-2 ring-orange-200" : "border-gray-200"
                        }`}
                      >
                        <div className="relative h-40">
                          <OptionImage
                            srcList={[imgSrc]}
                            alt={opt.label}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="text-lg font-semibold text-white drop-shadow">{opt.label}</div>
                            {opt.hint && <div className="text-sm text-white/90 mt-0.5">{opt.hint}</div>}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                      </div>

                <div className="flex items-center justify-between mt-8">
                  <Button variant="outline" onClick={prevStep} disabled={step === 1} className="border-gray-300 text-gray-700 hover:bg-gray-50">Previous</Button>
                  <Button onClick={nextStep} disabled={!answers[current.id]} className="bg-orange-600 hover:bg-orange-700">
                    {step === total ? "Get results" : "Next"}
                    </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-0 sm:p-0">
                <div className="relative overflow-hidden rounded-t-xl">
                  <OptionImage
                    srcList={["/test2.jpg", "/test3.jpeg", "/test4.jpg"]}
                    alt="Happy couple relaxing on a bed"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h2 className="text-3xl font-extrabold text-white drop-shadow">Your Mattress Match</h2>
                    <p className="text-white/90">Tailored from your answers</p>
                  </div>
                </div>
                <div className="p-6 sm:p-8 text-center space-y-6">
                  <p className="text-gray-700 max-w-2xl mx-auto">Based on your preferences, we think you'll love:</p>
                  
                  {isLoadingRecommendation ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                      <span className="ml-2 text-gray-600">Finding your perfect match...</span>
                    </div>
                  ) : recommendation ? (
                    <div className="space-y-4">
                      <div className="text-2xl font-bold text-orange-600">{recommendation.title}</div>
                      {recommendation.description && (
                        <p className="text-gray-600 max-w-xl mx-auto">{recommendation.description}</p>
                      )}
                      
                      {/* Show recommended products if available */}
                      {recommendation.products && recommendation.products.length > 0 && (
                        <div className="mt-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Products:</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                            {recommendation.products.slice(0, 4).map((product: any, index: number) => (
                              <div key={product.product_id || index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <h4 className="font-semibold text-gray-900">{product.products?.name || 'Product'}</h4>
                                {product.products?.headline && (
                                  <p className="text-sm text-gray-600 mt-1">{product.products.headline}</p>
                                )}
                                {product.products?.current_price && (
                                  <p className="text-orange-600 font-semibold mt-2">From £{product.products.current_price}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-orange-600">Balanced Hybrid Medium</div>
                  )}
                  
                  <div className="flex items-center justify-center gap-3 pt-2">
                    <Button asChild className="bg-orange-600 hover:bg-orange-700">
                      <a href="/mattresses">Shop recommendations</a>
                    </Button>
                    <Button variant="outline" onClick={() => { setStep(1); setAnswers({}); setRecommendation(null) }} className="border-gray-300 text-gray-700 hover:bg-gray-50">Retake quiz</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  )
}
