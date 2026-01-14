# Technical Specification: Openmind Growth OS

## 1. Tech Stack
- **Frontend:** React.js (Vite) + Tailwind CSS + Lucide Icons + Shadcn/UI + React Router
- **Backend:** Node.js (Express) - servidor único
- **Communication:** HTTP POST Webhooks síncronos hacia n8n (el backend se comunica directamente con n8n)
- **UI Framework:** Shadcn/UI con tema minimalista estilo Apple (paleta blanco/negro)
- **Configuración:** JSON centralizado en `agents.config.json` (raíz del proyecto)

### HTTP Request Format to n8n
- **Method:** POST
- **Content-Type:** `application/json`
- **Headers:** `Content-Type: application/json`
- **Body:** JSON con estructura variable según el tipo de agente (ver sección 3).

## 2. Architecture: Unified Server System
El sistema consiste en un servidor backend único y un frontend único con routing. El sistema se rige por un archivo central de configuración en `/agents.config.json` (raíz del proyecto).

### Estructura Unificada
- **Backend único:** Un solo servidor Express en `/backend/` que maneja todas las rutas de API
- **Frontend único:** Una sola aplicación React en `/frontend/` que maneja todas las rutas usando React Router
- **Rutas por módulo:** Cada módulo es accesible por su ruta (ej: `/home`, `/courage-lab`, `/culture-hunter`, etc.) en el mismo dominio/puerto
- El `agents.config.json` en la raíz contiene la configuración de todos los módulos (incluyendo sus webhook URLs de n8n)

### Backend Logic (Node.js Proxy Unificado)

**Archivo:** `backend/server.js`

**Endpoints:**
- `GET /api/agents` - Devuelve la lista de todos los agentes/módulos
  - Lee `agents.config.json` desde la raíz del proyecto
  - Devuelve todos los agentes con su información (id, name, description, icon, etc.)
  
- `POST /api/agent/:id/execute` - Ejecuta un agente específico
  - Recibe el `id` del agente en la ruta (ej: `/api/agent/courage-lab/execute`)
  - Lee `agents.config.json` desde la raíz del proyecto
  - Busca el agente por `id` en el config
  - Recibe `{ data }` en el body, hace POST al `webhook_url` del agente (desde el config) y hace forwarding a n8n
  - **Timeout:** 30 segundos máximo para las peticiones a n8n
  - **Manejo de errores:** Capturar y manejar errores de red, timeouts y respuestas de error de n8n

- **CORS:** Configurado para permitir requests del frontend

### Frontend Logic (React con Routing)

**Estructura:** `frontend/src/` con Vite + React + React Router

**Routing:**
- `/` o `/home` - Home page (portal/landing)
- `/courage-lab` - Módulo The Courage Lab
- `/culture-hunter` - Módulo The Culture Hunter
- `/growth-mapper` - Módulo Growth Mapper
- `/interview-gym` - Módulo The Interview Gym

**Componentes:**
- `App.jsx` - Configuración de React Router y rutas
- `Home.jsx` - Página principal mejorada con:
  - Hero section con imagen de fondo (Unsplash)
  - Features section (3 características con iconos)
  - Metodología section (2 cards informativas)
  - Agent Gateway (grid de módulos)
  - CTA final (sección persuasiva)
- `AgentCard.jsx` - Card mejorada para cada módulo con icono destacado, descripción larga y efectos hover
- `ChatComponent.jsx` - Para módulos tipo chat (Courage Lab, Interview Gym)
- `FormComponent.jsx` - Para módulos tipo form (Culture Hunter)
- `UploadComponent.jsx` - Para módulos tipo upload (Growth Mapper)
- Componentes UI (Shadcn-style): Button, Card, Input, Textarea, Select

**Funcionalidad:**
- Home: Fetch a `GET /api/agents` para obtener lista de módulos y mostrar cards
- Módulos: Fetch a `POST /api/agent/:id/execute` con `{ data }` para ejecutar el módulo
- Navegación entre módulos usando React Router (client-side routing)

## 3. Payload Structure by Agent Type

### Chat Agents (Courage Lab, Interview Gym)
- Payload JSON con campos técnicos apropiados según el tipo de interacción.
- Ejemplo estructura: `{ "message": "texto del usuario", "context": {...} }` (estructura específica a definir según cada taller).

### Form Agents (Culture Hunter)
- Todos los campos del formulario se envían en una sola petición POST.
- Estructura: `{ "role": "...", "culture_fit": "...", ... }` (campos definidos en el config del agente).

### Upload Agents (Growth Mapper)
- Archivos se convierten a base64 y se envían en el JSON del POST.
- Estructura: `{ "file": "base64_string", "filename": "cv.pdf", "fileType": "application/pdf" }`.
- Los archivos se envían directamente a n8n, no se almacenan localmente.

### Response Handling
- n8n devuelve JSON. Estructura típica: `{"output": "respuesta"}`, pero puede variar.
- El backend debe ser flexible para manejar diferentes estructuras de respuesta.
- El frontend debe procesar la respuesta y extraer el contenido relevante.

## 4. Folder Structure (Unified)
```text
/root
  agents.config.json                    # Config central de todos los módulos
  /backend
    server.js                            # Servidor único con todas las rutas API
    package.json
  /frontend
    /public
      /assets                            # Imágenes y assets estáticos
        .gitkeep
    /src
      /components
        /ui                              # Componentes UI (Button, Card, Input, Textarea, Select)
          button.jsx
          card.jsx
          input.jsx
          textarea.jsx
          select.jsx
        AgentCard.jsx                    # Card mejorada para módulos
        ChatComponent.jsx                # Componente de chat
        FormComponent.jsx                # Componente de formulario
        UploadComponent.jsx              # Componente de upload
      /pages
        Home.jsx                         # Ruta: / o /home (mejorado)
        CourageLab.jsx                   # Ruta: /courage-lab
        CultureHunter.jsx                # Ruta: /culture-hunter
        GrowthMapper.jsx                 # Ruta: /growth-mapper
        InterviewGym.jsx                 # Ruta: /interview-gym
      App.jsx                            # Configuración de React Router
      main.jsx
      index.css                          # Estilos globales con Tailwind
    package.json
    vite.config.js
    tailwind.config.js
    postcss.config.js
    index.html
```

### Justificación de la Arquitectura Unificada
- **Simplicidad:** Un solo servidor backend y un solo frontend simplifica el deployment y mantenimiento
- **Routing centralizado:** React Router maneja todas las rutas en el frontend
- **API unificada:** Backend único con endpoints claros (`GET /api/agents`, `POST /api/agent/:id/execute`)
- **Config centralizado:** El `agents.config.json` en la raíz permite configuración centralizada
- **Escalabilidad:** Fácil agregar nuevos módulos añadiendo rutas en el router y endpoints en el backend
- **Mismo dominio/puerto:** Todos los módulos accesibles desde el mismo servidor con rutas diferentes

## 5. Design System: Minimalista Estilo Apple (Mejorado)

### Filosofía de Diseño
- **Paleta de colores:** Blancos (#FFFFFF, #FAFAFA) y negros (#000000, #1A1A1A, #2A2A2A)
- **Espaciado:** Generoso (spacing amplio, márgenes grandes - py-16, py-24, py-32)
- **Tipografía:** Limpia y legible (system font stack o similar a SF Pro)
- **Sombras y bordes:** Sutiles y mínimos
- **Transiciones:** Suaves
- **Bordes redondeados:** Sutiles
- **Imágenes:** Hero section con imagen de fondo profesional para mayor impacto visual

### Home Page - Diseño Mejorado

**Hero Section:**
- Imagen de fondo desde Unsplash (profesional, relacionada con trabajo en equipo)
- Overlay oscuro con gradiente (`from-black/70 via-black/60 to-black/70`) para legibilidad
- Texto en blanco con sombras (`drop-shadow-2xl`, `drop-shadow-lg`)
- Badge con efecto glassmorphism (`backdrop-blur-sm`, `bg-white/10`)
- Botones destacados: blanco sólido para primario, outline blanco para secundario
- Altura mínima: 90vh para máximo impacto

**Features Section:**
- Grid de 3 columnas con iconos en círculos negros
- Iconos de Lucide React: Users, TrendingUp, Target
- Texto centrado con espaciado generoso

**Metodología Section:**
- Fondo con gradiente sutil (`from-white to-gray-50`)
- Grid de 2 cards con iconos CheckCircle2
- Información estructurada y legible

**Agent Gateway:**
- Cards mejoradas con iconos destacados en círculos negros
- Efectos hover mejorados (`hover:shadow-xl`, `hover:border-black`)
- Muestra descripción larga además de la corta
- Botones con iconos y animaciones

**CTA Final:**
- Fondo negro (`bg-black`) con texto blanco
- Diseño contrastante para máximo impacto
- Botón outline blanco sobre fondo negro

### Configuración Tailwind
- Tema personalizado con paleta blanco/negro
- Background principal: blanco (#FFFFFF)
- Texto principal: negro (#000000)
- Cards: fondo blanco con bordes sutiles o sombras muy ligeras, efectos hover mejorados
- Botones: estilo minimalista (outline o ghost para primarios, sólido negro/blanco para acciones principales)
- Inputs: bordes sutiles, fondo blanco, focus discreto
- Máxima legibilidad con buen contraste
- Responsive design manteniendo la estética minimalista
- Soporte para imágenes de fondo con overlay para mantener legibilidad