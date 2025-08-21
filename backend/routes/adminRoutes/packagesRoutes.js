const express = require('express');
const router = express.Router();
const { getPackages, updatePackages } = require('../../controllers/adminControllers/packagesController');
const adminMiddleware = require('../../middlewares/adminMiddleware');

router.get('/packages', adminMiddleware, getPackages);
router.put('/packages', adminMiddleware, updatePackages);

module.exports = router;