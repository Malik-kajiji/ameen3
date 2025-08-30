const reportModel = require('../../models/report');
const ExcelJS = require('exceljs');
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

// Download report in specified format
const downloadReport = async (req, res) => {
    try {
        const { type, period, format } = req.params;

        if (format !== 'xlsx') {
            return res.status(400).json({ message: 'Unsupported format. Only xlsx is supported.' });
        }

        // Get date range based on period
        const now = new Date();
        let from, to;
        switch (period) {
            case 'daily':
                from = new Date(now.setHours(0, 0, 0, 0));
                to = new Date(now.setHours(23, 59, 59, 999));
                break;
            case 'weekly':
                from = new Date(now.setDate(now.getDate() - now.getDay()));
                to = new Date(now.setDate(now.getDate() + 6));
                break;
            case 'monthly':
                from = new Date(now.getFullYear(), now.getMonth(), 1);
                to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'yearly':
                from = new Date(now.getFullYear(), 0, 1);
                to = new Date(now.getFullYear(), 11, 31);
                break;
            default:
                return res.status(400).json({ message: 'Invalid period' });
        }

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');

        // Add data based on report type
        switch (type) {
            case 'membership':
                const users = await userModel.find({
                    createdAt: { $gte: from, $lte: to }
                });
                
                worksheet.columns = [
                    { header: 'الاسم', key: 'name', width: 20 },
                    { header: 'البريد الإلكتروني', key: 'email', width: 30 },
                    { header: 'رقم الهاتف', key: 'phone', width: 15 },
                    { header: 'نوع العضوية', key: 'membershipType', width: 15 },
                    { header: 'الحالة', key: 'status', width: 10 },
                    { header: 'تاريخ التسجيل', key: 'createdAt', width: 20 }
                ];

                users.forEach(user => {
                    worksheet.addRow({
                        name: user.name,
                        email: user.email,
                        phone: user.phone,
                        membershipType: user.membershipType,
                        status: user.status,
                        createdAt: user.createdAt.toLocaleDateString('ar-LY')
                    });
                });
                break;

            case 'financial':
                const profits = await profitModel.find({
                    date: { $gte: from, $lte: to }
                });
                const expenses = await expenseModel.find({
                    date: { $gte: from, $lte: to }
                });

                worksheet.columns = [
                    { header: 'النوع', key: 'type', width: 15 },
                    { header: 'المصدر', key: 'source', width: 20 },
                    { header: 'المبلغ', key: 'amount', width: 15 },
                    { header: 'التاريخ', key: 'date', width: 20 },
                    { header: 'ملاحظات', key: 'notes', width: 30 }
                ];

                profits.forEach(profit => {
                    worksheet.addRow({
                        type: 'إيراد',
                        source: profit.source,
                        amount: profit.amount,
                        date: profit.date.toLocaleDateString('ar-LY'),
                        notes: profit.notes
                    });
                });

                expenses.forEach(expense => {
                    worksheet.addRow({
                        type: 'مصروف',
                        source: expense.category,
                        amount: -expense.amount,
                        date: expense.date.toLocaleDateString('ar-LY'),
                        notes: expense.description
                    });
                });
                break;

            case 'assets':
                const assets = await assetModel.find({
                    createdAt: { $gte: from, $lte: to }
                });

                worksheet.columns = [
                    { header: 'اسم المعدة', key: 'name', width: 20 },
                    { header: 'النوع', key: 'type', width: 15 },
                    { header: 'الحالة', key: 'status', width: 15 },
                    { header: 'تكلفة الشراء', key: 'purchaseCost', width: 15 },
                    { header: 'تاريخ الشراء', key: 'purchaseDate', width: 20 },
                    { header: 'آخر صيانة', key: 'lastMaintenance', width: 20 }
                ];

                assets.forEach(asset => {
                    worksheet.addRow({
                        name: asset.name,
                        type: asset.type,
                        status: asset.status,
                        purchaseCost: asset.purchaseCost,
                        purchaseDate: asset.purchaseDate.toLocaleDateString('ar-LY'),
                        lastMaintenance: asset.lastMaintenance?.toLocaleDateString('ar-LY') || 'لا يوجد'
                    });
                });
                break;

            case 'employees':
                const employees = await employeeModel.find({
                    createdAt: { $gte: from, $lte: to }
                });

                worksheet.columns = [
                    { header: 'الاسم', key: 'name', width: 20 },
                    { header: 'الوظيفة', key: 'position', width: 15 },
                    { header: 'الراتب', key: 'salary', width: 15 },
                    { header: 'رقم الهاتف', key: 'phone', width: 15 },
                    { header: 'البريد الإلكتروني', key: 'email', width: 30 },
                    { header: 'تاريخ التعيين', key: 'hireDate', width: 20 }
                ];

                employees.forEach(employee => {
                    worksheet.addRow({
                        name: employee.name,
                        position: employee.position,
                        salary: employee.salary,
                        phone: employee.phone,
                        email: employee.email,
                        hireDate: employee.hireDate.toLocaleDateString('ar-LY')
                    });
                });
                break;

            default:
                return res.status(400).json({ message: 'Invalid report type' });
        }

        // Set RTL direction for the worksheet
        worksheet.views = [{ rightToLeft: true }];

        // Write to buffer
        const buffer = await workbook.xlsx.writeBuffer();

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=${type}-${period}-report.xlsx`);

        // Send the buffer
        res.send(buffer);

    } catch (err) {
        console.error("Error in downloadReport:", err);
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
    toggleSchedule,
    downloadReport
};