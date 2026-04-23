const reportesService = require('../services/reportes.service');

const getAusentismo = (req, res) => {
	const top5 = reportesService.getTopAusentismo();
	res.json(top5);
};

module.exports = {
	getAusentismo,
};
