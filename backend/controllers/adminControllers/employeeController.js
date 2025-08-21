const employeeModel = require('../../models/employee');

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        // Get all employees
        const employees = await employeeModel.find().sort({ createdAt: -1 });
        
        // Format employees data
        const formattedEmployees = employees.map(employee => {
            return {
                id: employee._id.toString(),
                fullName: employee.fullName,
                phone: employee.phone,
                email: employee.email,
                jobTitle: employee.jobTilte, // Note: keeping the original spelling from the model
                role: employee.role,
                profilePicture: employee.profilePicture,
                salary: employee.salary,
                hireDate: employee.hireData ? employee.hireData.toISOString().split('T')[0] : '',
                isActive: employee.isActive,
                createdAt: employee.createdAt,
                updatedAt: employee.updatedAt
            };
        });
        
        res.status(200).json(formattedEmployees);
    } catch (err) {
        console.error("Error in getAllEmployees:", err);
        res.status(400).json({ message: err.message });
    }
};

// Get a single employee by ID
const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find employee by ID
        const employee = await employeeModel.findById(id);
        
        if (!employee) {
            return res.status(404).json({ message: 'الموظف غير موجود' });
        }
        
        const formattedEmployee = {
            id: employee._id.toString(),
            fullName: employee.fullName,
            phone: employee.phone,
            email: employee.email,
            jobTitle: employee.jobTilte, // Note: keeping the original spelling from the model
            role: employee.role,
            profilePicture: employee.profilePicture,
            salary: employee.salary,
            hireDate: employee.hireData ? employee.hireData.toISOString().split('T')[0] : '',
            isActive: employee.isActive,
            createdAt: employee.createdAt,
            updatedAt: employee.updatedAt
        };
        
        res.status(200).json(formattedEmployee);
    } catch (err) {
        console.error("Error in getEmployeeById:", err);
        res.status(400).json({ message: err.message });
    }
};

// Create a new employee
const createEmployee = async (req, res) => {
    try {
        const { name, phone, email, password, role, salary, profilePicture } = req.body;
        
        // Use a default password if not provided
        const employeePassword = password || 'default123';
        
        // Create new employee using the model's static method
        const employee = await employeeModel.createEmploye(
            name,
            phone,
            email,
            employeePassword,
            role,
            role,
            profilePicture || 'default.jpg',
            salary ? parseInt(salary) : 0
        );
        
        const formattedEmployee = {
            id: employee._id.toString(),
            fullName: employee.fullName,
            phone: employee.phone,
            email: employee.email,
            jobTitle: employee.jobTilte, // Note: keeping the original spelling from the model
            role: employee.role,
            profilePicture: employee.profilePicture,
            salary: employee.salary,
            hireDate: employee.hireData ? employee.hireData.toISOString().split('T')[0] : '',
            isActive: employee.isActive,
            createdAt: employee.createdAt,
            updatedAt: employee.updatedAt
        };
        
        res.status(201).json({ 
            message: 'تم إنشاء الموظف بنجاح',
            employee: formattedEmployee
        });
    } catch (err) {
        console.error("Error in createEmployee:", err);
        res.status(400).json({ message: err.message });
    }
};

// Update an employee
const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, email, role, salary, profilePicture, isActive } = req.body;
        
        // Find and update the employee
        const employee = await employeeModel.findByIdAndUpdate(
            id,
            { fullName: name, phone, email, jobTilte: role, role, profilePicture, salary: salary ? parseInt(salary) : undefined, isActive },
            { new: true }
        );
        
        if (!employee) {
            return res.status(404).json({ message: 'الموظف غير موجود' });
        }
        
        const formattedEmployee = {
            id: employee._id.toString(),
            fullName: employee.fullName,
            phone: employee.phone,
            email: employee.email,
            jobTitle: employee.jobTilte, // Note: keeping the original spelling from the model
            role: employee.role,
            profilePicture: employee.profilePicture,
            salary: employee.salary,
            hireDate: employee.hireData ? employee.hireData.toISOString().split('T')[0] : '',
            isActive: employee.isActive,
            createdAt: employee.createdAt,
            updatedAt: employee.updatedAt
        };
        
        res.status(200).json({ 
            message: 'تم تحديث بيانات الموظف بنجاح',
            employee: formattedEmployee
        });
    } catch (err) {
        console.error("Error in updateEmployee:", err);
        res.status(400).json({ message: err.message });
    }
};

// Delete an employee
const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Delete employee using the model's static method
        const employee = await employeeModel.deleteEmploye(id);
        
        res.status(200).json({ 
            message: 'تم حذف الموظف بنجاح',
            employee: {
                id: employee._id.toString(),
                fullName: employee.fullName
            }
        });
    } catch (err) {
        console.error("Error in deleteEmployee:", err);
        res.status(400).json({ message: err.message });
    }
};

// Set employee active status
const setEmployeeActiveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        
        // Update employee active status using the model's static method
        const employee = await employeeModel.setActive(id, isActive);
        
        if (!employee) {
            return res.status(404).json({ message: 'الموظف غير موجود' });
        }
        
        res.status(200).json({ 
            message: `تم ${isActive ? 'تفعيل' : 'إلغاء تفعيل'} الموظف بنجاح`,
            employee: {
                id: employee._id.toString(),
                isActive
            }
        });
    } catch (err) {
        console.error("Error in setEmployeeActiveStatus:", err);
        res.status(400).json({ message: err.message });
    }
};

// Set employee salary
const setEmployeeSalary = async (req, res) => {
    try {
        const { id } = req.params;
        const { salary } = req.body;
        
        // Update employee salary using the model's static method
        const employee = await employeeModel.setSalary(id, salary);
        
        if (!employee) {
            return res.status(404).json({ message: 'الموظف غير موجود' });
        }
        
        res.status(200).json({ 
            message: 'تم تحديث راتب الموظف بنجاح',
            employee: {
                id: employee._id.toString(),
                salary
            }
        });
    } catch (err) {
        console.error("Error in setEmployeeSalary:", err);
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    setEmployeeActiveStatus,
    setEmployeeSalary
};