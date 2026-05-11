const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/image.controller');

// GET /api/images
router.get('/images', controller.getImages);

module.exports = router;