const express = require('express');
const router = express.Router();

const estudiantesRoutes = require('./estudiantes.routes');
const asistenciasRoutes = require('./asistencias.routes');
const reportesRoutes = require('./reportes.routes');

router.use('/estudiantes', estudiantesRoutes);
router.use('/asistencias', asistenciasRoutes);
router.use('/reportes', reportesRoutes);

module.exports = router;
