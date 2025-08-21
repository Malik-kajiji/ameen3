const express = require('express');
const router = express.Router();
const adminMiddleWare = require('../../middlewares/adminMiddleware');

const {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    setEmployeeActiveStatus,
    setEmployeeSalary
} = require('../../controllers/adminControllers/employeeController');

// middleware
router.use(adminMiddleWare);

// Get all employees
router.get('/', getAllEmployees);

// Get a single employee by ID
router.get('/:id', getEmployeeById);

// Create a new employee
router.post('/', createEmployee);

// Update an employee
router.put('/:id', updateEmployee);

// Delete an employee
router.delete('/:id', deleteEmployee);

// Set employee active status
router.put('/:id/active', setEmployeeActiveStatus);

// Set employee salary
router.put('/:id/salary', setEmployeeSalary);

module.exports = router;