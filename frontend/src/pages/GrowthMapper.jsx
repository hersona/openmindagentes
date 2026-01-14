import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import UploadComponent from '../components/UploadComponent'
import { ArrowLeft } from 'lucide-react'

export default function GrowthMapper() {
  const [agent, setAgent] = useState(null)

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        const found = data.agents?.find(a => a.id === 'growth-mapper')
        setAgent(found)
      })
      .catch(err => console.error('Error fetching agent:', err))
  }, [])

  if (!agent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-semibold mb-4 text-black">{agent.name}</h1>
          <p className="text-lg text-gray-600">{agent.long_description || agent.description}</p>
        </div>

        <UploadComponent agentId={agent.id} agentConfig={agent.config} />
      </div>
    </div>
  )
}
