const express = require('express');
const router = express.Router();
const adminMiddleWare = require('../../middlewares/adminMiddleware');

const {
    getReports,
    createReport,
    updateReport,
    deleteReport,
    generateReport,
    getScheduledReports,
    toggleSchedule,
    downloadReport
} = require('../../controllers/adminControllers/reportController');

// Apply admin middleware to all routes
router.use(adminMiddleWare);

// Get all reports with pagination and filtering
router.get('/', getReports);

// Get scheduled reports
router.get('/scheduled', getScheduledReports);

// Create a new report
router.post('/', createReport);

// Update a report
router.put('/:id', updateReport);

// Delete a report
router.delete('/:id', deleteReport);

// Generate report data
router.post('/:id/generate', generateReport);

// Toggle report schedule
router.patch('/:id/schedule', toggleSchedule);

// Download report
router.get('/:type/:period/:format', downloadReport);

// Download report
router.get('/download/:type/:period/:format', downloadReport);

module.exports = router;