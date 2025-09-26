"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'

interface QuizRecommendation {
  id: string
  rule_name: string
  description: string
  answer_conditions: Record<string, string>
  recommendation_title: string
  recommendation_description: string
  priority: number
  is_active: boolean
  products: any[]
}

export default function QuizRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<QuizRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    rule_name: '',
    description: '',
    answer_conditions: {} as Record<string, string>,
    recommendation_title: '',
    recommendation_description: '',
    priority: 1,
    is_active: true
  })

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('/api/admin/quiz-recommendations')
      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.recommendations || [])
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (recommendation: QuizRecommendation) => {
    setEditingId(recommendation.id)
    setFormData({
      rule_name: recommendation.rule_name,
      description: recommendation.description,
      answer_conditions: recommendation.answer_conditions,
      recommendation_title: recommendation.recommendation_title,
      recommendation_description: recommendation.recommendation_description,
      priority: recommendation.priority,
      is_active: recommendation.is_active
    })
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/quiz-recommendations', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingId,
          ...formData
        })
      })

      if (response.ok) {
        await fetchRecommendations()
        setEditingId(null)
        setFormData({
          rule_name: '',
          description: '',
          answer_conditions: {},
          recommendation_title: '',
          recommendation_description: '',
          priority: 1,
          is_active: true
        })
      }
    } catch (error) {
      console.error('Error saving recommendation:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recommendation?')) return

    try {
      const response = await fetch('/api/admin/quiz-recommendations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        await fetchRecommendations()
      }
    } catch (error) {
      console.error('Error deleting recommendation:', error)
    }
  }

  const addCondition = () => {
    const key = prompt('Enter condition key (e.g., position, firmness):')
    const value = prompt('Enter condition value (e.g., side, soft):')
    if (key && value) {
      setFormData(prev => ({
        ...prev,
        answer_conditions: { ...prev.answer_conditions, [key]: value }
      }))
    }
  }

  const removeCondition = (key: string) => {
    setFormData(prev => {
      const newConditions = { ...prev.answer_conditions }
      delete newConditions[key]
      return { ...prev, answer_conditions: newConditions }
    })
  }

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Quiz Recommendations</h1>
        <Button onClick={() => setEditingId('new')} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Recommendation
        </Button>
      </div>

      {/* Edit Form */}
      {editingId && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId === 'new' ? 'Add New Recommendation' : 'Edit Recommendation'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rule_name">Rule Name</Label>
                <Input
                  id="rule_name"
                  value={formData.rule_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, rule_name: e.target.value }))}
                  placeholder="e.g., Side Sleeper Soft"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this recommendation rule"
              />
            </div>

            <div>
              <Label>Answer Conditions</Label>
              <div className="space-y-2">
                {Object.entries(formData.answer_conditions).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Badge variant="outline">{key}: {value}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCondition(key)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" onClick={addCondition}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Condition
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="recommendation_title">Recommendation Title</Label>
              <Input
                id="recommendation_title"
                value={formData.recommendation_title}
                onChange={(e) => setFormData(prev => ({ ...prev, recommendation_title: e.target.value }))}
                placeholder="e.g., Memory Foam / Hybrid Medium-Soft"
              />
            </div>

            <div>
              <Label htmlFor="recommendation_description">Recommendation Description</Label>
              <Textarea
                id="recommendation_description"
                value={formData.recommendation_description}
                onChange={(e) => setFormData(prev => ({ ...prev, recommendation_description: e.target.value }))}
                placeholder="Detailed description of why this recommendation fits"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={handleSave} className="bg-orange-600 hover:bg-orange-700">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec) => (
          <Card key={rec.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{rec.rule_name}</h3>
                    <Badge variant={rec.is_active ? "default" : "secondary"}>
                      {rec.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline">Priority: {rec.priority}</Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{rec.description}</p>
                  
                  <div className="mb-2">
                    <strong>Conditions:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(rec.answer_conditions).map(([key, value]) => (
                        <Badge key={key} variant="outline">{key}: {value}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <strong>Recommendation:</strong> {rec.recommendation_title}
                  </div>
                  
                  {rec.recommendation_description && (
                    <p className="text-sm text-gray-600">{rec.recommendation_description}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(rec)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(rec.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
