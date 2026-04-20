# asistencia-api-vibe

API y panel de prueba para gestion de asistencia estudiantil.

## Ejecutar en local

1. Instala dependencias:

```bash
npm install
```

2. Inicia el servidor Express local:

```bash
npm start
```

3. Abre `http://localhost:3000`.

## Deploy en Netlify

Este repositorio ya incluye la configuracion para Netlify:

- `netlify.toml` con:
  - `publish = "."`
  - `functions = "netlify/functions"`
  - redireccion de `/api/*` hacia `/.netlify/functions/api/:splat`
- `netlify/functions/api.js` con los endpoints equivalentes al backend local.

### Ajustes en el panel de Netlify

En Site settings > Build & deploy:

- Base directory: vacio (si el repo apunta directo a esta carpeta)
- Build command: vacio
- Publish directory: `.`

Si el proyecto esta dentro de una subcarpeta en tu repositorio monorepo, usa esa subcarpeta como Base directory.

## Endpoints disponibles

- `GET /api/estudiantes`
- `POST /api/estudiantes`
- `GET /api/estudiantes/:id`
- `POST /api/asistencias`
- `GET /api/asistencias/estudiante/:id`
- `GET /api/reportes/ausentismo`

## Nota sobre almacenamiento

Tanto en local como en Netlify Function, los datos se guardan en memoria. Al reiniciar el proceso o cambiar de instancia, los datos se pierden.
