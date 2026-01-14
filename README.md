# Openmind Growth OS

Plataforma modular de consultoría de talento humano con arquitectura unificada.

## Estructura del Proyecto

```
/root
  agents.config.json          # Configuración central de todos los módulos
  /backend                    # Servidor Express único
    server.js
    package.json
  /frontend                   # Aplicación React única
    src/
      components/
      pages/
    package.json
    vite.config.js
```

## Requisitos

- Node.js 18+ 
- npm o yarn

## Instalación

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Ejecución

### 1. Iniciar el Backend

```bash
cd backend
npm start
```

El backend se ejecutará en `http://localhost:3001`

### 2. Iniciar el Frontend (en otra terminal)

```bash
cd frontend
npm run dev
```

El frontend se ejecutará en `http://localhost:3000`

## Rutas Disponibles

- `/` o `/home` - Página principal (Home)
- `/courage-lab` - The Courage Lab (Chat)
- `/culture-hunter` - The Culture Hunter (Form)
- `/growth-mapper` - Growth Mapper (Upload)
- `/interview-gym` - The Interview Gym (Chat)

## API Endpoints

- `GET /api/agents` - Obtiene la lista de todos los agentes
- `POST /api/agent/:id/execute` - Ejecuta un agente específico

## Configuración

La configuración de los módulos se encuentra en `agents.config.json` en la raíz del proyecto.
