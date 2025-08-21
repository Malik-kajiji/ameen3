const express = require('express');
const router = express.Router();
const adminMiddleWare = require('../../middlewares/adminMiddleware');

const {
    getAllAssets,
    getAssetById,
    createAsset,
    updateAsset,
    deleteAsset,
    getMaintenanceLogs,
    addMaintenanceLog,
    getMonthlyMaintenanceCosts
} = require('../../controllers/adminControllers/assetController');

// middleware
router.use(adminMiddleWare);

// Get all assets
router.get('/', getAllAssets);

// Get a single asset by ID
router.get('/:id', getAssetById);

// Create a new asset
router.post('/', createAsset);

// Update an asset
router.put('/:id', updateAsset);

// Delete an asset
router.delete('/:id', deleteAsset);

// Get maintenance logs for an asset
router.get('/:assetId/maintenance', getMaintenanceLogs);

// Add maintenance log for an asset
router.post('/:assetId/maintenance', addMaintenanceLog);

// Get monthly maintenance costs
router.get('/maintenance/monthly-costs', getMonthlyMaintenanceCosts);

module.exports = router;