const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportes.controller');

router.get('/ausentismo', reportesController.getAusentismo);

module.exports = router;
