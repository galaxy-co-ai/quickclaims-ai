'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    address: '',
    clientName: '',
    projectType: '',
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step < 3) {
      setStep(step + 1)
      return
    }

    // Submit final form
    setLoading(true)
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const project = await response.json()
        router.push(`/projects/${project.id}`)
      }
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full card-soft">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            AI Concierge
          </h2>
          <p className="text-muted-foreground">Let's create your project in 3 simple steps</p>
        </div>

        <div className="flex mb-8 gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-colors ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-3">
              <label htmlFor="address" className="block text-lg font-medium text-foreground">
                What's the project address?
              </label>
              <input
                id="address"
                type="text"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                className="w-full h-12 px-4 bg-input-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="123 Main St, City, State ZIP"
                required
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <label htmlFor="clientName" className="block text-lg font-medium text-foreground">
                Who is the client?
              </label>
              <input
                id="clientName"
                type="text"
                value={formData.clientName}
                onChange={(e) => updateField('clientName', e.target.value)}
                className="w-full h-12 px-4 bg-input-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Client name"
                required
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <label htmlFor="projectType" className="block text-lg font-medium text-foreground">
                What type of project is this?
              </label>
              <select
                id="projectType"
                value={formData.projectType}
                onChange={(e) => updateField('projectType', e.target.value)}
                className="w-full h-12 px-4 bg-input-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              >
                <option value="">Select project type</option>
                <option value="Roof Repair">Roof Repair</option>
                <option value="Roof Replacement">Roof Replacement</option>
                <option value="Siding">Siding</option>
                <option value="Water Damage">Water Damage</option>
                <option value="Fire Damage">Fire Damage</option>
                <option value="Remodel">Remodel</option>
                <option value="Addition">Addition</option>
                <option value="Other">Other</option>
              </select>
            </div>
          )}

          <div className="flex gap-4 pt-2">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 h-12 px-6 border border-border rounded-xl hover:bg-accent transition-all font-medium"
              >
                Back
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all disabled:opacity-50 shadow-soft hover:shadow-soft-hover"
            >
              {loading ? 'Creating...' : step === 3 ? 'Create Project' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
