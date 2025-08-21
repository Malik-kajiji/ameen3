const express = require('express');
const router = express.Router();
const adminMiddleWare = require('../../middlewares/adminMiddleware');

const {
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember,
    createMember,
    getPackages
} = require('../../controllers/adminControllers/memberController');

// middleware
router.use(adminMiddleWare);

// Get all members
router.get('/', getAllMembers);

// Get a single member by ID
router.get('/:id', getMemberById);

// Create a new member
router.post('/', createMember);

// Update a member
router.put('/:id', updateMember);

// Delete a member
router.delete('/:id', deleteMember);

// Get all packages
router.get('/packages', getPackages);

module.exports = router;