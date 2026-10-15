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

- **Directorio:** /workspace (entorno de desarrollo frontend)
- **Tipo:** Aplicación React SPA (frontend de FASE 00)
- **Nota:** Este entorno contiene el frontend completo. La arquitectura completa monorepo (con Fastify + PostgreSQL) se implementará cuando se disponga de infraestructura de servidor.

## Tecnologías y versiones efectivas

| Tecnología | Versión | Función |
|-----------|---------|---------|
| React | 18.2.0 | UI framework |
| TypeScript | 5.7.0 | Tipado estático |
| Vite | 6.3.5 | Build tool |
| Tailwind CSS | 4.1.7 | Estilos |
| React Router | 6.8.0 | Enrutamiento |
| Framer Motion | 11.16.1 | Animaciones |
| Lucide React | 0.294.0 | Iconografía |

## Arquitectura

```
src/
├── App.tsx              # Router principal
├── main.tsx             # Entry point
├── index.css            # Estilos + tema
├── types/
│   └── index.ts         # Contratos TypeScript
├── context/
│   ├── AuthContext.tsx   # Estado de autenticación
│   └── ThemeContext.tsx  # Modo claro/oscuro
├── api/
│   └── index.ts         # Capa API (simulada en frontend)
├── components/
│   ├── Layout.tsx        # Header + Footer + Nav
│   └── ProtectedRoute.tsx # Guard de rutas
└── pages/
    ├── Landing.tsx
    ├── Login.tsx
    ├── Register.tsx
    ├── AuthPages.tsx     # VerifyEmail, ForgotPassword, ResetPassword
    ├── Dashboard.tsx
    ├── Projects.tsx
    ├── ProjectDetail.tsx
    ├── Account.tsx
    ├── Settings.tsx
    ├── Pricing.tsx
    ├── NotFound.tsx
    └── Modules.tsx       # 7 páginas de módulos
```

## Módulos del ecosistema

| Módulo | Estado FASE 00 | Descripción |
|--------|---------------|-------------|
| Andalus Cinema | DESIGNED | Producción audiovisual |
| Andalus Cinema+ | DESIGNED | Exhibición y distribución |
| Andalus Community | DESIGNED | Red de creadores |
| Andalus Festivals | DESIGNED | Concursos artísticos |
| Andalus Rights | DESIGNED | Gestión de derechos |
| Andalus Trace 360° | DESIGNED | Seguimiento de obras |
| Andalus Wallet | DESIGNED | Ganancias de creadores |

## Estado de implementación

### IMPLEMENTADO (Frontend)
- ✅ Landing page con identidad visual
- ✅ Registro con validación
- ✅ Login con gestión de errores
- ✅ Verificación de email (simulada)
- ✅ Recuperación de contraseña
- ✅ Dashboard con estadísticas
- ✅ CRUD de proyectos privados
- ✅ Subida de PDF con validación
- ✅ Declaración de derechos
- ✅ 7 páginas de módulos informativas
- ✅ Modo claro/oscuro
- ✅ Diseño responsive
- ✅ Navegación completa
- ✅ Página de precios (sin checkout)
- ✅ Cuenta y configuración

### CONFIGURATION_REQUIRED
- ⚠️ Google OIDC (sin credenciales)
- ⚠️ Stripe TEST (sin claves)
- ⚠️ PostgreSQL (sin servidor)
- ⚠️ Mailpit/SMTP (sin servicio)

### NOT STARTED (requiere backend)
- ❌ Hash Argon2id real (simulado en frontend)
- ❌ Cookies HttpOnly
- ❌ CSRF tokens
- ❌ Rate limiting
- ❌ Procesamiento real de PDF (pdf-parse)
- ❌ Migraciones Prisma
- ❌ Webhooks Stripe

## Convenciones

- Idioma del código: inglés (variables, funciones)
- Idioma de la UI: español
- Tipado estricto TypeScript
- Componentes funcionales con hooks
- Context API para estado global
- localStorage para persistencia en desarrollo

## Reglas de seguridad (diseño)

- No tokens en localStorage (producción usará cookies HttpOnly)
- No secrets en código
- Validación Zod en backend
- Aislamiento por ownerId en backend
- No confiar en datos del navegador para autorización

## Comandos verificados

```bash
npm run dev       # Desarrollo (Vite)
npm run build     # Producción
npm run typecheck # Verificación de tipos
```

## Dependencias externas necesarias

- PostgreSQL (para backend completo)
- Node.js + Fastify (API server)
- Mailpit o SMTP (correo)
- Google OAuth credentials (OIDC)
- Stripe API keys (pagos)
- Motor OCR (documentos escaneados)
- Motores de IA (generación audiovisual)

## Errores y bloqueos

1. **Sin backend real:** El frontend simula la API con localStorage. Se necesita Fastify + PostgreSQL para autenticación real, procesamiento PDF y persistencia segura.
2. **Sin Google OIDC:** No se pueden proporcionar credenciales de prueba.
3. **Sin Stripe:** No se pueden procesar pagos reales.
4. **Sin OCR:** Documentos escaneados no pueden procesarse sin motor OCR.

## Continuidad para la siguiente sesión

1. Implementar backend Fastify + TypeScript
2. Configurar PostgreSQL + Prisma
3. Migrar autenticación a backend real (Argon2id, cookies)
4. Implementar procesamiento real de PDF
5. Configurar Google OIDC con credenciales
6. Preparar Stripe TEST
7. Implementar tests de integración
8. Docker Compose para desarrollo

---

*Última actualización: FASE 00 — Frontend completo*
*Estado: PARTIAL (frontend verificado, backend pendiente)*
