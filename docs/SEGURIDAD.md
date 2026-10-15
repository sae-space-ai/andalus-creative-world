# SEGURIDAD.md
## ANDALUS CREATIVE WORLD

---

## Principios de seguridad

1. **Defensa en profundidad:** Múltiples capas de protección.
2. **Mínimo privilegio:** Cada componente accede solo a lo necesario.
3. **No confiar en el cliente:** Toda validación se repite en backend.
4. **Transparencia honesta:** No se afirma seguridad no verificada.

## Autenticación (diseño para producción)

### Contraseñas
- **Algoritmo:** Argon2id
- **Parámetros:** memory=65536, iterations=3, parallelism=4
- **Nunca** se almacenan en texto plano
- **Nunca** se transmiten por URL o logs

### Sesiones
- **Almacenamiento:** Cookies HttpOnly + Secure + SameSite=Lax
- **NUNCA** en localStorage (vulnerable a XSS)
- **Duración:** 7 días con renovación en actividad
- **Revocación:** Posibilidad de cerrar todas las sesiones
- **Token:** Hash SHA-256 del token aleatorio (no el token completo)

### Tokens de un solo uso
- Email verification: 24h, un solo uso, hash almacenado
- Password reset: 1h, un solo uso, hash almacenado
- Generación: crypto.randomBytes(32)

## Protección de rutas

### Backend
- Middleware de autenticación en todas las rutas privadas
- Verificación de ownerId en cada operación sobre recursos
- El ownerId NUNCA se acepta desde el body/params del request
- Se extrae de la sesión autenticada

### Frontend
- ProtectedRoute component para rutas privadas
- Redirección a /login si no autenticado
- No se muestra información sensible sin verificación

## CSRF
- Token CSRF en formularios (doble submit cookie pattern)
- SameSite cookie como defensa adicional
- Verificación en backend para mutations

## Rate Limiting
- Login: 5 intentos por IP en 15 minutos
- Registro: 3 por IP por hora
- API general: 100 req/min por usuario
- Upload: 10 por minuto por usuario

## Archivos
- **Tipo MIME:** Verificado contra firma real (magic bytes)
- **Tamaño máximo:** 50 MB para PDF
- **Nombre:** Sanitizado, sin path traversal
- **Almacenamiento:** Fuera del webroot, acceso solo por API
- **Checksum:** SHA-256 registrado antes de procesamiento

## Datos sensibles
- **Nunca** en logs: contraseñas, tokens completos, PII innecesaria
- **Nunca** en URLs: tokens de sesión o reset
- **Nunca** en código: claves API, secretos
- **Variables de entorno:** Para todas las credenciales

## Aislamiento de datos
- Cada usuario solo ve sus propios proyectos
- Cada proyecto solo ve sus propios documentos
- La verificación se hace en backend, no solo en frontend
- Query siempre incluye `WHERE ownerId = $authenticatedUserId`

## Privacidad
- Proyectos privados por defecto
- Documentos nunca se publican automáticamente
- La plataforma no adquiere propiedad de las obras
- Derecho a exportar y eliminar datos personales
- Logs mínimos necesarios para auditoría

## Estado actual (FASE 00)

| Medida | Frontend | Backend |
|--------|----------|---------|
| Hash contraseñas | ⚠️ Simulado | ❌ Pendiente |
| Cookies HttpOnly | ❌ N/A | ❌ Pendiente |
| CSRF | ❌ Pendiente | ❌ Pendiente |
| Rate limiting | ❌ N/A | ❌ Pendiente |
| Validación inputs | ✅ Zod schemas | ❌ Pendiente |
| Aislamiento ownerId | ✅ En lógica | ❌ Pendiente |
| Sin secrets en código | ✅ Verificado | ✅ Verificado |

---

*Documento de seguridad — FASE 00*
