const express = require('express');
const router = express.Router();
const adminMiddleware = require('../../middlewares/adminMiddleware');

const {
    loginAsAdmin,
    getAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin
} = require('../../controllers/adminControllers/adminController');

// Import packages routes
const packagesRoutes = require('./packagesRoutes');

// Use packages routes
router.use('/', packagesRoutes);

// Public route for login
router.post('/login', loginAsAdmin);

// Protected admin routes
router.get('/admins', adminMiddleware, getAdmins);
router.post('/admins', adminMiddleware, createAdmin);
router.put('/admins/:id', adminMiddleware, updateAdmin);
router.delete('/admins/:id', adminMiddleware, deleteAdmin);

module.exports = router;