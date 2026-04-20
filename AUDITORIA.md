## Hallazgo 1 — Validación del estado de asistencia (cumple)

- **Severidad:** baja
- **Archivo/línea:** netlify/functions/api.js, línea 117
- **Descripción:** El endpoint valida un enum explícito para `estado` (`presente`, `ausente`, `justificada`).
- **Evidencia:** en la línea indicada se define `const estadosValidos = ['presente', 'ausente', 'justificada'];` y se rechaza con 400 en línea 119 si no coincide.
- **Impacto:** reduce valores inválidos en la data de asistencias.

## Hallazgo 2 — Rechazo de fechas futuras (cumple)

- **Severidad:** baja
- **Archivo/línea:** netlify/functions/api.js, línea 129
- **Descripción:** Se rechazan asistencias con fecha posterior al día actual.
- **Evidencia:** comparación `if (fechaAsistencia > fechaActual)` y respuesta 400 en línea 130.
- **Impacto:** evita registros de asistencia en fechas futuras.

## Hallazgo 3 — Falta validación estricta del formato de fecha

- **Severidad:** media
- **Archivo/línea:** netlify/functions/api.js, línea 124
- **Descripción:** Se usa `new Date(fecha)` pero no se valida explícitamente formato (`YYYY-MM-DD`) ni `Invalid Date`.
- **Evidencia:** no existe una verificación del tipo `Number.isNaN(fechaAsistencia.getTime())` antes de comparar.
- **Impacto:** podrían entrar fechas ambiguas o inválidas según el parser del runtime.

## Hallazgo 4 — Manejo de errores incompleto en rutas Express

- **Severidad:** media
- **Archivo/línea:** index.js, línea 29
- **Descripción:** Las rutas de Express no están envueltas en `try/catch` ni hay middleware global de errores.
- **Evidencia:** en `index.js` no aparece ningún `try {` en handlers, y no hay `app.use((err, req, res, next) => ...)`.
- **Impacto:** un error inesperado podría terminar en 500 no controlado o caída parcial del proceso.

## Hallazgo 5 — Código HTTP para duplicados no usa 409

- **Severidad:** media
- **Archivo/línea:** index.js, línea 110
- **Descripción:** Al detectar duplicado de asistencia se responde 400 en vez de 409 (conflicto de recurso).
- **Evidencia:** en duplicados retorna `res.status(400)` con mensaje de registro existente.
- **Impacto:** semántica HTTP menos precisa para clientes y para manejo automático de conflictos.

## Hallazgo 6 — Exposición de datos sin autenticación

- **Severidad:** alta
- **Archivo/línea:** index.js, línea 57
- **Descripción:** Se publica listado de estudiantes sin autenticación/autorización.
- **Evidencia:** `GET /api/estudiantes` devuelve todo el arreglo `estudiantes` y no hay middleware de auth en el archivo.
- **Impacto:** riesgo de exposición de datos personales (nombre/apellido/código) a usuarios no autorizados.

## Hallazgo 7 — Seguridad HTTP básica no implementada (CORS/rate limiting)

- **Severidad:** alta
- **Archivo/línea:** index.js, línea 5
- **Descripción:** No se observa configuración de CORS ni rate limiting.
- **Evidencia:** solo se configura `app.use(express.json())`; no hay uso de `cors`, `helmet` o `express-rate-limit` en `index.js` ni en dependencias de `package.json` (línea 9).
- **Impacto:** mayor superficie para abuso de API desde orígenes no controlados y ataques de fuerza bruta/DoS.

## Hallazgo 8 — Estructura monolítica en archivo principal

- **Severidad:** media
- **Archivo/línea:** index.js, línea 29
- **Descripción:** Rutas, validaciones y lógica de negocio conviven en un solo archivo.
- **Evidencia:** todas las rutas de estudiantes, asistencias y reportes están en `index.js` (líneas 29 a 154).
- **Impacto:** dificulta mantenimiento, pruebas unitarias y escalabilidad del proyecto.

## Hallazgo 9 — Dependencias y vulnerabilidades

- **Severidad:** baja
- **Archivo/línea:** package.json, línea 10
- **Descripción:** El proyecto usa una sola dependencia productiva (`express`) y el resultado de `npm audit` no reporta vulnerabilidades.
- **Evidencia:** `package.json` incluye únicamente `"express": "^4.18.2"`; comando ejecutado: `npm audit --json` -> `total: 0` vulnerabilidades.
- **Impacto:** estado actual sano de dependencias, pero sin herramientas adicionales de seguridad en runtime.

## Hallazgo 10 — Configuración y pruebas automatizadas

- **Severidad:** alta
- **Archivo/línea:** package.json, línea 7
- **Descripción:** No hay script de pruebas ni archivos de test; además, el puerto está hardcodeado y no existe `.env.example`.
- **Evidencia:** scripts solo incluyen `"start": "node index.js"`; en `index.js` se fija `const PORT = 3000;` (línea 156); no se encontró `.env.example` ni archivos `*.test.*`/`*.spec.*`.
- **Impacto:** menor confiabilidad por falta de testing automatizado y menor flexibilidad de despliegue por configuración rígida.

## Hallazgo 11 — Documentación de ejecución (cumple parcial)

- **Severidad:** baja
- **Archivo/línea:** README.md, línea 5
- **Descripción:** El README sí explica cómo instalar y ejecutar localmente, pero no documenta aspectos de seguridad, autenticación ni política de datos.
- **Evidencia:** en `README.md` aparecen pasos de `npm install` y `npm start` (líneas 9 y 16).
- **Impacto:** facilita arranque técnico, pero deja vacíos operativos/compliance para producción.
