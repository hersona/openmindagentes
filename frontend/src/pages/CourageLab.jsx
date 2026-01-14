import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ChatComponent from '../components/ChatComponent'
import ProfileSelector from '../components/ProfileSelector'
import { ArrowLeft, ArrowLeftCircle } from 'lucide-react'

export default function CourageLab() {
  const [agent, setAgent] = useState(null)
  const [selectedProfile, setSelectedProfile] = useState(null)

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        const found = data.agents?.find(a => a.id === 'courage-lab')
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

  const profiles = agent.config?.profiles || []

  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile)
  }

  const handleBackToSelection = () => {
    setSelectedProfile(null)
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

        {!selectedProfile ? (
          <div className="max-w-5xl mx-auto">
            <ProfileSelector profiles={profiles} onSelect={handleProfileSelect} />
          </div>
        ) : (
          <div className="max-w-4xl">
            {/* Header con perfil seleccionado */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {selectedProfile.avatar ? (
                  <img
                    src={selectedProfile.avatar}
                    alt={selectedProfile.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-300"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-semibold">
                    {selectedProfile.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-black">{selectedProfile.name}</h3>
                  <p className="text-sm text-gray-600">{selectedProfile.role}</p>
                </div>
              </div>
              <button
                onClick={handleBackToSelection}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeftCircle className="h-5 w-5" />
                <span>Cambiar perfil</span>
              </button>
            </div>

            <ChatComponent 
              agentId={agent.id} 
              agentConfig={agent.config}
              selectedProfile={selectedProfile}
            />
          </div>
        )}
      </div>
    </div>
  )
}
