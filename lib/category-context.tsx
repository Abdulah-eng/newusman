"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface CategoryContextType {
  selectedCategory: string
  setSelectedCategory: (category: string) => void
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined)

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState('mattresses')

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  )
}

export function useCategory() {
  const context = useContext(CategoryContext)
  if (context === undefined) {
    throw new Error('useCategory must be used within a CategoryProvider')
  }
  return context
}
