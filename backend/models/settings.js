const mongoose = require('mongoose');
const schema = mongoose.Schema;

const settingsSchema = new schema({
    general: {
        gymName: { type: String, default: 'صالة فينيكس للياقة البدنية' },
        gymNameEn: { type: String, default: 'Phoenix Fitness Gym' },
        description: { type: String, default: 'أفضل صالة رياضية في ليبيا مع أحدث المعدات وأفضل الكوادر.' },
        phone: { type: String, default: '+218 91 234 5678' },
        email: { type: String, default: 'info@phoenixgym.ly' },
        address: { type: String, default: 'طرابلس – حي الأندلس – شارع الجمهورية' },
        website: { type: String, default: 'www.phoenixgym.ly' },
        workingHours: {
            start: { type: String, default: '06:00' },
            end: { type: String, default: '23:00' }
        },
        currency: { type: String, default: 'LYD' },
        timezone: { type: String, default: 'Africa/Tripoli' }
    },
    membership: {
        autoRenewal: { type: Boolean, default: true },
        gracePeriod: { type: Number, default: 7 },
        lateFee: { type: Number, default: 50 },
        discounts: {
            student: { type: Number, default: 15 },
            family: { type: Number, default: 20 },
            annual: { type: Number, default: 10 }
        },
        memberIdPrefix: { type: String, default: 'GM' },
        defaultPlan: { type: String, default: 'شهري' }
    },
    notifications: {
        emailNotifications: { type: Boolean, default: true },
        smsNotifications: { type: Boolean, default: false },
        expiryReminder: { type: Number, default: 3 },
        paymentReminder: { type: Number, default: 1 },
        maintenanceAlerts: { type: Boolean, default: true },
        newMemberWelcome: { type: Boolean, default: true }
    },
    security: {
        twoFactorAuth: { type: Boolean, default: false },
        sessionTimeout: { type: Number, default: 30 },
        passwordPolicy: { type: String, default: 'متوسط' },
        backupFrequency: { type: String, default: 'يومي' },
        auditLog: { type: Boolean, default: true }
    },
    system: {
        language: { type: String, default: 'ar' },
        theme: { type: String, default: 'auto' },
        dateFormat: { type: String, default: 'DD/MM/YYYY' },
        timeFormat: { type: String, default: '24h' },
        autoBackup: { type: Boolean, default: true },
        debugMode: { type: Boolean, default: false }
    }
}, { timestamps: true });

// Static method to get settings
settingsSchema.statics.getSettings = async function() {
    const settings = await this.findOne();
    return settings || await this.create({});
};

// Static method to update settings
settingsSchema.statics.updateSettings = async function(category, data) {
    const settings = await this.findOne();
    if (!settings) {
        return await this.create({ [category]: data });
    }
    settings[category] = { ...settings[category], ...data };
    return await settings.save();
};

module.exports = mongoose.model('settings', settingsSchema);