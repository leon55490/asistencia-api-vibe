const db = require('../data/db');

const getTopAusentismo = () => {
	const conteoAusencias = {};

	db.asistencias.forEach((a) => {
		if (a.estado === 'ausente') {
			conteoAusencias[a.estudianteId] = (conteoAusencias[a.estudianteId] || 0) + 1;
		}
	});

	const reporte = db.estudiantes.map((estudiante) => {
		return {
			estudiante: `${estudiante.nombre} ${estudiante.apellido}`,
			codigo: estudiante.codigo,
			ausencias: conteoAusencias[estudiante.id] || 0,
		};
	});

	const top5 = reporte.sort((a, b) => b.ausencias - a.ausencias).slice(0, 5);
	return top5;
};

module.exports = {
	getTopAusentismo,
};
