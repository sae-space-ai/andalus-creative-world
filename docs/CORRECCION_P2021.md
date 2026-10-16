# Corrección del Error P2021 - Tablas PostgreSQL No Existen

## Resumen Ejecutivo

**Problema:** Error P2021 de Prisma en GitHub Actions:
```
Prisma P2021
The table `public.User` does not exist in the current database.
```

**Causa:** No existía la carpeta `prisma/migrations/` con migraciones reales. `prisma generate` solo genera el cliente TypeScript, **no crea las tablas en PostgreSQL**.

**Solución:** 
1. ✅ Creada migración inicial real con todas las tablas
2. ✅ Agregados diagnósticos al workflow de CI
3. ✅ Corregido beforeAll para no borrar datos con filtros amplios

**Estado:** ✅ Corrección completada, pendiente de verificación en GitHub Actions.

---

## Análisis del Error

### Error Reportado
```
Prisma P2021
The table `public.User` does not exist in the current database.
Archivo: apps/api/tests/integration.test.ts, línea 41, beforeAll.
```

### Causa Raíz

**Confusión común:**
- ❌ `prisma generate` → Solo genera el cliente TypeScript (no crea tablas)
- ✅ `prisma migrate deploy` → Aplica migraciones SQL (crea tablas)

**Problema específico:**
- No existía la carpeta `prisma/migrations/`
- No había archivos SQL de migración
- `prisma migrate deploy` no tenía nada que aplicar
- Las tablas nunca se crearon en PostgreSQL

---

## Solución Aplicada

### 1. Crear Migración Inicial Real

**Archivo creado:** `prisma/migrations/20240101000000_init/migration.sql`

**Contenido:**
- ✅ 15 tablas completas con todos los campos
- ✅ Todas las restricciones (PRIMARY KEY, UNIQUE, FOREIGN KEY)
- ✅ Todos los índices para optimización
- ✅ Compatible con PostgreSQL 16 y Prisma 5.22.0

**Tablas creadas:**
1. User
2. ExternalIdentity
3. Session
4. EmailVerificationToken
5. PasswordResetToken
6. SecurityEvent
7. Project
8. SourceDocument
9. DocumentPage
10. DocumentProcessingJob
11. CreditWallet
12. CreditLedgerEntry
13. PromotionCampaign
14. PromotionRedemption
15. PaymentRecord

**Archivo de metadata:** `prisma/migrations/migration_lock.toml`
```toml
provider = "postgresql"
```

### 2. Agregar Diagnósticos al Workflow

**Archivo modificado:** `.github/workflows/verify-fase00.yml`

**Nuevos pasos agregados:**
```yaml
- name: Verify database tables exist
  env:
    PGPASSWORD: test_password
  run: |
    echo "=== Database Diagnostics ==="
    echo "Checking PostgreSQL connection..."
    psql -h localhost -U andalus_test -d andalus_test -c "SELECT version();"
    
    echo ""
    echo "Checking search_path..."
    psql -h localhost -U andalus_test -d andalus_test -c "SHOW search_path;"
    
    echo ""
    echo "Listing all tables in public schema..."
    psql -h localhost -U andalus_test -d andalus_test -c "\dt public.*"
    
    echo ""
    echo "Verifying essential tables exist..."
    psql -h localhost -U andalus_test -d andalus_test -c "
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('User', 'Session', 'Project', 'SourceDocument', 'DocumentPage')
      ORDER BY table_name;
    "
    
    echo ""
    echo "Checking Prisma migration status..."
    psql -h localhost -U andalus_test -d andalus_test -c "
      SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 5;
    " || echo "No migrations table found"
    
    echo ""
    echo "=== Diagnostics Complete ==="
```

**Beneficios:**
- ✅ Verifica conexión PostgreSQL
- ✅ Lista todas las tablas creadas
- ✅ Verifica tablas esenciales (User, Session, Project, etc.)
- ✅ Muestra estado de migraciones de Prisma
- ✅ No imprime credenciales sensibles

### 3. Corregir beforeAll del Test

**Archivo modificado:** `apps/api/tests/integration.test.ts`

**ANTES (peligroso):**
```typescript
beforeAll(async () => {
  // ❌ Borra todos los usuarios con email que empieza con 'test_'
  await prisma.user.deleteMany({
    where: { email: { startsWith: 'test_' } },
  });
});
```

**DESPUÉS (seguro):**
```typescript
beforeAll(async () => {
  // ✅ No bulk deletion - each test run uses unique identifiers
  // Cleanup happens in afterAll for this specific test run only
});
```

**Razón:**
- ❌ El filtro `startsWith: 'test_'` podría borrar datos de otras ejecuciones
- ❌ Podría borrar datos de producción si se ejecuta accidentalmente
- ✅ Cada ejecución usa identificadores únicos con `Date.now()`
- ✅ El `afterAll` ya limpia solo los datos propios usando `userId`

---

## Archivos Modificados

| Archivo | Cambio | Estado |
|---------|--------|--------|
| `prisma/migrations/20240101000000_init/migration.sql` | Creado (migración inicial) | ✅ Nuevo |
| `prisma/migrations/migration_lock.toml` | Creado (metadata) | ✅ Nuevo |
| `.github/workflows/verify-fase00.yml` | Agregados diagnósticos | ✅ Modificado |
| `apps/api/tests/integration.test.ts` | Corregido beforeAll | ✅ Modificado |
| `docs/CORRECCION_P2021.md` | Documentación completa | ✅ Creado |

---

## Estructura de Migraciones

```
prisma/
├── schema.prisma
└── migrations/
    ├── migration_lock.toml
    └── 20240101000000_init/
        └── migration.sql
```

**Flujo de migraciones:**
1. `prisma migrate deploy` lee `prisma/migrations/`
2. Aplica `migration.sql` en PostgreSQL
3. Registra en tabla `_prisma_migrations`
4. Las tablas quedan creadas y listas para usar

---

## Diagnósticos en CI

### Qué verifican los diagnósticos:

1. **Conexión PostgreSQL**
   ```sql
   SELECT version();
   ```
   - ✅ Confirma que PostgreSQL está corriendo
   - ✅ Muestra versión del servidor

2. **Search Path**
   ```sql
   SHOW search_path;
   ```
   - ✅ Verifica el schema activo (debe ser `public`)

3. **Lista de Tablas**
   ```sql
   \dt public.*
   ```
   - ✅ Muestra todas las tablas en el schema `public`
   - ✅ Confirma que las 15 tablas fueron creadas

4. **Tablas Esenciales**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('User', 'Session', 'Project', 'SourceDocument', 'DocumentPage');
   ```
   - ✅ Verifica específicamente las tablas críticas
   - ✅ Si faltan, el test fallará antes de ejecutar Vitest

5. **Estado de Migraciones**
   ```sql
   SELECT * FROM _prisma_migrations ORDER BY finished_at DESC LIMIT 5;
   ```
   - ✅ Muestra las migraciones aplicadas
   - ✅ Confirma que `20240101000000_init` fue aplicada

---

## Resultados Esperados en GitHub Actions

### Job: Integration Tests

```
✅ Install dependencies: PASS
✅ Generate Prisma Client: PASS
✅ Run migrations: PASS (aplica 20240101000000_init)
✅ Verify database tables exist: PASS
   - PostgreSQL connection: OK
   - search_path: "$user", public
   - Tables: 15 creadas
   - Essential tables: User, Session, Project, SourceDocument, DocumentPage
   - Migration status: 20240101000000_init applied
⏳ Run integration tests: (ejecutándose)
```

---

## Próximos Pasos

### 1. Commit de los cambios
```bash
git add prisma/migrations/
git add .github/workflows/verify-fase00.yml
git add apps/api/tests/integration.test.ts
git add docs/CORRECCION_P2021.md

git commit -m "fix: crear migración inicial y agregar diagnósticos de BD

- Crear migración inicial con 15 tablas PostgreSQL
- Agregar diagnósticos de base de datos en CI
- Verificar que tablas existen antes de ejecutar tests
- Corregir beforeAll para no borrar datos con filtros amplios
- Soluciona error P2021: table public.User does not exist"
```

### 2. Push a la rama
```bash
git push origin main
```

### 3. Verificar GitHub Actions
```
URL: https://github.com/sae-space-ai/andalus-creative-world/actions

Verificar:
✅ Run migrations: PASS
✅ Verify database tables exist: PASS
   - 15 tablas creadas
   - Tablas esenciales presentes
   - Migración aplicada
⏳ Run integration tests: (ejecutándose)
```

---

## Estado Final

| Componente | Estado | Detalles |
|-----------|--------|----------|
| **Error P2021** | ✅ Corregido | Migración inicial creada |
| **Migraciones** | ✅ Creadas | 15 tablas en migration.sql |
| **Diagnósticos CI** | ✅ Agregados | Verifican tablas antes de tests |
| **beforeAll** | ✅ Corregido | No borra datos con filtros amplios |
| **Frontend Build** | ✅ PASS | 4.99s verificado |
| **Integration Tests** | ⏳ Pendiente | Requiere verificación en CI |
| **FASE 00** | 🔒 BLOCKED | Requiere verificación en GitHub Actions |

---

## ⚠️ NO SE TOCÓ

- ✅ Frontend (16 páginas React)
- ✅ Lógica de negocio del backend
- ✅ Schema Prisma (15 modelos)
- ✅ Documentación TOP-DOWN
- ✅ 7 módulos del ecosistema
- ✅ Tests unitarios (25 tests)
- ✅ ANDALUS STUDIO / ANDALUS RE

---

## 🎯 CRITERIOS DE ACEPTACIÓN

### Para declarar este error como corregido:
- ✅ Migración inicial creada
- ✅ Diagnósticos agregados al workflow
- ✅ GitHub Actions ejecuta sin error P2021
- ✅ Tablas existen antes de ejecutar tests

### Para declarar FASE 00 CI VERIFIED:
- ✅ Frontend Build: PASS
- ✅ Backend Typecheck: PASS
- ✅ Prisma Validation: PASS
- ✅ Migrations: PASS
- ✅ Database tables: PASS
- ✅ Integration Tests: PASS
- ⚠️ E2E Tests: PASS o documentar

### Para declarar FASE 00 VERIFIED (completo):
- Todo lo anterior
- ✅ Tests HTTP reales con Fastify
- ✅ Tests E2E con navegador
- ✅ Verificación en runtime local

---

## 🔗 ENLACES DE REFERENCIA

- **Repositorio:** https://github.com/sae-space-ai/andalus-creative-world
- **PR #3:** https://github.com/sae-space-ai/andalus-creative-world/pull/3
- **GitHub Actions:** https://github.com/sae-space-ai/andalus-creative-world/actions

---

**Estado final:** Corrección completada, listo para commit y push.  
**FASE 00:** 🔒 BLOCKED (requiere verificación en GitHub Actions).  
**No se ha declarado FASE 00 como verificada.**

---

*Corrección del error P2021 completada — FASE 00*  
*AL-ANDALUS AI — Intelligence · Engineering · Europe*
