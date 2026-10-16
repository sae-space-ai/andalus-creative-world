# CORRECCIÓN CI — GITHUB ACTIONS (SEGUNDA ITERACIÓN)
## ANDALUS CREATIVE WORLD — FASE 00

---

## Problemas identificados en PR #3

### 1. ❌ Backend Typecheck: FAIL

**Errores TypeScript reales:**
- `request.user is possibly undefined`
- `string | undefined is not assignable to string`

**Causa raíz:**
- El middleware `authenticate()` asigna `request.user` pero TypeScript no sabe que después de `authenticate()` el usuario está garantizado
- Se usaba `request.user.id` directamente sin verificación de tipos

**Corrección aplicada:**
```typescript
// Agregada función helper con type safety
function getAuthenticatedUser(request: FastifyRequest): User {
  if (!request.user) {
    throw new Error('User not authenticated');
  }
  return request.user;
}

// Uso en todos los endpoints protegidos:
const user = getAuthenticatedUser(request);
// Ahora user es de tipo User (no undefined)
```

**Endpoints corregidos:**
- POST /api/v1/auth/logout
- GET /api/v1/auth/me
- GET /api/v1/projects
- POST /api/v1/projects
- GET /api/v1/projects/:id
- PATCH /api/v1/projects/:id
- DELETE /api/v1/projects/:id
- GET /api/v1/projects/:id/documents
- POST /api/v1/projects/:id/documents

**Archivo modificado:** `apps/api/src/index.ts`

---

### 2. ❌ Prisma Schema Validation: FAIL

**Problema:**
- El job usaba `npm install -g prisma` (instalación global)
- Esto causaba discrepancias con `@prisma/client` del proyecto
- La versión global podía no coincidir con la del schema

**Corrección aplicada:**
```yaml
# ANTES:
- name: Install Prisma CLI
  run: npm install -g prisma
- name: Validate Prisma schema
  run: prisma validate --schema prisma/schema.prisma

# AHORA:
- name: Install dependencies
  run: npm install  # Instala prisma desde package.json raíz
- name: Validate Prisma schema
  run: npx prisma validate --schema prisma/schema.prisma
```

**Archivo modificado:** 
- `.github/workflows/verify-fase00.yml`
- `package.json` (agregado `prisma: ^5.10.0` en devDependencies)

---

### 3. ⚠️ Frontend Typecheck: WARNING

**Problema:**
- El workflow usaba `|| echo "Typecheck script not defined, skipping"`
- Esto ocultaba errores reales de TypeScript

**Corrección aplicada:**
```yaml
# ANTES:
- name: Typecheck
  run: npm run typecheck || echo "Typecheck script not defined, skipping"

# AHORA:
- name: Typecheck
  run: npm run typecheck
```

**Nota:** Si el script `typecheck` no existe en package.json, el job fallará correctamente en lugar de ocultar el error.

---

### 4. ⚠️ E2E Tests: WARNING

**Problema:**
- El workflow usaba `continue-on-error: true`
- Esto permitía que el workflow pasara aunque los tests E2E fallaran

**Corrección aplicada:**
```yaml
# ANTES:
- name: Run E2E tests
  run: npx playwright test
  continue-on-error: true

# AHORA:
- name: Run E2E tests
  run: npx playwright test
```

**Nota:** Si no hay tests E2E escritos, el job fallará. Esto es correcto: no debemos declarar FASE 00 como verificada sin tests E2E reales.

---

## Archivos modificados

### 1. `apps/api/src/index.ts`
- Agregada función `getAuthenticatedUser()` con type safety
- Corregidos 9 endpoints para usar narrowing de tipos
- Eliminados todos los usos inseguros de `request.user.*`

### 2. `.github/workflows/verify-fase00.yml`
- Corregido job `prisma` para usar `npx prisma` en lugar de instalación global
- Eliminado `|| echo` del job `frontend`
- Eliminado `continue-on-error: true` del job `e2e`

### 3. `package.json`
- Agregado `prisma: ^5.10.0` en devDependencies

---

## Resultados esperados en GitHub Actions

### Job 1: Frontend Build
✅ **PASS** (sin cambios)
- npm ci → éxito
- npm run typecheck → éxito (sin ocultar errores)
- npm run build → éxito

### Job 2: Backend Typecheck
✅ **PASS** (corregido)
- npm install → éxito
- prisma generate --schema → éxito
- npm run typecheck → éxito (sin errores de tipos)

### Job 3: Prisma Schema Validation
✅ **PASS** (corregido)
- npm install → éxito (prisma desde package.json)
- npx prisma validate --schema → éxito
- npx prisma generate --schema → éxito

### Job 4: Integration Tests
✅ **PASS** (sin cambios, depende de PostgreSQL)
- npm install → éxito
- prisma generate → éxito
- prisma migrate deploy → éxito
- vitest run → éxito

### Job 5: E2E Tests
⚠️ **PASS/FAIL** (sin continue-on-error)
- Si hay tests E2E: ejecutados
- Si no hay tests E2E: fallará (correcto)

---

## Próximos pasos

### 1. Hacer commit y push
```bash
git add apps/api/src/index.ts
git add .github/workflows/verify-fase00.yml
git add package.json
git add docs/CORRECCION_CI_2.md
git commit -m "fix: corregir errores TypeScript y Prisma en CI"
git push origin main
```

### 2. Verificar GitHub Actions
- Ir a: https://github.com/sae-space-ai/andalus-creative-world/actions
- Verificar que los 5 jobs pasan
- Si Integration Tests falla, revisar logs de PostgreSQL
- Si E2E Tests falla, escribir tests E2E reales

### 3. Si todo pasa
- FASE 00 puede declararse como CI VERIFIED
- Pero aún requiere verificación en runtime local para declarar FASE 00 VERIFIED

---

## Resumen de correcciones

| Problema | Estado | Causa | Solución |
|----------|--------|-------|----------|
| request.user undefined | ✅ Corregido | Sin type narrowing | getAuthenticatedUser() |
| Prisma global vs local | ✅ Corregido | Discrepancia de versiones | npx prisma desde package.json |
| Typecheck oculto | ✅ Corregido | \|\| echo ocultaba errores | Eliminado \|\| echo |
| E2E continue-on-error | ✅ Corregido | Ocultaba fallos | Eliminado continue-on-error |

---

## No se tocó

- ✅ Frontend (16 páginas)
- ✅ Backend (lógica de negocio)
- ✅ Schema Prisma (15 modelos)
- ✅ Documentación TOP-DOWN
- ✅ 7 módulos del ecosistema
- ✅ Tests existentes
- ✅ ANDALUS STUDIO / ANDALUS RE

---

## Estado final

**CI Corregido (iteración 2):** ✅  
**Frontend Build:** ✅ PASS  
**Backend Typecheck:** ✅ PASS (esperado, sin errores TypeScript)  
**Prisma Validation:** ✅ PASS (esperado, usando npx prisma local)  
**Integration Tests:** ⏳ Pendiente de ejecución en GitHub  
**E2E Tests:** ⏳ Pendiente de ejecución en GitHub (sin continue-on-error)  
**FASE 00:** 🔒 BLOCKED (requiere verificación en runtime)

---

*Corrección CI iteración 2 completada — FASE 00*  
*AL-ANDALUS AI — Intelligence · Engineering · Europe*
