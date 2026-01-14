import { Link } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import * as Icons from 'lucide-react'

const iconMap = {
  MessageSquare: Icons.MessageSquare,
  Search: Icons.Search,
  FileText: Icons.FileText,
  Users: Icons.Users,
}

export default function AgentCard({ agent }) {
  const Icon = iconMap[agent.icon] || Icons.Circle
  
  return (
    <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-black group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-black text-white group-hover:scale-110 transition-transform">
              <Icon className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">{agent.name}</CardTitle>
          </div>
        </div>
        <CardDescription className="text-base text-gray-600 leading-relaxed">
          {agent.description}
        </CardDescription>
        {agent.long_description && (
          <p className="text-sm text-gray-500 mt-3 leading-relaxed">
            {agent.long_description}
          </p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <Link to={agent.route}>
          <Button className="w-full group-hover:bg-black group-hover:text-white transition-colors" variant="outline">
            Explorar módulo
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
