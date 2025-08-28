"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from 'react'

export function CategoryGrid() {
	const [items, setItems] = useState<any[]>([])

	useEffect(() => {
		setItems([])
	}, [])

	if (!items.length) return null

	return (
		<section className="py-16 bg-white">
			<div className="container mx-auto px-4">
				<div className="text-center mb-12">
					<h2 className="text-3xl md:text-4xl font-bold text-black mb-4 font-display">
						Shop by Category
					</h2>
					<p className="text-lg text-gray-700 max-w-2xl mx-auto font-modern">
						Find exactly what you need for your perfect sleep setup
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
					{items.map((category: any, idx: number) => (
						<div key={idx} className="w-full">
							<Link href={category.href || '#'}>
								<Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 bg-white border border-gray-200 hover:border-orange-300 rounded-xl overflow-hidden">
									<CardContent className="p-0">
										<div className="relative overflow-hidden rounded-t-lg">
											<Image
												src={category.image || "/placeholder.svg"}
												alt={category.title || 'Category'}
												width={1200}
												height={800}
												className="w-full h-48 object-cover bg-white group-hover:scale-105 transition-transform duration-300"
											/>
										</div>
										<div className="p-6">
											<h3 className="text-xl font-semibold text-black mb-2 group-hover:text-orange-600 font-display">
												{category.title}
											</h3>
											{category.subtitle && (
												<p className="text-gray-700 font-modern">{category.subtitle}</p>
											)}
										</div>
									</CardContent>
								</Card>
							</Link>
						</div>
					))}
				</div>
			</div>
		</section>
	)
}


