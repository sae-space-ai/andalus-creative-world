# EXPERIENCIA DE USUARIO — TOP-DOWN
## ANDALUS CREATIVE WORLD

---

## MÉTODO TOP-DOWN

Definir primero la experiencia final del usuario;
después pantallas, acciones, contratos,
tecnología y pruebas.

No desarrollar infraestructura aislada
sin necesidad funcional definida.

No presentar simulaciones como funciones operativas.

---

## RECORRIDO A — ACCESO

### Pantallas
1. Landing (`/`)
2. Register (`/register`)
3. VerifyEmail (`/verify-email?token=...`)
4. Login (`/login`)
5. ForgotPassword (`/forgot-password`)
6. ResetPassword (`/reset-password?token=...`)
7. Dashboard (`/dashboard`)

### Flujo completo
```
Landing → Register → (email de verificación) → VerifyEmail → Login → Dashboard
                                                                    ↓
                                                              Logout → Login
```

### Acciones del usuario
1. Abre la landing
2. Hace clic en "Registrarse"
3. Introduce email, contraseña y nombre visible
4. Recibe correo con enlace de verificación
5. Hace clic en el enlace
6. El sistema verifica el token contra PostgreSQL
7. El correo queda marcado como verificado
8. Inicia sesión con sus credenciales
9. El backend crea sesión con cookie HttpOnly
10. Accede al dashboard con sus datos reales

### Validaciones
- Email: formato válido, único
- Contraseña: mínimo 8 caracteres
- Nombre visible: 2-50 caracteres
- Token de verificación: un solo uso, caduca en 24h

### Datos necesarios
- Email
- Contraseña (hasheada con Argon2id)
- Nombre visible
- Token de verificación (hash almacenado)

### Resultados esperados
- Usuario creado en PostgreSQL
- Email verificado en la base de datos
- Sesión activa con cookie segura
- Dashboard muestra datos reales del usuario

### Errores posibles
- Email ya registrado → mensaje anti-enumeración
- Contraseña débil → validación en frontend y backend
- Token expirado → mensaje de caducidad
- Token ya usado → mensaje de invalidez
- Credenciales incorrectas → mensaje genérico

### Servicios externos
- SMTP (Mailpit en desarrollo, proveedor real en producción)

### Estado de implementación
- **Frontend:** IMPLEMENTED (sin simulaciones)
- **Backend:** IMPLEMENTED (código completo)
- **Verificación en runtime:** NOT_RUN (requiere infraestructura)

---

## RECORRIDO B — CREAR OBRA

### Pantallas
1. Dashboard (`/dashboard`)
2. Projects (`/projects`)
3. ProjectDetail (`/projects/:id`)

### Flujo
```
Dashboard → "Nuevo proyecto" → Formulario → ProjectDetail
                                              ↓
                                         Editar título/descripción
                                         Declarar derechos
                                         Subir PDF
                                         Ver texto extraído
```

### Acciones del usuario
1. Desde el dashboard, hace clic en "Nuevo proyecto"
2. Selecciona tipo de proyecto (Película, Cortometraje, etc.)
3. Introduce título y descripción
4. El backend crea el proyecto con ownerId de la sesión
5. Accede al detalle del proyecto
6. Declara derechos sobre la obra (obligatorio antes de subir)
7. Sube un archivo PDF
8. El backend valida, almacena y procesa el documento
9. El texto extraído se muestra por páginas
10. Puede editar título y descripción
11. Puede eliminar el proyecto con confirmación

### Validaciones
- Título: 1-200 caracteres
- Descripción: 0-2000 caracteres
- Tipo: enum válido
- PDF: solo application/pdf, máximo 50 MB
- Derechos: declaración obligatoria antes de subir

### Datos necesarios
- Tipo de proyecto
- Título
- Descripción
- Declaración de derechos (OWN_WORK, PUBLIC_DOMAIN, LICENSED, AUTHORIZED)
- Archivo PDF

### Resultados esperados
- Proyecto creado en PostgreSQL con ownerId real
- PDF almacenado privadamente
- Checksum SHA-256 registrado
- Texto extraído y persistido por páginas
- Proyecto visible solo para el propietario

### Errores posibles
- Sin declaración de derechos → bloqueo de subida
- Archivo no PDF → rechazo
- Archivo mayor de 50 MB → rechazo
- PDF escaneado sin texto → estado NEEDS_OCR
- Error de procesamiento → estado FAILED

### Servicios externos
- Almacenamiento privado de archivos

### Estado de implementación
- **Frontend:** IMPLEMENTED
- **Backend:** IMPLEMENTED
- **Verificación en runtime:** NOT_RUN

---

## RECORRIDO C — PRODUCIR PELÍCULA (Andalus Cinema)

### Estado: DESIGNED (no implementado)

### Herramientas previstas
1. Importación de libros
2. Lector PDF y documentos
3. Procesamiento por capítulos
4. Analizador narrativo
5. Adaptador literario-cinematográfico
6. Generador de sinopsis
7. Editor de tratamiento
8. Editor de guion
9. Diseñador de personajes
10. Diseñador de escenarios
11. Biblia Cinematográfica Viva
12. Control de continuidad
13. Storyboard
14. Planificador de escenas
15. Planificador de planos
16. Generación de imágenes
17. Generación de vídeo
18. Gestión de tomas y versiones
19. Dirección de voces y diálogos
20. Generación musical
21. Diseño de sonido
22. Sincronización audiovisual
23. Montaje y edición
24. Control de calidad
25. Renderizado
26. Exportación

### Primera producción de referencia
- Identificador: PELICULA_001
- Fuente: Libro original que facilitará el propietario
- No se inventará el contenido

### Dependencias
- Motores de IA para generación
- Infraestructura de renderizado
- Almacenamiento de assets
- Servicios de audio y vídeo

---

## RECORRIDO D — ESTRENAR (Andalus Cinema+)

### Estado: DESIGNED (no implementado)

### Capacidades previstas
- Catálogo de obras
- Fichas con tráilers
- Estrenos programados
- Reproducción autorizada
- Distribución territorial
- Estadísticas verificables

### Regla clave
- Crear una película NO la publica automáticamente
- El creador decide cuándo y cómo distribuir

---

## RECORRIDO E — COMUNIDAD (Andalus Community)

### Estado: DESIGNED (no implementado)

### Capacidades previstas
- Perfiles artísticos
- Portfolios
- Publicaciones explícitas
- Seguidores
- Equipos de colaboración
- Mensajería
- Moderación

### Regla clave
- Los manuscritos privados nunca se comparten implícitamente

---

## RECORRIDO F — FESTIVALES (Andalus Festivals)

### Estado: DESIGNED (no implementado)

### Capacidades previstas
- Convocatorias y categorías
- Inscripciones con validación
- Jurados con rúbricas
- Votación popular separada
- Antifraude
- Premios y certificados

### Reglas clave
- No permitir compra de votos
- Revisión legal antes de activar premios

---

## RECORRIDO G — DERECHOS (Andalus Rights)

### Estado: DESIGNED (no implementado)

### Capacidades previstas
- Registro de obras
- Titulares declarados
- Licencias y contratos
- Territorios y plazos
- Evidencias y hashes
- Control de acceso

### Regla clave
- La plataforma NO adquiere propiedad automática

---

## RECORRIDO H — GANANCIAS (Andalus Wallet)

### Estado: DESIGNED (no implementado)

### Capacidades previstas
- Ganancias pendientes y disponibles
- Historial de movimientos
- Liquidaciones
- Solicitudes de retirada

### Reglas clave
- Proveedor financiero autorizado para custodia
- Separación absoluta: fondos de creadores ≠ ingresos de plataforma
- Créditos comprados ≠ créditos promocionales

---

## Registro de capacidades

| Módulo | Herramienta | Estado | Ruta |
|--------|-----------|--------|------|
| Base | Registro | IMPLEMENTED | /register |
| Base | Login | IMPLEMENTED | /login |
| Base | Verificación email | IMPLEMENTED | /verify-email |
| Base | Recuperar contraseña | IMPLEMENTED | /forgot-password |
| Base | Dashboard | IMPLEMENTED | /dashboard |
| Base | Proyectos CRUD | IMPLEMENTED | /projects |
| Base | Subida PDF | IMPLEMENTED | /projects/:id |
| Cinema | Producción audiovisual | DESIGNED | /cinema |
| Cinema+ | Exhibición | DESIGNED | /cinema-plus |
| Community | Red social | DESIGNED | /community |
| Festivals | Concursos | DESIGNED | /festivals |
| Rights | Derechos | DESIGNED | /rights |
| Trace 360° | Seguimiento | DESIGNED | /trace |
| Wallet | Ganancias | DESIGNED | /wallet |
| Pagos | Stripe TEST | CONFIGURATION_REQUIRED | /pricing |
| Auth | Google OIDC | CONFIGURATION_REQUIRED | /login |

---

*Documento de experiencia de usuario — Método TOP-DOWN*
