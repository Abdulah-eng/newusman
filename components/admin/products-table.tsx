"use client"

import { useEffect, useState } from "react"
import { Edit2, Trash2, RefreshCw } from "lucide-react"

type ProductRow = {
  id: string
  name: string
  category: string
  brand?: string
  currentPrice?: number
  originalPrice?: number
  created_at?: string
}

const categories = ["mattresses","beds","sofas","pillows","toppers","bunkbeds"]

export default function ProductsTable() {
  const [rows, setRows] = useState<ProductRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadAll = async () => {
    try {
      setLoading(true)
      setError(null)
      const all: ProductRow[] = []
      for (const cat of categories) {
        const res = await fetch(`/api/products?category=${encodeURIComponent(cat)}`)
        if (!res.ok) continue
        const data = await res.json()
        for (const p of (data.products || [])) {
          all.push({
            id: p.id,
            name: p.name,
            brand: p.brand,
            currentPrice: p.currentPrice,
            originalPrice: p.originalPrice,
            category: cat,
          })
        }
      }
      setRows(all)
    } catch (e:any) {
      setError(e?.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadAll() }, [])

  const handleDelete = async (row: ProductRow) => {
    if (!confirm(`Delete ${row.name}?`)) return
    const res = await fetch(`/api/products?id=${encodeURIComponent(row.id)}&category=${encodeURIComponent(row.category)}`, { method: 'DELETE' })
    if (res.ok) {
      setRows(prev => prev.filter(r => r.id !== row.id))
    } else {
      alert('Delete failed')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <h3 className="text-lg font-semibold">All Products</h3>
        <button onClick={loadAll} className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>
      {error && <div className="px-4 py-2 text-red-600 text-sm">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Brand</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6" colSpan={5}>Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td className="px-4 py-6" colSpan={5}>No products found</td></tr>
            ) : (
              rows.map(row => (
                <tr key={`${row.category}-${row.id}`} className="border-t">
                  <td className="px-4 py-2 font-medium text-gray-900">{row.name}</td>
                  <td className="px-4 py-2">{row.category}</td>
                  <td className="px-4 py-2">{row.brand}</td>
                  <td className="px-4 py-2">£{(row.currentPrice || 0).toFixed(2)}</td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => {
                        // Navigate to the category tab to edit
                        const evt = new CustomEvent('admin:edit-product', { detail: row })
                        window.dispatchEvent(evt)
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 mr-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Edit2 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(row)}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


