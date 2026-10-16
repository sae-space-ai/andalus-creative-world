# CORRECCIÓN CI — GITHUB ACTIONS
## ANDALUS CREATIVE WORLD — FASE 00

---

## Problemas identificados y corregidos

### 1. ❌ Backend Typecheck: FAIL

**Causa:**
- El workflow intentaba usar `cache-dependency-path: apps/api/package-lock.json`
- Este archivo NO existe (solo existe `package-lock.json` en la raíz para el frontend)
- La caché de npm fallaba al no encontrar el lockfile

**Corrección:**
- Eliminado `cache-dependency-path` del job `backend`
- Cambiado `npm ci || npm install` a solo `npm install`
- Agregado `--schema ../../prisma/schema.prisma` al comando `prisma generate`

**Archivo corregido:** `.github/workflows/verify-fase00.yml` (líneas 46-69)

---

### 2. ❌ Prisma Schema Validation: FAIL

**Causa:**
- Los comandos `npx prisma validate` y `npx prisma generate` se ejecutaban en `apps/api`
- Pero el schema está en `prisma/schema.prisma` (raíz del repositorio)
- Prisma no encontraba el schema por defecto

**Corrección:**
- Cambiado `working-directory` a la raíz del repositorio para el job `prisma`
- Agregado `--schema prisma/schema.prisma` explícitamente
- Instalado Prisma CLI globalmente para evitar dependencias locales

**Archivo corregido:** `.github/workflows/verify-fase00.yml` (líneas 71-95)

---

### 3. ❌ Integration Tests: NOT_RUN

**Causa:**
- El job dependía de `backend` y `prisma` que fallaban
- Además, los comandos de Prisma no encontraban el schema

**Corrección:**
- Agregado `--schema ../../prisma/schema.prisma` a todos los comandos de Prisma
- Agregado paso para instalar Vitest explícitamente
- Especificado el archivo de test: `tests/integration.test.ts`

**Archivo corregido:** `.github/workflows/verify-fase00.yml` (líneas 97-148)

---

### 4. ❌ Errores de TypeScript en backend

**Causa:**
- El código usaba `request.user` y `request.session` sin declarar los tipos
- TypeScript no reconocía estas propiedades en `FastifyRequest`

**Corrección:**
- Agregada declaración de módulos para extender `FastifyRequest`
- Importados tipos `User` y `Session` desde `@prisma/client`

**Archivo corregido:** `apps/api/src/index.ts` (líneas 1-30)

```typescript
declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
    session?: Session;
  }
}
```

---

### 5. ❌ Comandos `npm ci || npm install`

**Causa:**
- Este patrón oculta errores reales
- Si `npm ci` falla, continúa con `npm install` sin diagnosticar el problema

**Corrección:**
- Reemplazado con `npm install` directo en el backend (no hay lockfile)
- Mantenido `npm ci` en el frontend (sí hay lockfile)

**Archivos corregidos:** `.github/workflows/verify-fase00.yml` (múltiples líneas)

---

## Cambios realizados

### `.github/workflows/verify-fase00.yml`

**Job `backend`:**
```yaml
# ANTES:
cache-dependency-path: apps/api/package-lock.json
run: npm ci || npm install
run: npx prisma generate

# AHORA:
# (sin cache-dependency-path)
run: npm install
run: npx prisma generate --schema ../../prisma/schema.prisma
```

**Job `prisma`:**
```yaml
# ANTES:
defaults:
  run:
    working-directory: apps/api
run: npm ci || npm install
run: npx prisma validate
run: npx prisma generate

# AHORA:
defaults:
  run:
    working-directory: .  # (raíz)
run: npm install -g prisma
run: prisma validate --schema prisma/schema.prisma
run: prisma generate --schema prisma/schema.prisma
```

**Job `integration`:**
```yaml
# ANTES:
run: npm ci || npm install
run: npx prisma generate
run: npx prisma migrate deploy
run: npx vitest run --reporter=verbose

# AHORA:
run: npm install
run: npx prisma generate --schema ../../prisma/schema.prisma
run: npx prisma migrate deploy --schema ../../prisma/schema.prisma
run: npm install -D vitest
run: npx vitest run tests/integration.test.ts --reporter=verbose
```

**Job `e2e`:**
```yaml
# ANTES:
run: cd apps/api && (npm ci || npm install)
run: cd apps/api && npx prisma generate
run: cd apps/api && npx prisma migrate deploy

# AHORA:
run: cd apps/api && npm install
run: cd apps/api && npx prisma generate --schema ../../prisma/schema.prisma
run: cd apps/api && npx prisma migrate deploy --schema ../../prisma/schema.prisma
```

### `apps/api/src/index.ts`

**Agregado al inicio:**
```typescript
import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient, User, Session } from '@prisma/client';

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
    session?: Session;
  }
}
```

---

## Resultados esperados en GitHub Actions

### Job 1: Frontend Build
✅ **PASS** (ya funcionaba)
- npm ci → éxito
- npm run build → éxito (4.96s)

### Job 2: Backend Typecheck
✅ **PASS** (corregido)
- npm install → éxito
- prisma generate --schema → éxito
- npm run typecheck → éxito (sin errores TypeScript)

### Job 3: Prisma Schema Validation
✅ **PASS** (corregido)
- prisma validate --schema → éxito
- prisma generate --schema → éxito

### Job 4: Integration Tests
✅ **PASS** (corregido, depende de PostgreSQL)
- npm install → éxito
- prisma generate → éxito
- prisma migrate deploy → éxito
- vitest run → éxito (tests ejecutados)

### Job 5: E2E Tests
⚠️ **PASS/FAIL** (depende de Playwright)
- Puede fallar si no hay tests E2E escritos
- `continue-on-error: true` permite que el workflow continúe

---

## Próximos pasos

1. **Hacer commit de los cambios:**
   ```bash
   git add .github/workflows/verify-fase00.yml
   git add apps/api/src/index.ts
   git commit -m "fix: corregir CI - rutas de Prisma y tipos TypeScript"
   git push origin main
   ```

2. **Verificar GitHub Actions:**
   - Ir a https://github.com/sae-space-ai/andalus-creative-world/actions
   - Verificar que los 5 jobs pasan

3. **Si Integration Tests falla:**
   - Revisar logs de PostgreSQL
   - Verificar que las migraciones se aplican
   - Comprobar que los tests están bien escritos

4. **Si E2E Tests falla:**
   - Es normal si no hay tests E2E escritos aún
   - El workflow tiene `continue-on-error: true`

---

## Archivos modificados

1. `.github/workflows/verify-fase00.yml` — Correcciones de CI
2. `apps/api/src/index.ts` — Declaración de tipos TypeScript

---

## No se tocó

- ✅ Frontend (16 páginas)
- ✅ Backend (lógica de negocio)
- ✅ Schema Prisma (15 modelos)
- ✅ Documentación TOP-DOWN
- ✅ 7 módulos del ecosistema
- ✅ Tests existentes

---

*Corrección CI — FASE 00*
*AL-ANDALUS AI — Intelligence · Engineering · Europe*
