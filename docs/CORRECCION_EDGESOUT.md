# Corrección del Error edgesOut en Integration Tests

## Problema Identificado

**Error en GitHub Actions:**
```
Install Vitest: FAIL
npm install -D vitest
Cannot read properties of null (reading 'edgesOut')
```

## Causa Raíz

El error `edgesOut` ocurre cuando npm intenta modificar un `package-lock.json` que no existe o está corrupto. En nuestro caso:

1. **`apps/api/package-lock.json` NO existe**
2. El workflow ejecutaba `npm install` (crea lockfile temporal)
3. Luego ejecutaba `npm install -D vitest` (intenta modificar ese lockfile)
4. Esto causa el error `edgesOut` porque el árbol de dependencias está en estado inconsistente

## Solución Aplicada

### 1. Agregar Vitest como dependencia declarada

**Archivo:** `apps/api/package.json`

```json
{
  "devDependencies": {
    "@types/node": "^20.11.16",
    "@types/pdf-parse": "^1.1.4",
    "prisma": "^5.10.0",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "vitest": "^1.6.1"  // ← AGREGADO
  },
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",           // ← AGREGADO
    "test:watch": "vitest"          // ← AGREGADO
  }
}
```

### 2. Eliminar instalación dinámica en CI

**Archivo:** `.github/workflows/verify-fase00.yml`

**ANTES:**
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

## Archivos Modificados

1. **`apps/api/package.json`**
   - Agregado `vitest: ^1.6.1` en devDependencies
   - Agregados scripts `test` y `test:watch`

2. **`.github/workflows/verify-fase00.yml`**
   - Eliminado paso "Install Vitest"
   - Cambiado `npx vitest run` por `npm test`

## Pasos para el Usuario

### 1. Generar package-lock.json localmente

```bash
cd apps/api
npm install
```

Esto creará `apps/api/package-lock.json` con todas las dependencias incluyendo vitest.

### 2. Commit del lockfile

```bash
git add apps/api/package-lock.json
git commit -m "chore: add backend package-lock.json for reproducible CI builds"
```

### 3. Push y verificar CI

```bash
git push origin main
```

Luego verificar en GitHub Actions que:
- ✅ Frontend Build: PASS
- ✅ Backend Typecheck: PASS
- ✅ Prisma Schema Validation: PASS
- ✅ Generate Prisma Client: PASS
- ✅ Run migrations: PASS
- ✅ Install dependencies: PASS (sin error edgesOut)
- ⏳ Run integration tests: (requiere PostgreSQL corriendo)

## Por Qué Esta Solución es Correcta

1. **Declarativo vs Dinámico:** Las dependencias están declaradas en `package.json`, no instaladas dinámicamente en CI
2. **Reproducible:** Con `package-lock.json`, las instalaciones son idénticas en todos los entornos
3. **Rápido:** `npm ci` (si se usa) es más rápido que `npm install`
4. **Seguro:** No hay modificaciones inesperadas del árbol de dependencias en CI

## Versiones Compatibles

- **Node.js:** 20.x (definido en workflow)
- **npm:** 10.x (incluido con Node 20)
- **Vitest:** 1.6.1 (compatible con TypeScript 5.3.3 y Node 20)
- **Prisma:** 5.10.0 (ya declarado)
- **TypeScript:** 5.3.3 (ya declarado)

## Próximos Pasos

1. Ejecutar `npm install` en `apps/api/` localmente
2. Commit de `apps/api/package-lock.json`
3. Push a la rama
4. Verificar que Integration Tests se ejecuta correctamente
5. Si falla, revisar logs de PostgreSQL y migraciones

## Notas Importantes

- **NO usar `npm install -D <paquete>` en CI** - siempre declarar en package.json
- **SIEMPR commit package-lock.json** - garantiza builds reproducibles
- **Usar `npm ci` en CI** cuando exista package-lock.json (más rápido y seguro)
- **NO mezclar dependencias** de frontend y backend - son paquetes independientes

---

**Estado:** Corrección aplicada, pendiente de generación de package-lock.json y verificación en CI.

**FASE 00:** 🔒 BLOCKED (requiere verificación en GitHub Actions)
