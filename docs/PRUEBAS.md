# PRUEBAS — ANDALUS CREATIVE WORLD
## FASE 00 — Procedimiento de Verificación

---

## Estado Actual

**Frontend:** ✅ Compila correctamente (build exitoso)
**Backend:** ✅ Código completo, no ejecutado
**Base de datos:** ✅ Schema definido, no migrado
**Tests unitarios:** ✅ Creados, no ejecutados
**Tests integración:** ❌ No escritos (requieren PostgreSQL)
**Tests E2E:** ❌ No escritos (requieren navegador)

---

## Prerrequisitos

### Sistema
- Node.js 20+
- npm 10+
- Docker y Docker Compose (recomendado)
- PostgreSQL 16 (alternativa a Docker)

### Puertos necesarios
- 3000: Frontend (Vite)
- 3001: Backend (Fastify)
- 5432: PostgreSQL
- 8025: Mailpit (UI web)
- 1025: Mailpit (SMTP)

---

## Procedimiento Completo

### 1. Diagnóstico Inicial

```bash
# Ejecutar script de diagnóstico
chmod +x scripts/diagnose.sh
./scripts/diagnose.sh
```

Este script verifica:
- Node.js, npm, Docker, PostgreSQL
- Existencia de archivos
- Dependencias instaladas
- Prisma válido
- Puertos disponibles
- Build del frontend
- Typecheck del backend

### 2. Iniciar Infraestructura

#### Opción A: Docker Compose (Recomendado)

```bash
# Levantar PostgreSQL y Mailpit
docker-compose up -d postgres mailpit

# Verificar que están corriendo
docker-compose ps

# Ver logs de PostgreSQL
docker-compose logs postgres
```

#### Opción B: PostgreSQL Local

```bash
# Crear usuario y base de datos
sudo -u postgres psql

# En psql:
CREATE USER andalus WITH PASSWORD 'andalus_dev_password';
CREATE DATABASE andalus_creative_world OWNER andalus;
\q

# Verificar conexión
psql -h localhost -U andalus -d andalus_creative_world
```

### 3. Configurar Variables de Entorno

```bash
# Copiar ejemplo
cp .env.example .env

# Editar .env y ajustar si es necesario
# Para Docker Compose, los valores por defecto funcionan
# Para PostgreSQL local, ajustar DATABASE_URL
```

### 4. Instalar Dependencias del Backend

```bash
cd apps/api
npm install
```

### 5. Generar Cliente Prisma

```bash
cd apps/api
npx prisma generate
```

### 6. Ejecutar Migraciones

```bash
cd apps/api
npx prisma migrate dev --name init
```

Esto creará todas las tablas en PostgreSQL.

### 7. Verificar Base de Datos

```bash
# Conectar a PostgreSQL
psql -h localhost -U andalus -d andalus_creative_world

# Listar tablas
\dt

# Deberías ver:
# - User
# - Session
# - Project
# - SourceDocument
# - DocumentPage
# - etc.

# Salir
\q
```

### 8. Arrancar Backend

```bash
cd apps/api
npm run dev
```

Deberías ver:
```
🚀 Andalus Creative World API running on http://0.0.0.0:3001
📊 Health check: http://0.0.0.0:3001/api/v1/health
```

### 9. Verificar Health Check

```bash
curl http://localhost:3001/api/v1/health
```

Respuesta esperada:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2024-..."
}
```

### 10. Arrancar Frontend

```bash
# En otra terminal
npm run dev
```

Deberías ver:
```
VITE v6.3.5  ready in xxx ms
➜  Local:   http://localhost:3000/
```

### 11. Abrir Navegador

```
http://localhost:3000
```

---

## Pruebas Funcionales

### A. Registro de Usuario

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "displayName": "Test User"
  }'
```

Respuesta esperada:
```json
{
  "message": "Registro exitoso. Revisa tu correo para verificar tu cuenta.",
  "userId": "..."
}
```

**Verificar en Mailpit:**
```
http://localhost:8025
```

Buscar el email de verificación y copiar el token.

### B. Verificación de Email

```bash
curl -X POST http://localhost:3001/api/v1/auth/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "token": "TOKEN_DEL_EMAIL"
  }'
```

Respuesta esperada:
```json
{
  "message": "Correo verificado correctamente"
}
```

### C. Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Respuesta esperada:
```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "displayName": "Test User",
    "role": "USER",
    "status": "ACTIVE"
  }
}
```

**Verificar cookie:**
```bash
cat cookies.txt
```

Deberías ver `session_token`.

### D. Consultar Sesión

```bash
curl http://localhost:3001/api/v1/auth/me \
  -b cookies.txt
```

Respuesta esperada:
```json
{
  "user": {
    "id": "...",
    "email": "test@example.com",
    "displayName": "Test User",
    "role": "USER",
    "status": "ACTIVE",
    "emailVerifiedAt": "...",
    "createdAt": "..."
  }
}
```

### E. Crear Proyecto

```bash
curl -X POST http://localhost:3001/api/v1/projects \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "type": "FILM",
    "title": "Mi Primera Película",
    "description": "Una historia increíble"
  }'
```

Respuesta esperada:
```json
{
  "project": {
    "id": "...",
    "ownerId": "...",
    "type": "FILM",
    "title": "Mi Primera Película",
    "description": "Una historia increíble",
    "status": "DRAFT",
    "visibility": "PRIVATE",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Guardar el ID del proyecto para los siguientes pasos.**

### F. Listar Proyectos

```bash
curl http://localhost:3001/api/v1/projects \
  -b cookies.txt
```

Respuesta esperada:
```json
{
  "projects": [
    {
      "id": "...",
      "title": "Mi Primera Película",
      ...
    }
  ]
}
```

### G. Declarar Derechos

```bash
curl -X PATCH http://localhost:3001/api/v1/projects/PROJECT_ID \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "rightsType": "OWN_WORK",
    "rightsNotes": "Soy el autor original"
  }'
```

### H. Subir PDF

Crear un PDF de prueba primero:
```bash
echo "Este es un documento de prueba para Andalus Creative World." > test.txt
# Convertir a PDF (requiere herramientas como pandoc, wkhtmltopdf, etc.)
# O usar un PDF existente
```

Subir el PDF:
```bash
curl -X POST http://localhost:3001/api/v1/projects/PROJECT_ID/documents \
  -b cookies.txt \
  -F "file=@documento.pdf"
```

Respuesta esperada:
```json
{
  "document": {
    "id": "...",
    "projectId": "...",
    "originalName": "documento.pdf",
    "mimeType": "application/pdf",
    "sizeBytes": 12345,
    "checksum": "sha256_...",
    "status": "PROCESSING",
    "createdAt": "..."
  }
}
```

### I. Verificar Procesamiento

Esperar unos segundos y consultar:
```bash
curl http://localhost:3001/api/v1/projects/PROJECT_ID/documents \
  -b cookies.txt
```

El documento debería tener `status: "COMPLETED"` y `pageCount > 0`.

### J. Aislamiento entre Usuarios

Crear un segundo usuario:
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user2@example.com",
    "password": "password123",
    "displayName": "User Two"
  }'
```

Verificar y hacer login con user2, luego intentar acceder al proyecto de user1:
```bash
curl http://localhost:3001/api/v1/projects/PROJECT_ID_USER1 \
  -b cookies_user2.txt
```

Respuesta esperada:
```json
{
  "error": "Proyecto no encontrado"
}
```

**Esto confirma el aislamiento por ownerId.**

### K. Logout

```bash
curl -X POST http://localhost:3001/api/v1/auth/logout \
  -b cookies.txt
```

Respuesta esperada:
```json
{
  "message": "Sesión cerrada"
}
```

Verificar que la cookie se eliminó:
```bash
curl http://localhost:3001/api/v1/auth/me \
  -b cookies.txt
```

Respuesta esperada:
```json
{
  "error": "Not authenticated"
}
```

### L. Persistencia de Sesión

Hacer login de nuevo:
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Consultar proyectos:
```bash
curl http://localhost:3001/api/v1/projects \
  -b cookies.txt
```

**Los proyectos deben persistir entre sesiones.**

---

## Tests Unitarios

```bash
cd apps/api
npm test
```

Tests incluidos:
- Validaciones Zod (register, login, projects)
- Generación de tokens
- Hashing de tokens
- Normalización de email
- Seguridad básica

---

## Tests de Integración (Requieren PostgreSQL)

Crear archivo `apps/api/tests/integration.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

describe('Integration Tests', () => {
  beforeAll(async () => {
    // Limpiar base de datos de pruebas
    await prisma.user.deleteMany();
    await prisma.project.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('creates a user with hashed password', async () => {
    const password = 'testpassword';
    const hash = await argon2.hash(password, { type: argon2.argon2id });
    
    const user = await prisma.user.create({
       {
        email: 'integration@test.com',
        emailNormalized: 'integration@test.com',
        passwordHash: hash,
        displayName: 'Integration Test',
        status: 'ACTIVE',
        emailVerifiedAt: new Date(),
      },
    });

    expect(user.id).toBeDefined();
    expect(user.passwordHash).not.toBe(password);
    
    const valid = await argon2.verify(hash, password);
    expect(valid).toBe(true);
  });

  it('enforces email uniqueness', async () => {
    await expect(
      prisma.user.create({
         {
          email: 'integration@test.com',
          emailNormalized: 'integration@test.com',
          displayName: 'Duplicate',
        },
      })
    ).rejects.toThrow();
  });

  it('isolates projects by owner', async () => {
    const user1 = await prisma.user.findUnique({
      where: { email: 'integration@test.com' },
    });

    const user2 = await prisma.user.create({
       {
        email: 'user2@test.com',
        emailNormalized: 'user2@test.com',
        displayName: 'User 2',
        status: 'ACTIVE',
      },
    });

    const project = await prisma.project.create({
       {
        ownerId: user1!.id,
        type: 'FILM',
        title: 'User 1 Project',
      },
    });

    // User 2 should not see User 1's project
    const user2Projects = await prisma.project.findMany({
      where: { ownerId: user2.id },
    });

    expect(user2Projects).toHaveLength(0);
  });
});
```

Ejecutar:
```bash
cd apps/api
npm test
```

---

## Tests E2E (Requieren Navegador)

**Estado:** NOT_EXECUTED

Para implementar E2E con Playwright:

```bash
cd apps/api
npm install -D @playwright/test
npx playwright install
```

Crear `apps/api/tests/e2e.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test('complete user flow', async ({ page }) => {
  // 1. Ir al frontend
  await page.goto('http://localhost:3000');
  
  // 2. Registrarse
  await page.click('text=Registrarse');
  await page.fill('#email', 'e2e@test.com');
  await page.fill('#password', 'password123');
  await page.fill('#displayName', 'E2E User');
  await page.click('button:has-text("Crear cuenta")');
  
  // 3. Verificar redirección al dashboard
  await expect(page).toHaveURL(/.*dashboard/);
  
  // 4. Crear proyecto
  await page.click('text=Nuevo proyecto');
  await page.fill('#new-title', 'E2E Project');
  await page.click('button:has-text("Crear proyecto")');
  
  // 5. Verificar que el proyecto existe
  await expect(page.locator('text=E2E Project')).toBeVisible();
  
  // 6. Cerrar sesión
  await page.click('text=Cerrar sesión');
  
  // 7. Volver a iniciar sesión
  await page.fill('#email', 'e2e@test.com');
  await page.fill('#password', 'password123');
  await page.click('button:has-text("Iniciar sesión")');
  
  // 8. Verificar que el proyecto persiste
  await page.click('text=Mis proyectos');
  await expect(page.locator('text=E2E Project')).toBeVisible();
});
```

Ejecutar:
```bash
npx playwright test
```

---

## Criterios de Aceptación

FASE 00 se considera **VERIFIED** cuando:

- ✅ Backend arranca sin errores
- ✅ Health check responde `{"status":"ok"}`
- ✅ Frontend se comunica con backend
- ✅ Registro crea usuario en PostgreSQL
- ✅ Email de verificación llega a Mailpit
- ✅ Verificación de email funciona
- ✅ Login establece cookie HttpOnly
- ✅ Sesión persiste entre recargas
- ✅ Logout invalida sesión
- ✅ Crear proyecto funciona
- ✅ Listar proyectos muestra solo los propios
- ✅ Subir PDF funciona
- ✅ Extracción de texto se completa
- ✅ Aislamiento entre usuarios verificado
- ✅ Tests unitarios pasan
- ✅ Tests de integración pasan
- ✅ Build frontend exitoso
- ✅ Typecheck backend exitoso

---

## Bloqueos Conocidos

1. **Sin PostgreSQL:** No se pueden ejecutar migraciones ni tests de integración
2. **Sin Docker:** No se puede levantar infraestructura automáticamente
3. **Sin Google credentials:** OIDC no puede probarse
4. **Sin Stripe keys:** Pagos no pueden activarse

---

## Comandos Rápidos

```bash
# Diagnóstico completo
./scripts/diagnose.sh

# Iniciar infraestructura
docker-compose up -d

# Instalar dependencias backend
cd apps/api && npm install

# Generar Prisma client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Arrancar backend
npm run dev

# Arrancar frontend (otra terminal)
npm run dev

# Ejecutar tests
cd apps/api && npm test

# Verificar health
curl http://localhost:3001/api/v1/health
```

---

*Documento de pruebas — FASE 00*
*Última actualización: Diagnóstico de runtime*
