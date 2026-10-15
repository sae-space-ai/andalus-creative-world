#!/bin/bash
# ANDALUS CREATIVE WORLD — Script de Diagnóstico Completo
# FASE 00 — Verificación de Runtime

set -e

echo "============================================================"
echo "ANDALUS CREATIVE WORLD — DIAGNÓSTICO DE FASE 00"
echo "============================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# ============================================================
# 1. VERIFICACIÓN DEL ENTORNO
# ============================================================

echo "1. VERIFICACIÓN DEL ENTORNO"
echo "----------------------------"

# Directorio actual
echo "Directorio actual: $(pwd)"

# Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_status 0 "Node.js: $NODE_VERSION"
else
    print_status 1 "Node.js: NO DISPONIBLE"
fi

# npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_status 0 "npm: $NPM_VERSION"
else
    print_status 1 "npm: NO DISPONIBLE"
fi

# Docker
if command -v docker &> /dev/null; then
    DOCKER_VERSION=$(docker --version)
    print_status 0 "Docker: $DOCKER_VERSION"
    
    # Verificar si Docker daemon está corriendo
    if docker info &> /dev/null; then
        print_status 0 "Docker daemon: ACTIVO"
    else
        print_status 1 "Docker daemon: INACTIVO"
    fi
else
    print_status 1 "Docker: NO DISPONIBLE"
fi

# Docker Compose
if command -v docker-compose &> /dev/null; then
    COMPOSE_VERSION=$(docker-compose --version)
    print_status 0 "Docker Compose: $COMPOSE_VERSION"
elif docker compose version &> /dev/null; then
    COMPOSE_VERSION=$(docker compose version)
    print_status 0 "Docker Compose: $COMPOSE_VERSION"
else
    print_status 1 "Docker Compose: NO DISPONIBLE"
fi

# PostgreSQL
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version)
    print_status 0 "PostgreSQL client: $PSQL_VERSION"
else
    print_status 1 "PostgreSQL client: NO DISPONIBLE"
fi

# pg_isready
if command -v pg_isready &> /dev/null; then
    print_status 0 "pg_isready: DISPONIBLE"
else
    print_status 1 "pg_isready: NO DISPONIBLE"
fi

echo ""

# ============================================================
# 2. VERIFICACIÓN DE ARCHIVOS
# ============================================================

echo "2. VERIFICACIÓN DE ARCHIVOS"
echo "----------------------------"

# Frontend
if [ -f "package.json" ]; then
    print_status 0 "Frontend package.json: EXISTE"
else
    print_status 1 "Frontend package.json: NO EXISTE"
fi

if [ -f "src/App.tsx" ]; then
    print_status 0 "Frontend App.tsx: EXISTE"
else
    print_status 1 "Frontend App.tsx: NO EXISTE"
fi

# Backend
if [ -f "apps/api/package.json" ]; then
    print_status 0 "Backend package.json: EXISTE"
else
    print_status 1 "Backend package.json: NO EXISTE"
fi

if [ -f "apps/api/src/index.ts" ]; then
    print_status 0 "Backend index.ts: EXISTE"
else
    print_status 1 "Backend index.ts: NO EXISTE"
fi

# Prisma
if [ -f "prisma/schema.prisma" ]; then
    print_status 0 "Prisma schema: EXISTE"
else
    print_status 1 "Prisma schema: NO EXISTE"
fi

# Docker Compose
if [ -f "docker-compose.yml" ]; then
    print_status 0 "docker-compose.yml: EXISTE"
else
    print_status 1 "docker-compose.yml: NO EXISTE"
fi

# Environment
if [ -f ".env.example" ]; then
    print_status 0 ".env.example: EXISTE"
else
    print_status 1 ".env.example: NO EXISTE"
fi

if [ -f ".env" ]; then
    print_status 0 ".env: EXISTE (configuración local)"
else
    echo -e "${YELLOW}!${NC} .env: NO EXISTE (copiar desde .env.example)"
fi

echo ""

# ============================================================
# 3. DEPENDENCIAS
# ============================================================

echo "3. DEPENDENCIAS"
echo "---------------"

# Frontend dependencies
if [ -d "node_modules" ]; then
    print_status 0 "Frontend node_modules: EXISTE"
else
    print_status 1 "Frontend node_modules: NO EXISTE (ejecutar: npm install)"
fi

# Backend dependencies
if [ -d "apps/api/node_modules" ]; then
    print_status 0 "Backend node_modules: EXISTE"
else
    print_status 1 "Backend node_modules: NO EXISTE (ejecutar: cd apps/api && npm install)"
fi

echo ""

# ============================================================
# 4. PRISMA
# ============================================================

echo "4. PRISMA"
echo "---------"

cd apps/api

# Validar schema
if npx prisma validate &> /dev/null; then
    print_status 0 "Prisma schema: VÁLIDO"
else
    print_status 1 "Prisma schema: INVÁLIDO"
fi

# Verificar si el cliente está generado
if [ -d "node_modules/.prisma/client" ]; then
    print_status 0 "Prisma client: GENERADO"
else
    print_status 1 "Prisma client: NO GENERADO (ejecutar: npx prisma generate)"
fi

cd ../..

echo ""

# ============================================================
# 5. BASE DE DATOS
# ============================================================

echo "5. BASE DE DATOS"
echo "----------------"

# Verificar si PostgreSQL está accesible
if command -v pg_isready &> /dev/null; then
    if pg_isready -h localhost -p 5432 &> /dev/null; then
        print_status 0 "PostgreSQL localhost:5432: ACCESIBLE"
        
        # Intentar conectar
        if command -v psql &> /dev/null; then
            if psql -h localhost -U andalus -d andalus_creative_world -c "SELECT 1" &> /dev/null; then
                print_status 0 "Conexión a BD: EXITOSA"
            else
                print_status 1 "Conexión a BD: FALLIDA (verificar credenciales)"
            fi
        fi
    else
        print_status 1 "PostgreSQL localhost:5432: NO ACCESIBLE"
    fi
else
    echo -e "${YELLOW}!${NC} pg_isready no disponible, no se puede verificar PostgreSQL"
fi

echo ""

# ============================================================
# 6. PUERTOS
# ============================================================

echo "6. PUERTOS"
echo "----------"

# Verificar puertos comunes
for port in 3000 3001 5432 8025; do
    if lsof -i :$port &> /dev/null; then
        echo -e "${YELLOW}!${NC} Puerto $port: EN USO"
    else
        print_status 0 "Puerto $port: DISPONIBLE"
    fi
done

echo ""

# ============================================================
# 7. BUILD FRONTEND
# ============================================================

echo "7. BUILD FRONTEND"
echo "-----------------"

if npm run build &> /dev/null; then
    print_status 0 "Frontend build: EXITOSO"
else
    print_status 1 "Frontend build: FALLIDO"
fi

echo ""

# ============================================================
# 8. TYPECHECK BACKEND
# ============================================================

echo "8. TYPECHECK BACKEND"
echo "--------------------"

cd apps/api

if npx tsc --noEmit &> /dev/null; then
    print_status 0 "Backend typecheck: EXITOSO"
else
    print_status 1 "Backend typecheck: FALLIDO"
fi

cd ../..

echo ""

# ============================================================
# 9. TESTS UNITARIOS
# ============================================================

echo "9. TESTS UNITARIOS"
echo "------------------"

cd apps/api

if [ -f "tests/unit.test.ts" ]; then
    print_status 0 "Tests unitarios: EXISTEN"
    
    if npx vitest run &> /dev/null; then
        print_status 0 "Tests unitarios: PASADOS"
    else
        print_status 1 "Tests unitarios: FALLIDOS"
    fi
else
    print_status 1 "Tests unitarios: NO EXISTEN"
fi

cd ../..

echo ""

# ============================================================
# 10. RESUMEN
# ============================================================

echo "============================================================"
echo "RESUMEN DEL DIAGNÓSTICO"
echo "============================================================"
echo ""
echo "Para completar la verificación de FASE 00, ejecute:"
echo ""
echo "1. Iniciar infraestructura:"
echo "   docker-compose up -d postgres mailpit"
echo ""
echo "2. Configurar base de datos:"
echo "   cd apps/api"
echo "   cp ../../.env.example .env"
echo "   npx prisma generate"
echo "   npx prisma migrate dev --name init"
echo ""
echo "3. Arrancar backend:"
echo "   npm run dev"
echo ""
echo "4. Arrancar frontend (en otra terminal):"
echo "   cd ../.."
echo "   npm run dev"
echo ""
echo "5. Verificar:"
echo "   curl http://localhost:3001/api/v1/health"
echo ""
echo "============================================================"
