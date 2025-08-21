const reportModel = require('../../models/report');
const userModel = require('../../models/user');
const employeeModel = require('../../models/employee');
const expenseModel = require('../../models/expense');
const profitModel = require('../../models/profits');
const assetModel = require('../../models/assets');

// Get all reports with pagination and filtering
const getReports = async (req, res) => {
    try {
        const { page = 1, limit = 10, type, status } = req.query;
        const skip = (page - 1) * limit;

        let query = {};
        if (type) query.type = type;
        if (status) query.status = status;

        const reports = await reportModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await reportModel.countDocuments(query);

        res.status(200).json({
            reports,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        console.error("Error in getReports:", err);
        res.status(400).json({ message: err.message });
    }
};

// Create a new report
const createReport = async (req, res) => {
    try {
        const {
            title,
            type,
            description,
            dateRange,
            filters,
            includeCharts,
            includeDetails,
            format,
            schedule
        } = req.body;

        const report = await reportModel.create({
            title,
            type,
            description,
            dateRange,
            filters,
            includeCharts,
            includeDetails,
            format,
            schedule,
            status: schedule?.enabled ? 'مجدول' : 'نشط'
        });

        res.status(201).json({
            message: 'تم إنشاء التقرير بنجاح',
            report
        });
    } catch (err) {
        console.error("Error in createReport:", err);
        res.status(400).json({ message: err.message });
    }
};

// Update a report
const updateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const report = await reportModel.findByIdAndUpdate(
            id,
            { ...updateData },
            { new: true, runValidators: true }
        );

        if (!report) {
            return res.status(404).json({ message: 'التقرير غير موجود' });
        }

        res.status(200).json({
            message: 'تم تحديث التقرير بنجاح',
            report
        });
    } catch (err) {
        console.error("Error in updateReport:", err);
        res.status(400).json({ message: err.message });
    }
};

// Delete a report
const deleteReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await reportModel.findByIdAndDelete(id);

        if (!report) {
            return res.status(404).json({ message: 'التقرير غير موجود' });
        }

        res.status(200).json({
            message: 'تم حذف التقرير بنجاح'
        });
    } catch (err) {
        console.error("Error in deleteReport:", err);
        res.status(400).json({ message: err.message });
    }
};

// Generate report data based on type
const generateReport = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await reportModel.findById(id);

        if (!report) {
            return res.status(404).json({ message: 'التقرير غير موجود' });
        }

        let reportData = {};
        const { from, to } = report.dateRange;

        switch (report.type) {
            case 'membership':
                const users = await userModel.find({
                    createdAt: { $gte: from, $lte: to }
                });
                reportData = {
                    totalMembers: users.length,
                    activeMembers: users.filter(u => u.status === 'active').length,
                    inactiveMembers: users.filter(u => u.status === 'inactive').length,
                    membershipTypes: await userModel.aggregate([
                        {
                            $match: {
                                createdAt: { $gte: from, $lte: to }
                            }
                        },
                        {
                            $group: {
                                _id: "$membershipType",
                                count: { $sum: 1 }
                            }
                        }
                    ])
                };
                break;

            case 'financial':
                const profits = await profitModel.find({
                    date: { $gte: from, $lte: to }
                });
                const expenses = await expenseModel.find({
                    date: { $gte: from, $lte: to }
                });
                
                reportData = {
                    totalIncome: profits.reduce((sum, p) => sum + p.amount, 0),
                    totalExpenses: expenses.reduce((sum, e) => sum + e.amount, 0),
                    profitsBySource: await profitModel.aggregate([
                        {
                            $match: {
                                date: { $gte: from, $lte: to }
                            }
                        },
                        {
                            $group: {
                                _id: "$source",
                                total: { $sum: "$amount" }
                            }
                        }
                    ]),
                    expensesByCategory: await expenseModel.getExpensesByCategorySummary(from, to)
                };
                break;

            case 'equipment':
                reportData = {
                    assets: await assetModel.find({
                        createdAt: { $gte: from, $lte: to }
                    }),
                    maintenanceLogs: await assetModel.aggregate([
                        {
                            $match: {
                                'maintenanceLogs.date': { $gte: from, $lte: to }
                            }
                        },
                        {
                            $unwind: '$maintenanceLogs'
                        },
                        {
                            $group: {
                                _id: '$name',
                                totalMaintenance: { $sum: 1 },
                                totalCost: { $sum: '$maintenanceLogs.cost' }
                            }
                        }
                    ])
                };
                break;

            case 'employee':
                reportData = {
                    employees: await employeeModel.find({
                        createdAt: { $gte: from, $lte: to }
                    }),
                    attendance: await employeeModel.aggregate([
                        {
                            $match: {
                                'attendance.date': { $gte: from, $lte: to }
                            }
                        },
                        {
                            $unwind: '$attendance'
                        },
                        {
                            $group: {
                                _id: '$name',
                                totalDays: { $sum: 1 },
                                presentDays: {
                                    $sum: { $cond: ['$attendance.present', 1, 0] }
                                }
                            }
                        }
                    ])
                };
                break;

            default:
                reportData = {};
        }

        // Update last generated date
        report.lastGenerated = new Date();
        if (report.schedule.enabled) {
            report.nextRun = report.calculateNextRun();
        }
        await report.save();

        res.status(200).json({
            report,
            data: reportData
        });
    } catch (err) {
        console.error("Error in generateReport:", err);
        res.status(400).json({ message: err.message });
    }
};

// Get scheduled reports
const getScheduledReports = async (req, res) => {
    try {
        const reports = await reportModel.getScheduledReports();
        res.status(200).json({ reports });
    } catch (err) {
        console.error("Error in getScheduledReports:", err);
        res.status(400).json({ message: err.message });
    }
};

// Toggle report schedule
const toggleSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const report = await reportModel.findById(id);

        if (!report) {
            return res.status(404).json({ message: 'التقرير غير موجود' });
        }

        report.schedule.enabled = !report.schedule.enabled;
        report.status = report.schedule.enabled ? 'مجدول' : 'نشط';
        if (report.schedule.enabled) {
            report.nextRun = report.calculateNextRun();
        } else {
            report.nextRun = null;
        }

        await report.save();

        res.status(200).json({
            message: `تم ${report.schedule.enabled ? 'تفعيل' : 'تعطيل'} جدولة التقرير`,
            report
        });
    } catch (err) {
        console.error("Error in toggleSchedule:", err);
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getReports,
    createReport,
    updateReport,
    deleteReport,
    generateReport,
    getScheduledReports,
    toggleSchedule
};