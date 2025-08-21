const express = require('express');
const router = express.Router();
const adminMiddleWare = require('../../middlewares/adminMiddleware');
const {
    downloadMembershipReport,
    downloadFinancialReport,
    downloadAssetsReport,
    downloadEmployeesReport
} = require('../../controllers/adminControllers/reportDownloadController');

// middleware
router.use(adminMiddleWare);

// Download membership report
router.get('/membership/:period/:format', downloadMembershipReport);

// Download financial report
router.get('/financial/:period/:format', downloadFinancialReport);

// Download assets report
router.get('/assets/:period/:format', downloadAssetsReport);

// Download employees report
router.get('/employees/:period/:format', downloadEmployeesReport);

module.exports = router;