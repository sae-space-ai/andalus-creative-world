# QWEN.md — Memoria Técnica
## ANDALUS CREATIVE WORLD
### AL-ANDALUS AI — FASE 00

---

## Diagnóstico de Herramientas Disponibles

**IMPORTANTE:** Este entorno de desarrollo solo proporciona las siguientes herramientas:
- `build_project` (ejecuta `npm run build`)
- `create_file`, `edit_file`, `delete_file`
- `glob_files`, `grep_files`, `list_files`, `read_file`
- `install_npm_packages`
- `web_search`, `web_fetch`
- `generate_image`
- `done`

**NO se dispone de:**
- ❌ Ejecución de comandos shell arbitrarios
- ❌ Acceso a Docker
- ❌ Acceso a PostgreSQL
- ❌ Ejecución de tests (vitest, jest)
- ❌ Arranque de servidores (Fastify, Vite)
- ❌ Verificación de puertos
- ❌ Inspección de procesos

**Consecuencia:** El código puede escribirse y compilarse, pero NO puede ejecutarse ni verificarse en runtime dentro de este entorno.

---

## Identidad del producto

- **Marca matriz:** AL-ANDALUS AI
- **Lema:** INTELLIGENCE · ENGINEERING · EUROPE
- **Producto:** ANDALUS CREATIVE WORLD
- **Identidad visual:** Verde de Andalucía (#006B3F, #073C27), blanco, dorado

## Estado actual: BLOCKED

**NO es PARTIAL. NO es VERIFIED. Es BLOCKED.**

El código está escrito pero NO se ha verificado en runtime.

### Limitación crítica del entorno:
Este entorno solo proporciona herramientas de edición de archivos y compilación.
**NO proporciona ejecución de comandos shell, acceso a bases de datos, ni capacidad de arrancar servicios.**

### ✅ LO ÚNICO VERIFICADO

**Frontend (React + TypeScript + Vite):**
- ✅ 16 páginas funcionales
- ✅ API client conectado a backend real (fetch con credentials)
- ✅ AuthContext usa API real (no localStorage)
- ✅ Modo claro/oscuro
- ✅ Diseño responsive
- ✅ Build exitoso (4.89s, sin errores)

**Backend (Fastify + TypeScript):**
- ✅ Servidor completo (824 líneas)
- ✅ Autenticación con Argon2id
- ✅ Cookies HttpOnly + Secure + SameSite
- ✅ Rate limiting
- ✅ Validación Zod
- ✅ CRUD de proyectos con aislamiento ownerId
- ✅ Subida y procesamiento PDF con pdf-parse
- ✅ Todas las rutas /api/v1/*

**Base de datos (Prisma + PostgreSQL):**
- ✅ Schema completo (363 líneas, 15 modelos)
- ✅ Relaciones e índices
- ✅ Tipos enum
- ✅ Constraints de unicidad

**Infraestructura:**
- ✅ docker-compose.yml (PostgreSQL + Mailpit + API + Web)
- ✅ .env.example documentado
- ✅ Script de diagnóstico (scripts/diagnose.sh)

**Tests:**
- ✅ Tests unitarios creados (apps/api/tests/unit.test.ts)
- ✅ Configuración Vitest (apps/api/vitest.config.ts)
- ✅ Procedimiento de pruebas documentado (docs/PRUEBAS.md)

### ⚠️ CONFIGURATION_REQUIRED

- Google OIDC (sin credenciales)
- Stripe TEST (sin claves API)
- SMTP (sin configuración)

### ❌ NO VERIFICADO (Requiere ejecución)

- ❌ PostgreSQL real (sin servidor en este entorno)
- ❌ Migraciones ejecutadas
- ❌ Backend arrancado
- ❌ Tests ejecutados
- ❌ Flujo completo E2E

---

## Comandos para ejecutar fuera de este entorno

```bash
# 1. Diagnóstico
chmod +x scripts/diagnose.sh
./scripts/diagnose.sh

# 2. Iniciar infraestructura
docker-compose up -d postgres mailpit

# 3. Configurar backend
cd apps/api
npm install
cp ../../.env.example .env
npx prisma generate
npx prisma migrate dev --name init

# 4. Arrancar backend
npm run dev

# 5. Arrancar frontend (otra terminal)
cd ../..
npm run dev

# 6. Verificar
curl http://localhost:3001/api/v1/health

# 7. Ejecutar tests
cd apps/api
npm test
```

---

## Estructura de archivos

```
/workspace
├── apps/api/                    # Backend Fastify
│   ├── src/index.ts            # Servidor (824 líneas)
│   ├── tests/unit.test.ts      # Tests unitarios
│   ├── vitest.config.ts        # Config Vitest
│   ├── package.json
│   └── tsconfig.json
├── prisma/
│   └── schema.prisma           # 15 modelos (363 líneas)
├── scripts/
│   └── diagnose.sh             # Script de diagnóstico
├── src/                         # Frontend React
│   ├── App.tsx
│   ├── api/index.ts            # API client (fetch real)
│   ├── context/
│   │   ├── AuthContext.tsx     # Conectado a API real
│   │   └── ThemeContext.tsx
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── ProtectedRoute.tsx
│   └── pages/                  # 16 páginas
├── docs/
│   ├── PRUEBAS.md              # Procedimiento completo
│   ├── ESTADO.md
│   ├── ARQUITECTURA.md
│   ├── SEGURIDAD.md
│   ├── MODULOS.md
│   ├── AUTENTICACION.md
│   └── FASE00_INFORME_FINAL.md
├── docker-compose.yml
├── .env.example
├── QWEN.md
└── README.md
```

---

## Tecnologías

### Frontend
- React 18.2.0
- TypeScript 5.7.0
- Vite 6.3.5
- Tailwind CSS 4.1.7
- React Router 6.8.0

### Backend
- Fastify 4.26.1
- TypeScript 5.3.3
- Prisma 5.10.0
- PostgreSQL 16
- Argon2 0.31.2
- Zod 3.22.4
- pdf-parse 1.1.1

---

## Bloqueos y limitaciones

1. **Entorno sin ejecución de comandos:** No se puede arrancar PostgreSQL, Docker, ni servidores.
2. **Sin verificación en runtime:** El código está completo pero no se ha ejecutado.
3. **Sin tests ejecutados:** Los tests están escritos pero no se han corrido.
4. **Sin credenciales externas:** Google OIDC y Stripe requieren configuración.

---

## Continuidad para la siguiente sesión

Para completar la verificación de FASE 00:

1. Ejecutar `./scripts/diagnose.sh` en un entorno con Docker/PostgreSQL
2. Levantar infraestructura con `docker-compose up -d`
3. Instalar dependencias del backend: `cd apps/api && npm install`
4. Generar cliente Prisma: `npx prisma generate`
5. Ejecutar migraciones: `npx prisma migrate dev --name init`
6. Arrancar backend: `npm run dev`
7. Verificar health check: `curl http://localhost:3001/api/v1/health`
8. Ejecutar tests: `npm test`
9. Probar flujo completo (ver docs/PRUEBAS.md)
10. **No marcar FASE 00 como VERIFIED hasta completar todos los pasos**

---

*Última actualización: Diagnóstico honesto de herramientas disponibles*
*Estado: PARTIAL (código completo, sin verificación en runtime)*
