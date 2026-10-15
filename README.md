# ANDALUS CREATIVE WORLD
### Plataforma creativa y audiovisual de AL-ANDALUS AI

**INTELLIGENCE · ENGINEERING · EUROPE**

---

## Descripción

Andalus Creative World es una plataforma integral de creación audiovisual que permite a los creadores transformar sus obras en producciones cinematográficas, gestionar sus derechos, colaborar con otros creadores y monetizar su trabajo de forma transparente y segura.

## Estado actual — FASE 00

**Estado: PARTIAL — Código completo, pendiente de verificación en runtime**

### ✅ Implementado (código completo)
- Frontend React con 16 páginas
- Backend Fastify con autenticación real
- Schema Prisma con 15 modelos PostgreSQL
- Procesamiento real de PDF con extracción de texto
- Sistema de créditos y ledger
- 7 módulos del ecosistema (diseñados)

### ⚠️ Pendiente de verificación
- Ejecución con PostgreSQL real
- Tests de integración
- Flujo completo E2E
- Google OIDC (requiere credenciales)
- Stripe TEST (requiere claves)

## Arquitectura

```
/workspace
├── apps/api/              # Backend Fastify + TypeScript
│   ├── src/index.ts       # Servidor completo
│   └── package.json
├── prisma/
│   └── schema.prisma      # 15 modelos PostgreSQL
├── src/                   # Frontend React
│   ├── App.tsx
│   ├── api/               # API client (fetch real)
│   ├── context/           # Auth + Theme
│   ├── components/        # Layout + ProtectedRoute
│   └── pages/             # 16 páginas
├── docker-compose.yml     # PostgreSQL + Mailpit + API
└── .env.example
```

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

## Inicio rápido

### 1. Iniciar infraestructura
```bash
docker-compose up -d postgres mailpit
```

### 2. Configurar backend
```bash
cd apps/api
npm install
cp ../../.env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

### 3. Iniciar frontend
```bash
cd ../..
npm install
npm run dev
```

### 4. Abrir navegador
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Mailpit: http://localhost:8025

## Tecnologías

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS 4
- React Router 6

### Backend
- Fastify 4 + TypeScript
- Prisma 5 + PostgreSQL 16
- Argon2id (contraseñas)
- Zod (validación)
- pdf-parse (extracción PDF)

## Identidad visual

- **Verde principal:** #006B3F
- **Verde profundo:** #073C27
- **Blanco:** #FFFFFF
- **Dorado:** #C9A84C

## Seguridad

- Autenticación con Argon2id
- Cookies HttpOnly + Secure + SameSite
- CSRF protection
- Rate limiting
- Validación Zod en todos los inputs
- Aislamiento de datos por propietario
- Tokens de un solo uso con caducidad

## Documentación

- [QWEN.md](QWEN.md) — Memoria técnica
- [docs/ESTADO.md](docs/ESTADO.md) — Estado detallado
- [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) — Arquitectura
- [docs/SEGURIDAD.md](docs/SEGURIDAD.md) — Seguridad
- [docs/MODULOS.md](docs/MODULOS.md) — Módulos del ecosistema
- [docs/AUTENTICACION.md](docs/AUTENTICACION.md) — Autenticación
- [docs/FASE00_INFORME_FINAL.md](docs/FASE00_INFORME_FINAL.md) — Informe final

## Licencia

© AL-ANDALUS AI. Todos los derechos reservados.
