# Functional Specification: Openmind Growth OS

## 1. Project Vision
Openmind Growth es una plataforma modular de consultoría de talento humano diseñada para **Openmind Global**. El sistema consiste en módulos independientes (Agentes de IA) que transforman la gestión de personas mediante entrenamiento, diagnóstico y reclutamiento inteligente.

## 2. Arquitectura Unificada
- **Servidor único:** Un solo servidor backend maneja todas las rutas de API.
- **Frontend único:** Un solo frontend (aplicación React) maneja todas las rutas usando React Router.
- **Rutas por módulo:** Cada módulo es accesible por su ruta (ej: `/home`, `/courage-lab`, `/culture-hunter`, etc.) en el mismo dominio/puerto.
- **Configuración Centralizada:** El archivo `agents.config.json` en la raíz del proyecto contiene la configuración de todos los módulos (incluyendo sus webhook URLs de n8n).

## 3. Key Modules

### 3.1 Home Portal (ruta: `/` o `/home`)
Página principal que actúa como portal/landing mejorado:

- **Sección Hero (Banner):**
  - Imagen de fondo profesional (actualmente desde Unsplash)
  - Overlay oscuro para mejorar legibilidad del texto
  - Badge superior con tagline "Human Talent Powered by AI"
  - Título principal grande en blanco
  - Descripción de la empresa
  - Dos botones de acción:
    - "Comenzar ahora" - Navega al primer módulo
    - "Ver módulos" - Hace scroll suave a la sección de módulos

- **Sección Features:**
  - Grid de 3 características destacadas con iconos
  - Desarrollo de Talento, Crecimiento Exponencial, Resultados Medibles
  - Iconos en círculos negros con descripciones

- **Sección Metodología:**
  - Título destacado "Nuestra Metodología"
  - Descripción de la consultora
  - Grid de 2 cards con información sobre talleres especializados e IA avanzada

- **Agent Gateway (Módulos):**
  - Grid dinámico de cards mejoradas que representan todos los módulos disponibles
  - Cada card muestra: Icono (en círculo negro), Nombre, Descripción, Descripción larga, y botón de acceso
  - Cards con efectos hover y diseño mejorado
  - Botón CTA adicional al final

- **CTA Final:**
  - Sección con fondo negro y texto blanco
  - Mensaje persuasivo para transformar la organización
  - Botón destacado para comenzar prueba

- Lee `agents.config.json` vía API (`GET /api/agents`) para obtener la lista de módulos y información de la empresa

### 3.2 Modules (The 4 Pillars)
Cada módulo es accesible por su ruta en el mismo servidor:

1. **The Courage Lab (ruta: `/courage-lab`):** Roleplay interactivo tipo juego para practicar conversaciones difíciles (feedback, despidos, crisis).
   - Tipo: Chat con selección de perfil
   - Interfaz: 
     - Pantalla inicial: ProfileSelector con carrusel de perfiles (imágenes reales, nombres y cargos)
     - Pantalla de chat: ChatComponent con header del perfil seleccionado
   - Funcionalidad: El usuario selecciona un perfil de la empresa (ej: Lina - Gerente, Herson - Desarrollador) y practica conversaciones con ese perfil específico
   - Configuración: Perfiles definidos en `agents.config.json` con nombre, cargo e imagen (URL de Unsplash)

2. **The Culture Hunter (ruta: `/culture-hunter`):** Búsqueda de talento en LinkedIn analizando "Culture Fit" en lugar de solo keywords.
   - Tipo: Form
   - Interfaz: FormComponent con formulario dinámico basado en configuración

3. **Growth Mapper (ruta: `/growth-mapper`):** Análisis de CVs cargados para detectar brechas de habilidades y recomendar talleres específicos de Openmind.
   - Tipo: Upload
   - Interfaz: UploadComponent para subir y analizar CVs

4. **The Interview Gym (ruta: `/interview-gym`):** Simulador de entrevistas por competencias con feedback inmediato sobre el desempeño.
   - Tipo: Chat
   - Interfaz: ChatComponent para prácticas de entrevistas

## 4. Operational Logic

### 4.1 Navegación y Routing
- El usuario accede a la aplicación en la ruta raíz (`/`) que muestra el Home con diseño mejorado.
- El Home tiene múltiples secciones: Hero con imagen de fondo, Features, Metodología, Agent Gateway y CTA final.
- El botón "Ver módulos" en el Hero hace scroll suave a la sección de módulos.
- El Home muestra cards mejoradas de cada módulo con enlaces a sus rutas correspondientes (ej: `/courage-lab`).
- El usuario puede navegar entre módulos usando React Router (client-side routing).
- Cada módulo es accesible directamente por su ruta (ej: `/culture-hunter`, `/growth-mapper`, etc.).
- Cada página de módulo tiene un botón de "Volver al inicio" para facilitar la navegación.

### 4.2 Comunicación Frontend-Backend
- El frontend único se comunica con el backend único mediante API.
- **Home:** Frontend llama a `GET /api/agents` para obtener la lista de módulos.
- **Módulos:** Frontend llama a `POST /api/agent/:id/execute` con `{ data }` para ejecutar el módulo.
- El backend lee `agents.config.json` (raíz del proyecto), busca el agente por `id` en la ruta, y hace forwarding a n8n usando su `webhook_url`.
- Los datos se envían a n8n que devuelve la respuesta procesada.
- **Configurabilidad:** El sistema lee dinámicamente la configuración desde el archivo central `agents.config.json`.
- **Courage Lab específico:** Cuando se envía un mensaje, se incluye el `role` (cargo) y `profile_name` del perfil seleccionado para que n8n adapte su comportamiento.

## 5. Authentication & Access
- **Acceso público:** La plataforma es accesible públicamente sin requerir autenticación inicial (puede implementarse en el futuro).
- No se requiere base de datos propia; n8n maneja toda la persistencia de datos.

## 6. Response Format
- n8n devuelve respuestas en formato JSON. La estructura puede variar según el agente, pero típicamente incluye campos como:
  - `{"output": "texto de respuesta"}`
  - La estructura exacta puede variar, por lo que el sistema debe ser flexible para manejar diferentes formatos de respuesta.