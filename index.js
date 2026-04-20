const express = require('express');
const app = express();

app.use(express.json());

// Ruta base
app.get('/', (req, res) => {
	res.send(`
        <h1>API Asistencia Estudiantil Vibe</h1>
        <p>El servidor está funcionando. Endpoints disponibles:</p>
        <ul>
            <li>GET /api/estudiantes</li>
            <li>POST /api/estudiantes</li>
            <li>GET /api/estudiantes/:id</li>
            <li>POST /api/asistencias</li>
            <li>GET /api/asistencias/estudiante/:id</li>
            <li>GET /api/reportes/ausentismo</li>
        </ul>
    `);
});

// In-memory storage
let estudiantes = [];
let asistencias = [];

// Helper functions
const generateCode = () => {
	const min = 10000;
	const max = 99999;
	const num = Math.floor(Math.random() * (max - min + 1)) + min;
	return `EST${num}`;
};

// 1. POST /api/estudiantes -> Crear estudiante
app.post('/api/estudiantes', (req, res) => {
	const { nombre, apellido } = req.body;

	if (!nombre || !apellido) {
		return res.status(400).json({ error: 'Nombre y apellido son requeridos' });
	}

	let codigo;
	let isUnique = false;
	while (!isUnique) {
		codigo = generateCode();
		if (!estudiantes.find((e) => e.codigo === codigo)) {
			isUnique = true;
		}
	}

	const newEstudiante = {
		id: estudiantes.length + 1,
		codigo,
		nombre,
		apellido,
	};

	estudiantes.push(newEstudiante);
	res.status(201).json(newEstudiante);
});

// 2. GET /api/estudiantes -> Listar estudiantes
app.get('/api/estudiantes', (req, res) => {
	res.json(estudiantes);
});

// 3. GET /api/estudiantes/:id -> Obtener estudiante por ID
app.get('/api/estudiantes/:id', (req, res) => {
	const estudiante = estudiantes.find((e) => e.id === parseInt(req.params.id));
	if (!estudiante) {
		return res.status(404).json({ error: 'Estudiante no encontrado' });
	}
	res.json(estudiante);
});

// 4. POST /api/asistencias -> Registrar asistencia
app.post('/api/asistencias', (req, res) => {
	const { estudianteId, fecha, estado } = req.body;

	if (!estudianteId || !fecha || !estado) {
		return res
			.status(400)
			.json({ error: 'Faltan datos requeridos (estudianteId, fecha, estado)' });
	}

	// Validate if student exists
	const estudiante = estudiantes.find((e) => e.id === estudianteId);
	if (!estudiante) {
		return res.status(404).json({ error: 'Estudiante no encontrado' });
	}

	// Validate status
	const estadosValidos = ['presente', 'ausente', 'justificada'];
	if (!estadosValidos.includes(estado)) {
		return res
			.status(400)
			.json({ error: 'Estado inválido. Debe ser: presente, ausente o justificada' });
	}

	// Validate future date
	const fechaAsistencia = new Date(fecha);
	const fechaActual = new Date();
	// Reset time for comparison
	fechaAsistencia.setHours(0, 0, 0, 0);
	fechaActual.setHours(0, 0, 0, 0);

	if (fechaAsistencia > fechaActual) {
		return res.status(400).json({ error: 'La fecha no puede ser futura' });
	}

	// Validate duplicates for same date and student
	const duplicate = asistencias.find(
		(a) => a.estudianteId === estudianteId && a.fecha === fecha
	);
	if (duplicate) {
		return res.status(400).json({
			error: 'Ya existe una asistencia registrada para este estudiante en esta fecha',
		});
	}

	const nuevaAsistencia = {
		id: asistencias.length + 1,
		estudianteId,
		fecha,
		estado,
	};

	asistencias.push(nuevaAsistencia);
	res.status(201).json(nuevaAsistencia);
});

// 5. GET /api/asistencias/estudiante/:id -> Listar asistencias por estudiante
app.get('/api/asistencias/estudiante/:id', (req, res) => {
	const studentId = parseInt(req.params.id);
	const asistenciasEstudiante = asistencias.filter((a) => a.estudianteId === studentId);
	res.json(asistenciasEstudiante);
});

// 6. GET /api/reportes/ausentismo -> Top 5 estudiantes con más ausencias
app.get('/api/reportes/ausentismo', (req, res) => {
	const conteoAusencias = {};

	asistencias.forEach((a) => {
		if (a.estado === 'ausente') {
			conteoAusencias[a.estudianteId] = (conteoAusencias[a.estudianteId] || 0) + 1;
		}
	});

	const reporte = estudiantes.map((estudiante) => {
		return {
			estudiante: `${estudiante.nombre} ${estudiante.apellido}`,
			codigo: estudiante.codigo,
			ausencias: conteoAusencias[estudiante.id] || 0,
		};
	});

	const top5 = reporte.sort((a, b) => b.ausencias - a.ausencias).slice(0, 5);

	res.json(top5);
});

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
