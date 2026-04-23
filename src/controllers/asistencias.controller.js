const asistenciasService = require('../services/asistencias.service');

const createAsistencia = (req, res) => {
	const { estudianteId, fecha, estado } = req.body;

	if (!estudianteId || !fecha || !estado) {
		return res
			.status(400)
			.json({ error: 'Faltan datos requeridos (estudianteId, fecha, estado)' });
	}

	try {
		const nuevaAsistencia = asistenciasService.createAsistencia({ estudianteId, fecha, estado });
		res.status(201).json(nuevaAsistencia);
	} catch (err) {
		if (err.message === 'ESTUDIANTE_NOT_FOUND') {
			return res.status(404).json({ error: 'Estudiante no encontrado' });
		}
		if (err.message === 'ESTADO_INVALIDO') {
			return res.status(400).json({ error: 'Estado inválido. Debe ser: presente, ausente o justificada' });
		}
		if (err.message === 'FECHA_FUTURA') {
			return res.status(400).json({ error: 'La fecha no puede ser futura' });
		}
		if (err.message === 'DUPLICADO') {
			return res.status(400).json({ error: 'Ya existe una asistencia registrada para este estudiante en esta fecha' });
		}
		
		return res.status(500).json({ error: 'Error del servidor' });
	}
};

const getAsistenciasByEstudiante = (req, res) => {
	const studentId = parseInt(req.params.id);
	const asistenciasEstudiante = asistenciasService.getAsistenciasByEstudianteId(studentId);
	res.json(asistenciasEstudiante);
};

module.exports = {
	createAsistencia,
	getAsistenciasByEstudiante,
};
