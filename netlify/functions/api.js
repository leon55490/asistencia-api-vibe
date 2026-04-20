let estudiantes = [];
let asistencias = [];

const json = (statusCode, payload) => ({
	statusCode,
	headers: {
		'Content-Type': 'application/json',
	},
	body: JSON.stringify(payload),
});

const generateCode = () => {
	const min = 10000;
	const max = 99999;
	const num = Math.floor(Math.random() * (max - min + 1)) + min;
	return `EST${num}`;
};

const parseBody = (event) => {
	if (!event.body) {
		return {};
	}

	try {
		return JSON.parse(event.body);
	} catch (error) {
		return null;
	}
};

const getApiPath = (path) => {
	if (!path) {
		return '/';
	}

	if (path.startsWith('/.netlify/functions/api')) {
		return path.replace('/.netlify/functions/api', '') || '/';
	}

	if (path.startsWith('/api')) {
		return path.replace('/api', '') || '/';
	}

	return path;
};

exports.handler = async (event) => {
	const method = event.httpMethod;
	const route = getApiPath(event.path);

	if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
		const parsed = parseBody(event);
		if (parsed === null) {
			return json(400, { error: 'JSON invalido en el body' });
		}
		event.parsedBody = parsed;
	}

	if (method === 'GET' && route === '/estudiantes') {
		return json(200, estudiantes);
	}

	if (method === 'POST' && route === '/estudiantes') {
		const { nombre, apellido } = event.parsedBody;

		if (!nombre || !apellido) {
			return json(400, { error: 'Nombre y apellido son requeridos' });
		}

		let codigo;
		let isUnique = false;
		while (!isUnique) {
			codigo = generateCode();
			if (!estudiantes.find((estudiante) => estudiante.codigo === codigo)) {
				isUnique = true;
			}
		}

		const nuevoEstudiante = {
			id: estudiantes.length + 1,
			codigo,
			nombre,
			apellido,
		};

		estudiantes.push(nuevoEstudiante);
		return json(201, nuevoEstudiante);
	}

	const estudianteByIdMatch = route.match(/^\/estudiantes\/(\d+)$/);
	if (method === 'GET' && estudianteByIdMatch) {
		const estudianteId = Number(estudianteByIdMatch[1]);
		const estudiante = estudiantes.find((item) => item.id === estudianteId);

		if (!estudiante) {
			return json(404, { error: 'Estudiante no encontrado' });
		}

		return json(200, estudiante);
	}

	if (method === 'POST' && route === '/asistencias') {
		const { estudianteId, fecha, estado } = event.parsedBody;
		const studentId = Number(estudianteId);

		if (!studentId || !fecha || !estado) {
			return json(400, {
				error: 'Faltan datos requeridos (estudianteId, fecha, estado)',
			});
		}

		const estudiante = estudiantes.find((item) => item.id === studentId);
		if (!estudiante) {
			return json(404, { error: 'Estudiante no encontrado' });
		}

		const estadosValidos = ['presente', 'ausente', 'justificada'];
		if (!estadosValidos.includes(estado)) {
			return json(400, {
				error: 'Estado invalido. Debe ser: presente, ausente o justificada',
			});
		}

		const fechaAsistencia = new Date(fecha);
		const fechaActual = new Date();
		fechaAsistencia.setHours(0, 0, 0, 0);
		fechaActual.setHours(0, 0, 0, 0);

		if (fechaAsistencia > fechaActual) {
			return json(400, { error: 'La fecha no puede ser futura' });
		}

		const duplicate = asistencias.find(
			(item) => item.estudianteId === studentId && item.fecha === fecha
		);
		if (duplicate) {
			return json(400, {
				error: 'Ya existe una asistencia registrada para este estudiante en esta fecha',
			});
		}

		const nuevaAsistencia = {
			id: asistencias.length + 1,
			estudianteId: studentId,
			fecha,
			estado,
		};

		asistencias.push(nuevaAsistencia);
		return json(201, nuevaAsistencia);
	}

	const asistenciasByIdMatch = route.match(/^\/asistencias\/estudiante\/(\d+)$/);
	if (method === 'GET' && asistenciasByIdMatch) {
		const studentId = Number(asistenciasByIdMatch[1]);
		const asistenciasEstudiante = asistencias.filter(
			(item) => item.estudianteId === studentId
		);
		return json(200, asistenciasEstudiante);
	}

	if (method === 'GET' && route === '/reportes/ausentismo') {
		const conteoAusencias = {};

		asistencias.forEach((item) => {
			if (item.estado === 'ausente') {
				conteoAusencias[item.estudianteId] =
					(conteoAusencias[item.estudianteId] || 0) + 1;
			}
		});

		const reporte = estudiantes.map((estudiante) => ({
			estudiante: `${estudiante.nombre} ${estudiante.apellido}`,
			codigo: estudiante.codigo,
			ausencias: conteoAusencias[estudiante.id] || 0,
		}));

		const top5 = reporte.sort((a, b) => b.ausencias - a.ausencias).slice(0, 5);
		return json(200, top5);
	}

	return json(404, { error: 'Endpoint no encontrado' });
};
