const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/property.controller');

// GET /api/get-property
router.get('/get-property', controller.getProperty);

module.exports = router;