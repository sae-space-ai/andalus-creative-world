# QWEN.md — Memoria Técnica
## ANDALUS CREATIVE WORLD
### AL-ANDALUS AI — FASE 00

---

## Identidad del producto

- **Marca matriz:** AL-ANDALUS AI
- **Lema:** INTELLIGENCE · ENGINEERING · EUROPE
- **Producto:** ANDALUS CREATIVE WORLD
- **Identidad visual:** Verde de Andalucía (#006B3F, #073C27), blanco, dorado
- **Experiencia:** Elegante, premium, cinematográfica, responsive, accesible

## Directorio y repositorio

- **Directorio:** /workspace
- **Tipo:** Monorepo (frontend + backend)
- **Frontend:** React SPA en `src/`
- **Backend:** Fastify API en `apps/api/`
- **Base de datos:** Prisma schema en `prisma/schema.prisma`
- **Infraestructura:** Docker Compose en `docker-compose.yml`

## Tecnologías y versiones efectivas

### Frontend
| Tecnología | Versión | Función |
|-----------|---------|---------|
| React | 18.2.0 | UI framework |
| TypeScript | 5.7.0 | Tipado estático |
| Vite | 6.3.5 | Build tool |
| Tailwind CSS | 4.1.7 | Estilos |
| React Router | 6.8.0 | Enrutamiento |

### Backend
| Tecnología | Versión | Función |
|-----------|---------|---------|
| Node.js | 20+ | Runtime |
| Fastify | 4.26.1 | API server |
| TypeScript | 5.3.3 | Tipado |
| Prisma | 5.10.0 | ORM |
| PostgreSQL | 16 | Base de datos |
| Argon2 | 0.31.2 | Hash contraseñas |
| Zod | 3.22.4 | Validación |
| pdf-parse | 1.1.1 | Extracción PDF |

## Arquitectura

```
/workspace
├── apps/
│   └── api/                    # Backend Fastify
│       ├── src/
│       │   └── index.ts        # Servidor completo
│       ├── package.json
│       └── tsconfig.json
├── prisma/
│   └── schema.prisma           # Schema PostgreSQL
├── src/                        # Frontend React
│   ├── App.tsx
│   ├── api/index.ts            # API client (fetch real)
│   ├── context/
│   │   ├── AuthContext.tsx     # Autenticación real
│   │   └── ThemeContext.tsx
│   ├── components/
│   │   ├── Layout.tsx
│   │   └── ProtectedRoute.tsx
│   └── pages/                  # 16 páginas
├── docker-compose.yml          # PostgreSQL + Mailpit + API
├── .env.example                # Variables de entorno
├── QWEN.md
├── README.md
└── docs/
```

## Estado de implementación

### ✅ IMPLEMENTADO (Código completo)

**Frontend:**
- ✅ 16 páginas funcionales
- ✅ API client con fetch real
- ✅ AuthContext conectado a API
- ✅ Modo claro/oscuro
- ✅ Diseño responsive

**Backend:**
- ✅ Fastify server con todas las rutas
- ✅ Autenticación con Argon2id
- ✅ Cookies HttpOnly + Secure
- ✅ Rate limiting
- ✅ Validación Zod
- ✅ CRUD de proyectos
- ✅ Subida y procesamiento PDF
- ✅ Extracción de texto con pdf-parse
- ✅ Aislamiento por ownerId

**Base de datos:**
- ✅ Schema Prisma completo
- ✅ 15 modelos definidos
- ✅ Relaciones e índices
- ✅ Migraciones preparadas

### ⚠️ CONFIGURATION_REQUIRED

- Google OIDC (sin credenciales)
- Stripe TEST (sin claves API)
- SMTP (sin configuración)

### ❌ NO VERIFICADO (Requiere ejecución)

- PostgreSQL real (sin servidor en este entorno)
- Migraciones ejecutadas
- Tests de integración
- Flujo completo E2E

## Comandos

### Frontend
```bash
npm run dev       # Desarrollo (Vite)
npm run build     # Producción
npm run typecheck # Verificación de tipos
```

### Backend (requiere PostgreSQL)
```bash
cd apps/api
npm install
npm run dev       # Desarrollo con hot reload
npm run build     # Compilar TypeScript
```

### Base de datos
```bash
npx prisma validate    # Validar schema
npx prisma generate    # Generar cliente
npx prisma migrate dev # Ejecutar migraciones
```

### Docker Compose
```bash
docker-compose up -d   # Iniciar todo
docker-compose down    # Parar todo
```

## Dependencias externas necesarias

- PostgreSQL 16+
- Node.js 20+
- Mailpit o SMTP real
- Google OAuth credentials (opcional)
- Stripe API keys (opcional)

## Errores y bloqueos

1. **Sin PostgreSQL en este entorno:** No se puede ejecutar el backend ni las migraciones.
2. **Sin servidor persistente:** No se puede verificar el flujo completo.
3. **Sin Google credentials:** OIDC no puede probarse.
4. **Sin Stripe keys:** Pagos no pueden activarse.

## Continuidad para la siguiente sesión

1. Iniciar Docker Compose (PostgreSQL + Mailpit)
2. Ejecutar migraciones de Prisma
3. Arrancar backend Fastify
4. Verificar health check
5. Probar registro y login
6. Probar creación de proyectos
7. Probar subida de PDF
8. Verificar extracción de texto
9. Probar aislamiento entre usuarios
10. Ejecutar tests

---

*Última actualización: FASE 00 — Backend completo, pendiente de ejecución*
*Estado: PARTIAL (código completo, sin verificación en runtime)*
