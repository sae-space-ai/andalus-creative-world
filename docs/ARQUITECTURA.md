# ARQUITECTURA.md
## ANDALUS CREATIVE WORLD

---

## Arquitectura actual (FASE 00 — Frontend)

```
┌─────────────────────────────────────────────────────┐
│                    NAVEGADOR                         │
│  ┌───────────────────────────────────────────────┐  │
│  │              React SPA (Vite)                  │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐  │  │
│  │  │  Pages   │ │Components│ │   Context     │  │  │
│  │  │  (16)    │ │ (Layout) │ │ (Auth+Theme) │  │  │
│  │  └──────────┘ └──────────┘ └──────────────┘  │  │
│  │  ┌──────────────────────────────────────────┐ │  │
│  │  │          API Layer (simulada)            │ │  │
│  │  │  projectsApi · documentsApi · capabilitiesApi │  │
│  │  └──────────────────────────────────────────┘ │  │
│  │  ┌──────────────────────────────────────────┐ │  │
│  │  │         localStorage (persistencia)      │ │  │
│  │  └──────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Arquitectura objetivo (monorepo completo)

```
┌──────────────────────────────────────────────────────────────┐
│                         CLIENTES                              │
│  ┌──────────┐  ┌──────────────┐  ┌────────────────────┐     │
│  │   Web    │  │  Andalus     │  │  Andalus           │     │
│  │ (React)  │  │  Studio      │  │  RE                │     │
│  └────┬─────┘  └──────┬───────┘  └────────┬───────────┘     │
│       │               │                    │                  │
│       └───────────────┼────────────────────┘                  │
│                       │ OIDC/OAuth (futuro SSO)               │
├───────────────────────┼──────────────────────────────────────┤
│                  API GATEWAY                                  │
│  ┌────────────────────┴───────────────────────────────────┐  │
│  │              Fastify + TypeScript                       │  │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐ │  │
│  │  │  Auth   │ │ Projects │ │Documents │ │ Modules   │ │  │
│  │  │ Module  │ │ Module   │ │ Module   │ │ (future)  │ │  │
│  │  └─────────┘ └──────────┘ └──────────┘ └───────────┘ │  │
│  │  ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐ │  │
│  │  │Credits  │ │ Stripe   │ │  Email   │ │  Workers  │ │  │
│  │  │ Ledger  │ │ Payments │ │  (SMTP)  │ │  (future) │ │  │
│  │  └─────────┘ └──────────┘ └──────────┘ └───────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│                    PERSISTENCIA                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  PostgreSQL  │  │  File Store  │  │  Redis (future)  │  │
│  │  + Prisma    │  │  (S3/Local)  │  │  (cache/queues)  │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
├──────────────────────────────────────────────────────────────┤
│                 SERVICIOS EXTERNOS                            │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ │
│  │ Google │ │ Stripe │ │  SMTP  │ │  AI    │ │  Video/  │ │
│  │  OIDC  │ │ TEST   │ │(Mailpit│ │Engines │ │  Audio   │ │
│  │        │ │        │ │/Prod)  │ │(future)│ │ (future) │ │
│  └────────┘ └────────┘ └────────┘ └────────┘ └──────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## Decisiones técnicas

### 1. React SPA para frontend
- **Razón:** Single Page Application permite experiencia fluida sin recargas.
- **Alternativa considerada:** Next.js (SSR). Descartada en FASE 00 por complejidad innecesaria.

### 2. Context API para estado
- **Razón:** Suficiente para auth y theme en FASE 00.
- **Evolución:** Migrar a Zustand o Redux si crece la complejidad.

### 3. localStorage para persistencia (desarrollo)
- **Razón:** Permite desarrollo sin backend.
- **Limitación:** NO es seguro para producción. Se migrará a cookies HttpOnly.

### 4. Tailwind CSS v4
- **Razón:** Utility-first, rápido desarrollo, tema personalizable.
- **Nota:** v4 tiene API diferente a v3 (sin @apply con clases custom).

### 5. Simulación de API
- **Razón:** Permite desarrollar y probar el frontend sin backend.
- **Contrato:** La capa API tiene la misma interfaz que tendrá el backend real.

## Frontera de integración con ANDALUS STUDIO

- No se comparten bases de datos
- No se comparten cookies de sesión
- No se comparten claves privadas
- SSO futuro mediante OIDC/OAuth estándar
- Preparada la arquitectura para federación de identidades

## Módulos — Arquitectura de extensibilidad

Cada módulo futuro sigue el mismo patrón:
1. **Contratos TypeScript** definidos en `types/index.ts`
2. **Página informativa** con estado honesto (DESIGNED)
3. **Rutas API** preparadas (devolverán 501 hasta implementación)
4. **Modelos de BD** diseñados pero no creados hasta necesidad real
5. **Sin tablas decorativas** ni funciones simuladas

---

*Documento de arquitectura — FASE 00*
