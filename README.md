# ANDALUS CREATIVE WORLD
### Plataforma creativa y audiovisual de AL-ANDALUS AI

**INTELLIGENCE · ENGINEERING · EUROPE**

---

## Descripción

Andalus Creative World es una plataforma integral de creación audiovisual que permite a los creadores transformar sus obras en producciones cinematográficas, gestionar sus derechos, colaborar con otros creadores y monetizar su trabajo de forma transparente y segura.

## Estado actual — FASE 00

Esta versión implementa el **frontend completo** de la Fase 00 (Fundación Integral del Producto):

- ✅ Autenticación (registro, login, recuperación)
- ✅ Dashboard personal
- ✅ Gestión de proyectos privados
- ✅ Subida y procesamiento de PDF
- ✅ Declaración de derechos sobre obras
- ✅ 7 módulos del ecosistema (diseñados)
- ✅ Modo claro/oscuro
- ✅ Diseño responsive y accesible
- ✅ Sistema de créditos (diseñado)

## Módulos

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| 🎬 Cinema | Diseñado | Producción audiovisual y adaptación de libros |
| 🎥 Cinema+ | Diseñado | Estrenos, exhibición y distribución |
| 👥 Community | Diseñado | Comunidad de creadores |
| 🏆 Festivals | Diseñado | Concursos y festivales |
| 🛡️ Rights | Diseñado | Gestión de derechos y licencias |
| 🔍 Trace 360° | Diseñado | Seguimiento y rendimiento |
| 💰 Wallet | Diseñado | Ganancias de creadores |

## Tecnologías

- **Frontend:** React 18 + TypeScript + Vite
- **Estilos:** Tailwind CSS 4
- **Routing:** React Router 6
- **Iconos:** Lucide React
- **Animaciones:** Framer Motion

## Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build producción
npm run build

# Verificación de tipos
npm run typecheck
```

## Identidad visual

- **Verde principal:** #006B3F
- **Verde profundo:** #073C27
- **Blanco:** #FFFFFF
- **Dorado:** #C9A84C

## Arquitectura futura (monorepo)

```
apps/
  web/        # Frontend React (este proyecto)
  api/        # Backend Fastify
packages/
  contracts/  # Tipos compartidos
  shared/     # Utilidades
  ui/         # Componentes compartidos
prisma/       # Schema y migraciones
```

## Seguridad

- Autenticación con Argon2id (backend)
- Cookies HttpOnly + Secure
- CSRF protection
- Rate limiting
- Validación Zod en todos los inputs
- Aislamiento de datos por propietario

## Licencia

© AL-ANDALUS AI. Todos los derechos reservados.
