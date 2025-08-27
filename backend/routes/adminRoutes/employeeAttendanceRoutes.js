const express = require('express');
const router = express.Router();
const {
    getEmployeeAttendance,
    createAttendance,
    updateAttendance,
    paySalary,
    getSalaryHistory
} = require('../../controllers/adminControllers/employeeAttendanceController');
const adminMiddleware = require('../../middlewares/adminMiddleware');

// Apply admin middleware to all routes
router.use(adminMiddleware);

// Attendance routes
router.get('/:employeeId/attendance', getEmployeeAttendance);
router.post('/:employeeId/attendance', createAttendance);
router.put('/attendance/:id', updateAttendance);

// Salary routes
router.post('/:employeeId/salary', paySalary);
router.get('/:employeeId/salary', getSalaryHistory);

module.exports = router;