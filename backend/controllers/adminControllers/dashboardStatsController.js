const userModel = require('../../models/user');
const userAttendanceModel = require('../../models/userAttendance');
const profitModel = require('../../models/profits');
const maintenanceLogModel = require('../../models/maintenanceLog');

// Get monthly stats
const getMonthlyStats = async (req, res) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        // Get monthly attendance
        const monthlyAttendance = await userAttendanceModel.countDocuments({
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

        // Get monthly revenue
        const monthlyRevenue = await profitModel.aggregate([
            {
                $match: {
                    date: {
                        $gte: startOfMonth,
                        $lte: endOfMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // Get new members this month
        const newMembers = await userModel.countDocuments({
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

        // Get maintenance costs
        const maintenanceLogs = await maintenanceLogModel.find({
            maintenanceDate: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });
        const maintenanceCost = maintenanceLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

        res.status(200).json({
            monthlyAttendance,
            monthlyRevenue: monthlyRevenue[0]?.total || 0,
            newMembers,
            maintenanceCost
        });
    } catch (err) {
        console.error("Error in getMonthlyStats:", err);
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getMonthlyStats
};