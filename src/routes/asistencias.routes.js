const express = require('express');
const router = express.Router();
const asistenciasController = require('../controllers/asistencias.controller');

router.post('/', asistenciasController.createAsistencia);
router.get('/estudiante/:id', asistenciasController.getAsistenciasByEstudiante);

module.exports = router;
