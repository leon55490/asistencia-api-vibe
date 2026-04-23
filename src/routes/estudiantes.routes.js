const express = require('express');
const router = express.Router();
const estudiantesController = require('../controllers/estudiantes.controller');

router.post('/', estudiantesController.createEstudiante);
router.get('/', estudiantesController.getAllEstudiantes);
router.get('/:id', estudiantesController.getEstudianteById);

module.exports = router;
