const Notification = require('../../models/notification');
const User = require('../../models/user');
const sendMessage = require('../../functions/sendMessage');

const createNotification = async (req, res) => {
    try {
        const { title, message, recipient, recipientPhone, type, scheduledDate } = req.body;

        // Verify phone number exists in database
        await Notification.verifyPhoneNumber(recipientPhone);

        // Create notification
        const notification = await Notification.createNotification({
            title,
            message,
            recipient,
            recipientPhone,
            type,
            scheduledDate,
            status: type === 'مجدول' ? 'مجدول' : 'مُرسل'
        });

        // If not scheduled, send SMS
        if (type !== 'مجدول') {
            const result = await sendMessage(message, recipientPhone);
            if (result.error) {
                notification.status = 'فاشل';
                notification.deliveryStatus = 'failed';
                await notification.save();
                throw new Error(result.error);
            }
            notification.deliveryStatus = 'delivered';
            await notification.save();
        }

        res.status(201).json(notification);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.getNotifications();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const verifyPhoneNumber = async (req, res) => {
    try {
        const { phone } = req.params;
        const user = await User.findOne({ phone });
        if (!user) {
            throw new Error('رقم الهاتف غير موجود في قاعدة البيانات');
        }
        res.status(200).json({ 
            exists: true, 
            username: user.username,
            phone: user.phone 
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getDeliveryStats = async (req, res) => {
    try {
        const total = await Notification.countDocuments({ type: { $ne: 'مجدول' } });
        const delivered = await Notification.countDocuments({ deliveryStatus: 'delivered' });
        const deliveryRate = total > 0 ? Math.round((delivered / total) * 100) : 0;

        // Get notifications from this week
        const startOfWeek = new Date();
        startOfWeek.setHours(0, 0, 0, 0);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        
        const weeklyCount = await Notification.countDocuments({
            createdAt: { $gte: startOfWeek },
            type: { $ne: 'مجدول' }
        });

        res.status(200).json({
            total,
            delivered,
            deliveryRate,
            weeklyCount
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createNotification,
    getNotifications,
    verifyPhoneNumber,
    getDeliveryStats
};