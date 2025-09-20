"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useHomePageContent } from "@/hooks/use-homepage-content"

export function MattressFinderPromo() {
  const { content, loading, error } = useHomePageContent()



  return (
    <section className="relative bg-white py-10 md:py-14">
        <div className="px-4 md:px-6 lg:px-10 xl:px-12">


        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Soft background accent */}
          <div className="hidden lg:block absolute -left-6 top-6 bottom-6 w-1/2 rounded-3xl bg-orange-50/40" aria-hidden="true"></div>

          {/* Left: Image */}
          <div className="relative order-1 lg:order-none">
            <div className="relative h-[320px] sm:h-[400px] md:h-[440px] lg:h-[480px] rounded-2xl overflow-hidden shadow-lg ring-1 ring-orange-100 bg-gray-100">
              <Image
                src={content.quiz?.image || "/sofa.jpeg"}
                alt="Showroom assistance"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-black mb-4 font-display">
              {content.quiz?.heading || "Find Your Perfect Mattress in Minutes"}
            </h2>
            <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6 font-modern">
              {content.quiz?.paragraph || "Our smart Mattress Finder makes shopping simple — answer a few quick questions and instantly discover the best mattress for your comfort, support, and sleep style. Whether you need an orthopaedic mattress, memory foam, or luxury hybrid, we'll match you with the ideal choice — tailored just for you."}
            </p>
            <div className="flex justify-center">
              <Button asChild className="bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white px-8 md:px-10 py-5 md:py-6 text-base md:text-lg font-semibold rounded-2xl shadow-lg text-center">
                <Link href="/mattress-finder">Take the quiz</Link>
              </Button>
            </div>
          </div>
        </div>
        </div>
      </section>
  )
}


