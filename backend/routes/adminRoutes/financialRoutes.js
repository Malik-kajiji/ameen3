const express = require('express');
const router = express.Router();
const adminMiddleWare = require('../../middlewares/adminMiddleware');

const {
    getFinancialOverview,
    getIncomeTransactions,
    getExpenseTransactions,
    addExpense,
    createInvoice,
    updatePaymentStatus,
    updateExpenseStatus,
    getFinancialReports
} = require('../../controllers/adminControllers/financialController');

// middleware
router.use(adminMiddleWare);

// Get financial overview data
router.get('/overview', getFinancialOverview);

// Get income transactions
router.get('/income', getIncomeTransactions);

// Get expense transactions
router.get('/expenses', getExpenseTransactions);

// Add a new expense
router.post('/expenses', addExpense);

// Create invoice
router.post('/invoices', createInvoice);

// Update payment status
router.put('/income/:id/status', updatePaymentStatus);

// Get financial reports
router.get('/reports', getFinancialReports);

// Update expense status
router.put('/expenses/:id/status', updateExpenseStatus);

module.exports = router;