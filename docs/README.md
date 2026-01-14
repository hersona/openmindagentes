# Documentación del Proyecto

Esta carpeta contiene toda la documentación técnica y funcional del proyecto Openmind Growth OS.

## Estructura

```
docs/
├── README.md                    # Este archivo
├── functional-spec.md           # Especificación funcional general del sistema
├── technical-spec.md            # Especificación técnica general del sistema
└── features/                    # Especificaciones de módulos/features individuales
    └── courage-lab-spec.md      # Especificación del módulo The Courage Lab
```

## Documentos Base

- **functional-spec.md**: Descripción funcional de la plataforma, arquitectura general, módulos principales y flujos de usuario
- **technical-spec.md**: Especificación técnica detallada: tech stack, arquitectura, endpoints, estructura de carpetas, diseño

## Features/Módulos

Los specs de cada módulo/feature individual se encuentran en la carpeta `features/`:

- **courage-lab-spec.md**: Especificación completa del módulo The Courage Lab (selector de perfiles, integración con n8n, componentes)

## Cómo usar esta documentación

1. Para entender la visión general del proyecto, lee primero `functional-spec.md`
2. Para detalles técnicos de implementación, consulta `technical-spec.md`
3. Para detalles específicos de un módulo, revisa el spec correspondiente en `features/`
