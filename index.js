const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

app.get('/styles.css', (req, res) => {
	res.sendFile(path.join(__dirname, 'styles.css'));
});

// Ruta base
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
});

const routes = require('./src/routes');

// API routes
app.use('/api', routes);

const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
