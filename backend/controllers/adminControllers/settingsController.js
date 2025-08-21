const Settings = require('../../models/settings');

const getSettings = async (req, res) => {
    try {
        const settings = await Settings.getSettings();
        res.status(200).json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateSettings = async (req, res) => {
    try {
        const { category } = req.params;
        const data = req.body;
        
        if (!['general', 'membership', 'notifications', 'security', 'system'].includes(category)) {
            throw new Error('Invalid settings category');
        }

        const settings = await Settings.updateSettings(category, data);
        res.status(200).json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Test endpoint to fill database with default values
const fillDefaultSettings = async (req, res) => {
    try {
        const settings = await Settings.create({
            general: {
                gymName: 'صالة فينيكس للياقة البدنية',
                gymNameEn: 'Phoenix Fitness Gym',
                description: 'أفضل صالة رياضية في ليبيا مع أحدث المعدات وأفضل الكوادر.',
                phone: '+218 91 234 5678',
                email: 'info@phoenixgym.ly',
                address: 'طرابلس – حي الأندلس – شارع الجمهورية',
                website: 'www.phoenixgym.ly',
                workingHours: { start: '06:00', end: '23:00' },
                currency: 'LYD',
                timezone: 'Africa/Tripoli'
            },
            membership: {
                autoRenewal: true,
                gracePeriod: 7,
                lateFee: 50,
                discounts: { student: 15, family: 20, annual: 10 },
                memberIdPrefix: 'GM',
                defaultPlan: 'شهري'
            },
            notifications: {
                emailNotifications: true,
                smsNotifications: false,
                expiryReminder: 3,
                paymentReminder: 1,
                maintenanceAlerts: true,
                newMemberWelcome: true
            },
            security: {
                twoFactorAuth: false,
                sessionTimeout: 30,
                passwordPolicy: 'متوسط',
                backupFrequency: 'يومي',
                auditLog: true
            },
            system: {
                language: 'ar',
                theme: 'auto',
                dateFormat: 'DD/MM/YYYY',
                timeFormat: '24h',
                autoBackup: true,
                debugMode: false
            }
        });
        res.status(201).json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getSettings,
    updateSettings,
    fillDefaultSettings
};