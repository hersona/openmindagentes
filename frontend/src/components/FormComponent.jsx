import { useState } from 'react'
import { Input } from './ui/input'
import { Select } from './ui/select'
import { Button } from './ui/button'

export default function FormComponent({ agentId, agentConfig }) {
  const [formData, setFormData] = useState({})
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResponse(null)

    try {
      const res = await fetch(`/api/agent/${agentId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: formData }),
      })

      const result = await res.json()
      const responseContent = result.output || result.response || result.resultado || JSON.stringify(result)
      setResponse(responseContent)
    } catch (error) {
      console.error('Error submitting form:', error)
      setResponse('Error al procesar la solicitud.')
    } finally {
      setLoading(false)
    }
  }

  const renderField = (field) => {
    if (field.type === 'select') {
      return (
        <Select
          key={field.name}
          value={formData[field.name] || ''}
          onChange={(e) => handleChange(field.name, e.target.value)}
          required
        >
          <option value="">Selecciona...</option>
          {field.options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </Select>
      )
    }

    return (
      <Input
        key={field.name}
        type={field.type || 'text'}
        value={formData[field.name] || ''}
        onChange={(e) => handleChange(field.name, e.target.value)}
        placeholder={field.placeholder || ''}
        required
      />
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {agentConfig?.fields?.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2 text-black">
              {field.label}
            </label>
            {renderField(field)}
          </div>
        ))}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Enviando...' : 'Enviar'}
        </Button>
      </form>

      {response && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-2 text-black">Respuesta:</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  )
}
