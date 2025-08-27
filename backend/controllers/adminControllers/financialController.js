const profitModel = require('../../models/profits');
const expenseModel = require('../../models/expense');
const subscriptionModel = require('../../models/subscriptions');
const packageModel = require('../../models/packages');

// Get financial overview data
const getFinancialOverview = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

        // Total income (profits) this month
        const monthlyProfits = await profitModel.aggregate([
            {
                $match: {
                    date: { $gte: startOfMonth, $lt: endOfMonth }
                }
            },
            {
                $group: { _id: null, total: { $sum: "$amount" } }
            }
        ]);
        const totalMonthlyIncome = monthlyProfits[0]?.total || 0;

        // Total expenses this month
        const monthlyExpenses = await expenseModel.aggregate([
            {
                $match: {
                    date: { $gte: startOfMonth, $lt: endOfMonth }
                }
            },
            {
                $group: { _id: null, total: { $sum: "$amount" } }
            }
        ]);
        const totalMonthlyExpenses = monthlyExpenses[0]?.total || 0;

        // Net profit this month
        const netProfit = totalMonthlyIncome - totalMonthlyExpenses;

        // Total income (profits) this year
        const yearlyProfits = await profitModel.aggregate([
            {
                $match: {
                    date: { $gte: startOfYear, $lt: endOfYear }
                }
            },
            {
                $group: { _id: null, total: { $sum: "$amount" } }
            }
        ]);
        const totalYearlyIncome = yearlyProfits[0]?.total || 0;

        // Total expenses this year
        const yearlyExpenses = await expenseModel.aggregate([
            {
                $match: {
                    date: { $gte: startOfYear, $lt: endOfYear }
                }
            },
            {
                $group: { _id: null, total: { $sum: "$amount" } }
            }
        ]);
        const totalYearlyExpenses = yearlyExpenses[0]?.total || 0;

        // Pending payments
        const pendingExpenses = await expenseModel.find({ status: 'pending' });
        const pendingAmount = pendingExpenses.reduce((sum, expense) => sum + expense.amount, 0);

        // Income by source this month
        const incomeBySource = await profitModel.aggregate([
            {
                $match: {
                    date: { $gte: startOfMonth, $lt: endOfMonth }
                }
            },
            {
                $group: {
                    _id: "$source",
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // Expenses by category this month
        const expensesByCategory = await expenseModel.getExpensesByCategorySummary(startOfMonth, endOfMonth);

        res.status(200).json({
            totalMonthlyIncome,
            totalMonthlyExpenses,
            netProfit,
            totalYearlyIncome,
            totalYearlyExpenses,
            pendingAmount,
            incomeBySource,
            expensesByCategory
        });
    } catch (err) {
        console.error("Error in getFinancialOverview:", err);
        res.status(400).json({ message: err.message });
    }
};

// Get income transactions
const getIncomeTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 20, startDate, endDate } = req.query;
        const skip = (page - 1) * limit;

        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        // Get profits with subscription details
        const profits = await profitModel.find(dateFilter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        // Format the data
        const transactions = await Promise.all(profits.map(async (profit) => {
            let memberName = 'غير محدد';
            let transactionType = profit.source;
            let status = 'مدفوع';
            
            if (profit.source === 'subscription') {
                transactionType = 'اشتراك عضو';
            } else if (profit.source === 'invoice') {
                memberName = profit.customerName || 'غير محدد';
                transactionType = 'فاتورة';
                status = profit.status || 'مدفوع';
            }

            return {
                id: profit._id,
                date: profit.date,
                member: memberName,
                type: transactionType,
                amount: profit.amount,
                method: 'نقدي',
                status: status,
                source: profit.source,
                note: profit.note,
                // Include invoice details if available
                customerEmail: profit.customerEmail,
                customerPhone: profit.customerPhone,
                dueDate: profit.dueDate,
                items: profit.items
            };
        }));

        // Get total count for pagination
        const total = await profitModel.countDocuments(dateFilter);

        res.status(200).json({
            transactions,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error("Error in getIncomeTransactions:", err);
        res.status(400).json({ message: err.message });
    }
};

// Get expense transactions
const getExpenseTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 20, startDate, endDate, category } = req.query;
        const skip = (page - 1) * limit;

        let filter = {};
        if (startDate && endDate) {
            filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (category) {
            filter.category = category;
        }

        const expenses = await expenseModel.find(filter)
            .sort({ date: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await expenseModel.countDocuments(filter);

        res.status(200).json({
            expenses: expenses.map(expense => ({
                id: expense._id,
                date: expense.date,
                category: expense.category,
                description: expense.description,
                amount: expense.amount,
                status: expense.status === 'paid' ? 'مدفوع' : expense.status === 'pending' ? 'معلق' : 'متأخر',
                paymentMethod: expense.paymentMethod === 'cash' ? 'نقدي' : expense.paymentMethod === 'card' ? 'بطاقة' : expense.paymentMethod === 'bank_transfer' ? 'تحويل' : 'آخر'
            })),
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error("Error in getExpenseTransactions:", err);
        res.status(400).json({ message: err.message });
    }
};

// Add a new expense
const addExpense = async (req, res) => {
    try {
        const { amount, category, description, date, status, paymentMethod, note } = req.body;

        // Validate required fields
        if (!amount || !category || !description) {
            return res.status(400).json({ message: 'الرجاء تعبئة جميع الحقول المطلوبة' });
        }

        const expense = await expenseModel.addExpense(
            amount,
            category,
            description,
            status || 'pending',
            paymentMethod || 'cash',
            note || '',
            date ? new Date(date) : new Date()
        );

        res.status(201).json({
            message: 'تمت إضافة المصروف بنجاح',
            expense: {
                id: expense._id,
                amount: expense.amount,
                category: expense.category,
                description: expense.description,
                date: expense.date,
                status: expense.status
            }
        });
    } catch (err) {
        console.error("Error in addExpense:", err);
        res.status(400).json({ message: err.message });
    }
};

// Create invoice (add profit from subscription)
const createInvoice = async (req, res) => {
    try {
        const {
            customerName,
            customerEmail,
            customerPhone,
            dueDate,
            notes,
            items,
            totalAmount,
            createdAt,
            status
        } = req.body;

        // Validate required fields
        if (!customerName || !items || !totalAmount) {
            return res.status(400).json({ message: 'الرجاء تعبئة جميع الحقول المطلوبة' });
        }

        // Add profit record with invoice details
        const profit = await profitModel.addProfit(
            totalAmount,
            'invoice',
            notes || '',
            createdAt ? new Date(createdAt) : new Date(),
            {
                customerName,
                customerEmail,
                customerPhone,
                dueDate: dueDate ? new Date(dueDate) : null,
                items,
                status
            }
        );

        // Format the response for income transactions list
        const formattedProfit = {
            id: profit._id,
            date: profit.date,
            member: profit.customerName,
            type: 'فاتورة',
            amount: profit.amount,
            method: 'نقدي',
            status: profit.status,
            source: profit.source,
            note: profit.note
        };

        res.status(201).json({
            message: 'تم إنشاء الفاتورة بنجاح',
            profit: formattedProfit
        });
    } catch (err) {
        console.error("Error in createInvoice:", err);
        res.status(400).json({ message: err.message });
    }
};

// Get financial reports data
const getFinancialReports = async (req, res) => {
    try {
        const { reportType, year, month } = req.query;
        const now = new Date();
        let startDate, endDate;

        if (reportType === 'monthly') {
            // Default to current month if not specified
            const reportYear = year ? parseInt(year) : now.getFullYear();
            const reportMonth = month ? parseInt(month) - 1 : now.getMonth(); // JS months are 0-indexed
            startDate = new Date(reportYear, reportMonth, 1);
            endDate = new Date(reportYear, reportMonth + 1, 1);
        } else if (reportType === 'yearly') {
            // Default to current year if not specified
            const reportYear = year ? parseInt(year) : now.getFullYear();
            startDate = new Date(reportYear, 0, 1);
            endDate = new Date(reportYear + 1, 0, 1);
        } else {
            // Default to current month
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        }

        // Get profits and expenses for the period
        const profits = await profitModel.find({
            date: { $gte: startDate, $lt: endDate }
        }).sort({ date: 1 });

        const expenses = await expenseModel.find({
            date: { $gte: startDate, $lt: endDate }
        }).sort({ date: 1 });

        // Calculate daily totals
        const dailyData = {};
        const dateSet = new Set();

        // Add all dates from profits and expenses
        profits.forEach(profit => {
            const dateStr = profit.date.toISOString().split('T')[0];
            dateSet.add(dateStr);
            if (!dailyData[dateStr]) {
                dailyData[dateStr] = { date: dateStr, income: 0, expenses: 0 };
            }
            dailyData[dateStr].income += profit.amount;
        });

        expenses.forEach(expense => {
            const dateStr = expense.date.toISOString().split('T')[0];
            dateSet.add(dateStr);
            if (!dailyData[dateStr]) {
                dailyData[dateStr] = { date: dateStr, income: 0, expenses: 0 };
            }
            dailyData[dateStr].expenses += expense.amount;
        });

        // Convert to array and calculate profit
        const reportData = Array.from(dateSet).map(date => {
            const data = dailyData[date] || { date, income: 0, expenses: 0 };
            return {
                ...data,
                profit: data.income - data.expenses
            };
        }).sort((a, b) => new Date(a.date) - new Date(b.date));

        // Summary data
        const totalIncome = reportData.reduce((sum, day) => sum + day.income, 0);
        const totalExpenses = reportData.reduce((sum, day) => sum + day.expenses, 0);
        const netProfit = totalIncome - totalExpenses;

        res.status(200).json({
            reportData,
            summary: {
                totalIncome,
                totalExpenses,
                netProfit
            },
            period: {
                startDate,
                endDate
            }
        });
    } catch (err) {
        console.error("Error in getFinancialReports:", err);
        res.status(400).json({ message: err.message });
    }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find and update the profit record
        const profit = await profitModel.findByIdAndUpdate(
            id,
            { status: 'مدفوع' },
            { new: true }
        );

        if (!profit) {
            return res.status(404).json({ message: 'المعاملة غير موجودة' });
        }

        res.status(200).json({
            message: 'تم تحديث حالة الدفع بنجاح',
            profit: {
                id: profit._id,
                date: profit.date,
                member: profit.customerName || 'غير محدد',
                type: profit.source === 'invoice' ? 'فاتورة' : profit.source,
                amount: profit.amount,
                method: 'نقدي',
                status: profit.status,
                source: profit.source,
                note: profit.note
            }
        });
    } catch (err) {
        console.error("Error in updatePaymentStatus:", err);
        res.status(400).json({ message: err.message });
    }
};

// Update expense status
const updateExpenseStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['paid', 'pending', 'overdue'].includes(status)) {
            return res.status(400).json({ message: 'حالة غير صالحة' });
        }

        // Find and update the expense record
        const expense = await expenseModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!expense) {
            return res.status(404).json({ message: 'المصروف غير موجود' });
        }

        // Format the response
        const formattedExpense = {
            id: expense._id,
            date: expense.date,
            category: expense.category,
            description: expense.description,
            amount: expense.amount,
            status: expense.status === 'paid' ? 'مدفوع' : expense.status === 'pending' ? 'معلق' : 'متأخر',
            paymentMethod: expense.paymentMethod === 'cash' ? 'نقدي' : expense.paymentMethod === 'card' ? 'بطاقة' : expense.paymentMethod === 'bank_transfer' ? 'تحويل' : 'آخر'
        };

        res.status(200).json({
            message: 'تم تحديث حالة المصروف بنجاح',
            expense: formattedExpense
        });
    } catch (err) {
        console.error("Error in updateExpenseStatus:", err);
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getFinancialOverview,
    getIncomeTransactions,
    getExpenseTransactions,
    addExpense,
    createInvoice,
    updatePaymentStatus,
    updateExpenseStatus,
    getFinancialReports
};