# AUTENTICACION.md
## ANDALUS CREATIVE WORLD

---

## Diseño de autenticación

### Registro
1. Usuario envía: email, contraseña, nombre visible
2. Backend normaliza email (lowercase, trim)
3. Verifica que no existe cuenta con ese email
4. Hash contraseña con Argon2id
5. Crea usuario con estado PENDING_VERIFICATION
6. Genera token de verificación (crypto.randomBytes(32))
7. Almacena hash del token (no el token completo)
8. Envía email con enlace de verificación
9. Token caduca en 24h, un solo uso

### Login
1. Usuario envía: email, contraseña
2. Backend busca usuario por email normalizado
3. Si no existe: responde "Credenciales incorrectas" (anti-enumeración)
4. Verifica contraseña con Argon2id
5. Si incorrecta: responde "Credenciales incorrectas"
6. Verifica rate limit (5 intentos / 15 min)
7. Crea sesión con token aleatorio
8. Almacena hash del token en BD
9. Establece cookie HttpOnly + Secure + SameSite
10. Registra evento de seguridad

### Sesión
- Cookie HttpOnly (no accesible por JavaScript)
- Secure (solo HTTPS en producción)
- SameSite=Lax (protección CSRF básica)
- Duración: 7 días
- Renovación en actividad
- Verificación en cada request privado

### Logout
1. Invalida sesión en BD
2. Elimina cookie
3. Registra evento

### Recuperación de contraseña
1. Usuario solicita con email
2. Si existe: genera token de reset (1h caducidad)
3. Envía email con enlace
4. Usuario establece nueva contraseña
5. Token se invalida tras uso
6. Todas las sesiones existentes se revocan

## Google OIDC (pendiente de configuración)

### Flujo
1. Frontend redirige a Google Authorization Endpoint
2. Incluye: client_id, redirect_uri, scope, state, nonce, code_challenge (PKCE)
3. Google autentica al usuario
4. Callback con authorization code
5. Backend intercambia code por tokens
6. Valida id_token: issuer, audience, exp, nonce, signature
7. Crea o vincula ExternalIdentity
8. Establece sesión interna

### Variables necesarias
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- GOOGLE_REDIRECT_URI

### Estado: CONFIGURATION_REQUIRED
- Sin credenciales, el botón se muestra deshabilitado
- No se simula autenticación con Google

## Estado actual (FASE 00 frontend)

| Función | Estado | Implementación |
|---------|--------|----------------|
| Registro | ✅ Funcional | localStorage (simulado) |
| Login | ✅ Funcional | localStorage (simulado) |
| Logout | ✅ Funcional | Limpieza localStorage |
| Sesión persistente | ✅ Funcional | localStorage |
| Verificación email | ⚠️ Simulada | Sin envío real |
| Recuperación | ⚠️ Simulada | Sin envío real |
| Google OIDC | ❌ No configurado | Botón deshabilitado |
| Argon2id | ❌ No implementado | Hash simple simulado |
| Cookies HttpOnly | ❌ No implementado | Requiere backend |
| CSRF | ❌ No implementado | Requiere backend |
| Rate limiting | ❌ No implementado | Requiere backend |

---

*Documento de autenticación — FASE 00*
