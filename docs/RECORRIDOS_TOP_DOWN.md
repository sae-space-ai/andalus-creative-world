# RECORRIDOS TOP-DOWN
## ANDALUS CREATIVE WORLD

---

## Método

Cada recorrido define:
1. **Pantallas** que verá el usuario
2. **Acciones** que realizará
3. **Validaciones** que se aplicarán
4. **Datos** necesarios
5. **Resultados** esperados
6. **Errores** posibles
7. **Servicios** externos requeridos
8. **Estado** de implementación

---

## RECORRIDO A — ACCESO

### Objetivo
El usuario se registra, verifica su correo e inicia sesión.

### Pantallas
- Landing (`/`)
- Register (`/register`)
- VerifyEmail (`/verify-email?token=...`)
- Login (`/login`)
- Dashboard (`/dashboard`)

### Flujo
```
Landing → Register → Email → VerifyEmail → Login → Dashboard
```

### Acciones
1. Usuario abre la landing
2. Hace clic en "Registrarse"
3. Introduce email, contraseña (8+ chars), nombre visible
4. Backend valida con Zod
5. Backend hashea contraseña con Argon2id
6. Backend crea usuario en PostgreSQL
7. Backend genera token de verificación
8. Backend envía email con enlace
9. Usuario hace clic en el enlace
10. Backend verifica token (un solo uso, 24h caducidad)
11. Backend marca email como verificado
12. Usuario inicia sesión
13. Backend crea sesión con cookie HttpOnly
14. Usuario accede al dashboard

### Validaciones
- Email: formato válido, único
- Contraseña: mínimo 8 caracteres
- Nombre: 2-50 caracteres
- Token: un solo uso, caduca en 24h

### Datos
- Email, contraseña (hash), nombre visible
- Token de verificación (hash)
- Sesión (token hash, expiración)

### Resultados
- Usuario en PostgreSQL con email verificado
- Sesión activa con cookie segura
- Dashboard muestra datos reales

### Errores
- Email duplicado → mensaje anti-enumeración
- Contraseña débil → validación rechazada
- Token expirado → mensaje de caducidad
- Credenciales incorrectas → mensaje genérico

### Servicios
- SMTP (Mailpit en dev, proveedor real en prod)

### Estado
- **Frontend:** ✅ IMPLEMENTED (sin simulaciones)
- **Backend:** ✅ IMPLEMENTED (código completo)
- **Runtime:** ❌ NOT_RUN (requiere infraestructura)

---

## RECORRIDO B — CREAR OBRA

### Objetivo
El usuario crea un proyecto privado y sube material autorizado.

### Pantallas
- Dashboard (`/dashboard`)
- Projects (`/projects`)
- ProjectDetail (`/projects/:id`)

### Flujo
```
Dashboard → Nuevo proyecto → Formulario → ProjectDetail
                                              ↓
                                         Declarar derechos
                                         Subir PDF
                                         Ver texto extraído
```

### Acciones
1. Usuario hace clic en "Nuevo proyecto"
2. Selecciona tipo (Película, Cortometraje, etc.)
3. Introduce título y descripción
4. Backend crea proyecto con ownerId de la sesión
5. Usuario accede al detalle
6. Usuario declara derechos (obligatorio)
7. Usuario sube PDF
8. Backend valida formato y tamaño
9. Backend calcula checksum SHA-256
10. Backend almacena archivo privadamente
11. Backend extrae texto con pdf-parse
12. Backend guarda páginas en PostgreSQL
13. Usuario ve texto extraído

### Validaciones
- Título: 1-200 caracteres
- PDF: solo application/pdf, máx 50 MB
- Derechos: declaración obligatoria

### Datos
- Tipo, título, descripción
- Declaración de derechos
- Archivo PDF (checksum, storage path)
- Páginas con texto extraído

### Resultados
- Proyecto en PostgreSQL con ownerId real
- PDF almacenado privadamente
- Texto extraído y persistido
- Acceso solo para propietario

### Errores
- Sin derechos → bloqueo de subida
- No PDF → rechazo
- >50 MB → rechazo
- PDF escaneado → NEEDS_OCR

### Servicios
- Almacenamiento privado

### Estado
- **Frontend:** ✅ IMPLEMENTED
- **Backend:** ✅ IMPLEMENTED
- **Runtime:** ❌ NOT_RUN

---

## RECORRIDO C — PRODUCIR PELÍCULA

### Objetivo
Adaptar un libro a producción audiovisual completa.

### Estado: DESIGNED (no implementado)

### Herramientas
1. Importación de libros
2. Procesamiento por capítulos
3. Analizador narrativo
4. Adaptador a guion
5. Biblia Cinematográfica Viva
6. Storyboard
7. Generación visual
8. Generación de vídeo
9. Voces y diálogos
10. Música y sonido
11. Montaje
12. Renderizado
13. Exportación

### Primera producción
- Identificador: PELICULA_001
- Fuente: Libro que facilitará el propietario

### Dependencias
- Motores de IA
- Infraestructura de renderizado
- Servicios de audio/vídeo

---

## RECORRIDOS D-H — MÓDULOS FUTUROS

Todos en estado **DESIGNED**:

- **D. Cinema+:** Exhibición y distribución
- **E. Community:** Red de creadores
- **F. Festivals:** Concursos artísticos
- **G. Rights:** Gestión de derechos
- **H. Wallet:** Ganancias de creadores

Ver `docs/MODULOS.md` para detalles.

---

## Resumen de estados

| Recorrido | Frontend | Backend | Runtime |
|-----------|----------|---------|---------|
| A. Acceso | ✅ | ✅ | ❌ |
| B. Crear obra | ✅ | ✅ | ❌ |
| C. Producir película | ✅ (info) | ❌ | ❌ |
| D. Estrenar | ✅ (info) | ❌ | ❌ |
| E. Community | ✅ (info) | ❌ | ❌ |
| F. Festivals | ✅ (info) | ❌ | ❌ |
| G. Rights | ✅ (info) | ❌ | ❌ |
| H. Wallet | ✅ (info) | ❌ | ❌ |

---

*Documento de recorridos — Método TOP-DOWN*
