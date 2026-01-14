# Functional Specification: The Courage Lab

## 1. Visión General

The Courage Lab es un módulo interactivo tipo juego diseñado para entrenar conversaciones difíciles en el entorno laboral. El usuario selecciona un perfil (colega, jefe, subordinado, etc.) de un carrusel visual y practica conversaciones con ese perfil específico.

## 2. Experiencia de Usuario

### 2.1 Flujo Principal

1. **Entrada al Módulo**: El usuario accede a `/courage-lab`
2. **Selección de Perfil**: Se presenta un carrusel interactivo con perfiles de personas (caras/avatares)
3. **Información del Perfil**: Cada perfil muestra nombre y cargo
4. **Selección**: El usuario hace clic en el perfil deseado
5. **Inicio de Conversación**: Se inicia el chat con el perfil seleccionado
6. **Interacción**: El usuario chatea con el agente de IA que actúa como el perfil seleccionado

### 2.2 Pantalla de Selección de Perfiles

- **Diseño**: Carrusel horizontal con cards de perfiles
- **Elementos visuales**:
  - Avatar/foto circular de cada persona
  - Nombre destacado
  - Cargo/subtítulo
  - Efecto hover para indicar interactividad
  - Transiciones suaves entre perfiles
- **Navegación**: 
  - Flechas laterales para navegar (si hay muchos perfiles)
  - O scroll horizontal si es más natural
  - Indicadores de posición (dots o números)
- **Estilo**: Diseño moderno, limpio y atractivo

### 2.3 Pantalla de Chat

- Una vez seleccionado el perfil, se muestra la interfaz de chat
- El header muestra el nombre y cargo del perfil seleccionado
- El chat funciona como un ChatComponent estándar
- El contexto del cargo se envía a n8n para que el agente actúe acorde

## 3. Configuración

### 3.1 Archivo de Configuración

Se añadirá una sección en `agents.config.json` para definir los perfiles disponibles en courage-lab:

```json
{
  "id": "courage-lab",
  "config": {
    "profiles": [
      {
        "id": "lina",
        "name": "Lina",
        "role": "Gerente",
        "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces"
      },
      {
        "id": "herson",
        "name": "Herson",
        "role": "Desarrollador",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces"
      },
      {
        "id": "maria",
        "name": "María",
        "role": "Directora de Recursos Humanos",
        "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces"
      },
      {
        "id": "carlos",
        "name": "Carlos",
        "role": "Product Manager",
        "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces"
      }
    ],
    "placeholder": "Escribe tu mensaje para iniciar el roleplay..."
  }
}
```

**Nota:** Las imágenes de avatar son URLs de Unsplash con fotos profesionales reales. Si una imagen falla al cargar, se muestra un icono de usuario como fallback.

### 3.2 Estructura de Perfiles

Cada perfil debe incluir:
- **id**: Identificador único (string) - ej: "lina", "herson"
- **name**: Nombre de la persona (string) - ej: "Lina", "Herson"
- **role**: Cargo/posición en la empresa (string) - Este es el campo crítico que se envía a n8n - ej: "Gerente", "Desarrollador"
- **avatar**: URL de la imagen del perfil (string, opcional pero recomendado)
  - **Implementación actual**: URLs de Unsplash con parámetros `w=400&h=400&fit=crop&crop=faces` para imágenes cuadradas de retratos
  - Si no se proporciona o falla la carga, se muestra un icono User como fallback
  - Ejemplo: `"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces"`

## 4. Integración con n8n

### 4.1 Petición al Backend

Cuando el usuario selecciona un perfil y envía un mensaje:

```javascript
POST /api/agent/courage-lab/execute
{
  "data": {
    "message": "Texto del mensaje del usuario",
    "role": "Gerente",  // Cargo del perfil seleccionado
    "profile_name": "Lina"  // Nombre del perfil (opcional, para contexto)
  }
}
```

### 4.2 Procesamiento en n8n

- El agente de n8n recibe el campo `role` (cargo)
- El agente adapta su comportamiento y preguntas según el cargo recibido
- Ejemplos:
  - Si `role` es "Gerente": El agente actúa como un gerente, hace preguntas apropiadas para ese nivel
  - Si `role` es "Desarrollador": El agente actúa como un desarrollador, con contexto técnico
  - Si `role` es "Directora de Recursos Humanos": El agente actúa con perspectiva de RRHH

## 5. Componentes Técnicos

### 5.1 Componentes Implementados

1. **ProfileSelector Component** (✅ IMPLEMENTADO): 
   - Muestra grid de perfiles con imágenes reales
   - Maneja la selección del perfil
   - Efectos hover con indicador "Seleccionar"
   - Manejo de errores de imagen con fallback a icono User
   - Diseño responsive con flex-wrap

2. **CourageLab.jsx** (✅ MODIFICADO):
   - Estado `selectedProfile` para el perfil seleccionado
   - Renderizado condicional: ProfileSelector si no hay perfil, ChatComponent si hay perfil
   - Header del perfil seleccionado con imagen, nombre y cargo
   - Botón "Cambiar perfil" para volver a la selección
   - Pasa `selectedProfile` al ChatComponent

3. **ChatComponent** (✅ MODIFICADO):
   - Acepta prop `selectedProfile`
   - Incluye `role` y `profile_name` en el body de cada petición POST
   - Compatible con otros módulos que no usan perfiles (prop opcional)

## 6. Diseño Visual

### 6.1 Principios de Diseño

- **Moderno y Profesional**: Mantener consistencia con el resto de la aplicación
- **Interactivo**: Feedback visual claro en hover y clic
- **Accesible**: Contraste adecuado, tamaños de click apropiados
- **Responsive**: Funciona bien en desktop y móvil

### 6.2 Colores y Estilos

- **Paleta**: Negro (#000000) como color primario, blancos y grises (#FAFAFA, #F3F4F6)
- **Cards de perfiles**: 
  - Fondo blanco con borde gris (#E5E7EB) que se vuelve negro en hover
  - Sombras sutiles que se intensifican en hover (`hover:shadow-xl`)
  - Bordes redondeados (`rounded-xl`)
- **Avatares**: 
  - Circular (`rounded-full`) con tamaño 24x24 (96px) en el selector
  - Ring/borde sutil que se intensifica en hover
  - Imágenes reales desde Unsplash con fallback a icono User
- **Tipografía**: Clara y legible, fuente semibold para nombres, texto normal para cargos
- **Transiciones**: Suaves (`transition-all duration-300`) en hover y cambios de estado
- **Responsive**: Grid con `flex-wrap` para adaptarse a diferentes tamaños de pantalla

## 7. Casos de Uso Típicos

### 7.1 Perfiles Estándar de una Empresa

Ejemplos de perfiles que pueden configurarse:
- Gerente / Manager
- Desarrollador / Developer
- Product Manager
- Directora/Director de Recursos Humanos
- CEO / Director Ejecutivo
- Diseñador / Designer
- Analista de Negocios
- Scrum Master
- Tech Lead
- CTO

### 7.2 Escenarios de Práctica

El usuario puede practicar:
- Dar feedback a un subordinado
- Recibir feedback de un gerente
- Negociar con un Product Manager
- Discutir políticas con RRHH
- Comunicar decisiones difíciles
- Manejar conflictos entre pares

## 8. Fase Inicial (MVP)

### 8.1 Alcance Mínimo

Para la primera versión, implementar:
- Carrusel básico con 4-6 perfiles predefinidos
- Selección de perfil
- Envío del cargo (role) a n8n en cada mensaje
- Interfaz de chat estándar después de la selección
- Diseño simple pero atractivo

### 8.2 Exclusiones Iniciales

- Avatares personalizados (usar placeholders inicialmente)
- Navegación compleja (empezar con scroll simple)
- Animaciones avanzadas
- Búsqueda de perfiles
- Filtros por departamento

## 9. Flujo de Datos

```
Usuario → Selecciona Perfil → CourageLab.jsx (guarda selectedProfile)
    ↓
Usuario → Escribe mensaje → ChatComponent
    ↓
ChatComponent → POST /api/agent/courage-lab/execute { message, role }
    ↓
Backend → Lee agents.config.json → Encuentra webhook_url
    ↓
Backend → POST a n8n webhook con { message, role }
    ↓
n8n → Procesa según role → Devuelve respuesta
    ↓
Backend → Devuelve respuesta → ChatComponent
    ↓
ChatComponent → Muestra respuesta en chat
```

## 10. Consideraciones Futuras

Posibles mejoras para versiones posteriores:
- Avatares personalizados/fotos reales
- Más perfiles (expandible)
- Búsqueda y filtros
- Historial de conversaciones por perfil
- Estadísticas de práctica
- Escenarios predefinidos (feedback, negociación, etc.)
- Dificultad configurable por perfil
