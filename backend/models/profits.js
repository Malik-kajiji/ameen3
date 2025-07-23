const mongoose = require('mongoose');

const schema = mongoose.Schema;

const profitSchema = new schema({
    amount: {
        type: Number,
        required: true
    },
    source: {
        type: String,
        required: true // e.g. "subscription", "other"
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    note: {
        type: String,
        default: ""
    }
}, { timestamps: true });

/**
 * Add a new profit record
 * @param {Number} amount - Profit amount
 * @param {String} source - Source of profit
 * @param {String} note - Optional note
 * @param {Date} date - Optional profit date (default: now)
 */
profitSchema.statics.addProfit = async function(amount, source, note = "", date = new Date()) {
    const profit = await this.create({
        amount,
        source,
        note,
        date
    });
    return profit;
};

/**
 * Get weekly profits: group by day in the last 7 days (or specify week)
 */
profitSchema.statics.getWeeklyProfits = async function(startDate = null) {
    // Default: current week (starting from last Sunday)
    let start;
    if (startDate) {
        start = new Date(startDate);
    } else {
        const now = new Date();
        start = new Date(now.setDate(now.getDate() - now.getDay())); // Last Sunday
        start.setHours(0, 0, 0, 0);
    }
    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    return this.aggregate([
        {
            $match: {
                date: { $gte: start, $lt: end }
            }
        },
        {
            $group: {
                _id: {
                    day: { $dayOfMonth: "$date" },
                    month: { $month: "$date" },
                    year: { $year: "$date" }
                },
                totalProfit: { $sum: "$amount" }
            }
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
        }
    ]);
};

/**
 * Get monthly profits: group by day for the current month (or specify month)
 */
profitSchema.statics.getMonthlyProfits = async function(year = null, month = null) {
    // Default: current month
    const now = new Date();
    year = year || now.getFullYear();
    month = month || now.getMonth() + 1; // JS Date: 0-indexed months
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    return this.aggregate([
        {
            $match: {
                date: { $gte: start, $lt: end }
            }
        },
        {
            $group: {
                _id: {
                    day: { $dayOfMonth: "$date" }
                },
                totalProfit: { $sum: "$amount" }
            }
        },
        {
            $sort: { "_id.day": 1 }
        }
    ]);
};

/**
 * Get yearly profits: group by month for the current year (or specify year)
 */
profitSchema.statics.getYearlyProfits = async function(year = null) {
    // Default: current year
    year = year || new Date().getFullYear();
    const start = new Date(year, 0, 1);
    const end = new Date(year + 1, 0, 1);

    return this.aggregate([
        {
            $match: {
                date: { $gte: start, $lt: end }
            }
        },
        {
            $group: {
                _id: {
                    month: { $month: "$date" }
                },
                totalProfit: { $sum: "$amount" }
            }
        },
        {
            $sort: { "_id.month": 1 }
        }
    ]);
};

module.exports = mongoose.model('profit', profitSchema);