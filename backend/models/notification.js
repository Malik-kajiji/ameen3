const mongoose = require('mongoose');
const schema = mongoose.Schema;

const notificationSchema = new schema({
    id: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    recipient: {
        type: String,
        required: true
    },
    recipientPhone: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['تلقائي', 'يدوي', 'مجدول'],
        required: true
    },
    status: {
        type: String,
        enum: ['مُرسل', 'مجدول', 'فاشل'],
        default: 'مجدول'
    },
    scheduledDate: {
        type: Date
    },
    deliveryStatus: {
        type: String,
        enum: ['pending', 'delivered', 'failed'],
        default: 'pending'
    }
}, { timestamps: true });

// Generate notification ID
notificationSchema.pre('save', async function(next) {
    if (!this.id) {
        const latestNotification = await this.constructor.findOne().sort({ createdAt: -1 });
        let nextNumber = 1;
        if (latestNotification && latestNotification.id) {
            const currentNumber = parseInt(latestNotification.id.split('-')[1]);
            nextNumber = currentNumber + 1;
        }
        this.id = `NOT-${String(nextNumber).padStart(3, '0')}`;
    }
    next();
});

// Static method to create a notification
notificationSchema.statics.createNotification = async function(data) {
    // If it's a scheduled notification, just save it
    if (data.type === 'مجدول') {
        return await this.create(data);
    }

    // For non-scheduled notifications, attempt to send them
    const notification = await this.create({
        ...data,
        status: 'مُرسل'
    });

    return notification;
};

// Static method to get notifications
notificationSchema.statics.getNotifications = async function() {
    return await this.find().sort({ createdAt: -1 });
};

// Static method to verify phone number exists
notificationSchema.statics.verifyPhoneNumber = async function(phone) {
    const User = mongoose.model('user');
    const user = await User.findOne({ phone });
    if (!user) {
        throw new Error('رقم الهاتف غير موجود في قاعدة البيانات');
    }
    return user;
};

module.exports = mongoose.model('notification', notificationSchema);