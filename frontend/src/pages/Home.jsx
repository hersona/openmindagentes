import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Sparkles, Users, TrendingUp, Target } from 'lucide-react'
import AgentCard from '../components/AgentCard'
import { Button } from '../components/ui/button'

export default function Home() {
  const [agents, setAgents] = useState([])
  const [companyInfo, setCompanyInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/agents')
      .then(res => res.json())
      .then(data => {
        setAgents(data.agents || [])
        setCompanyInfo(data.company_info)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching agents:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-400">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Con Imagen de Fondo */}
      <section className="relative py-32 px-4 overflow-hidden min-h-[90vh] flex items-center">
        {/* Imagen de fondo desde Unsplash */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2084&q=80)',
          }}
        >
          {/* Overlay oscuro para mejorar legibilidad del texto */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center z-10 w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium mb-8">
            <Sparkles className="h-4 w-4" />
            <span>Human Talent Powered by AI</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 text-white leading-tight drop-shadow-2xl">
            Transformando personas a través de <span className="text-gray-100">IA</span>
          </h1>
          
          <p className="text-2xl text-white/95 max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-lg">
            {companyInfo?.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to={agents[0]?.route || '/courage-lab'}>
              <button className="inline-flex items-center justify-center rounded-md bg-white text-black hover:bg-gray-100 text-lg font-medium px-8 py-6 shadow-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                Comenzar ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
            <button 
              onClick={() => {
                document.getElementById('modules')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-flex items-center justify-center rounded-md border-2 border-white bg-transparent text-white hover:bg-white/10 text-lg font-medium px-8 py-6 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Ver módulos
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Desarrollo de Talento</h3>
              <p className="text-gray-600">
                Potencia las habilidades de tu equipo con entrenamiento personalizado
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Crecimiento Exponencial</h3>
              <p className="text-gray-600">
                Metodología probada para acelerar el crecimiento profesional
              </p>
            </div>
            
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black text-white mb-4">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Resultados Medibles</h3>
              <p className="text-gray-600">
                Herramientas avanzadas para medir y optimizar el rendimiento
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Consultoría Section - Mejorada */}
      <section className="py-24 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-black">
              Nuestra Metodología
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {companyInfo?.description || 'Consultora líder en transformación cultural y talleres de crecimiento exponencial.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <CheckCircle2 className="h-6 w-6 text-black mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-black">Talleres Especializados</h3>
              <p className="text-gray-600">
                Programas diseñados para desarrollar habilidades específicas y transformar el desempeño profesional.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <CheckCircle2 className="h-6 w-6 text-black mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-black">IA Avanzada</h3>
              <p className="text-gray-600">
                Tecnología de vanguardia que personaliza cada experiencia de aprendizaje.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Gateway - Mejorado */}
      <section id="modules" className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 text-black">
              Explora Nuestros Módulos
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Herramientas inteligentes diseñadas para transformar tu organización
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>

          <div className="text-center">
            <p className="text-lg text-gray-600 mb-6">
              ¿Listo para comenzar tu transformación?
            </p>
            <Link to={agents[0]?.route || '/courage-lab'}>
              <Button size="lg" className="text-lg px-8 py-6">
                Empezar ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final Section */}
      <section className="py-24 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Transforma tu organización hoy
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Únete a las empresas que ya están revolucionando su gestión de talento humano
          </p>
          <Link to={agents[0]?.route || '/courage-lab'}>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-white text-white hover:bg-white hover:text-black">
              Comenzar tu prueba
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
