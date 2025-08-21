const mongoose = require('mongoose');

const schema = mongoose.Schema;

const expenseSchema = new schema({
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true // e.g. "rent", "utilities", "salaries", "maintenance"
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['paid', 'pending', 'overdue'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'bank_transfer', 'other'],
        default: 'cash'
    },
    note: {
        type: String,
        default: ""
    }
}, { timestamps: true });

/**
 * Add a new expense record
 * @param {Number} amount - Expense amount
 * @param {String} category - Expense category
 * @param {String} description - Expense description
 * @param {String} status - Expense status
 * @param {String} paymentMethod - Payment method
 * @param {String} note - Optional note
 * @param {Date} date - Optional expense date (default: now)
 */
expenseSchema.statics.addExpense = async function(amount, category, description, status = 'pending', paymentMethod = 'cash', note = "", date = new Date()) {
    const expense = await this.create({
        amount,
        category,
        description,
        status,
        paymentMethod,
        note,
        date
    });
    return expense;
};

/**
 * Get expenses by date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 */
expenseSchema.statics.getExpensesByDateRange = async function(startDate, endDate) {
    return this.find({
        date: { $gte: startDate, $lte: endDate }
    }).sort({ date: -1 });
};

/**
 * Get expenses by category
 * @param {String} category - Expense category
 */
expenseSchema.statics.getExpensesByCategory = async function(category) {
    return this.find({ category }).sort({ date: -1 });
};

/**
 * Get total expenses in a date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 */
expenseSchema.statics.getTotalExpenses = async function(startDate, endDate) {
    const result = await this.aggregate([
        {
            $match: {
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$amount" }
            }
        }
    ]);
    return result[0]?.total || 0;
};

/**
 * Get expenses grouped by category for a date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 */
expenseSchema.statics.getExpensesByCategorySummary = async function(startDate, endDate) {
    return this.aggregate([
        {
            $match: {
                date: { $gte: startDate, $lte: endDate }
            }
        },
        {
            $group: {
                _id: "$category",
                total: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { total: -1 }
        }
    ]);
};

module.exports = mongoose.model('expense', expenseSchema);