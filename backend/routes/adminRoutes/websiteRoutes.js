const express = require('express');
const router = express.Router();
const adminMiddleware = require('../../middlewares/adminMiddleware');
const {
    getWebsiteContent,
    updateAbout,
    updateFeatures,
    updateTrainingDays,
    updatePackages,
    updateContact
} = require('../../controllers/adminControllers/websiteController');

// middleware
router.use(adminMiddleware);

// Get website content
router.get('/content', getWebsiteContent);

// Update website sections
router.put('/about', updateAbout);
router.put('/features', updateFeatures);
router.put('/training-days', updateTrainingDays);
router.put('/packages', updatePackages);
router.put('/contact', updateContact);

module.exports = router;