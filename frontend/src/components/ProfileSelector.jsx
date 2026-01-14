import { useState } from 'react'
import { User } from 'lucide-react'

export default function ProfileSelector({ profiles, onSelect }) {
  const [imageErrors, setImageErrors] = useState({})

  if (!profiles || profiles.length === 0) {
    return (
      <div className="text-center text-gray-400 py-12">
        No hay perfiles disponibles
      </div>
    )
  }

  const handleImageError = (profileId) => {
    setImageErrors(prev => ({ ...prev, [profileId]: true }))
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-semibold mb-8 text-center text-black">
        Selecciona con quién quieres practicar
      </h2>
      
      <div className="flex gap-6 justify-center flex-wrap">
        {profiles.map((profile) => {
          const hasError = imageErrors[profile.id]
          const showImage = profile.avatar && !hasError

          return (
            <button
              key={profile.id}
              onClick={() => onSelect(profile)}
              className="group relative bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-black hover:shadow-xl transition-all duration-300 flex flex-col items-center w-48 cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4 overflow-hidden ring-2 ring-gray-200 group-hover:ring-black transition-all">
                {showImage ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover"
                    onError={() => handleImageError(profile.id)}
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400 group-hover:text-black transition-colors" />
                )}
              </div>

              {/* Name */}
              <h3 className="text-lg font-semibold text-black mb-2 group-hover:text-black">
                {profile.name}
              </h3>

              {/* Role */}
              <p className="text-sm text-gray-600 text-center group-hover:text-gray-700">
                {profile.role}
              </p>

              {/* Hover indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-black text-white text-xs px-3 py-1 rounded-full">
                  Seleccionar
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
