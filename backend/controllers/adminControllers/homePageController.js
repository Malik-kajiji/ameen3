const userModel = require('../../models/user');
const profitModel = require('../../models/profits');
const subscriptionModel = require('../../models/subscriptions');
const userAttendanceModel = require('../../models/userAttendance');
const packageModel = require('../../models/packages');

const getStartOfWeek = (date = new Date()) => {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() - d.getDay());
    return d;
};
const getEndOfWeek = (date = new Date()) => {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 7);
    return end;
};
const getStartOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth(), 1);
const getEndOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth() + 1, 1);
const getStartOfYear = (date = new Date()) => new Date(date.getFullYear(), 0, 1);
const getEndOfYear = (date = new Date()) => new Date(date.getFullYear() + 1, 0, 1);

const getHomePageData = async (req, res) => {
    try {
        // Timeframes
        const now = new Date();
        const weekStart = getStartOfWeek(now);
        const weekEnd = getEndOfWeek(now);
        const monthStart = getStartOfMonth(now);
        const monthEnd = getEndOfMonth(now);

        // Total users
        const totalUsers = await userModel.countDocuments();

        // New users this week
        const newUsersThisWeek = await userModel.countDocuments({
            createdAt: { $gte: weekStart, $lt: weekEnd }
        });

        // Total profits this week
        const weeklyProfits = await profitModel.aggregate([
            {
                $match: {
                    date: { $gte: weekStart, $lt: weekEnd }
                }
            },
            {
                $group: { _id: null, total: { $sum: "$amount" } }
            }
        ]);
        const totalWeeklyProfits = weeklyProfits[0]?.total || 0;

        // Profits by day this week
        const profitByDay = await profitModel.aggregate([
            {
                $match: {
                    date: { $gte: weekStart, $lt: weekEnd }
                }
            },
            {
                $group: {
                    _id: { $dayOfWeek: "$date" },
                    date: { $first: "$date" },
                    profit: { $sum: "$amount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]).then(arr =>
            arr.map(item => ({
                day: item.date.toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric' }),
                profit: item.profit
            }))
        );

        // Ended subscriptions this month
        const endedSubscriptionsThisMonth = await subscriptionModel.countDocuments({
            status: 'ended',
            endDate: { $gte: monthStart, $lt: monthEnd }
        });

        // Package percentage (types)
        const totalSubs = await subscriptionModel.countDocuments();
        const packages = await packageModel.find();
        const packageCounts = await subscriptionModel.aggregate([
            {
                $group: {
                    _id: "$packageName",
                    count: { $sum: 1 }
                }
            }
        ]);
        

        
        const packagePercentage = packages.map(pkg => {
            const found = packageCounts.find(pc => pc._id === pkg.title);
            const count = found ? found.count : 0;
            const percentage = totalSubs === 0 ? 0 : Math.round((count / totalSubs) * 100);
            

            
            return {
                packageName: pkg.title,
                percentage: percentage
            };
        });

        // Attendance by day (this week)
        const allAttendance = await userAttendanceModel.find();
        // Flatten all attendance data for the week
        let attendanceByDayMap = {};
        allAttendance.forEach(userAttend => {
            (userAttend.data || []).forEach(entry => {
                const dateObj = new Date(entry.date);
                if (dateObj >= weekStart && dateObj < weekEnd) {
                    const dayStr = dateObj.toISOString().slice(0, 10); // YYYY-MM-DD
                    attendanceByDayMap[dayStr] = (attendanceByDayMap[dayStr] || 0) + 1;
                }
            });
        });
        const attendanceByDay = Object.entries(attendanceByDayMap).map(([day, count]) => ({
            day,
            attendanceCount: count
        })).sort((a, b) => new Date(a.day) - new Date(b.day));

        // Average user attendance (this week)
        const totalAttendanceEvents = Object.values(attendanceByDayMap).reduce((a, b) => a + b, 0);
        const averageAttendance = totalUsers === 0 ? 0 : +(totalAttendanceEvents / totalUsers).toFixed(2);

        res.status(200).json({
            totalUsers,
            newUsersThisWeek,
            totalWeeklyProfits,
            averageAttendance,
            endedSubscriptionsThisMonth,
            profitByDay,
            packagePercentage,
            attendanceByDay
        });
    } catch (err) {
        console.error("Error in getHomePageData:", err);
        res.status(400).json({ message: err.message });
    }
};

const getDashboardDataByTimeframe = async (req, res) => {
    try {
        const { timeframe } = req.params;
        const now = new Date();
        let start, end, groupBy, dateFormat;

        if (timeframe === 'weekly') {
            start = getStartOfWeek(now);
            end = getEndOfWeek(now);
            groupBy = { $dayOfWeek: "$date" };
            dateFormat = { weekday: 'short', month: 'short', day: 'numeric' };
        } else if (timeframe === 'monthly') {
            start = getStartOfMonth(now);
            end = getEndOfMonth(now);
            groupBy = { $dayOfMonth: "$date" };
            dateFormat = { month: 'short', day: 'numeric' };
        } else if (timeframe === 'yearly') {
            start = getStartOfYear(now);
            end = getEndOfYear(now);
            groupBy = { $month: "$date" };
            dateFormat = { month: 'short', year: 'numeric' };
        } else {
            return res.status(400).json({ message: 'Invalid timeframe' });
        }

        // Users
        const totalUsers = await userModel.countDocuments();
        const newUsers = await userModel.countDocuments({ createdAt: { $gte: start, $lt: end } });

        // Profits in timeframe
        const profits = await profitModel.aggregate([
            { $match: { date: { $gte: start, $lt: end } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalProfits = profits[0]?.total || 0;

        // Profits by time unit
        const profitByTimeUnit = await profitModel.aggregate([
            { $match: { date: { $gte: start, $lt: end } } },
            {
                $group: {
                    _id: groupBy,
                    date: { $first: "$date" },
                    profit: { $sum: "$amount" }
                }
            },
            { $sort: { "_id": 1 } }
        ]).then(arr =>
            arr.map(item => ({
                timeUnit: item.date.toLocaleDateString('en-GB', dateFormat),
                profit: item.profit
            }))
        );

        // Ended subscriptions in timeframe
        const endedSubscriptions = await subscriptionModel.countDocuments({
            status: 'ended',
            endDate: { $gte: start, $lt: end }
        });

        // Package percentage
        const totalSubs = await subscriptionModel.countDocuments({ createdAt: { $gte: start, $lt: end } });
        const packages = await packageModel.find();
        const packageCounts = await subscriptionModel.aggregate([
            { $match: { createdAt: { $gte: start, $lt: end } } },
            { $group: { _id: "$packageName", count: { $sum: 1 } } }
        ]);
        
        // Debug information
        console.log(`Timeframe: ${timeframe}, Total subscriptions in timeframe:`, totalSubs);
        console.log("Packages:", packages.map(p => p.title));
        console.log("Package counts in timeframe:", packageCounts);
        
        const packagePercentage = packages.map(pkg => {
            const found = packageCounts.find(pc => pc._id === pkg.title);
            const count = found ? found.count : 0;
            const percentage = totalSubs === 0 ? 0 : Math.round((count / totalSubs) * 100);
            
            // Debug information for each package
            console.log(`Timeframe ${timeframe}, Package: ${pkg.title}, Found: ${!!found}, Count: ${count}, Percentage: ${percentage}`);
            
            return {
                packageName: pkg.title,
                percentage: percentage
            };
        });

        // Attendance by time unit
        const allAttendance = await userAttendanceModel.find();
        let attendanceByTimeUnitMap = {};
        allAttendance.forEach(userAttend => {
            (userAttend.data || []).forEach(entry => {
                const dateObj = new Date(entry.date);
                if (dateObj >= start && dateObj < end) {
                    let timeKey;
                    if (timeframe === 'weekly')
                        timeKey = dateObj.toISOString().slice(0, 10);
                    else if (timeframe === 'monthly')
                        timeKey = dateObj.toISOString().slice(0, 10);
                    else if (timeframe === 'yearly')
                        timeKey = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;
                    attendanceByTimeUnitMap[timeKey] = (attendanceByTimeUnitMap[timeKey] || 0) + 1;
                }
            });
        });
        const attendanceByTimeUnit = Object.entries(attendanceByTimeUnitMap).map(([timeUnit, count]) => ({
            timeUnit,
            attendanceCount: count
        })).sort((a, b) => a.timeUnit.localeCompare(b.timeUnit));

        // Average user attendance in timeframe
        const totalAttendanceEvents = Object.values(attendanceByTimeUnitMap).reduce((a, b) => a + b, 0);
        const averageAttendance = totalUsers === 0 ? 0 : +(totalAttendanceEvents / totalUsers).toFixed(2);

        res.status(200).json({
            totalUsers,
            newUsersInTimeframe: newUsers,
            totalProfitsInTimeframe: totalProfits,
            averageAttendanceInTimeframe: averageAttendance,
            endedSubscriptionsInTimeframe: endedSubscriptions,
            profitByTimeUnit,
            packagePercentage,
            attendanceByTimeUnit
        });
    } catch (err) {
        console.error("Error in getDashboardDataByTimeframe:", err);
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getHomePageData,
    getDashboardDataByTimeframe
};