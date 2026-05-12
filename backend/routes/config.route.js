const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/config.controller');

// GET /api/config/maps-key
router.get('/config/maps-key', controller.getMapsKey);

module.exports = router;