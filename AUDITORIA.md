Se tiene la siguiente lista de verificación, para cada ítem, guarda en un archivo `AUDITORIA.md` qué encontraste, con la referencia al archivo y la línea específica.

**Checklist de auditoría:**

| # | Aspecto | Pregunta |
|---|---------|----------|
| 1 | Validación de entrada | ¿Valida el formato del código del estudiante? ¿Rechaza fechas futuras? ¿Valida el enum del estado? |
| 2 | Manejo de errores | ¿Hay try/catch en las rutas? ¿Devuelve códigos HTTP correctos (400, 404, 409, 500)? |
| 3 | Inyección y seguridad | Si usa base de datos, ¿parametriza consultas? ¿Escapa entradas? ¿Tiene rate limiting? ¿CORS configurado? |
| 4 | Datos sensibles | ¿Expone información de estudiantes sin autenticación? ¿Hay manejo de datos personales según habeas data? |
| 5 | Estructura y mantenibilidad | ¿Separa rutas, controladores y lógica? ¿O todo está en `index.js`? ¿Los nombres son descriptivos? |
| 6 | Dependencias | ¿Qué paquetes agregó? ¿Los necesita? ¿Tienen vulnerabilidades? Ejecuta `npm audit`. |
| 7 | Configuración | ¿Hardcodea puertos o credenciales? ¿Usa variables de entorno? ¿Hay `.env.example`? |
| 8 | Idempotencia y duplicados | ¿Permite registrar dos asistencias iguales para el mismo estudiante y fecha? |
| 9 | Pruebas | ¿Generó alguna prueba automatizada? ¿O cero? |
| 10 | Documentación | ¿El README explica cómo correrlo? ¿Hay comentarios útiles o vacíos? |

**Formato del archivo `AUDITORIA.md`:**

```markdown
## Hallazgo 1 — Validación de código del estudiante
- **Severidad:** media
- **Archivo/línea:** src/routes/estudiantes.js, línea 23
- **Descripción:** El endpoint POST /api/estudiantes no valida el patrón EST\d{5}.
- **Evidencia:** envié POST con codigo "abc" y respondió 201.
- **Impacto:** datos inconsistentes en el sistema real.
```

**Punto de control:** mínimo 8 hallazgos documentados.
