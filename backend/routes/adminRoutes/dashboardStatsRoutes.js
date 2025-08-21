const express = require('express');
const router = express.Router();
const adminMiddleWare = require('../../middlewares/adminMiddleware');
const { getMonthlyStats } = require('../../controllers/adminControllers/dashboardStatsController');

// middleware
router.use(adminMiddleWare);

// Get monthly stats
router.get('/monthly', getMonthlyStats);

module.exports = router;