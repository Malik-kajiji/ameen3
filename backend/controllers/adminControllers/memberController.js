const userModel = require('../../models/user');
const subscriptionModel = require('../../models/subscriptions');
const packageModel = require('../../models/packages');

// Get all members with their subscription details
const getAllMembers = async (req, res) => {
    try {
        // Get all users
        const users = await userModel.find().sort({ createdAt: -1 });
        console.log("Fetched users:", users);
        
        // Get all subscriptions for mapping
        const subscriptions = await subscriptionModel.find();
        
        // Get all packages for mapping
        const packages = await packageModel.find();
        
        // Combine user data with subscription information
        const members = users.map((user, index) => {
            try {
                console.log(`Processing user ${index}:`, user);
                
                // Validate userNumber first before using it
                if (typeof user.userNumber !== 'number' || isNaN(user.userNumber)) {
                    console.warn(`Invalid userNumber for user ${user._id} at index ${index}:`, user.userNumber);
                    // Try to fix the userNumber if possible
                    if (user._id) {
                        // Use a fallback based on the user's position in the array or creation date
                        user.userNumber = index + 1; // Use index as fallback
                    } else {
                        user.userNumber = index + 1;
                    }
                }
                
                // Ensure userNumber is a valid number for ID generation
                let validUserNumber = user.userNumber;
                if (typeof validUserNumber !== 'number' || isNaN(validUserNumber) || validUserNumber < 0) {
                    console.warn(`Invalid validUserNumber for user ${user._id} at index ${index}:`, validUserNumber);
                    validUserNumber = index + 1; // Fallback to index for invalid numbers
                }
                
                // Find the current subscription for this user
                const currentSubscription = subscriptions.find(sub => sub.userId === user._id.toString() && sub.status === 'active');
                
                // Find the package details for this subscription
                let packageDetails = null;
                if (currentSubscription) {
                    packageDetails = packages.find(pkg => pkg._id.toString() === currentSubscription.packageId);
                }
                
                const memberObj = {
                    id: `GM${validUserNumber.toString().padStart(3, '0')}`,
                    userNumber: validUserNumber,
                    name: user.username,
                    email: user.email,
                    phone: user.phone,
                    gender: user.gender === 'male' ? 'ذكر' : 'أنثى',
                    city: user.city,
                    status: user.status === 'active' ? 'نشط' : user.status === 'paused' ? 'متوقف' : 'منتهي',
                    profilePicture: user.profilePicture,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    // Subscription details
                    currentSubscriptionId: currentSubscription ? currentSubscription._id : null,
                    packageName: packageDetails ? packageDetails.title : 'لا توجد خطة',
                    packagePeriod: packageDetails ? packageDetails.period : 0,
                    subscriptionStartDate: currentSubscription ? currentSubscription.startData : null,
                    subscriptionEndDate: currentSubscription ? currentSubscription.endData : null,
                    subscriptionStatus: currentSubscription ? currentSubscription.status : null
                };
                
                console.log(`Generated member object for user ${user._id} at index ${index}:`, memberObj);
                return memberObj;
            } catch (err) {
                console.error(`Error processing user ${user._id} at index ${index}:`, err);
                // Return a minimal user object if processing fails
                return {
                    id: 'GM000',
                    userNumber: 0,
                    name: user.username || 'Unknown',
                    email: user.email || '',
                    phone: user.phone || '',
                    gender: 'غير محدد',
                    city: user.city || 'غير محدد',
                    status: 'خطأ',
                    profilePicture: user.profilePicture || '',
                    createdAt: user.createdAt || new Date(),
                    updatedAt: user.updatedAt || new Date(),
                    packageName: 'خطأ في المعالجة',
                    packagePeriod: 0,
                    subscriptionStartDate: null,
                    subscriptionEndDate: null,
                    subscriptionStatus: null
                };
            }
        });
        
        console.log("Final members array:", members);
        res.status(200).json(members);
    } catch (err) {
        console.error("Error in getAllMembers:", err);
        res.status(400).json({ message: err.message });
    }
};

// Get a single member by ID
const getMemberById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("Fetching member by ID:", id);
        
        // Extract user number from ID (GM001 -> 1)
        const userNumber = parseInt(id.replace('GM', ''));
        console.log("Parsed userNumber:", userNumber);
        
        // Validate that userNumber is a valid number
        if (isNaN(userNumber)) {
            console.log("Invalid userNumber parsed from ID:", id);
            return res.status(400).json({ message: 'رقم العضو غير صحيح' });
        }
        
        // Find user by userNumber
        const user = await userModel.findOne({ userNumber });
        console.log("Found user by userNumber:", user);
        
        if (!user) {
            console.log("User not found for userNumber:", userNumber);
            return res.status(404).json({ message: 'العضو غير موجود' });
        }
        
        // Validate userNumber
        if (typeof user.userNumber !== 'number' || isNaN(user.userNumber)) {
            console.warn(`Invalid userNumber for user ${user._id}:`, user.userNumber);
            user.userNumber = userNumber; // Use the parsed value
        }
        
        // Get user's subscriptions
        const subscriptions = await subscriptionModel.find({ userId: user._id.toString() });
        
        // Get all packages
        const packages = await packageModel.find();
        
        // Find the current active subscription
        const currentSubscription = subscriptions.find(sub => sub.status === 'active');
        
        // Find the package details for the current subscription
        let packageDetails = null;
        if (currentSubscription) {
            packageDetails = packages.find(pkg => pkg._id.toString() === currentSubscription.packageId);
        }
        
        const member = {
            id: `GM${user.userNumber.toString().padStart(3, '0')}`,
            userNumber: user.userNumber,
            name: user.username,
            email: user.email,
            phone: user.phone,
            gender: user.gender === 'male' ? 'ذكر' : 'أنثى',
            city: user.city,
            status: user.status === 'active' ? 'نشط' : user.status === 'paused' ? 'متوقف' : 'منتهي',
            profilePicture: user.profilePicture,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            // Subscription details
            currentSubscriptionId: currentSubscription ? currentSubscription._id : null,
            packageName: packageDetails ? packageDetails.title : 'لا توجد خطة',
            packagePeriod: packageDetails ? packageDetails.period : 0,
            subscriptionStartDate: currentSubscription ? currentSubscription.startData : null,
            subscriptionEndDate: currentSubscription ? currentSubscription.endData : null,
            subscriptionStatus: currentSubscription ? currentSubscription.status : null,
            // All subscriptions
            subscriptions: subscriptions.map(sub => {
                const pkg = packages.find(p => p._id.toString() === sub.packageId);
                return {
                    id: sub._id,
                    packageName: pkg ? pkg.title : 'خطة غير معروفة',
                    packagePrice: sub.packagePrice,
                    startDate: sub.startData,
                    endDate: sub.endData,
                    status: sub.status,
                    createdAt: sub.createdAt,
                    updatedAt: sub.updatedAt
                };
            })
        };
        
        console.log("Returning member:", member);
        res.status(200).json(member);
    } catch (err) {
        console.error("Error in getMemberById:", err);
        res.status(400).json({ message: err.message });
    }
};

// Update a member
const updateMember = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        // Extract user number from ID (GM001 -> 1)
        const userNumber = parseInt(id.replace('GM', ''));
        
        // Validate that userNumber is a valid number
        if (isNaN(userNumber)) {
            return res.status(400).json({ message: 'رقم العضو غير صحيح' });
        }
        
        // Find user by userNumber
        const user = await userModel.findOne({ userNumber });
        
        if (!user) {
            return res.status(404).json({ message: 'العضو غير موجود' });
        }
        
        // Update user data
        const updatedUser = await userModel.findByIdAndUpdate(
            user._id,
            {
                username: updateData.name,
                email: updateData.email,
                phone: updateData.phone,
                city: updateData.city,
                status: updateData.status
            },
            { new: true }
        );
        
        // Validate userNumber
        if (typeof updatedUser.userNumber !== 'number' || isNaN(updatedUser.userNumber)) {
            console.warn(`Invalid userNumber for user ${updatedUser._id}:`, updatedUser.userNumber);
            updatedUser.userNumber = userNumber; // Use the parsed value
        }
        
        res.status(200).json({
            id: `GM${updatedUser.userNumber.toString().padStart(3, '0')}`,
            userNumber: updatedUser.userNumber,
            name: updatedUser.username,
            email: updatedUser.email,
            phone: updatedUser.phone,
            gender: updatedUser.gender === 'male' ? 'ذكر' : 'أنثى',
            city: updatedUser.city,
            status: updatedUser.status === 'active' ? 'نشط' : updatedUser.status === 'paused' ? 'متوقف' : 'منتهي',
            profilePicture: updatedUser.profilePicture,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        });
    } catch (err) {
        console.error("Error in updateMember:", err);
        res.status(400).json({ message: err.message });
    }
};

// Delete a member
const deleteMember = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Extract user number from ID (GM001 -> 1)
        const userNumber = parseInt(id.replace('GM', ''));
        
        // Validate that userNumber is a valid number
        if (isNaN(userNumber)) {
            return res.status(400).json({ message: 'رقم العضو غير صحيح' });
        }
        
        // Find user by userNumber
        const user = await userModel.findOne({ userNumber });
        
        if (!user) {
            return res.status(404).json({ message: 'العضو غير موجود' });
        }
        
        // Delete user
        await userModel.findByIdAndDelete(user._id);
        
        // Also delete all subscriptions for this user
        await subscriptionModel.deleteMany({ userId: user._id.toString() });
        
        res.status(200).json({ message: 'تم حذف العضو بنجاح' });
    } catch (err) {
        console.error("Error in deleteMember:", err);
        res.status(400).json({ message: err.message });
    }
};

// Create a new member
const createMember = async (req, res) => {
    try {
        const memberData = req.body;
        
        // Get all packages to find the selected one
        const packages = await packageModel.find();
        const selectedPackage = packages.find(pkg => pkg.title === memberData.plan);
        
        // Create user with proper userNumber
        const user = await userModel.create({
            userNumber: await getNextUserNumber(),
            username: memberData.name,
            phone: memberData.phone,
            email: memberData.email,
            password: await generateRandomPassword(),
            gender: memberData.gender || 'male',
            city: memberData.city || memberData.nationality || 'غير محدد',
            profilePicture: 'default.jpg',
            status: 'active'
        });
        
        // Create subscription if package is selected
        let subscription = null;
        if (selectedPackage && memberData.plan) {
            const durationDays = selectedPackage.period;
            const startDate = new Date();
            const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);
            
            subscription = await subscriptionModel.create({
                userId: user._id.toString(),
                packageId: selectedPackage._id.toString(),
                packageName: selectedPackage.title,
                packagePrice: selectedPackage.price,
                packagePeriod: selectedPackage.period,
                startData: startDate,
                endData: endDate,
                status: 'active',
                createdBy: req.admin.admin_id // Use admin ID from middleware
            });
        }
        
        // Validate userNumber
        if (typeof user.userNumber !== 'number' || isNaN(user.userNumber)) {
            console.warn(`Invalid userNumber for user ${user._id}:`, user.userNumber);
            user.userNumber = 1; // Set a default value
        }
        
        res.status(201).json({
            id: `GM${user.userNumber.toString().padStart(3, '0')}`,
            userNumber: user.userNumber,
            name: user.username,
            email: user.email,
            phone: user.phone,
            gender: user.gender === 'male' ? 'ذكر' : 'أنثى',
            city: user.city,
            status: 'نشط',
            profilePicture: user.profilePicture,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            subscriptionId: subscription ? subscription._id : null
        });
    } catch (err) {
        console.error("Error in createMember:", err);
        res.status(400).json({ message: err.message });
    }
};

// Get all packages
const getPackages = async (req, res) => {
    console.log("Fetching all packages");
    try {
        const packages = await packageModel.find();
        console.log("Fetched packages:", packages);
        res.status(200).json(packages);
    } catch (err) {
        console.error("Error in getPackages:", err);
        res.status(400).json({ message: err.message });
    }
};

// Helper function to get next user number
const getNextUserNumber = async () => {
    try {
        const latestUser = await userModel.findOne().sort({ userNumber: -1 });
        
        // Check if latestUser exists and has a valid userNumber
        if (latestUser && typeof latestUser.userNumber === 'number' && !isNaN(latestUser.userNumber)) {
            return latestUser.userNumber + 1;
        }
        
        // If no users exist or userNumber is invalid, start from 1
        // But first check if userNumber 1 is already taken
        const userWithNumber1 = await userModel.findOne({ userNumber: 1 });
        if (!userWithNumber1) {
            return 1;
        }
        
        // If 1 is taken, find the highest valid number and increment
        const usersWithValidNumbers = await userModel.find({ 
            userNumber: { $type: 'number', $ne: null } 
        }).sort({ userNumber: -1 });
        
        if (usersWithValidNumbers.length > 0) {
            const highestValidNumber = usersWithValidNumbers[0].userNumber;
            if (typeof highestValidNumber === 'number' && !isNaN(highestValidNumber)) {
                return highestValidNumber + 1;
            }
        }
        
        // Fallback: return 1
        return 1;
    } catch (err) {
        console.error("Error in getNextUserNumber:", err);
        // Fallback: return 1
        return 1;
    }
};

// Helper function to generate random password
const generateRandomPassword = async () => {
    const bcrypt = require('bcrypt');
    const salt = await bcrypt.genSalt(10);
    const randomString = Math.random().toString(36).slice(-8);
    return await bcrypt.hash(randomString, salt);
};

module.exports = {
    getAllMembers,
    getMemberById,
    updateMember,
    deleteMember,
    createMember,
    getPackages
};