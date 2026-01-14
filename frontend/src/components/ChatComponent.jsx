import { useState } from 'react'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'

export default function ChatComponent({ agentId, agentConfig, selectedProfile }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const messageText = input.trim()
    const userMessage = { role: 'user', content: messageText }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // Construir el body de la petición
      const requestBody = {
        message: messageText
      }

      // Si hay un perfil seleccionado, incluir role y profile_name
      if (selectedProfile) {
        requestBody.role = selectedProfile.role
        requestBody.profile_name = selectedProfile.name
      }

      const response = await fetch(`/api/agent/${agentId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: requestBody }),
      })

      const result = await response.json()
      const assistantContent = result.output || result.response || result.resultado || JSON.stringify(result)
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error al procesar la solicitud.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            {agentConfig?.placeholder || 'Escribe tu mensaje para comenzar...'}
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === 'user'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-black'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-4 py-2">
              <div className="text-gray-400">Pensando...</div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={agentConfig?.placeholder || 'Escribe tu mensaje...'}
            className="flex-1"
            rows={2}
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()}>
            Enviar
          </Button>
        </div>
      </div>
    </div>
  )
}
