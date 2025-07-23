const express = require('express');
const router = express.Router();
const adminMiddleWare = require('../../middlewares/adminMiddleware')

const {
    getHomePageData,
    getDashboardDataByTimeframe
} = require('../../controllers/adminControllers/homePageController');

// middleware
router.use(adminMiddleWare)

// Get main dashboard data (current week/month)
router.get('/main', getHomePageData);

// Get dashboard data by timeframe: weekly, monthly, yearly
router.get('/:timeframe', getDashboardDataByTimeframe);

module.exports = router;