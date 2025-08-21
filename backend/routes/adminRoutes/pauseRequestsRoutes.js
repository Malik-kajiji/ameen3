const express = require('express');
const router = express.Router();
const adminMiddleWare = require('../../middlewares/adminMiddleware');

const {
    getAllPauseRequests,
    getPauseRequestById,
    approvePauseRequest,
    rejectPauseRequest,
    bulkApprovePauseRequests,
    bulkRejectPauseRequests
} = require('../../controllers/adminControllers/pauseRequestsController');

// middleware
router.use(adminMiddleWare);

// Get all pause requests
router.get('/', getAllPauseRequests);

// Get a single pause request by ID
router.get('/:id', getPauseRequestById);

// Approve a pause request
router.put('/:id/approve', approvePauseRequest);

// Reject a pause request
router.put('/:id/reject', rejectPauseRequest);

// Bulk approve pause requests
router.put('/bulk/approve', bulkApprovePauseRequests);

// Bulk reject pause requests
router.put('/bulk/reject', bulkRejectPauseRequests);

module.exports = router;