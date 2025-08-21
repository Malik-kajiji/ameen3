const stopRequestModel = require('../../models/stopRequests');
const userModel = require('../../models/user');
const subscriptionModel = require('../../models/subscriptions');

// Get all pause requests with user details
const getAllPauseRequests = async (req, res) => {
    try {
        // Get all stop requests
        const requests = await stopRequestModel.find().sort({ createdAt: -1 });
        
        // Get all users for mapping
        const users = await userModel.find();
        
        // Get all subscriptions for mapping
        const subscriptions = await subscriptionModel.find();
        
        // Combine request data with user information
        const pauseRequests = requests.map(request => {
            try {
                // Find the user for this request
                const user = users.find(u => u._id.toString() === request.userId);
                
                // Find the user's current subscription
                const userSubscriptions = subscriptions.filter(sub => sub.userId === request.userId);
                const currentSubscription = userSubscriptions.find(sub => sub.status === 'active') || 
                                          userSubscriptions.find(sub => sub.status === 'paused') ||
                                          userSubscriptions[0];
                
                // Calculate remaining days
                let remainingDays = 0;
                if (request.status === 'accepted' && request.endData) {
                    const endDate = new Date(request.endData);
                    const today = new Date();
                    const timeDiff = endDate.getTime() - today.getTime();
                    remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    remainingDays = Math.max(0, remainingDays); // Ensure non-negative
                }
                
                return {
                    id: request._id.toString(),
                    userId: request.userId,
                    member: user ? user.username : 'عضو غير معروف',
                    memberId: user ? `GM${(user.userNumber || 0).toString().padStart(3, '0')}` : 'GM000',
                    reason: request.reason || 'لا يوجد سبب محدد',
                    requestDate: request.createdAt ? request.createdAt.toISOString().split('T')[0] : '',
                    startDate: request.startDate ? request.startDate.toISOString().split('T')[0] : '',
                    endDate: request.endData ? request.endData.toISOString().split('T')[0] : '',
                    duration: request.startDate && request.endData ? 
                        Math.ceil((new Date(request.endData) - new Date(request.startDate)) / (1000 * 3600 * 24)) + ' يوم' : 
                        'غير محدد',
                    status: request.status === 'pending' ? 'معلق' : 
                           request.status === 'accepted' ? 'موافق' : 'مرفوض',
                    remainingDays: remainingDays,
                    createdAt: request.createdAt,
                    updatedAt: request.updatedAt
                };
            } catch (err) {
                console.error(`Error processing request ${request._id}:`, err);
                // Return a minimal request object if processing fails
                return {
                    id: request._id.toString(),
                    userId: request.userId,
                    member: 'خطأ في المعالجة',
                    memberId: 'GM000',
                    reason: 'خطأ في المعالجة',
                    requestDate: '',
                    startDate: '',
                    endDate: '',
                    duration: '0 يوم',
                    status: 'خطأ',
                    remainingDays: 0,
                    createdAt: request.createdAt,
                    updatedAt: request.updatedAt
                };
            }
        });
        
        res.status(200).json(pauseRequests);
    } catch (err) {
        console.error("Error in getAllPauseRequests:", err);
        res.status(400).json({ message: err.message });
    }
};

// Get a single pause request by ID
const getPauseRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find request by ID
        const request = await stopRequestModel.findById(id);
        
        if (!request) {
            return res.status(404).json({ message: 'طلب الإيقاف غير موجود' });
        }
        
        // Find the user for this request
        const user = await userModel.findById(request.userId);
        
        // Find the user's subscriptions
        const userSubscriptions = await subscriptionModel.find({ userId: request.userId });
        const currentSubscription = userSubscriptions.find(sub => sub.status === 'active') || 
                                  userSubscriptions.find(sub => sub.status === 'paused') ||
                                  userSubscriptions[0];
        
        // Calculate remaining days
        let remainingDays = 0;
        if (request.status === 'accepted' && request.endData) {
            const endDate = new Date(request.endData);
            const today = new Date();
            const timeDiff = endDate.getTime() - today.getTime();
            remainingDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            remainingDays = Math.max(0, remainingDays); // Ensure non-negative
        }
        
        const pauseRequest = {
            id: request._id.toString(),
            userId: request.userId,
            member: user ? user.username : 'عضو غير معروف',
            memberId: user ? `GM${(user.userNumber || 0).toString().padStart(3, '0')}` : 'GM000',
            reason: request.reason || 'لا يوجد سبب محدد',
            requestDate: request.createdAt ? request.createdAt.toISOString().split('T')[0] : '',
            startDate: request.startDate ? request.startDate.toISOString().split('T')[0] : '',
            endDate: request.endData ? request.endData.toISOString().split('T')[0] : '',
            duration: request.startDate && request.endData ? 
                Math.ceil((new Date(request.endData) - new Date(request.startDate)) / (1000 * 3600 * 24)) + ' يوم' : 
                'غير محدد',
            status: request.status === 'pending' ? 'معلق' : 
                   request.status === 'accepted' ? 'موافق' : 'مرفوض',
            remainingDays: remainingDays,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt
        };
        
        res.status(200).json(pauseRequest);
    } catch (err) {
        console.error("Error in getPauseRequestById:", err);
        res.status(400).json({ message: err.message });
    }
};

// Approve a pause request
const approvePauseRequest = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find and update the request
        const request = await stopRequestModel.findByIdAndUpdate(
            id,
            { status: 'accepted' },
            { new: true }
        );
        
        if (!request) {
            return res.status(404).json({ message: 'طلب الإيقاف غير موجود' });
        }
        
        // Also update the user's subscription status to paused
        const user = await userModel.findById(request.userId);
        if (user) {
            // Find the user's current active subscription
            const subscription = await subscriptionModel.findOne({
                userId: request.userId,
                status: 'active'
            });
            
            if (subscription) {
                // Update subscription status to paused
                await subscriptionModel.findByIdAndUpdate(
                    subscription._id,
                    { status: 'paused' },
                    { new: true }
                );
                
                // Update user status to paused
                await userModel.findByIdAndUpdate(
                    request.userId,
                    { status: 'paused' },
                    { new: true }
                );
            }
        }
        
        res.status(200).json({ 
            message: 'تم الموافقة على طلب الإيقاف بنجاح',
            request: {
                id: request._id.toString(),
                status: 'موافق'
            }
        });
    } catch (err) {
        console.error("Error in approvePauseRequest:", err);
        res.status(400).json({ message: err.message });
    }
};

// Reject a pause request
const rejectPauseRequest = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Find and update the request
        const request = await stopRequestModel.findByIdAndUpdate(
            id,
            { status: 'rejected' },
            { new: true }
        );
        
        if (!request) {
            return res.status(404).json({ message: 'طلب الإيقاف غير موجود' });
        }
        
        res.status(200).json({ 
            message: 'تم رفض طلب الإيقاف بنجاح',
            request: {
                id: request._id.toString(),
                status: 'مرفوض'
            }
        });
    } catch (err) {
        console.error("Error in rejectPauseRequest:", err);
        res.status(400).json({ message: err.message });
    }
};

// Bulk approve pause requests
const bulkApprovePauseRequests = async (req, res) => {
    try {
        const { ids } = req.body;
        
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'يجب تقديم معرفات الطلبات للموافقة عليها' });
        }
        
        // Update all requests
        const requests = await stopRequestModel.updateMany(
            { _id: { $in: ids } },
            { status: 'accepted' }
        );
        
        // Update user subscriptions and statuses
        for (const id of ids) {
            const request = await stopRequestModel.findById(id);
            if (request) {
                const user = await userModel.findById(request.userId);
                if (user) {
                    // Find the user's current active subscription
                    const subscription = await subscriptionModel.findOne({
                        userId: request.userId,
                        status: 'active'
                    });
                    
                    if (subscription) {
                        // Update subscription status to paused
                        await subscriptionModel.findByIdAndUpdate(
                            subscription._id,
                            { status: 'paused' },
                            { new: true }
                        );
                        
                        // Update user status to paused
                        await userModel.findByIdAndUpdate(
                            request.userId,
                            { status: 'paused' },
                            { new: true }
                        );
                    }
                }
            }
        }
        
        res.status(200).json({ 
            message: `تم الموافقة على ${requests.modifiedCount} طلب إيقاف بنجاح`,
            count: requests.modifiedCount
        });
    } catch (err) {
        console.error("Error in bulkApprovePauseRequests:", err);
        res.status(400).json({ message: err.message });
    }
};

// Bulk reject pause requests
const bulkRejectPauseRequests = async (req, res) => {
    try {
        const { ids } = req.body;
        
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'يجب تقديم معرفات الطلبات لرفضها' });
        }
        
        // Update all requests
        const requests = await stopRequestModel.updateMany(
            { _id: { $in: ids } },
            { status: 'rejected' }
        );
        
        res.status(200).json({ 
            message: `تم رفض ${requests.modifiedCount} طلب إيقاف بنجاح`,
            count: requests.modifiedCount
        });
    } catch (err) {
        console.error("Error in bulkRejectPauseRequests:", err);
        res.status(400).json({ message: err.message });
    }
};

module.exports = {
    getAllPauseRequests,
    getPauseRequestById,
    approvePauseRequest,
    rejectPauseRequest,
    bulkApprovePauseRequests,
    bulkRejectPauseRequests
};