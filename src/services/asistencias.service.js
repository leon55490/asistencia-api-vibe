const db = require('../data/db');

const createAsistencia = ({ estudianteId, fecha, estado }) => {
	const estudiante = db.estudiantes.find((e) => e.id === estudianteId);
	if (!estudiante) {
		throw new Error('ESTUDIANTE_NOT_FOUND');
	}

	const estadosValidos = ['presente', 'ausente', 'justificada'];
	if (!estadosValidos.includes(estado)) {
		throw new Error('ESTADO_INVALIDO');
	}

	const fechaAsistencia = new Date(fecha);
	const fechaActual = new Date();
	fechaAsistencia.setHours(0, 0, 0, 0);
	fechaActual.setHours(0, 0, 0, 0);

	if (fechaAsistencia > fechaActual) {
		throw new Error('FECHA_FUTURA');
	}

	const duplicate = db.asistencias.find(
		(a) => a.estudianteId === estudianteId && a.fecha === fecha
	);
	if (duplicate) {
		throw new Error('DUPLICADO');
	}

	const nuevaAsistencia = {
		id: db.asistencias.length + 1,
		estudianteId,
		fecha,
		estado,
	};

	db.asistencias.push(nuevaAsistencia);
	return nuevaAsistencia;
};

const getAsistenciasByEstudianteId = (studentId) => {
	return db.asistencias.filter((a) => a.estudianteId === studentId);
};

module.exports = {
	createAsistencia,
	getAsistenciasByEstudianteId,
};
