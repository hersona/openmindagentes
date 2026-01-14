import { useState } from 'react'
import { Button } from './ui/button'
import { Upload } from 'lucide-react'

export default function UploadComponent({ agentId, agentConfig }) {
  const [file, setFile] = useState(null)
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const allowedTypes = agentConfig?.allowed_types || ['.pdf', '.docx']
  const maxSizeMB = agentConfig?.max_size_mb || 5

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (!selectedFile) return

    setError('')

    // Validate file type
    const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase()
    if (!allowedTypes.includes(fileExtension)) {
      setError(`Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`)
      return
    }

    // Validate file size
    const fileSizeMB = selectedFile.size / (1024 * 1024)
    if (fileSizeMB > maxSizeMB) {
      setError(`El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`)
      return
    }

    setFile(selectedFile)
  }

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result.split(',')[1])
      reader.onerror = error => reject(error)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    setResponse(null)
    setError('')

    try {
      const base64 = await convertToBase64(file)
      const fileType = file.type || 'application/pdf'

      const res = await fetch(`/api/agent/${agentId}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            file: base64,
            filename: file.name,
            fileType: fileType,
          },
        }),
      })

      const result = await res.json()
      const responseContent = result.output || result.response || result.resultado || JSON.stringify(result)
      setResponse(responseContent)
    } catch (error) {
      console.error('Error uploading file:', error)
      setError('Error al procesar el archivo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-black">
            Seleccionar archivo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <input
              type="file"
              onChange={handleFileChange}
              accept={allowedTypes.join(',')}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="inline-flex items-center justify-center rounded-md border border-black bg-transparent hover:bg-gray-50 px-4 py-2 text-sm font-medium transition-colors">
                Seleccionar archivo
              </span>
            </label>
            {file && (
              <p className="mt-4 text-sm text-gray-600">{file.name}</p>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Tipos permitidos: {allowedTypes.join(', ')} | Tamaño máximo: {maxSizeMB}MB
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" disabled={loading || !file} className="w-full">
          {loading ? 'Procesando...' : 'Analizar'}
        </Button>
      </form>

      {response && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-2 text-black">Resultado:</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  )
}
