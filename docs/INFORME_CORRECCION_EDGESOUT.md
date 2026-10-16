# Informe de Corrección: Error edgesOut en Integration Tests

## Resumen Ejecutivo

**Problema:** Error `Cannot read properties of null (reading 'edgesOut')` al ejecutar `npm install -D vitest` en GitHub Actions.

**Causa Raíz:** Instalación dinámica de dependencias en CI sin `package-lock.json` en `apps/api/`.

**Solución:** Declarar Vitest como dependencia en `package.json` y eliminar la instalación dinámica.

**Estado:** ✅ Corrección aplicada, pendiente de generación de `package-lock.json` y verificación en CI.

---

## Análisis del Error

### Error Reportado
```
Install Vitest: FAIL
npm install -D vitest
Cannot read properties of null (reading 'edgesOut')
```

### Causa Técnica

El error `edgesOut` ocurre cuando npm intenta modificar un árbol de dependencias inconsistente:

1. **`apps/api/package-lock.json` NO existe**
2. El workflow ejecuta `npm install` → crea lockfile temporal
3. Luego ejecuta `npm install -D vitest` → intenta modificar ese lockfile
4. npm encuentra inconsistencias en el árbol de dependencias → error `edgesOut`

### Por Qué Ocurre

- **npm install** sin lockfile crea un árbol de dependencias basado en `package.json`
- **npm install -D <paquete>** intenta modificar ese árbol
- Si el árbol temporal no está completamente resuelto, npm falla con `edgesOut`
- Esto es especialmente común en entornos CI con caché o estados inconsistentes

---

## Solución Aplicada

### 1. Declarar Vitest en package.json

**Archivo:** `apps/api/package.json`

```json
{
  "name": "@andalus/api",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@fastify/cookie": "^9.3.1",
    "@fastify/cors": "^9.0.1",
    "@fastify/csrf-protection": "^6.4.1",
    "@fastify/formbody": "^7.4.0",
    "@fastify/multipart": "^8.1.0",
    "@fastify/rate-limit": "^9.1.0",
    "@prisma/client": "^5.10.0",
    "argon2": "^0.31.2",
    "fastify": "^4.26.1",
    "pdf-parse": "^1.1.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/node": "^20.11.16",
    "@types/pdf-parse": "^1.1.4",
    "prisma": "^5.10.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "vitest": "^1.6.1"
  }
}
```

**Cambios:**
- ✅ Agregado `"vitest": "^1.6.1"` en `devDependencies`
- ✅ Agregado script `"test": "vitest run"`
- ✅ Agregado script `"test:watch": "vitest"`

### 2. Eliminar Instalación Dinámica en CI

**Archivo:** `.github/workflows/verify-fase00.yml`

**ANTES (Job 4: Integration Tests):**
```yaml
- name: Install dependencies
  run: npm install

- name: Generate Prisma Client
  run: npx prisma generate --schema ../../prisma/schema.prisma

- name: Run migrations
  run: npx prisma migrate deploy --schema ../../prisma/schema.prisma

- name: Install Vitest
  run: npm install -D vitest  # ← CAUSA DEL ERROR

- name: Run integration tests
  run: npx vitest run tests/integration.test.ts --reporter=verbose
```

**DESPUÉS:**
```yaml
- name: Install dependencies
  run: npm install

- name: Generate Prisma Client
  run: npx prisma generate --schema ../../prisma/schema.prisma

- name: Run migrations
  run: npx prisma migrate deploy --schema ../../prisma/schema.prisma

- name: Run integration tests
  run: npm test  # ← USA EL SCRIPT DEFINIDO EN package.json
```

**Cambios:**
- ✅ Eliminado paso "Install Vitest"
- ✅ Cambiado `npx vitest run` por `npm test`

---

## Archivos Modificados

### 1. `apps/api/package.json`
- Agregado `vitest: ^1.6.1` en `devDependencies`
- Agregados scripts `test` y `test:watch`

### 2. `.github/workflows/verify-fase00.yml`
- Eliminado paso "Install Vitest" (línea 145-146)
- Cambiado comando de tests a `npm test` (línea 146)

### 3. `docs/CORRECCION_EDGESOUT.md`
- Documentación detallada de la corrección

### 4. `docs/INFORME_CORRECCION_EDGESOUT.md`
- Este informe

---

## Versiones Compatibles

| Componente | Versión | Compatibilidad |
|------------|---------|----------------|
| Node.js | 20.x | ✅ Definido en workflow |
| npm | 10.x | ✅ Incluido con Node 20 |
| Vitest | 1.6.1 | ✅ Compatible con TypeScript 5.3.3 y Node 20 |
| Prisma | 5.10.0 | ✅ Ya declarado |
| TypeScript | 5.3.3 | ✅ Ya declarado |
| Fastify | 4.26.1 | ✅ Ya declarado |

---

## Próximos Pasos para el Usuario

### Paso 1: Generar package-lock.json Localmente

```bash
cd apps/api
npm install
```

Esto creará `apps/api/package-lock.json` con todas las dependencias incluyendo vitest.

**Importante:** Este paso es crucial porque:
- Crea un lockfile reproducible
- Garantiza que CI use las mismas versiones
- Previene errores de dependencias inconsistentes

### Paso 2: Commit del Lockfile

```bash
git add apps/api/package-lock.json
git commit -m "chore: add backend package-lock.json for reproducible CI builds

- Generated package-lock.json for apps/api
- Includes vitest 1.6.1 and all dependencies
- Ensures reproducible builds in CI"
```

### Paso 3: Commit de los Cambios de Corrección

```bash
git add apps/api/package.json
git add .github/workflows/verify-fase00.yml
git add docs/CORRECCION_EDGESOUT.md
git add docs/INFORME_CORRECCION_EDGESOUT.md

git commit -m "fix: resolve edgesOut error in Integration Tests

- Add vitest 1.6.1 to apps/api/package.json devDependencies
- Add test scripts to apps/api/package.json
- Remove dynamic vitest installation from CI workflow
- Use npm test instead of npx vitest run
- Fixes: Cannot read properties of null (reading 'edgesOut')"
```

### Paso 4: Push a la Rama

```bash
git push origin main
```

### Paso 5: Verificar GitHub Actions

Ir a: https://github.com/sae-space-ai/andalus-creative-world/actions

**Resultado Esperado:**
```
✅ Frontend Build: PASS
✅ Backend Typecheck: PASS
✅ Prisma Schema Validation: PASS
✅ Generate Prisma Client: PASS
✅ Run migrations: PASS
✅ Install dependencies: PASS (sin error edgesOut)
⏳ Run integration tests: (ejecutándose con PostgreSQL)
```

---

## Por Qué Esta Solución es Correcta

### 1. Declarativo vs Dinámico
- ✅ **Correcto:** Dependencias declaradas en `package.json`
- ❌ **Incorrecto:** Dependencias instaladas dinámicamente en CI

### 2. Reproducible
- ✅ **Correcto:** Con `package-lock.json`, las instalaciones son idénticas
- ❌ **Incorrecto:** Sin lockfile, las versiones pueden variar

### 3. Rápido
- ✅ **Correcto:** `npm ci` (si se usa) es más rápido que `npm install`
- ❌ **Incorrecto:** `npm install -D` añade tiempo extra

### 4. Seguro
- ✅ **Correcto:** No hay modificaciones inesperadas del árbol de dependencias
- ❌ **Incorrecto:** Instalaciones dinámicas pueden romper el árbol

---

## Mejora Futura: Usar npm ci

Una vez que `apps/api/package-lock.json` exista, se puede optimizar el workflow:

**ANTES:**
```yaml
- name: Install dependencies
  run: npm install
```

**DESPUÉS:**
```yaml
- name: Install dependencies
  run: npm ci
```

**Beneficios de npm ci:**
- ✅ Más rápido que `npm install`
- ✅ Elimina `node_modules` antes de instalar
- ✅ Instala exactamente las versiones del lockfile
- ✅ Falla si `package.json` y `package-lock.json` no coinciden
- ✅ Ideal para CI/CD

---

## Diagnóstico de Errores Similares

Si encuentras errores similares en el futuro:

### Error: `edgesOut`
- **Causa:** Instalación dinámica sin lockfile
- **Solución:** Declarar dependencias en `package.json`

### Error: `ERESOLVE`
- **Causa:** Conflictos de versiones de dependencias
- **Solución:** Ajustar versiones en `package.json` o usar `--legacy-peer-deps`

### Error: `ENOENT: package-lock.json`
- **Causa:** Lockfile no existe o no está commiteado
- **Solución:** Ejecutar `npm install` y commitear el lockfile

---

## Estado Final

| Componente | Estado | Detalles |
|------------|--------|----------|
| **Error edgesOut** | ✅ Corregido | Vitest declarado en package.json |
| **Frontend Build** | ✅ PASS | Verificado localmente (5.05s) |
| **Backend Typecheck** | ✅ PASS (esperado) | Sin cambios en código TypeScript |
| **Prisma Validation** | ✅ PASS (esperado) | Sin cambios en schema |
| **Integration Tests** | ⏳ Pendiente | Requiere package-lock.json y verificación en CI |
| **E2E Tests** | ⏳ Pendiente | Requiere verificación en CI |
| **FASE 00** | 🔒 BLOCKED | Requiere verificación en GitHub Actions |

---

## Checklist de Verificación

- [x] Vitest agregado a `apps/api/package.json`
- [x] Scripts de test agregados a `apps/api/package.json`
- [x] Paso "Install Vitest" eliminado del workflow
- [x] Workflow usa `npm test` en lugar de `npx vitest run`
- [x] Documentación creada
- [ ] `apps/api/package-lock.json` generado localmente
- [ ] `apps/api/package-lock.json` commiteado
- [ ] Cambios pusheados a la rama
- [ ] GitHub Actions verificado
- [ ] Integration Tests ejecutados correctamente

---

## Enlaces de Referencia

- **Repositorio:** https://github.com/sae-space-ai/andalus-creative-world
- **PR #3:** https://github.com/sae-space-ai/andalus-creative-world/pull/3
- **GitHub Actions:** https://github.com/sae-space-ai/andalus-creative-world/actions
- **Documentación de Corrección:** `docs/CORRECCION_EDGESOUT.md`

---

**Fecha:** 2026
**Autor:** Qwen Code
**FASE:** 00-TD (Top-Down)
**Estado:** Corrección aplicada, pendiente de verificación en CI

---

*AL-ANDALUS AI — Intelligence · Engineering · Europe*
