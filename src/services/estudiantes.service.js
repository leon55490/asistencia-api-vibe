const db = require('../data/db');

const generateCode = () => {
	const min = 10000;
	const max = 99999;
	const num = Math.floor(Math.random() * (max - min + 1)) + min;
	return `EST${num}`;
};

const createEstudiante = ({ nombre, apellido }) => {
	let codigo;
	let isUnique = false;
	while (!isUnique) {
		codigo = generateCode();
		if (!db.estudiantes.find((e) => e.codigo === codigo)) {
			isUnique = true;
		}
	}

	const newEstudiante = {
		id: db.estudiantes.length + 1,
		codigo,
		nombre,
		apellido,
	};

	db.estudiantes.push(newEstudiante);
	return newEstudiante;
};

const getAllEstudiantes = () => {
	return db.estudiantes;
};

const getEstudianteById = (id) => {
	return db.estudiantes.find((e) => e.id === id);
};

module.exports = {
	createEstudiante,
	getAllEstudiantes,
	getEstudianteById,
};
