# MODULOS.md
## Ecosistema ANDALUS CREATIVE WORLD

---

## Visión general

El ecosistema consta de 7 módulos que cubren el ciclo completo de una obra creativa, desde la concepción hasta la monetización. Todos comparten:

- Identidad de usuario unificada
- Sistema de permisos consistente
- Ledger de créditos común
- Misma arquitectura de seguridad

## Estado en FASE 00

Todos los módulos están en estado **DESIGNED**:
- Contratos TypeScript definidos
- Páginas informativas implementadas
- Arquitectura de extensibilidad preparada
- Sin funcionalidad operativa (excepto la base común)

---

## A. ANDALUS CINEMA

**Propósito:** Producción audiovisual y adaptación de libros.

**Flujo previsto:**
1. Ingesta de libro (PDF/texto)
2. Extracción por capítulos
3. Análisis de estructura narrativa
4. Adaptación a guion cinematográfico
5. Biblia Cinematográfica Viva
6. Storyboard y planificación
7. Generación de assets visuales
8. Producción de audio (voces, música)
9. Montaje y renderizado
10. Exportación final

**Estados de producción:**
INGESTED → ANALYZING → SCRIPT_DRAFT → SCRIPT_REVIEW → BIBLE_REVIEW → STORYBOARD → SCENE_PLANNING → ASSET_GENERATION → AUDIO_PRODUCTION → VIDEO_PRODUCTION → EDITING → QUALITY_REVIEW → RENDERING → COMPLETED

**Dependencias futuras:** Motores de IA, generación de vídeo, síntesis de voz, música.

---

## B. ANDALUS CINEMA+

**Propósito:** Exhibición y distribución de obras.

**Capacidades:** Catálogo, fichas, reproductor, autorizaciones, distribución, estadísticas verificables, ingresos.

**Regla clave:** Crear una película NO la publica automáticamente. El creador decide.

---

## C. ANDALUS COMMUNITY

**Propósito:** Red social de creadores.

**Capacidades:** Perfiles, portfolios, publicaciones, equipos, mensajería, notificaciones, moderación.

**Regla clave:** Los manuscritos subidos para adaptación permanecen privados. La publicación es explícita.

---

## D. ANDALUS FESTIVALS

**Propósito:** Concursos y festivales artísticos.

**Capacidades:** Organizadores, inscripciones, jurados, rúbricas, votación popular, antifraude, certificados.

**Reglas clave:**
- Separar puntuación del jurado de voto popular
- No permitir compra de votos
- Revisión legal antes de activar premios

---

## E. ANDALUS RIGHTS

**Propósito:** Gestión de derechos y autorizaciones.

**Capacidades:** Registro de obras, titulares, licencias, contratos, territorios, plazos, evidencias, hashes.

**Regla clave:** La plataforma NO adquiere propiedad automática de las obras subidas.

---

## F. ANDALUS TRACE 360°

**Propósito:** Identificación y seguimiento de obras.

**Clasificación obligatoria:**
- DETECTED: Coincidencia técnica
- REPORTED: Dato de tercero
- VERIFIED: Contrastado con evidencia
- ESTIMATED: Estimación identificada
- SETTLED: Ingreso liquidado

**Regla clave:** Coincidencia detectada ≠ ingreso demostrado.

---

## G. ANDALUS WALLET

**Propósito:** Ganancias de creadores.

**Separación absoluta:**
- Dinero de creadores ≠ ingresos de plataforma
- Créditos comprados ≠ créditos promocionales
- Bonos promocionales ≠ dinero retirable

**Regla clave:** Los fondos de creadores serán custodiados por proveedor financiero autorizado. No se usan para financiar operaciones propias.

---

## Créditos de producción

**Tipos de transacción:**
PURCHASE, PROMOTIONAL_GRANT, RESERVE, CAPTURE, RELEASE, REFUND, EXPIRE, ADJUSTMENT

**Requisitos:**
- Unidades enteras (sin float)
- Idempotencia
- Transacciones atómicas
- Control de concurrencia
- Auditoría completa
- Backend determina saldos (nunca el navegador)

---

*Documento de módulos — FASE 00*
