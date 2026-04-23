const estudiantesService = require('../services/estudiantes.service');

const createEstudiante = (req, res) => {
	const { nombre, apellido } = req.body;

	if (!nombre || !apellido) {
		return res.status(400).json({ error: 'Nombre y apellido son requeridos' });
	}

	const newEstudiante = estudiantesService.createEstudiante({ nombre, apellido });
	res.status(201).json(newEstudiante);
};

const getAllEstudiantes = (req, res) => {
	res.json(estudiantesService.getAllEstudiantes());
};

const getEstudianteById = (req, res) => {
	const id = parseInt(req.params.id);
	const estudiante = estudiantesService.getEstudianteById(id);
	if (!estudiante) {
		return res.status(404).json({ error: 'Estudiante no encontrado' });
	}
	res.json(estudiante);
};

module.exports = {
	createEstudiante,
	getAllEstudiantes,
	getEstudianteById,
};
