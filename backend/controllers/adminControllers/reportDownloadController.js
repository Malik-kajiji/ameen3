const userModel = require('../../models/user');
const employeeModel = require('../../models/employee');
const assetModel = require('../../models/assets');
const profitModel = require('../../models/profits');
const expenseModel = require('../../models/expense');
const stopRequestModel = require('../../models/stopRequests');
const subscriptionModel = require('../../models/subscriptions');

const getDateRange = (period) => {
    const now = new Date();
    let startDate, endDate = now;

    switch (period) {
        case 'daily':
            startDate = new Date(now.setHours(0, 0, 0, 0));
            break;
        case 'weekly':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case 'monthly':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        case 'yearly':
            startDate = new Date(now.getFullYear(), 0, 1);
            break;
        default:
            startDate = new Date(now.setHours(0, 0, 0, 0));
    }

    return { startDate, endDate };
};

// Download membership report
const downloadMembershipReport = async (req, res) => {
    try {
        const { period, format } = req.params;
        const { startDate, endDate } = getDateRange(period);

        const data = {
            newMembers: await userModel.find({
                createdAt: { $gte: startDate, $lte: endDate }
            }),
            subscriptions: await subscriptionModel.find({
                createdAt: { $gte: startDate, $lte: endDate }
            }),
            stopRequests: await stopRequestModel.find({
                createdAt: { $gte: startDate, $lte: endDate }
            })
        };

        // Convert data to the requested format
        let fileContent = '';
        const formatLower = format.toLowerCase();
        if (!['word', 'excel', 'pdf'].includes(formatLower)) {
            return res.status(400).json({ message: 'صيغة الملف غير مدعومة' });
        }

        const fileName = `membership-report-${period}.${formatLower}`;
        const mimeTypes = {
            'word': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'pdf': 'application/pdf'
        };
        
        res.setHeader('Content-Type', mimeTypes[formatLower]);
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        
        switch (formatLower) {
            case 'word':
            case 'excel':
            case 'pdf':
                // Format data for better readability
                const formattedData = {
                    ...data,
                    newMembers: data.newMembers.map(m => ({
                        name: m.name,
                        phone: m.phone,
                        joinDate: new Date(m.createdAt).toLocaleDateString('ar-LY')
                    })),
                    subscriptions: data.subscriptions.map(s => ({
                        member: s.member,
                        package: s.package,
                        startDate: new Date(s.startDate).toLocaleDateString('ar-LY'),
                        endDate: new Date(s.endDate).toLocaleDateString('ar-LY'),
                        amount: s.amount
                    }))
                };
                fileContent = Buffer.from(JSON.stringify(formattedData, null, 2));
                break;
            default:
                throw new Error('Unsupported format');
        }

        res.send(fileContent);
    } catch (err) {
        console.error("Error in downloadMembershipReport:", err);
        if (err.message === 'Unsupported format') {
            res.status(400).json({ message: 'صيغة الملف غير مدعومة' });
        } else {
            res.status(500).json({ message: 'حدث خطأ أثناء تحميل التقرير' });
        }
    }
};

// Download financial report
const downloadFinancialReport = async (req, res) => {
    try {
        const { period, format } = req.params;
        const { startDate, endDate } = getDateRange(period);

        const data = {
            profits: await profitModel.find({
                date: { $gte: startDate, $lte: endDate }
            }),
            expenses: await expenseModel.find({
                date: { $gte: startDate, $lte: endDate }
            })
        };

        // Convert data to the requested format
        let fileContent = '';
        const formatLower = format.toLowerCase();
        if (!['word', 'excel', 'pdf'].includes(formatLower)) {
            return res.status(400).json({ message: 'صيغة الملف غير مدعومة' });
        }

        const fileName = `financial-report-${period}.${formatLower}`;
        const mimeTypes = {
            'word': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'pdf': 'application/pdf'
        };
        
        res.setHeader('Content-Type', mimeTypes[formatLower]);
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        
        switch (formatLower) {
            case 'word':
            case 'excel':
            case 'pdf':
                // Format data for better readability
                const formattedData = {
                    profits: data.profits.map(p => ({
                        amount: p.amount,
                        date: new Date(p.date).toLocaleDateString('ar-LY'),
                        description: p.description
                    })),
                    expenses: data.expenses.map(e => ({
                        amount: e.amount,
                        date: new Date(e.date).toLocaleDateString('ar-LY'),
                        category: e.category,
                        description: e.description
                    }))
                };
                fileContent = Buffer.from(JSON.stringify(formattedData, null, 2));
                break;
            default:
                throw new Error('Unsupported format');
        }

        res.send(fileContent);
    } catch (err) {
        console.error("Error in downloadFinancialReport:", err);
        if (err.message === 'Unsupported format') {
            res.status(400).json({ message: 'صيغة الملف غير مدعومة' });
        } else {
            res.status(500).json({ message: 'حدث خطأ أثناء تحميل التقرير' });
        }
    }
};

// Download assets report
const downloadAssetsReport = async (req, res) => {
    try {
        const { period, format } = req.params;
        const { startDate, endDate } = getDateRange(period);

        const data = {
            assets: await assetModel.find(),
            maintenanceLogs: await assetModel.aggregate([
                {
                    $match: {
                        'maintenanceLogs.date': { $gte: startDate, $lte: endDate }
                    }
                },
                { $unwind: '$maintenanceLogs' },
                {
                    $group: {
                        _id: '$name',
                        totalMaintenance: { $sum: 1 },
                        totalCost: { $sum: '$maintenanceLogs.cost' }
                    }
                }
            ])
        };

        // Convert data to the requested format
        let fileContent = '';
        const formatLower = format.toLowerCase();
        if (!['word', 'excel', 'pdf'].includes(formatLower)) {
            return res.status(400).json({ message: 'صيغة الملف غير مدعومة' });
        }

        const fileName = `assets-report-${period}.${formatLower}`;
        const mimeTypes = {
            'word': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'pdf': 'application/pdf'
        };
        
        res.setHeader('Content-Type', mimeTypes[formatLower]);
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        
        switch (formatLower) {
            case 'word':
            case 'excel':
            case 'pdf':
                // Format data for better readability
                const formattedData = {
                    assets: data.assets.map(a => ({
                        name: a.name,
                        status: a.status,
                        purchaseDate: new Date(a.purchaseDate).toLocaleDateString('ar-LY'),
                        lastMaintenance: a.maintenanceLogs?.length ?
                            new Date(a.maintenanceLogs[a.maintenanceLogs.length - 1].date).toLocaleDateString('ar-LY') :
                            'لا يوجد'
                    })),
                    maintenanceSummary: data.maintenanceLogs.map(m => ({
                        asset: m._id,
                        totalMaintenance: m.totalMaintenance,
                        totalCost: m.totalCost
                    }))
                };
                fileContent = Buffer.from(JSON.stringify(formattedData, null, 2));
                break;
            default:
                throw new Error('Unsupported format');
        }

        res.send(fileContent);
    } catch (err) {
        console.error("Error in downloadAssetsReport:", err);
        if (err.message === 'Unsupported format') {
            res.status(400).json({ message: 'صيغة الملف غير مدعومة' });
        } else {
            res.status(500).json({ message: 'حدث خطأ أثناء تحميل التقرير' });
        }
    }
};

// Download employees report
const downloadEmployeesReport = async (req, res) => {
    try {
        const { period, format } = req.params;
        const { startDate, endDate } = getDateRange(period);

        const data = {
            employees: await employeeModel.find(),
            attendance: await employeeModel.aggregate([
                {
                    $match: {
                        'attendance.date': { $gte: startDate, $lte: endDate }
                    }
                },
                { $unwind: '$attendance' },
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

        // Convert data to the requested format
        let fileContent = '';
        const formatLower = format.toLowerCase();
        if (!['word', 'excel', 'pdf'].includes(formatLower)) {
            return res.status(400).json({ message: 'صيغة الملف غير مدعومة' });
        }

        const fileName = `employees-report-${period}.${formatLower}`;
        const mimeTypes = {
            'word': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'pdf': 'application/pdf'
        };
        
        res.setHeader('Content-Type', mimeTypes[formatLower]);
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        
        switch (formatLower) {
            case 'word':
            case 'excel':
            case 'pdf':
                // Format data for better readability
                const formattedData = {
                    employees: data.employees.map(e => ({
                        name: e.name,
                        position: e.position,
                        salary: e.salary,
                        joinDate: new Date(e.joinDate).toLocaleDateString('ar-LY')
                    })),
                    attendanceSummary: data.attendance.map(a => ({
                        employee: a._id,
                        totalDays: a.totalDays,
                        presentDays: a.presentDays,
                        attendanceRate: `${((a.presentDays / a.totalDays) * 100).toFixed(1)}%`
                    }))
                };
                fileContent = Buffer.from(JSON.stringify(formattedData, null, 2));
                break;
            default:
                throw new Error('Unsupported format');
        }

        res.send(fileContent);
    } catch (err) {
        console.error("Error in downloadEmployeesReport:", err);
        if (err.message === 'Unsupported format') {
            res.status(400).json({ message: 'صيغة الملف غير مدعومة' });
        } else {
            res.status(500).json({ message: 'حدث خطأ أثناء تحميل التقرير' });
        }
    }
};

module.exports = {
    downloadMembershipReport,
    downloadFinancialReport,
    downloadAssetsReport,
    downloadEmployeesReport
};