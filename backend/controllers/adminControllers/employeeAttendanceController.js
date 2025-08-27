const employeeAttendanceModel = require('../../models/employeeAttendance');
const salaryModel = require('../../models/salary');
const expenseModel = require('../../models/expense');

// Get employee attendance records
const getEmployeeAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const records = await employeeAttendanceModel.getEmployeeAttendance(employeeId);
        
        res.status(200).json(records);
    } catch (err) {
        console.error("Error in getEmployeeAttendance:", err);
        res.status(400).json({ message: err.message });
    }
};

// Create attendance record
const createAttendance = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { date, status, hours } = req.body;

        const record = await employeeAttendanceModel.createAttendance(
            employeeId,
            date,
            status,
            hours
        );

        res.status(201).json({
            message: 'تم تسجيل الحضور بنجاح',
            record
        });
    } catch (err) {
        console.error("Error in createAttendance:", err);
        res.status(400).json({ message: err.message });
    }
};

// Update attendance record
const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, hours } = req.body;

        const record = await employeeAttendanceModel.updateAttendance(
            id,
            status,
            hours
        );

        if (!record) {
            return res.status(404).json({ message: 'سجل الحضور غير موجود' });
        }

        res.status(200).json({
            message: 'تم تحديث سجل الحضور بنجاح',
            record
        });
    } catch (err) {
        console.error("Error in updateAttendance:", err);
        res.status(400).json({ message: err.message });
    }
};

// Pay salary
const paySalary = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const { amount, month, date, notes } = req.body;

        // Create salary record
        const salary = await salaryModel.createSalary(
            employeeId,
            amount,
            month,
            date,
            notes
        );

        // Create expense record
        await expenseModel.addExpense(
            amount,
            'salaries',
            notes || `راتب شهر ${month}`,
            'paid',
            'cash',
            '',
            new Date(date)
        );

        res.status(201).json({
            message: 'تم دفع الراتب بنجاح',
            salary
        });
    } catch (err) {
        console.error("Error in paySalary:", err);
        res.status(400).json({ message: err.message });
    }
};

// Get employee salary history
const getSalaryHistory = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const payments = await salaryModel.getEmployeePayments(employeeId);
        
        res.status(200).json(payments);
    } catch (err) {
        console.error("Error in getSalaryHistory:", err);
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getEmployeeAttendance,
    createAttendance,
    updateAttendance,
    paySalary,
    getSalaryHistory
};