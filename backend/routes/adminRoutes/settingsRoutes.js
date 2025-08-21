const express = require('express');
const { getSettings, updateSettings, fillDefaultSettings } = require('../../controllers/adminControllers/settingsController');
const adminMiddleware = require('../../middlewares/adminMiddleware');

const router = express.Router();

// Apply admin middleware to all routes
router.use(adminMiddleware);

// Get all settings
router.get('/', getSettings);

// Update settings by category
router.put('/:category', updateSettings);

// Test endpoint to fill default values
router.get('/test/fill-default', fillDefaultSettings);

module.exports = router;