const express = require('express');
const { 
    createNotification, 
    getNotifications, 
    verifyPhoneNumber,
    getDeliveryStats 
} = require('../../controllers/adminControllers/notificationController');
const adminMiddleware = require('../../middlewares/adminMiddleware');

const router = express.Router();

// Apply admin middleware to all routes
router.use(adminMiddleware);

// Create a new notification
router.post('/', createNotification);

// Get all notifications
router.get('/', getNotifications);

// Verify phone number exists
router.get('/verify-phone/:phone', verifyPhoneNumber);

// Get delivery statistics
router.get('/stats', getDeliveryStats);

module.exports = router;