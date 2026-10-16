# QWEN.md — Memoria Técnica
## ANDALUS CREATIVE WORLD
### AL-ANDALUS AI — FASE 00-TD

---

## MÉTODO TOP-DOWN

**Definir primero la experiencia final del usuario;**
**después pantallas, acciones, contratos,**
**tecnología y pruebas.**

No desarrollar infraestructura aislada
sin necesidad funcional definida.

No presentar simulaciones como funciones operativas.

No reconstruir código existente válido.

---

## Diagnóstico de Herramientas Disponibles

**IMPORTANTE:** Este entorno de desarrollo solo proporciona:
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
- ❌ Ejecución de tests (vitest, jest, playwright)
- ❌ Arranque de servidores (Fastify, Vite)
- ❌ Verificación de puertos
- ❌ Inspección de procesos
- ❌ Acceso a Vercel

**Consecuencia:** El código puede escribirse y compilarse, pero NO puede ejecutarse ni verificarse en runtime dentro de este entorno.

---

## Identidad del producto

- **Marca matriz:** AL-ANDALUS AI
- **Lema:** INTELLIGENCE · ENGINEERING · EUROPE
- **Producto:** ANDALUS CREATIVE WORLD
- **Identidad visual:** Verde de Andalucía (#006B3F, #073C27), blanco, dorado

---

## Estado actual: BLOCKED

**NO es PARTIAL. NO es VERIFIED. Es BLOCKED.**

El código está completo y compilado, pero NO se ha verificado en runtime.

### ✅ LO ÚNICO VERIFICADO

**Frontend Build:**
```bash
Comando: npm run build
Resultado: ✅ ÉXITO (4.93s)
```

### ✅ IMPLEMENTADO (Código completo)

**Frontend (React + TypeScript + Vite):**
- ✅ 16 páginas funcionales
- ✅ API client conectado a backend real (fetch con credentials)
- ✅ AuthContext usa API real (no localStorage)
- ✅ Modo claro/oscuro
- ✅ Diseño responsive
- ✅ **Sin simulaciones** (3 corregidas en esta ejecución)

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

**Tests:**
- ✅ Tests unitarios (apps/api/tests/unit.test.ts)
- ✅ Tests de integración (apps/api/tests/integration.test.ts)
- ✅ CI configurado (.github/workflows/verify-fase00.yml)

**Documentación TOP-DOWN:**
- ✅ docs/EXPERIENCIA_USUARIO.md
- ✅ docs/RECORRIDOS_TOP_DOWN.md
- ✅ docs/MODULOS.md
- ✅ docs/PRUEBAS.md
- ✅ docs/INFORME_FINAL_FASE00_TD.md

### ❌ NO VERIFICADO (Requiere ejecución)

- ❌ PostgreSQL real (sin servidor en este entorno)
- ❌ Migraciones ejecutadas
- ❌ Backend arrancado
- ❌ Tests ejecutados
- ❌ Flujo completo E2E
- ❌ Despliegue en Vercel verificado

---

## Simulaciones corregidas en esta ejecución

### 1. VerifyEmail (src/pages/AuthPages.tsx)
**ANTES:** `await new Promise(r => setTimeout(r, 1500));`
**AHORA:** `await authApi.verifyEmail(token);`

### 2. ForgotPassword (src/pages/AuthPages.tsx)
**ANTES:** `await new Promise(r => setTimeout(r, 1000));`
**AHORA:** `await authApi.forgotPassword(email);`

### 3. ResetPassword (src/pages/AuthPages.tsx)
**ANTES:** `await new Promise(r => setTimeout(r, 1000));`
**AHORA:** `await authApi.resetPassword(token, password);`

---

## Comandos para ejecutar fuera de este entorno

```bash
# 1. Iniciar infraestructura
docker-compose up -d postgres mailpit

# 2. Configurar backend
cd apps/api
npm install
cp ../../.env.example .env
npx prisma generate
npx prisma migrate dev --name init

# 3. Arrancar servicios
# Terminal 1: Backend
cd apps/api
npm run dev

# Terminal 2: Frontend
npm run dev

# 4. Verificar
curl http://localhost:3001/api/v1/health

# 5. Ejecutar tests
cd apps/api
npm test

# 6. Probar flujo completo
# Abrir http://localhost:3000
```

---

## Estructura de archivos

```
/workspace
├── .github/workflows/
│   └── verify-fase00.yml       # CI con PostgreSQL real
├── apps/api/
│   ├── src/index.ts            # Backend Fastify (824 líneas)
│   ├── tests/
│   │   ├── unit.test.ts        # Tests unitarios
│   │   └── integration.test.ts # Prueba Nº 001
│   ├── vitest.config.ts
│   ├── package.json
│   └── tsconfig.json
├── prisma/
│   └── schema.prisma           # 15 modelos (363 líneas)
├── src/                         # Frontend React
│   ├── App.tsx
│   ├── api/index.ts            # API client (fetch real)
│   ├── context/
│   │   ├── AuthContext.tsx     # Conectado a API real
│   │   └── ThemeContext.tsx
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── ProtectedRoute.tsx
│   └── pages/                  # 16 páginas (sin simulaciones)
├── docs/
│   ├── EXPERIENCIA_USUARIO.md  # Recorridos TOP-DOWN
│   ├── RECORRIDOS_TOP_DOWN.md  # Flujos detallados
│   ├── MODULOS.md              # 7 módulos
│   ├── PRUEBAS.md              # Procedimiento completo
│   ├── INFORME_FINAL_FASE00_TD.md
│   └── ...
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

1. Ejecutar `docker-compose up -d postgres mailpit`
2. Instalar dependencias del backend: `cd apps/api && npm install`
3. Generar cliente Prisma: `npx prisma generate`
4. Ejecutar migraciones: `npx prisma migrate dev --name init`
5. Arrancar backend: `npm run dev`
6. Verificar health check: `curl http://localhost:3001/api/v1/health`
7. Ejecutar tests: `npm test`
8. Probar flujo completo (ver docs/PRUEBAS.md)
9. **No marcar FASE 00 como VERIFIED hasta completar todos los pasos**

---

*Última actualización: FASE 00-TD — Método TOP-DOWN aplicado*
*Estado: BLOCKED (código completo, sin verificación en runtime)*
*Simulaciones corregidas: 3*
*Tests escritos: unitarios + integración*
*CI configurado: GitHub Actions*
